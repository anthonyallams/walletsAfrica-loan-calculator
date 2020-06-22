// Loan UIs
const form = document.querySelector("#loan-form");
const results = document.querySelector("#results");
const loader = document.querySelector("#loading");
const close = document.querySelector("#close");
const loanSection = document.querySelector("#calculate-loan");

// loan calculator Event Listener
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
    showErrorCalc("Please check your inputs");
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
      showErrorCalc("Please check your inputs");
      //Hide Loader
      loader.style.display = "none";
    }
  }
}
// Function to show error for loan calculator
function showErrorCalc(error) {
  const card = document.querySelector(".loan-calc");
  const heading = document.querySelector(".heading");
  const errorDiv = document.createElement("div");
  errorDiv.className = "alert alert-danger";
  errorDiv.appendChild(document.createTextNode(error));

  card.insertBefore(errorDiv, heading);

  setTimeout(clearError, 3000);
}
// Function to show error for BVN verification
function showErrorBVN(error) {
  const card = document.querySelector(".card-body");
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

// BVN UIs
const formbvn = document.querySelector("#formbvn");
// const formbvn = document.querySelector("#formbvn");
const bvnvalue = document.querySelector(".bvnvalue");
const submitbvn = document.querySelector(".submitbvn");
const termsCondition = document.querySelector(".termsCondition");
const privacyPolicy = document.querySelector(".privacyPolicy");
const phone = document.querySelector(".phone");
const bvn = document.querySelector(".bvn");

// const includesTermsConditions = termsCondition.checked;
// const includesprivacyPolicy = privacyPolicy.checked;

// BVN KEYS
//KEYS FOR PRODUCTION
const PUBLIC_KEY = `y4800zy9oo5g`;
const SECRET_KEY = `lkir2y3q70l0`;

//KEYS FOR TEST
const PUBLICTEST_KEY = "uvjqzm5xl6bw";
const SECRETTEST_KEY = "hfucj5jatq8h";
const TEST_BVN = `21231485915`;

// Function to Update the success or failed bvn verification on UI
const updateVerification = (status, data) => {
  const failedBVN = document.querySelector(".failed-box");
  const successBVN = document.querySelector(".success-box");
  const bvnVerificationModal = document.querySelector(".error-modal");
  const gobackButton = document.querySelector(".goback");
  const continueButton = document.querySelector(".continue");
  const exitVerificationCard = document.querySelector(".cancelicon");
  const bvnName = document.querySelector(".bvnName");

  if (status) {
    bvnVerificationModal.style.display = "block";
    bvnName.textContent = `Dear ${data.FirstName} ${data.LastName}, `;
    successBVN.style.display = "block";
    continueButton.addEventListener("click", () => {
      bvnVerificationModal.style.display = "none";
      successBVN.style.display = "none";
      formbvn.reset();
      window.location.hash = "calculate-loan";
    });
    successBVN.addEventListener("click", (e) => {
      if (e.target.classList.contains("cancelicon")) {
        bvnVerificationModal.style.display = "none";
        successBVN.style.display = "none";
        formbvn.reset();
      }
    });
  } else {
    bvnVerificationModal.style.display = "block";
    failedBVN.style.display = "block";
    gobackButton.addEventListener("click", () => {
      failedBVN.style.display = "none";
      bvnVerificationModal.style.display = "none";
      formbvn.reset();
    });
    failedBVN.addEventListener("click", (e) => {
      if (e.target.classList.contains("cancelicon")) {
        bvnVerificationModal.style.display = "none";
        failedBVN.style.display = "none";
        formbvn.reset();
        // console.log("clicked cancel");
      }
    });
  }
};

// Get BVN details
const getBVNInfo = async (bvnValue) => {
  const url =
    "https://cors-anywhere.herokuapp.com/https://sandbox.wallets.africa/account/resolvebvn";

  const response = await fetch(url, {
    method: "POST",
    headers: new Headers({
      Authorization: "Bearer " + PUBLICTEST_KEY,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
    body: `bvn=${bvnValue}&secretKey=${SECRETTEST_KEY}`,
  });
  const data = await response.json();
  // const bvn = await data.BVN;
  if (data.BVN === "21231485915" && data.BVN === formbvn.bvn.value) {
    // showBVNSpinner()
    updateVerification(true, data);
  } else {
    updateVerification(false, data);
  }
  // console.log(data);
  // console.log(data.BVN);
  // console.log(formbvn.bvn.value === data.BVN);
  // return showBVNStatusOnUI(data);
  // return {data}
};
// 21231485915
// getBVNInfo("22153554719").then((data) => console.log(data.BVN));

// .catch((err) => console.log(err));

// const updateBVNui = async (city) => {
//   const bvnDetails = await
// };

const getBVNdetails = (e) => {
  e.preventDefault();

  // Get bvn value
  const bvnNo = formbvn.bvn.value.trim();
  const phoneNumber = formbvn.phone.value.trim();

  //Error handling
  if (formbvn.bvn.value.trim() === "" && formbvn.phone.value.trim() === "") {
    showErrorBVN("Please enter your BVN correctly and try again");
    // console.log("Failed");
  } else {
    getBVNInfo(bvnNo);
    // console.log("passed");
  }
};

// Function to check the box
const checkTheBox = (e) => {
  const result = e.target.value;

  // Get bvn value
  const bvnNo = formbvn.bvn.value;
  const phoneNumber = formbvn.phone.value;

  if (bvnNo && phoneNumber) {
    formbvn.termsCondition.checked = true;
    formbvn.privacyPolicy.checked = true;
  } else {
    formbvn.termsCondition.checked = false;
    formbvn.privacyPolicy.checked = false;
  }
};

formbvn.addEventListener("submit", getBVNdetails);
phone.addEventListener("keyup", checkTheBox);
bvn.addEventListener("keyup", checkTheBox);
