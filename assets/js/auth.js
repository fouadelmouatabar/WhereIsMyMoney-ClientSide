const loginEmail = document.querySelector("#loginEmail");
const loginPass = document.querySelector("#loginPass");
const loginFeedback = document.querySelector("#loginFeedback");

const registerEmail = document.querySelector("#registerEmail");
const registerPass = document.querySelector("#registerPass");
const registerConfirmPass = document.querySelector("#registerConfirmPass");
const registerFname = document.querySelector("#registerFname");
const registerLname = document.querySelector("#registerLname");
const registerGender = document.querySelector("#registerGender");
const registerAddress = document.querySelector("#registerAddress");
const registerCity = document.querySelector("#registerCity");
const registerCountry = document.querySelector("#registerCountry");
const registerCurrency = document.querySelector("#registerCurrency");
const registerPhone = document.querySelector("#registerPhone");
const registerPhoneCode = document.querySelector("#registerPhoneCode");
const registerPhoneNumber = document.querySelector("#registerPhoneNumber");
const registerBirthDate = document.querySelector("#registerBirthDate");
const registerBirthDateYY = document.querySelector("#registerBirthDateYY");
const registerBirthDateMM = document.querySelector("#registerBirthDateMM");
const registerBirthDateDD = document.querySelector("#registerBirthDateDD");
const registerQuestionsForm = document.querySelector("#securityQuestions");
const registerQuestionOne = document.querySelector("#registerQuestionOne");
const registerQuestionTwo = document.querySelector("#registerQuestionTwo");
const registerQuestionThree = document.querySelector("#registerQuestionThree");
const registerAnswerOne = document.querySelector("#registerAnswerOne");
const registerAnswerTwo = document.querySelector("#registerAnswerTwo");
const registerAnswerThree = document.querySelector("#registerAnswerThree");
const registerFeedback = document.querySelector("#registerFeedback");

const recoveryEmail = document.querySelector("#recoveryEmail");
const recoveryQuestion1 = document.querySelector("#recoveryQuestion1");
const recoveryQuestion2 = document.querySelector("#recoveryQuestion2");
const recoveryQuestion3 = document.querySelector("#recoveryQuestion3");
const recoveryAnswer1 = document.querySelector("#recoveryAnswer1");
const recoveryAnswer2 = document.querySelector("#recoveryAnswer2");
const recoveryAnswer3 = document.querySelector("#recoveryAnswer3");
const recoveryPass = document.querySelector("#recoveryPass");
const recoveryConfirmPass = document.querySelector("#recoveryConfirmPass");
const recoveryFeedback = document.querySelector("#recoveryFeedback");
const currentPage = window.location.href;

checkLoggedIn();

if (currentPage.indexOf('signup.html') !== -1) {
    registerForm();
    if(registerPass) {
        checkPassStrength(registerPass);
        registerPass.addEventListener("keyup", function() {
            checkPassStrength(registerPass);
        });
    }
}

function login() {
    const url = `${baseUrl}/account/authenticate`;
    const bodyParams = {
        "email": loginEmail.value,
        "password": loginPass.value
    }
    let formErrors = false;
    if(loginEmail.value == "") {
        inputError(loginEmail, "This field is required.");
        formErrors = true;
    } else if(validateEmail(loginEmail.value) == false) {
        inputError(loginEmail, "Please enter a valid loginEmail address.");
        formErrors = true;
    } else {
        inputValid(loginEmail);
    }

    if(loginPass.value == "") {
        inputError(loginPass, "This field is required.");
        formErrors = true;
    } else {
        inputValid(loginPass);
    }
    if(formErrors == false) {
        axios.post(url, bodyParams)
        .then((response) => {
            console.log(response);
            loginFeedback.innerHTML = "";
            localStorage.setItem("accessToken", response.data.access_token);
            localStorage.setItem("accountId", response.data.accountId);
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("firstName", response.data.firstName);
            localStorage.setItem("lastName", response.data.lastName);
            localStorage.setItem("birthDate", response.data.birthDate);
            localStorage.setItem("gender", response.data.gender);
            localStorage.setItem("phoneNumber", response.data.phoneNumber);
            localStorage.setItem("addressLabel", response.data.addressLabel);
            localStorage.setItem("country", response.data.country);
            localStorage.setItem("city", response.data.city);
            localStorage.setItem("currency", response.data.currency);
            localStorage.setItem("creationDate", response.data.creationDate);
            localStorage.setItem("profileImageId", response.data.profileImageId);
            localStorage.setItem("securityAnswers", JSON.stringify(response.data.securityAnswers));
            window.location = `dashboard.html`;
        }).catch((err) => {
            const errorHTML = `<div id="formFeedback" class="login-feedback alert alert-danger" role="alert">${err.response.data.message}</div>`;
            const loginErrorElem = document.querySelector("#formFeedback");
            if (loginErrorElem !== null) {
                console.log(err.response.data.message);
                loginErrorElem.innerText = err.response.data.message;
            } else {
                loginFeedback.innerHTML = errorHTML;
            }
        });
    }
}

