
const countriesJsonPath = "assets/js/JSON/countries.json";
const phoneCodesJsonPath = "assets/js/JSON/phoneCodes.json";

const currentDate = new Date();
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1;
const currentMonthName = monthNames[currentDate.getMonth()];
const currentDay = currentDate.getDate();


const registerEmail = document.getElementById("registerEmail");
const registerPass = document.getElementById("registerPass");
const registerConfirmPass = document.getElementById("registerConfirmPass");
const registerFname = document.getElementById("registerFname");
const registerLname = document.getElementById("registerLname");
const registerGender = document.getElementById("registerGender");
const registerAddress = document.getElementById("registerAddress");
const registerCity = document.getElementById("registerCity");
const registerCountry = document.getElementById("registerCountry");
const registerCurrency = document.getElementById("registerCurrency");
const registerPhone = document.getElementById("registerPhone");
const registerPhoneCode = document.getElementById("registerPhoneCode");
const registerPhoneNumber = document.getElementById("registerPhoneNumber");
const registerBirthDate = document.getElementById("registerBirthDate");
const registerBirthDateYY = document.getElementById("registerBirthDateYY");
const registerBirthDateMM = document.getElementById("registerBirthDateMM");
const registerBirthDateDD = document.getElementById("registerBirthDateDD");
let registerBirthDateVal = `${registerBirthDateYY.value}-${registerBirthDateMM.value}-${registerBirthDateDD.value}`;
const securityQuestionsForm = document.getElementById("securityQuestions");
const registerQuestionOne = document.getElementById("registerQuestionOne");
const registerQuestionTwo = document.getElementById("registerQuestionTwo");
const registerQuestionThree = document.getElementById("registerQuestionThree");
const registerAnswerOne = document.getElementById("registerAnswerOne");
const registerAnswerTwo = document.getElementById("registerAnswerTwo");
const registerAnswerThree = document.getElementById("registerAnswerThree");
const errorMsgRequired = "This field is required.";

if(registerPass) {
    checkPassStrength(registerPass);
    registerPass.addEventListener("keyup", function() {
        checkPassStrength(registerPass);
    });
}

if(registerCountry) {
    selectJSON(registerCountry, countriesJsonPath);
}

if(registerPhoneCode) {
    selectJSON(registerPhoneCode, phoneCodesJsonPath);
}

if(registerBirthDateYY) {
    let year = currentYear;
    for (let i = 1; i <=100; i++) {
        var option = document.createElement("option");
        option.value = year;
        option.text = year;
        if(year == currentYear) {
            option.selected = true;
        }
        registerBirthDateYY.appendChild(option);
        year--;
    }
}
if(registerBirthDateMM) {
    for (let i = 0; i < monthNames.length; i++) {
        var option = document.createElement("option");
        option.value = (i+1).toString().padStart(2, '0');
        option.text = monthNames[i];
        if(monthNames[i] == currentMonthName) {
            option.selected = true;
        }
        registerBirthDateMM.appendChild(option);
    }
}
if(registerBirthDateDD) {
    for (let i = 1; i <= 31; i++) {
        var option = document.createElement("option");
        option.value = i.toString().padStart(2, '0');
        option.text = i.toString().padStart(2, '0');
        if(i == currentDay) {
            option.selected = true;
        }
        registerBirthDateDD.appendChild(option);
    }
}

setSecurityQuestions(securityQuestionsForm);


function registerAuthValidate() {
    let formErrors = false;

    if(registerEmail.value == "") {
        formErrors = true;
        inputError(registerEmail, "This field is required.");
    } else if(validateEmail(registerEmail.value) == false) {
        formErrors = true;
        inputError(registerEmail, "Please enter a valid email address.");
    } else {
        inputValid(registerEmail);
    }

    if(registerPass.value == "") {
        formErrors = true;
        inputError(registerPass, "This field is required.");
    } else if(checkPassStrength(registerPass) < 4) {
        formErrors = true;
        inputError(registerPass, "Please choose a stronger password.");
    } else {
        inputValid(registerPass);
    }

    if(registerConfirmPass.value == "") {
        formErrors = true;
        inputError(registerConfirmPass, "This field is required.");
    } else if(registerPass.value !== registerConfirmPass.value) {
        formErrors = true;
        inputError(registerConfirmPass, "Passwords do not match.");
    } else {
        inputValid(registerConfirmPass);
    }
    if(formErrors == false) {
        registerGoStep(2);
    }
}

