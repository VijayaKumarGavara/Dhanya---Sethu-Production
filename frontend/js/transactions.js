document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("transactionsTableBody");
  const searchInput = document.getElementById("searchInput");

  const buyer = JSON.parse(localStorage.getItem("buyer"));
  const buyerId = buyer?.buyer_id;

  let allTransactions = [];

  if (!buyerId) {
    tableBody.innerHTML = `<tr><td colspan="4">Buyer not found in local storage.</td></tr>`;
    return;
  }

  async function fetchTransactions() {
    try {
      const res = await fetch(`/api/payment/transactions/${buyerId}`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4">No transactions found.</td></tr>`;
        return;
      }
      allTransactions = data;
      renderTable(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      tableBody.innerHTML = `<tr><td colspan="4">Error loading data.</td></tr>`;
    }
  }

  function renderTable(transactions) {
    tableBody.innerHTML = "";
    transactions.forEach(tx => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${tx.farmer_name}</td>
        <td>${tx.crop_name}</td>
        <td>₹${parseFloat(tx.amount).toFixed(2)}</td>
        <td>${formatDate(tx.paid_at)}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  function formatDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    const filtered = allTransactions.filter(tx =>
      tx.farmer_name.toLowerCase().includes(term) ||
      tx.crop_name.toLowerCase().includes(term)
    );
    renderTable(filtered);
  });

  fetchTransactions();
});
