const form = document.querySelector("#loan-form");
const results = document.querySelector("#results");
const loader = document.querySelector("#loading");
const close = document.querySelector("#close");

form.addEventListener("submit", function (e) {
  //Hide Results
  results.style.display = "none";
  //Show loader
  loader.style.display = "block";
  //Delay Loan Calculation
  setTimeout(calculateLoan, 2000);

  e.preventDefault();
});

function calculateLoan() {
  //Declare Variables
  const amount = document.querySelector("#amount");
  const interest = document.querySelector("#interest");
  const duration = document.querySelector("#duration");
  const monthlyPayment = document.querySelector("#monthly-payment");
  const totalPayment = document.querySelector("#total-payment");
  const totalInterest = document.querySelector("#total-interest");

  const principal = parseFloat(amount.value);
  const calculatedInterest = parseFloat(interest.value) / 100 / 12;
  const calculatedPayments = parseFloat(duration.value) * 12;

  if (principal <= 0 || calculatedInterest <= 0 || calculatedPayments <= 0) {
    showError("Please check your inputs");
    //Hide Loader
    loader.style.display = "none";
  } else {
    // Compute monthly payment
    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (principal * x * calculatedInterest) / (x - 1);

    if (isFinite(monthly)) {
      monthlyPayment.value = monthly.toFixed(2);
      totalPayment.value = (monthly * calculatedPayments).toFixed(2);
      totalInterest.value = (monthly * calculatedPayments - principal).toFixed(
        2
      );
      // Show results
      document.getElementById("results").style.display = "block";
      // Hide loader
      document.getElementById("loading").style.display = "none";
    } else {
      showError("Please check your inputs");
      //Hide Loader
      loader.style.display = "none";
    }
  }
}

function showError(error) {
  const card = document.querySelector(".loan-calc");
  const heading = document.querySelector(".heading");
  const errorDiv = document.createElement("div");
  errorDiv.className = "alert alert-danger";
  errorDiv.appendChild(document.createTextNode(error));

  card.insertBefore(errorDiv, heading);

  setTimeout(clearError, 3000);
}

//Clear Error
function clearError() {
  document.querySelector(".alert").remove();
}

close.addEventListener("click", closeResults);

function closeResults() {
  results.style.display = "none";
}
