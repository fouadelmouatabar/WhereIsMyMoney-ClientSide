
const baseUrl = "http://localhost:8080/wmm/api/v1"


document.addEventListener("DOMContentLoaded", clickableRows());

const loginBtn = document.getElementById("loginBtn");
if(loginBtn) {
    loginBtn.addEventListener("click", loginBtnClicked);
}

const registerBtn = document.getElementById("registerBtn");
if(registerBtn) {
    registerBtn.addEventListener("click", registerBtnClicked);
}

const registerPass = document.getElementById('registerPass');
if(registerPass) {
    checkPassStrength(registerPass);
    registerPass.addEventListener("keyup", function() {
        checkPassStrength(registerPass);
    });
}

function clickableRows() {
    const rows = document.querySelectorAll(".clickable-row");
    for(const row of rows) {
        row.addEventListener("click", function () {
            window.location = this.getAttribute("data-href");
        }); 
    }
}

function checkLoggedIn() {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if(token == null || userId == null) {
        window.location = `signin.html`;
    }
}

function loginBtnClicked() {
    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPass");
    const loginFeedback = document.getElementById("loginFeedback");
    const url = `${baseUrl}/account/authenticate`;
    const params = {
        "email": email.value,
        "password": password.value
    }

    if(email.value == "") {
        inputError(email, "This field is required.");
    } else if(validateEmail(email.value) == false) {
        inputError(email, "Please enter a valid email address.");
    } else {
        inputValid(email);
    }

    if(password.value == "") {
        inputError(password, "This field is required.");
    } else {
        inputValid(password);
    }

    axios.post(url, params)
    .then((response) => {
        console.log(response);
        loginFeedback.innerHTML = "";
        localStorage.setItem("userId", response.data.accountId);
        localStorage.setItem("token", response.data.access_token);
        // window.location = `dashboard.html`;
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

function registerBtnClicked() {
    const email = document.getElementById("registerEmail");
    const password = document.getElementById("registerPass");
    const cPassword = document.getElementById("registerConfirmPass");

    // const registerFeedback = document.getElementById("registerFeedback");
    // const url = `${baseUrl}/account/register`;

    if(email.value == "") {
        inputError(email, "This field is required.");
    } else if(validateEmail(email.value) == false) {
        inputError(email, "Please enter a valid email address.");
    } else {
        inputValid(email);
    }

    if(password.value == "") {
        inputError(password, "This field is required.");
    } else if(checkPassStrength(password) < 4) {
        inputError(password, "Please choose a stronger password.");
    } else {
        inputValid(password);
    }

    if(cPassword.value == "") {
        inputError(cPassword, "This field is required.");
    } else if(password.value !== cPassword.value) {
        inputError(cPassword, "Passwords do not match.");
    } else {
        inputValid(cPassword);
    }

}

function validateEmail(input) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (input.match(validRegex)) {
        return true;
    } else {
        return false;
    }  
}

function checkPassStrength(input) {
    const password = input.value;
    const strengthIndicator = findSiblingByClassName(input, "password-strength");

    let strength = 0;
    let strengthClass = '';

    if (password.length > 7) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    console.log(strength);
    switch (strength) {
      case 1:
        strengthClass = 'password-risky';
        break;
      case 2:
        strengthClass = 'password-guessable';
        break;
      case 3:
        strengthClass = 'password-weak';
        break;
      case 4:
        strengthClass = 'password-safe';
        break;
      case 5:
        strengthClass = 'password-secure';
        break;
      default:
        strengthClass = '';
    }
    strengthIndicator.className = `password-strength ${strengthClass}`;
    return strength;
}

function inputError(input, message) {
    input.classList.add("input-invalid");
    if (input.nextElementSibling.classList.contains("invalid-feedback")) {
        input.nextElementSibling.classList.add("d-block");
        input.nextElementSibling.innerText = message;
    }
}

function inputValid(input) {
    input.classList.remove("input-invalid");
    if (input.nextElementSibling.classList.contains("invalid-feedback")) {
        input.nextElementSibling.classList.remove("d-block");
        input.nextElementSibling.innerText = "";
    }
}

function findSiblingByClassName(element, className) {
    let sibling = element.nextElementSibling;
    
    while (sibling) {
      if (sibling.classList.contains(className)) {
        return sibling;
      }
      
      sibling = sibling.nextElementSibling;
    }
    
    return null;
}