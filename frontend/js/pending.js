// /frontend/js/pending.js

const tableBody = document.querySelector("#paymentsTable tbody");
const messageDiv = document.getElementById("message");

async function fetchPayments() {
  try {
    const res = await fetch("http://localhost:5000/api/payments/pending");
    const payments = await res.json();
    renderTable(payments);
  } catch (err) {
    messageDiv.innerText = "Error loading payments.";
  }
}

function renderTable(payments) {
  tableBody.innerHTML = "";

  payments.forEach((payment) => {
    const balance = payment.totalAmount - payment.amountPaid;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${payment.farmer.name}</td>
      <td>${payment.farmer.mobile}</td>
      <td>${payment.product.name}</td>
      <td>${payment.product.quantity}</td>
      <td>${payment.product.unitPrice}</td>
      <td>₹${payment.totalAmount}</td>
      <td>₹${payment.amountPaid}</td>
      <td>₹${balance}</td>
      <td>
        <input type="number" min="1" max="${balance}" placeholder="₹" class="payInput" />
        <button onclick="makePayment('${payment._id}', this)">Pay</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

async function makePayment(paymentId, btn) {
  const row = btn.closest("tr");
  const input = row.querySelector(".payInput");
  const amount = parseFloat(input.value);

  if (isNaN(amount) || amount <= 0) {
    alert("Enter valid amount");
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/payments/pay/${paymentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });

    const result = await res.json();

    if (res.ok) {
      messageDiv.innerText = "Payment updated successfully!";
      fetchPayments(); // Reload table
    } else {
      messageDiv.innerText = result.error || "Payment failed!";
    }
  } catch (err) {
    messageDiv.innerText = "Server error!";
  }
}

// Initial fetch
fetchPayments();
