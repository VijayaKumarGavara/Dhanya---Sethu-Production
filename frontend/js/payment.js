document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const cropFilter = document.getElementById("cropFilter");
  const statusFilter = document.getElementById("statusFilter");
  const applyFilters = document.getElementById("applyFilters");
  const duesTableBody = document.getElementById("duesTableBody");

  const paymentModal = document.getElementById("paymentModal");
  const paymentForm = document.getElementById("paymentForm");
  const modalFarmer = document.getElementById("modalFarmer");
  const modalCrop = document.getElementById("modalCrop");
  const modalDueAmount = document.getElementById("modalDueAmount");
  const paymentAmountInput = document.getElementById("paymentAmount");
  const cancelPaymentBtn = document.getElementById("cancelPaymentBtn");

  cancelPaymentBtn.addEventListener("click", () => {
    paymentModal.classList.add("hidden");
  });

  let allDues = [];
  let selectedDue = null;
  const buyer = JSON.parse(localStorage.getItem("buyer"));
  if(!buyer){
    alert("Buyer not Found, Please login");
    window.location.href = '/login';
  }
  
  const buyerId = buyer.buyer_id;
  
  
  const crops = JSON.parse(localStorage.getItem("crop_settings") || "[]");

  // Populate crop filter options
  crops.forEach(crop => {
    const option = document.createElement("option");
    option.value = crop.crop_name;
    option.textContent = crop.crop_name;
    cropFilter.appendChild(option);
  });

  async function fetchDues() {
    try {
      const res = await fetch(`/api/payment/dues/${buyerId}`);
      const data = await res.json();
      allDues = data;
      renderTable(data);
    } catch (err) {
      console.error("Error fetching dues:", err);
    }
  }

  function renderTable(dues) {
    duesTableBody.innerHTML = "";
    dues.forEach(due => {
      const row = document.createElement("tr");

      // Find default unit from crop settings
      const cropSetting = crops.find(c => c.crop_name === due.crop_name);
      const unit = cropSetting ? cropSetting.default_unit : "";
      var quantityDisplay;
      if(unit==='quintal'){
        quantityDisplay = `${due.qty_in_quintals} ${unit}`;
      }else{
        quantityDisplay = `${due.qty_in_kgs} ${unit}`;
      }

      row.innerHTML = `
        <td>${due.farmer_name}</td>
        <td>${due.crop_name}</td>
        <td>${quantityDisplay}</td>
        <td>₹${Number(due.total_amount).toFixed(2)}</td>
        <td>₹${Number(due.paid_amount).toFixed(2)}</td>
        <td>₹${(Number(due.total_amount) - Number(due.paid_amount)).toFixed(2)}</td>
        <td>${due.payment_status}</td>
        <td>
            <button 
              class="payBtn" 
              
              data-farmer="${due.farmer_id}" 
              data-crop="${due.crop_id}" 
              ${due.payment_status === "paid" ? "disabled style='opacity: 0.5; cursor: not-allowed;'" : ""}
            >
              Make Payment
            </button>
        </td>
      `;
      duesTableBody.appendChild(row);
    });
  }

  applyFilters.addEventListener("click", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCrop = cropFilter.value;
    const selectedStatus = statusFilter.value;

    const filtered = allDues.filter(due => {
      const matchesSearch =
        due.farmer_name.toLowerCase().includes(searchTerm);
        // due.aadhaar.includes(searchTerm);

      const matchesCrop = selectedCrop === "" || due.crop_name === selectedCrop;
      const matchesStatus = selectedStatus === "" || due.payment_status === selectedStatus;

      return matchesSearch && matchesCrop && matchesStatus;
    });

    renderTable(filtered);
  });

  duesTableBody.addEventListener("click", (e) => { 
    if (e.target.classList.contains("payBtn")) {
      const farmerId = e.target.getAttribute("data-farmer");
      const cropId = parseInt(e.target.getAttribute("data-crop"));

      selectedDue = allDues.find(d => d.farmer_id === farmerId && d.crop_id === cropId);
      if (selectedDue) openModal(selectedDue);
    }

  });

  function openModal(due) {
    const cropSetting = crops.find(c => c.crop_name === due.crop_name);
    const unit = cropSetting ? cropSetting.default_unit : "";

    modalFarmer.textContent = `Farmer: ${due.farmer_name}`;
    modalCrop.textContent = `Crop: ${due.crop_name} (${unit})`;
    const amountPaid = due.paid_amount ?? due.amount_paid; // handle both cases
    modalDueAmount.textContent = (due.total_amount - amountPaid).toFixed(2);

    paymentAmountInput.value = "";
    paymentModal.classList.remove("hidden");
  }

  window.addEventListener("click", (event) => {
    if (event.target === paymentModal) {
      paymentModal.classList.add("hidden");
    }
  });

  paymentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payAmt = parseFloat(paymentAmountInput.value);
    const dueLeft = selectedDue.total_amount - selectedDue.amount_paid;

    if (isNaN(payAmt) || payAmt <= 0 || payAmt > dueLeft) {
      alert("Invalid payment amount");
      return;
    }

    try {
      // console.log(buyerId,selectedDue.farmer_id,selectedDue.crop_id, payAmt);
      const res = await fetch("/api/payment/make-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer_id: buyerId,
          farmer_id: selectedDue.farmer_id,
          crop_id:selectedDue.crop_id,
          amount: payAmt,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert("Payment successful");
        paymentModal.classList.add("hidden");
        fetchDues();
      } else {
        alert("Payment failed");
      }
    } catch (err) {
      console.error("Error during payment:", err);
      alert("Server error");
    }
  });

  fetchDues();
});
