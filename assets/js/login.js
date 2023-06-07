function loginValidate() {
    const loginEmail = document.querySelector("#loginEmail");
    const loginPass = document.querySelector("#loginPass");
    const loginFeedback = document.querySelector("#loginFeedback");
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