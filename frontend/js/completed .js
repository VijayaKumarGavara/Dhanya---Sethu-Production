// /frontend/js/completed.js

const tableBody = document.querySelector("#completedPaymentsTable tbody");
const messageDiv = document.getElementById("message");

async function fetchCompletedPayments() {
  try {
    const res = await fetch("http://localhost:5000/api/payments/completed");
    const payments = await res.json();

    if (payments.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7">No completed payments yet.</td></tr>`;
      return;
    }

    payments.forEach(payment => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${payment.farmer.name}</td>
        <td>${payment.farmer.mobile}</td>
        <td>${payment.product.name}</td>
        <td>${payment.product.quantity}</td>
        <td>${payment.product.unitPrice}</td>
        <td>₹${payment.amountPaid}</td>
        <td>${new Date(payment.paymentDate).toLocaleDateString()}</td>
      `;
      tableBody.appendChild(row);
    });

  } catch (err) {
    messageDiv.innerText = "Error loading completed payments.";
  }
}

fetchCompletedPayments();
