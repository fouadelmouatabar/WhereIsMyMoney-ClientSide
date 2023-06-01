function loginValidate() {
    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPass");
    const loginFeedback = document.getElementById("loginFeedback");
    const url = `${baseUrl}/account/authenticate`;
    const params = {
        "email": email.value,
        "password": password.value
    }
    let formErrors = false;
    if(email.value == "") {
        inputError(email, "This field is required.");
        formErrors = true;
    } else if(validateEmail(email.value) == false) {
        inputError(email, "Please enter a valid email address.");
        formErrors = true;
    } else {
        inputValid(email);
    }

    if(password.value == "") {
        inputError(password, "This field is required.");
        formErrors = true;
    } else {
        inputValid(password);
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