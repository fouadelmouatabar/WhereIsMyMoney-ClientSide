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
let registerBirthDateVal = `${registerBirthDateYY.value}-${registerBirthDateMM.value}-${registerBirthDateDD.value}`;
const registerQuestionsForm = document.querySelector("#securityQuestions");
const registerQuestionOne = document.querySelector("#registerQuestionOne");
const registerQuestionTwo = document.querySelector("#registerQuestionTwo");
const registerQuestionThree = document.querySelector("#registerQuestionThree");
const registerAnswerOne = document.querySelector("#registerAnswerOne");
const registerAnswerTwo = document.querySelector("#registerAnswerTwo");
const registerAnswerThree = document.querySelector("#registerAnswerThree");
const registerFeedback = document.querySelector("#registerFeedback");

if(registerPass) {
    checkPassStrength(registerPass);
    registerPass.addEventListener("keyup", function() {
        checkPassStrength(registerPass);
    });
}

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

formSetQuestions(registerQuestionsForm);


function registerAuthValidate() {
    let formErrors = false;

    if(registerEmail.value == "") {
        formErrors = true;
        inputError(registerEmail, errorRequiredField);
    } else if(validateEmail(registerEmail.value) == false) {
        formErrors = true;
        inputError(registerEmail, errorValidEmail);
    } else {
        inputValid(registerEmail);
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
        pageTab(2);
    }
}

function registerInfosValidate() {
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
    } else {
        inputValid(registerPhone);
    }


    if(formErrors == false) {
        pageTab(3);
    }
}

function registerFinalStep() {
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
        let bodyParams = {
            "firstName":registerFname.value,
            "lastName":registerLname.value,
            "birthDate": `${registerBirthDateYY.value}-${registerBirthDateMM.value}-${registerBirthDateDD.value}`,
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
            window.location = `profile.html`;
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


