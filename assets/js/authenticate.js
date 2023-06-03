function loginValidate() {
    const loginEmail = document.getElementById("loginEmail");
    const loginPass = document.getElementById("loginPass");
    const loginFeedback = document.getElementById("loginFeedback");
    const url = `${baseUrl}/account/authenticate`;
    const params = {
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
        axios.post(url, params)
        .then((response) => {
            console.log(response);
            loginFeedback.innerHTML = "";
            localStorage.setItem("userId", response.data.accountId);
            localStorage.setItem("token", response.data.access_token);
            window.location = `dashboard.html`;
        }).catch((err) => {
            const errorHTML = `<div id="formFeedback" class="login-feedback alert alert-danger" role="alert">${err.response.data.message}</div>`;
            const loginErrorElem = document.getElementById("formFeedback");
            if (loginErrorElem !== null) {
                console.log(err.response.data.message);
                loginErrorElem.innerText = err.response.data.message;
            } else {
                loginFeedback.innerHTML = errorHTML;
            }
        });
    }
}