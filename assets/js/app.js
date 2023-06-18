const baseUrl = "https://wmm.up.railway.app/api/v1";
const countriesJSON = "assets/js/JSON/countries.json";
const phoneCodesJSON = "assets/js/JSON/phoneCodes.json";
const currenciesJSON = "assets/js/JSON/currencies.json";
const currentDate = new Date();
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1;
const currentDay = currentDate.getDate();
const errorRequiredField = "This field is required.";
const errorValidEmail = "Please enter a valid email address.";
const errorPassMatch = "Passwords do not match.";
const errorPassWeak = "Please choose a stronger password.";
const errorValidPhone = "Please enter a valid phone number.";

document.onload = clickableRows();
document.onload = hideInputFeedback();

function checkLoggedIn() {
    const userId = localStorage.getItem("accessToken");
    const token = localStorage.getItem("accountId");
    if(token != null && userId != null) {
        window.location = `dashboard.html`;
    }
}

function checkLoggedOut() {
    const userId = localStorage.getItem("accessToken");
    const token = localStorage.getItem("accountId");
    if(token == null || userId == null) {
        window.location = `index.html`;
    }
}

function clickableRows() {
    const rows = document.querySelectorAll(".clickable-row");
    for(const row of rows) {
        row.addEventListener("click", function () {
            window.location = this.getAttribute("data-href");
        }); 
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

function checkPassStrength(e) {
    let input = e;
    if (input instanceof Event) {
        input = e.target;
    }
    const password = input.value;
    const strengthIndicator = findSiblingByClassName(input, "password-strength");

    let strength = 0;
    let strengthClass = '';

    if (password.length > 7) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
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
    let formInput = input.closest('.form-input');
    let inputFeedback = formInput.querySelector('.input-feedback');
    formInput.classList.add("input-invalid");
    if (message !== undefined && inputFeedback !== undefined) {
        formInput.classList.add("input-invalid");
        inputFeedback.innerText = message;

        // if (input.nextElementSibling.classList.contains("input-feedback")) {
        //     input.nextElementSibling.classList.add("d-block");
        //     input.nextElementSibling.innerText = message;
        // }
    }
}

function inputValid(input) {
    let formInput = input.closest('.form-input');
    let inputFeedback = formInput.querySelector('.input-feedback');
    formInput.classList.remove("input-invalid");
    if (inputFeedback !== undefined) {
        formInput.classList.remove("input-invalid");
        inputFeedback.innerText = "";
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

function selectOptions(selectElement, dataJSON, selectedOption) {
    fetch(dataJSON)
    .then(response => response.json())
    .then(data => {
        data.forEach(country => {
            const optionElement = document.createElement('option');
            optionElement.value = country.value;
            optionElement.textContent = country.textContent;
            if(selectedOption != undefined) {
                if(selectedOption == country.value) {
                    optionElement.selected = true; 
                }
            }
            selectElement.appendChild(optionElement);
        });
    });
}

function getRadiosVal(inputRadio, btnName) {
    let radios = inputRadio.querySelectorAll(`input[type="radio"][name="${btnName}"]`);
    let selectedVal = "";
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            selectedVal = radios[i].value;
        }
    }
    return selectedVal;
}

function setRadiosVal(inputRadio, btnName, selectedVal) {
    let radios = inputRadio.querySelectorAll(`input[type="radio"][name="${btnName}"]`);
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].value == selectedVal) {
            radios[i].checked = true;
        } else {
            radios[i].checked = false;
        }
    }
}