function registerInfosValidate() {
    let formErrors = false;

    if(registerFname.value == "") {
        inputError(registerFname, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(registerFname);
    }

    if(registerLname.value == "") {
        inputError(registerLname, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(registerLname);
    }

    if(registerAddress.value == "") {
        inputError(registerAddress, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(registerAddress);
    }

    if(registerCity.value == "") {
        inputError(registerCity, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(registerCity);
    }

    if(registerCountry.value == "") {
        inputError(registerCountry, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(registerCountry);
    }

    if(registerCurrency.value == "") {
        inputError(registerCurrency, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(registerCurrency);
    }

    if(radioInputValue(registerGender, "gender") == "") {
        inputError(registerGender, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(registerGender);
    }

    if(registerBirthDateYY.value == currentYear &&
        registerBirthDateMM.value == currentMonth &&
        registerBirthDateDD.value == currentDay ) {
        inputError(registerBirthDate, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(registerBirthDate);
    }

    if(registerPhoneNumber.value == "") {
        inputError(registerPhone, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(registerPhone);
    }


    if(formErrors == false) {
        registerGoStep(3);

        // let elements = document.getElementsByClassName("register-step");
        // let elementsArray = Array.from(elements);
        // elementsArray[1].classList.add("d-none");
        // elementsArray[2].classList.remove("d-none");

        // let registerPhoneVal = `${registerPhoneCode.value} ${registerPhoneNumber.value}`;
        // let registerBirthDateVal = `${registerBirthDateYY.value}/${registerBirthDateMM.value}/${registerBirthDateDD.value}`;
        // let accountGendreVal = radioBtnValue(accountGendre, "gendre");
        // localStorage.setItem("registerFname", registerFname.value);
        // localStorage.setItem("registerLname", registerLname.value);
        // localStorage.setItem("registerGender", accountGendreVal);
        // localStorage.setItem("registerBirthdate", registerBirthDateVal);
        // localStorage.setItem("registerAddress", registerAddress.value);
        // localStorage.setItem("registerCity", registerCity.value);
        // localStorage.setItem("registerCountry", registerCountry.value);
        // localStorage.setItem("registerCurrency", registerCurrency.value);
        // localStorage.setItem("registerPhone", registerPhoneVal);
    }
}

function registerFinalStep() {
    let formErrors = false;

    if(registerQuestionOne.value == "") {
        inputError(registerQuestionOne, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(registerQuestionOne);
    }
    if(registerQuestionTwo.value == "") {
        inputError(registerQuestionTwo, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(registerQuestionTwo);
    }
    if(registerQuestionThree.value == "") {
        inputError(registerQuestionThree, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(registerQuestionThree);
    }
    if(registerAnswerOne.value == "") {
        inputError(registerAnswerOne, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(registerAnswerOne);
    }
    if(registerAnswerTwo.value == "") {
        inputError(registerAnswerTwo, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(registerAnswerTwo);
    }
    if(registerAnswerThree.value == "") {
        inputError(registerAnswerThree, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(registerAnswerThree);
    }
    if(formErrors == false) {
        let url = `${baseUrl}/account/register`;
        let params = {
            "firstName":registerFname.value,
            "lastName":registerLname.value,
            "birthDate": `${registerBirthDateYY.value}-${registerBirthDateMM.value}-${registerBirthDateDD.value}`,
            "gender":radioInputValue(registerGender, "gender"),
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
        console.log(params);
        axios.post(url, params)
        .then((response) => {
            console.log(response);
            window.location = `dashboard.html`;
        });
    }
}

function registerGoStep(index) {
    let elements = document.getElementsByClassName("register-step");
    let elementsArray = Array.from(elements);
    for (let i = 0; i < elementsArray.length; i++) {
        if (index === i+1) {
            elementsArray[i].classList.remove("d-none");
        } else {
            elementsArray[i].classList.add("d-none");
        }
    }
}

function getSecurityQuestions() {
    axios.get(`${baseUrl}/questions`)
    .then((response) => {
        let questions = response.data;
        for(question of questions) {
            console.log(question.question);
        }
        
    }).catch((err) => {
        console.log(err);
    });
}


function setSecurityQuestions(form) {
    let select = form.querySelectorAll("select");
    let option = `<option value="">Select Question</option>`;
    for (let i = 0; i < select.length; i++) {
        select[i].innerHTML += option;
    }
    axios.get(`${baseUrl}/questions`)
    .then((response) => {
        let questions = response.data;
        return questions;
    }).then((questions) => {
        for (let i = 0; i < select.length; i++) {
            for(question of questions) {
                let option = `<option value="${question.questionId}">${question.question}</option>`;
                select[i].innerHTML += option;
            }
        }
    }).catch((err) => {
        console.error(err);
    });
}