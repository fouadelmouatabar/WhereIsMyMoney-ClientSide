
const sQuestionsForm = document.getElementById("securityQuestions");
const securityQuestion1 = document.getElementById("securityQuestion1");
const securityQuestion2 = document.getElementById("securityQuestion2");
const securityQuestion3 = document.getElementById("securityQuestion3");
const securityAnswer1 = document.getElementById("securityAnswer1");
const securityAnswer2 = document.getElementById("securityAnswer2");
const securityAnswer3 = document.getElementById("securityAnswer3");
const questionsFeedback = document.getElementById("questionsFeedback");
const currentPass = document.getElementById("currentPass");
const newPass = document.getElementById("newPass");
const confirmPass = document.getElementById("confirmPass");

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
        form.sQuestionsForm.querySelectorAll("select");
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
        const url = `${baseUrl}/account/update/security-infos/`;
        const bodyParams = {
            "securityAnswers": [
              {
                "questionId": Number(securityQuestion1.value),
                "answer": securityAnswer1.value
              },
              {
                "questionId": Number(securityQuestion2.value),
                "answer": securityAnswer2.value
              },
              {
                "questionId": Number(securityQuestion3.value),
                "answer": securityAnswer3.value
              }
            ]
        }
        let cons = `(${url}, ${JSON.stringify(bodyParams)}, { headers: { Authorization: Bearer ${accessToken} }, params: { id: ${userId} } })`;
        console.log(cons);
        axios.put(url, bodyParams, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                id: userId,
            },
        })
        .then((response) => {
            questionsFeedback.innerHTML = "";
            localStorage.setItem("securityAnswers", JSON.stringify(response.data.securityAnswers));
            location.reload();
        }).catch((err) => {
            const errorHTML = `<div id="formFeedbackQA" class="login-feedback alert alert-danger" role="alert">${err.response.data.message}</div>`;
            const formFeedback = document.getElementById("formFeedbackQA");
            if (formFeedback !== null) {
                console.log(err.response.data.message);
                formFeedback.innerText = err.response.data.message;
            } else {
                questionsFeedback.innerHTML = errorHTML;
            }
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
        const url = `${baseUrl}/account/password-recovery/`;
        axios.put(url, bodyParams, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                id: userId,
            },
        })
        .then((response) => {
            questionsFeedback.innerHTML = "";
            localStorage.setItem("securityAnswers", JSON.stringify(response.data.securityAnswers));
            location.reload();
        }).catch((err) => {
            const errorHTML = `<div id="formFeedbackQA" class="login-feedback alert alert-danger" role="alert">${err.response.data.message}</div>`;
            const formFeedback = document.getElementById("formFeedbackQA");
            if (formFeedback !== null) {
                console.log(err.response.data.message);
                formFeedback.innerText = err.response.data.message;
            } else {
                questionsFeedback.innerHTML = errorHTML;
            }
        });
    }
}