function birthDateSelect(form, selectedYear, selectedMonth, selectedDay) {
    let selectElems = form.querySelectorAll("select");
    let year = currentYear;
    for (let i = 1; i <= 31; i++) {
        let option = document.createElement("option");
        let day = i.toString().padStart(2, '0');
        option.value = day;
        option.text = day;
        if(selectedDay != undefined) {
            if(day == selectedDay){
                option.selected = true; 
            }
        } else if(day == currentDay) {
            option.selected = true;
        } else {
            option.selected = false;
        }
        selectElems[0].appendChild(option);
    }
    for (let i = 0; i < monthNames.length; i++) {
        let option = document.createElement("option");
        let month = (i+1).toString().padStart(2, '0');
        option.value = month;
        option.text = monthNames[i];
        if(selectedMonth != undefined) {
            if(month == selectedMonth){
                option.selected = true; 
            }
        } else if(month == currentMonth) {
            option.selected = true;
        } else {
            option.selected = false;
        }
        selectElems[1].appendChild(option);
    }
    for (let i = 1; i <=100; i++) {
        var option = document.createElement("option");
        option.value = year;
        option.text = year;
        if(selectedYear != undefined) {
            if(year == selectedYear) {
                option.selected = true;
            }
        } else if(year == currentYear) {
            option.selected = true;
        } else {
            option.selected = false;
        }
        selectElems[2].appendChild(option);
        year--;
    }
}

function getPhoneComponents(phone) {
    const matches = phone.match(/^\((\+\d+)\)(\d+)$/);
    if (matches) {
        return [matches[1], matches[2]]
    } else {
        console.log("Invalid phone number format");
    }
}

function validatePhoneNumber(phone) {
    if(phone.match(/^(\d+)$/)) {
        return true;
    }
    return false;
}

function getDateComponents(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return [year, month, day];
}

function updateQuestions(formId, select) {
    let selectParent = document.getElementById(formId);
    let selectElems = selectParent.querySelectorAll("select");
    for (let i = 0; i < selectElems.length; i++) {
        if(i != select-1) {
            let excludes = new Array();
            for (let j = 0; j < selectElems.length; j++) {
                if(j != i && selectElems[j].value != "") {
                    excludes.push(selectElems[j].value);
                }
            }
            const options = selectElems[i].options;
            for (option of options) {
                let optionDisabled = false;
                for(let exclude of excludes) {
                    if(option.value == exclude) {
                        optionDisabled = true;
                    }
                }
                if(optionDisabled == true) {
                    option.disabled = true;
                } else {
                    option.disabled = false;
                }
            }
        }
    }
}

function setQuestions(select, selectedOption) {
    let option = `<option value="">Select Question</option>`;
    select.innerHTML = option;
    axios.get(`${baseUrl}/questions`)
    .then((response) => {
        let questions = response.data;
        return questions;
    }).then((questions) => {
        for(let question of questions) {
            const option = document.createElement('option');
            option.value = question.questionId;
            option.text = question.question;
            if(selectedOption !== null) {
                if(selectedOption == question.questionId) {
                    option.selected = true;
                } else {
                    option.selected = false;
                }
            }
            select.appendChild(option);
        }
    }).catch((err) => {
        console.error(err);
    });
}

function formSetQuestions(form) {
    let selects = form.querySelectorAll("select");
    for (let select of selects) {
        setQuestions(select);
    }
}

function pageTab(index) {
    let elements = document.getElementsByClassName("page-tab");
    let elementsArray = Array.from(elements);
    for (let i = 0; i < elementsArray.length; i++) {
        if (index === i+1) {
            elementsArray[i].classList.remove("d-none");
        } else {
            elementsArray[i].classList.add("d-none");
        }
    }
}

function formatDate(dateNum) {
    const date = new Date(dateNum);
    const dateDay = date.getDate();
    const dateMonth = date.getMonth();
    const dateYear = date.getFullYear();
    const FormattedDate = `${dateDay} ${monthNames[dateMonth]} ${dateYear}`;
    return FormattedDate;
}

function hideInputFeedback() {
    const formInputs = document.querySelectorAll('input, select');
    for (let formInput of formInputs) {
        formInput.addEventListener('change', function() {
            inputValid(formInput);
        });
    }
}