function registerForm() {
    if(registerCountry) {
        selectOptions(registerCountry, countriesJSON, "MA");
    }
    if(registerPhoneCode) {
        selectOptions(registerPhoneCode, phoneCodesJSON, "+212");
    }
    if(registerCurrency) {
        selectOptions(registerCurrency, currenciesJSON, "MAD");
    }
    birthDateSelect(registerBirthDate);
    formSetQuestions(registerQuestionOne);
    formSetQuestions(registerQuestionTwo);
    formSetQuestions(registerQuestionThree);
}

function registerAuth() {
    let formErrors = false;

    if(registerEmail.value == "") {
        formErrors = true;
        inputError(registerEmail, errorRequiredField);
    } else if(validateEmail(registerEmail.value) == false) {
        formErrors = true;
        inputError(registerEmail, errorValidEmail);
    }
    if(registerPass.value == "") {
        formErrors = true;
        inputError(registerPass, errorRequiredField);
    } else if(checkPassStrength(registerPass) < 4) {
        formErrors = true;
        inputError(registerPass, errorPassWeak);
    } else {
        inputValid(registerPass);
    }

    if(registerConfirmPass.value == "") {
        formErrors = true;
        inputError(registerConfirmPass, errorRequiredField);
    } else if(registerPass.value !== registerConfirmPass.value) {
        formErrors = true;
        inputError(registerConfirmPass, errorPassMatch);
    } else {
        inputValid(registerConfirmPass);
    }
    if(formErrors == false) {
        const url = `${baseUrl}/account/emailValidation/${registerEmail.value}`;
        axios.post(url)
        .then((response) => {
            inputValid(registerEmail);
            pageTab(2);
        })
        .catch((err) => {
            inputError(registerEmail, err.response.data.message);
        });
    }
}

