
const baseUrl = "http://localhost:8080/wmm/api/v1"


document.addEventListener("DOMContentLoaded", clickableRows());


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

function selectJSON(selectElement, dataJSON) {
    fetch(dataJSON)
    .then(response => response.json())
    .then(data => {
        data.forEach(country => {
            const optionElement = document.createElement('option');
            optionElement.value = country.value;
            optionElement.textContent = country.textContent;
            selectElement.appendChild(optionElement);
        });
    });
}

function radioBtnValue(inputRadio, btnName) {
    // let radios = inputRadio.getElementsByName(btnName);
    let radios = inputRadio.querySelectorAll(`input[name="${btnName}"]`);
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        let selectedValue = radios[i].value;
        return selectedValue;
      }
      return "";
    }
}