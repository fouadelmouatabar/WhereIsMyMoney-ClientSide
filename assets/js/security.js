
const sQuestionsForm = document.querySelector("#securityQuestions");
const securityQuestion1 = document.querySelector("#securityQuestion1");
const securityQuestion2 = document.querySelector("#securityQuestion2");
const securityQuestion3 = document.querySelector("#securityQuestion3");
const securityAnswer1 = document.querySelector("#securityAnswer1");
const securityAnswer2 = document.querySelector("#securityAnswer2");
const securityAnswer3 = document.querySelector("#securityAnswer3");
const questionsFeedback = document.querySelector("#questionsFeedback");
const passResetFeedback = document.querySelector("#passResetFeedback");
const passFeedback = document.querySelector("#passFeedback");
const currentPass = document.querySelector("#currentPass");
const newPass = document.querySelector("#newPass");
const confirmPass = document.querySelector("#confirmPass");

window.onload = setAnswers(sQuestionsForm);

function setAnswers(form) {
    if(localStorage.getItem("securityAnswers") !== null) {
        const answers = JSON.parse(localStorage.getItem("securityAnswers"));
        const sQuestions = form.querySelectorAll("select");
        const sAnswers = form.querySelectorAll("input[type='text']");
        for (let i = 0; i < sQuestions.length; i++) {
            console.log(answers[i]);
            setQuestions(sQuestions[i], answers[i].questionId);
        }
        for (let i = 0; i < sAnswers.length; i++) {
            sAnswers[i].value = answers[i].answer;
        }
        form.querySelectorAll("select");
    }
}

function updateAnswers() {
    let formErrors = false;

    if(securityQuestion1.value == "") {
        inputError(securityQuestion1, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(securityQuestion1);
    }
    if(securityQuestion2.value == "") {
        inputError(securityQuestion2, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(securityQuestion2);
    }
    if(securityQuestion3.value == "") {
        inputError(securityQuestion3, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(securityQuestion3);
    }
    if(securityAnswer1.value == "") {
        inputError(securityAnswer1, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(securityAnswer1);
    }
    if(securityAnswer2.value == "") {
        inputError(securityAnswer2, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(securityAnswer2);
    }
    if(securityAnswer3.value == "") {
        inputError(securityAnswer3, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(securityAnswer3);
    }
    if(formErrors == false) {
        const accessToken = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("accountId");
        const url = `${baseUrl}/account/update/security-infos/${userId}`;
        const answers = JSON.parse(localStorage.getItem("securityAnswers"));
        console.log(accessToken);
        const bodyParams = [
            {
                "questionId": Number(securityQuestion1.value),
                "answerId": answers[0].answerId,
                "answer": securityAnswer1.value
            },
            {
                "questionId": Number(securityQuestion2.value),
                "answerId": answers[1].answerId,
                "answer": securityAnswer2.value
            },
            {
                "questionId": Number(securityQuestion3.value),
                "answerId": answers[2].answerId,
                "answer": securityAnswer3.value
            }
        ];
        console.log(bodyParams)
        axios.put(url, bodyParams, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then((response) => {
            questionsFeedback.innerHTML = "";
            console.log(response);
            localStorage.setItem("accessToken", response.data.access_token);
            localStorage.setItem("securityAnswers", JSON.stringify(response.data.securityAnswers));
            const errorHTML = `<div class="alert alert-success">Your security questions have been successfully updated.</div>`;
            questionsFeedback.innerHTML = errorHTML;
        }).catch((err) => {
            const errorHTML = `<div class="alert alert-danger">${err.response.data.message}</div>`;
            questionsFeedback.innerHTML = errorHTML;
        });
    }
}

function updatePassword() {
    let formErrors = false;

    if(currentPass.value == "") {
        formErrors = true;
        inputError(currentPass, "This field is required.");
    } else {
        inputValid(currentPass);
    }

    if(newPass.value == "") {
        formErrors = true;
        inputError(newPass, "This field is required.");
    } else if(checkPassStrength(newPass) < 4) {
        formErrors = true;
        inputError(newPass, errorPassWeak);
    } else {
        inputValid(newPass);
    }

    if(confirmPass.value == "") {
        formErrors = true;
        inputError(confirmPass, "This field is required.");
    } else if(newPass.value !== confirmPass.value) {
        formErrors = true;
        inputError(confirmPass, errorPassMatch);
    } else {
        inputValid(confirmPass);
    }
    if(formErrors == false) {
        const accessToken = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("accountId");
        const url = `${baseUrl}/account/password-reset/${userId}/${currentPass.value}/${newPass.value}`;
        axios.put(url, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then((response) => {
            const errorHTML = `<div class="alert alert-success">Your password has been changed!</div>`;
            passResetFeedback.innerHTML = errorHTML;
            setTimeout(() => {
                logout();
                window.location = "signin.html";
            }, 10000);
        }).catch((err) => {
            const errorHTML = `<div class="alert alert-danger">${err.response.data.message}</div>`;
            passResetFeedback.innerHTML = errorHTML;
        });
    }
}