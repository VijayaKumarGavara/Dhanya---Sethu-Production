document.getElementById("paymentForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const buyerId = document.getElementById("payBuyerId").value;
  const farmerId = document.getElementById("payFarmerId").value;
  const amount = document.getElementById("amount").value;

  const res = await fetch("http://localhost:5000/api/payments/pay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ buyerId, farmerId, amount })
  });

  const data = await res.json();
  document.getElementById("paymentResult").innerText = data.message || "Payment Done!";
});

async function getPendingPayments() {
  const res = await fetch("http://localhost:5000/api/payments/pending");
  const data = await res.json();
  const list = document.getElementById("pendingPaymentsList");
  list.innerHTML = "";

  data.forEach((payment) => {
    const li = document.createElement("li");
    li.textContent = `Buyer: ${payment.buyerId?.name}, Farmer: ${payment.farmerId?.name}, Amount: ₹${payment.amount}`;
    list.appendChild(li);
  });
}
