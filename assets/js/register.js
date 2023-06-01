const countriesJsonPath = "assets/js/JSON/countries.json";
const phoneCodesJsonPath = "assets/js/JSON/phoneCodes.json";
const currentDate = new Date();
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1;
const currentMonthName = monthNames[currentDate.getMonth()];
const currentDay = currentDate.getDate();
const registerPass = document.getElementById('registerPass');
if(registerPass) {
    checkPassStrength(registerPass);
    registerPass.addEventListener("keyup", function() {
        checkPassStrength(registerPass);
    });
}

const selectCountry = document.getElementById("accountCountry");
if(selectCountry) {
    selectJSON(selectCountry, countriesJsonPath);
}

const selectPhoneCode = document.getElementById("accountPhoneCode");
if(selectPhoneCode) {
    selectJSON(selectPhoneCode, phoneCodesJsonPath);
}

const accountBirthdate = document.getElementById("accountBirthdate");
const accountBirthdateYY = document.getElementById("accountBirthdateYY");
const accountBirthdateMM = document.getElementById("accountBirthdateMM");
const accountBirthdateDD = document.getElementById("accountBirthdateDD");
if(accountBirthdateYY) {
    let year = currentYear;
    for (let i = 1; i <=100; i++) {
        var option = document.createElement("option");
        option.value = year;
        option.text = year;
        if(year == currentYear) {
            option.selected = true;
        }
        accountBirthdateYY.appendChild(option);
        year--;
    }
}
if(accountBirthdateMM) {
    for (let i = 0; i < monthNames.length; i++) {
        var option = document.createElement("option");
        option.value = i+1;
        option.text = monthNames[i];
        if(monthNames[i] == currentMonthName) {
            option.selected = true;
        }
        accountBirthdateMM.appendChild(option);
    }
}
if(accountBirthdateDD) {
    for (let i = 1; i <= 31; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.text = i;
        if(i == currentDay) {
            option.selected = true;
        }
        accountBirthdateDD.appendChild(option);
    }
}


function registerAuthValidate() {
    const email = document.getElementById("registerEmail");
    const password = document.getElementById("registerPass");
    const cPassword = document.getElementById("registerConfirmPass");
    let formErrors = false;
    // const registerFeedback = document.getElementById("registerFeedback");
    // const url = `${baseUrl}/account/register`;

    if(email.value == "") {
        formErrors = true;
        inputError(email, "This field is required.");
    } else if(validateEmail(email.value) == false) {
        formErrors = true;
        inputError(email, "Please enter a valid email address.");
    } else {
        inputValid(email);
    }

    if(password.value == "") {
        formErrors = true;
        inputError(password, "This field is required.");
    } else if(checkPassStrength(password) < 4) {
        formErrors = true;
        inputError(password, "Please choose a stronger password.");
    } else {
        inputValid(password);
    }

    if(cPassword.value == "") {
        formErrors = true;
        inputError(cPassword, "This field is required.");
    } else if(password.value !== cPassword.value) {
        formErrors = true;
        inputError(cPassword, "Passwords do not match.");
    } else {
        inputValid(cPassword);
    }
    if(formErrors == false) {
        let elements = document.getElementsByClassName("register-step");
        let elementsArray = Array.from(elements);
        elementsArray[0].classList.add("d-none");
        elementsArray[1].classList.remove("d-none");
    }
}

function registerInfosValidate() {
    const accountFname = document.getElementById("accountFname");
    const accountLname = document.getElementById("accountLname");
    const accountGendre = document.getElementById("accountGendre");
    const accountAddress = document.getElementById("accountAddress");
    const accountCity = document.getElementById("accountCity");
    const accountCountry = document.getElementById("accountCountry");
    const accountCurrency = document.getElementById("accountCurrency");
    const accountPhone = document.getElementById("accountPhone");
    const accountPhoneCode = document.getElementById("accountPhoneCode");
    const accountPhoneNumber = document.getElementById("accountPhoneNumber");
    const accountBirthdate = document.getElementById("accountBirthdate");
    const accountBirthdateYY = document.getElementById("accountBirthdateYY");
    const accountBirthdateMM = document.getElementById("accountBirthdateMM");
    const accountBirthdateDD = document.getElementById("accountBirthdateDD");
    const errorRequiredMsg = "This field is required.";

    let formErrors = false;

    if(accountFname.value == "") {
        inputError(accountFname, errorRequiredMsg);
        formErrors = true;
    } else {
        inputValid(accountFname);
    }

    if(accountLname.value == "") {
        inputError(accountLname, errorRequiredMsg);
        formErrors = true;
    } else {
        inputValid(accountLname);
    }

    if(accountAddress.value == "") {
        inputError(accountAddress, errorRequiredMsg);
        formErrors = true;
    } else {
        inputValid(accountAddress);
    }

    if(accountCity.value == "") {
        inputError(accountCity, errorRequiredMsg);
        formErrors = true;
    } else {
        inputValid(accountCity);
    }

    if(accountCountry.value == "") {
        inputError(accountCountry, errorRequiredMsg);
        formErrors = true;
    } else {
        inputValid(accountCountry);
    }

    if(accountCurrency.value == "") {
        inputError(accountCurrency, errorRequiredMsg);
        formErrors = true;
    } else {
        inputValid(accountCurrency);
    }

    if(radioBtnValue(accountGendre, "gendre") == "") {
        inputError(accountGendre, errorRequiredMsg);
        formErrors = true;
    } else {
        inputValid(accountGendre);
    }

    if(accountBirthdateYY.value == currentYear &&
        accountBirthdateMM.value == currentMonth &&
        accountBirthdateDD.value == currentDay ) {
        inputError(accountBirthdate, errorRequiredMsg);
        formErrors = true;
    } else {
        inputValid(accountBirthdate);
    }

    if(accountPhoneNumber.value == "") {
        inputError(accountPhone, errorRequiredMsg);
        formErrors = true;
    } else {
        inputValid(accountPhone);
    }


    if(formErrors == false) {
        let elements = document.getElementsByClassName("register-step");
        let elementsArray = Array.from(elements);
        elementsArray[1].classList.add("d-none");
        elementsArray[2].classList.remove("d-none");

        // let accountPhoneVal = `${accountPhoneCode.value} ${accountPhoneNumber.value}`;
        // let accountBirthdateVal = `${accountBirthdateYY.value}/${accountBirthdateMM.value}/${accountBirthdateDD.value}`;
        // let accountGendreVal = radioBtnValue(accountGendre, "gendre");
        // localStorage.setItem("registerFname", accountFname.value);
        // localStorage.setItem("registerLname", accountLname.value);
        // localStorage.setItem("registerGender", accountGendreVal);
        // localStorage.setItem("registerBirthdate", accountBirthdateVal);
        // localStorage.setItem("registerAddress", accountAddress.value);
        // localStorage.setItem("registerCity", accountCity.value);
        // localStorage.setItem("registerCountry", accountCountry.value);
        // localStorage.setItem("registerCurrency", accountCurrency.value);
        // localStorage.setItem("registerPhone", accountPhoneVal);
    }
}


function registerStep(i) {
    let elements = document.getElementsByClassName("register-step");
    let elementsArray = Array.from(elements);
    elementsArray[i-1].classList.remove("d-none");
    elementsArray[i].classList.add("d-none");
}