function registerInfos() {
    let formErrors = false;

    if(registerFname.value == "") {
        inputError(registerFname, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(registerFname);
    }

    if(registerLname.value == "") {
        inputError(registerLname, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(registerLname);
    }

    if(registerAddress.value == "") {
        inputError(registerAddress, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(registerAddress);
    }

    if(registerCity.value == "") {
        inputError(registerCity, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(registerCity);
    }

    if(registerCountry.value == "") {
        inputError(registerCountry, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(registerCountry);
    }

    if(registerCurrency.value == "") {
        inputError(registerCurrency, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(registerCurrency);
    }

    if(getRadiosVal(registerGender, "gender") == "") {
        inputError(registerGender, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(registerGender);
    }

    if(registerBirthDateYY.value == currentYear &&
        registerBirthDateMM.value == currentMonth &&
        registerBirthDateDD.value == currentDay ) {
        inputError(registerBirthDate, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(registerBirthDate);
    }

    if(registerPhoneNumber.value == "") {
        inputError(registerPhone, errorRequiredField);
        formErrors = true;
    } else if(!validatePhoneNumber(registerPhoneNumber.value)) {
        inputError(registerPhone, errorValidPhone);
        formErrors = true;
    } else {
        inputValid(registerPhone);
    }


    if(formErrors == false) {
        pageTab(3);
    }
}

function signup() {
    let formErrors = false;

    if(registerQuestionOne.value == "") {
        inputError(registerQuestionOne, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(registerQuestionOne);
    }
    if(registerQuestionTwo.value == "") {
        inputError(registerQuestionTwo, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(registerQuestionTwo);
    }
    if(registerQuestionThree.value == "") {
        inputError(registerQuestionThree, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(registerQuestionThree);
    }
    if(registerAnswerOne.value == "") {
        inputError(registerAnswerOne, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(registerAnswerOne);
    }
    if(registerAnswerTwo.value == "") {
        inputError(registerAnswerTwo, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(registerAnswerTwo);
    }
    if(registerAnswerThree.value == "") {
        inputError(registerAnswerThree, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(registerAnswerThree);
    }
    if(formErrors == false) {
        let url = `${baseUrl}/account/register`;
        let registerBirthdate = `${registerBirthDateYY.value}-${registerBirthDateMM.value}-${registerBirthDateDD.value}`;
        let bodyParams = {
            "firstName":registerFname.value,
            "lastName":registerLname.value,
            "birthDate":registerBirthdate,
            "gender":getRadiosVal(registerGender, "gender"),
            "phoneNumber":`(${registerPhoneCode.value})${registerPhoneNumber.value}`,
            "addressLabel":registerAddress.value,
            "country":registerCountry.value,
            "city":registerCity.value,
            "email":registerEmail.value,
            "password":registerPass.value,
            "currency":registerCurrency.value,
            "securityAnswers": [
              {
                "questionId": Number(registerQuestionOne.value),
                "answer": registerAnswerOne.value
              },
              {
                "questionId": Number(registerQuestionTwo.value),
                "answer": registerAnswerTwo.value
              },
              {
                "questionId": Number(registerQuestionThree.value),
                "answer": registerAnswerThree.value
              }
            ]
        }
        // console.log(params);
        axios.post(url, bodyParams)
        .then((response) => {
            registerFeedback.innerHTML = "";
            localStorage.setItem("accessToken", response.data.access_token);
            localStorage.setItem("accountId", response.data.accountId);
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("firstName", response.data.firstName);
            localStorage.setItem("lastName", response.data.lastName);
            localStorage.setItem("birthDate", response.data.birthDate);
            localStorage.setItem("gender", response.data.gender);
            localStorage.setItem("phoneNumber", response.data.phoneNumber);
            localStorage.setItem("addressLabel", response.data.addressLabel);
            localStorage.setItem("country", response.data.country);
            localStorage.setItem("city", response.data.city);
            localStorage.setItem("currency", response.data.currency);
            localStorage.setItem("creationDate", response.data.creationDate);
            localStorage.setItem("securityAnswers", JSON.stringify(response.data.securityAnswers));
            window.location = `settings.html`;
        }).catch((err) => {
            pageTab(1);
            const errorHTML = `<div id="formFeedback" class="login-feedback alert alert-danger" role="alert">${err.response.data.message}</div>`;
            const formFeedback = document.querySelector("#formFeedback");
            if (formFeedback !== null) {
                console.log(err.response.data.message);
                formFeedback.innerText = err.response.data.message;
            } else {
                registerFeedback.innerHTML = errorHTML;
            }
        });
    }
}

function passRecoveryCheck() {
    let formErrors = false;

    if(recoveryEmail.value == "") {
        formErrors = true;
        inputError(recoveryEmail, "This field is required.");
    } else if(validateEmail(recoveryEmail.value) == false) {
        formErrors = true;
        inputError(recoveryEmail, errorValidEmail);
    } else {
        const url = `${baseUrl}/account/emailValidation/${recoveryEmail.value}`;
        axios.post(url)
        .then(response => {
            formErrors = true;
            inputError(recoveryEmail, "Emai doesn't exist!");
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
            inputValid(recoveryEmail);
        });
    }
    if(recoveryQuestion1.value == "") {
        inputError(recoveryQuestion1, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(recoveryQuestion1);
    }
    if(recoveryQuestion2.value == "") {
        inputError(recoveryQuestion2, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(recoveryQuestion2);
    }
    if(recoveryQuestion3.value == "") {
        inputError(recoveryQuestion3, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(recoveryQuestion3);
    }
    if(recoveryAnswer1.value == "") {
        inputError(recoveryAnswer1, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(recoveryAnswer1);
    }
    if(recoveryAnswer2.value == "") {
        inputError(recoveryAnswer2, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(recoveryAnswer2);
    }
    if(recoveryAnswer3.value == "") {
        inputError(recoveryAnswer3, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(recoveryAnswer3);
    }
    if(formErrors == false) {
        pageTab(2);
    }
}

function passRecovery() {
    let formErrors = false;

    if(recoveryPass.value == "") {
        formErrors = true;
        inputError(recoveryPass, "This field is required.");
    } else if(checkPassStrength(recoveryPass) < 4) {
        formErrors = true;
        inputError(recoveryPass, errorPassWeak);
    } else {
        inputValid(recoveryPass);
    }

    if(recoveryConfirmPass.value == "") {
        formErrors = true;
        inputError(recoveryConfirmPass, "This field is required.");
    } else if(recoveryPass.value !== recoveryConfirmPass.value) {
        formErrors = true;
        inputError(recoveryConfirmPass, errorPassMatch);
    } else {
        inputValid(recoveryConfirmPass);
    }

    if(formErrors == false) {
        const url = `${baseUrl}/account/password-recovery`;
        const bodyParams = {
            "email": recoveryEmail.value,
            "newPassword": recoveryPass.value,
            "securityAnswers": [{
                "questionId": Number(recoveryQuestion1.value),
                "answer": recoveryAnswer1.value
            },
            {
                "questionId": Number(recoveryQuestion2.value),
                "answer": recoveryAnswer2.value
            },
            {
                "questionId": Number(recoveryQuestion3.value),
                "answer": recoveryAnswer3.value
            }]
        };
        axios.put(url, bodyParams)
        .then((response) => {
            console.log(response);
            recoveryFeedback.innerHTML = "";
            window.location = "index.html";
        }).catch((err) => {
            pageTab(1);
            const errorHTML = `<div class="alert alert-danger">Your answers doesn't match our records. try, or verify your submitted the correct questions and answers.</div>`;
            recoveryFeedback.innerHTML = errorHTML;
        });
    }
}