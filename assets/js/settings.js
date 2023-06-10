const userFullName = document.querySelector("#profileName");
const userDate = document.querySelector("#profileDate");
const userEmail = document.querySelector("#profileEmail");
const userAvatar = document.querySelector("#profileAvatar");
const userFname = document.querySelector("#userFname");
const userLname = document.querySelector("#userLname");
const userGender = document.querySelector("#userGender");
const userAddress = document.querySelector("#userAddress");
const userCity = document.querySelector("#userCity");
const userCountry = document.querySelector("#userCountry");
const userPhone = document.querySelector("#userPhone");
const userPhoneCode = document.querySelector("#userPhoneCode");
const userPhoneNumber = document.querySelector("#userPhoneNumber");
const userBirthDate = document.querySelector("#userBirthDate");
const userBirthDay = document.querySelector("#userBirthDay");
const userBirthMonth = document.querySelector("#userBirthMonth");
const userBirthYear = document.querySelector("#userBirthYear");
const userCurrency = document.querySelector("#userCurrency");
const profileFeedback = document.querySelector("#profileFeedback");
const deleteAccountFeedback = document.querySelector("#deleteAccountFeedback");
const confirmDeleteInput = document.querySelector("#confirmDeleteInput");

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

const accountEmail = document.querySelector("#accountEmail");
const accountCurrency = document.querySelector("#accountCurrency");

setUserInfo();

window.onload = function() {
    var currentPage = window.location.href;
    if (currentPage.indexOf('security-questions.html') !== -1) {
        setAnswers(sQuestionsForm);
    } else if (currentPage.indexOf('/settings.html') !== -1) {
        setPersonalInfo();
    } else if(currentPage.indexOf('account-settings.html') !== -1) {
        setAccountInfo();
    }
};



function setAccountInfo() {
    if(accountCurrency) {
        selectOptions(accountCurrency, currenciesJSON, localStorage.getItem("currency"));
    }
    if(accountEmail) {
        accountEmail.value = localStorage.getItem("email");
    }
}

function updateAvatar(e) {
    let fileInput = e.target;
    if (fileInput.files && fileInput.files[0]) {
        
        let file = fileInput.files[0];

        let reader = new FileReader();
        reader.onload = function(e) {
            userAvatar.src= e.target.result;
        }
        reader.readAsDataURL(file);

        const accessToken = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("accountId");
        const url = `${baseUrl}/image/add/${userId}`;
        
        let formData = new FormData();
        formData.append('image', file);
        
        axios.post(url, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then((response) => {
            console.log(response);
            localStorage.setItem("profileImageId", response.data.imageId);
        });
    }
}

function setProfileAvatar() {
    if(localStorage.getItem("profileImageId") !== null &&
    localStorage.getItem("accountId") !== null ) {
        const accessToken = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("accountId");
        const imageId = localStorage.getItem("profileImageId");
        const url = `${baseUrl}/image/`;
        const bodyParams = {
            "accountId":userId,
            "imageId":imageId
        }
        axios.post(url, bodyParams, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            responseType: 'blob'
        })
        .then(response => {
            const url = window.URL.createObjectURL(response.data);
            userAvatar.src = url;
        })
        .catch((err) => {
            console.log(err);
            return;
        });
    }
}

function setUserInfo() {
    setProfileAvatar();
    if(localStorage.getItem("firstName")  !== null && localStorage.getItem("lastName")  !== null ) {
        userFullName.innerText = `${localStorage.getItem("firstName")} ${localStorage.getItem("lastName")}`;
    }
    if(localStorage.getItem("creationDate")  !== null ) {
        userDate.innerText += ` ${localStorage.getItem("creationDate")}`;
    }
    if(localStorage.getItem("email")  !== null ) {
        userEmail.innerText = localStorage.getItem("email");
    }
}

function setPersonalInfo() {
    if(localStorage.getItem("firstName")  !== null && localStorage.getItem("lastName")  !== null ) {
        userFname.value = localStorage.getItem("firstName");
        userLname.value = localStorage.getItem("lastName");
    }
    if(localStorage.getItem("addressLabel")  !== null ) {
        userAddress.value = localStorage.getItem("addressLabel");
    }
    if(localStorage.getItem("city")  !== null ) {
        userCity.value = localStorage.getItem("city");
    }
    if(localStorage.getItem("phoneNumber")  !== null ) {
        phoneNumber = getPhoneComponents(localStorage.getItem("phoneNumber"));
        selectOptions(userPhoneCode, phoneCodesJSON, phoneNumber[0]);
        userPhoneNumber.value = phoneNumber[1];
    }
    if(localStorage.getItem("country")) {
        selectOptions(userCountry, countriesJSON, localStorage.getItem("country"));
    }
    if(localStorage.getItem("birthDate")) {
        let birthDate = getDateComponents(localStorage.getItem("birthDate"));
        birthDateSelect(userBirthDate, birthDate[0], birthDate[1], birthDate[2]);
    }
    if(localStorage.getItem("gender")) {
        setRadiosVal(userGender, "gender", localStorage.getItem("gender"));
    }
}

function updateProfileInfo() {
    let formErrors = false;
    if(userFname.value == "") {
        inputError(userFname, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(userFname);
    }
    if(userLname.value == "") {
        inputError(userLname, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(userLname);
    }
    if(getRadiosVal(userGender, "gender") == "") {
        inputError(userGender, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(userGender);
    }
    if(userBirthYear.value == "" ||
        userBirthMonth.value == "" ||
        userBirthDay.value == "" ) {
        inputError(userBirthDate, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(userBirthDate);
    }
    if(userAddress.value == "") {
        inputError(userAddress, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(userAddress);
    }
    if(userCity.value == "") {
        inputError(userCity, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(userCity);
    }
    if(userCountry.value == "") {
        inputError(userCountry, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(userCountry);
    }
    if(userPhoneCode.value == "" ||
        userPhoneNumber.value == "") {
        inputError(userPhone, errorRequiredField);
        formErrors = true;
    } else if(!validatePhoneNumber(userPhoneNumber.value)) {
        inputError(userPhone, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(userPhone);
    }

    if(formErrors == false) {
        const accessToken = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("accountId");
        const url = `${baseUrl}/account/update/user-infos/${userId}`;
        const bodyParams = {
            "firstName":userFname.value,
            "lastName":userLname.value,
            "birthDate": `${userBirthYear.value}-${userBirthMonth.value}-${userBirthDay.value}`,
            "gender":getRadiosVal(userGender, "gender"),
            "phoneNumber":`(${userPhoneCode.value})${userPhoneNumber.value}`,
            "addressLabel":userAddress.value,
            "country":userCountry.value,
            "city":userCity.value
        }
        axios.put(url, bodyParams, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then((response) => {
            console.log(response);
            profileFeedback.innerHTML = "";
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
            let alertSuccess = `<div class="alert alert-success">You have successfully updated your profile.</div>`;
            profileFeedback.innerHTML = alertSuccess;
        }).catch((err) => {
            let alertError = `<div class="alert alert-danger">${err.response.data.message}</div>`;
            profileFeedback.innerHTML = alertError;
        });
    }
}

function deleteAccount() {
    let formErrors = false;
    if(confirmDeleteInput.value != "DELETE") {
        inputError(confirmDeleteInput);
        document.querySelector("#deleteHelper").classList.add("text-danger"); 
        formErrors = true;
    } else {
        inputValid(confirmDeleteInput);
        document.querySelector("#deleteHelper").classList.remove("text-danger");
    }
    if(formErrors === false) {
        const accessToken = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("accountId");
        const url = `${baseUrl}/account/delete/${userId}`;
        axios.delete(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then((response) => {
            console.log(response);
            let alertSuccess = `<div class="alert alert-success">Your account was successfully deleted.</div>`;
            deleteAccountFeedback.innerHTML = alertSuccess;
            setTimeout(() => {
                logout();
            }, 10000);
        }).catch((err) => {
            let alertError = `<div class="alert alert-danger">An error occurred while deleting your account.</div>`;
            deleteAccountFeedback.innerHTML = alertError;
        });
    }
}

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
        const url = `${baseUrl}/account/password-reset/${userId}`;
        const bodyParams = {
            "oldPassword": currentPass.value,
            "newPassword": newPass.value
        }
        axios.put(url, bodyParams,
            // {params: { oldPassword: currentPass.value, newPassword: newPass.value}},
            {headers: { Authorization: `Bearer ${accessToken}`}}
        )
        .then((response) => {
            const errorHTML = `<div class="alert alert-success">Your password has been changed!</div>`;
            passResetFeedback.innerHTML = errorHTML;
            setTimeout(() => {
                logout();
                window.location = "index.html";
            }, 2000);
        }).catch((err) => {
            const errorHTML = `<div class="alert alert-danger">Something went wrong, please try again later.</div>`;
            passResetFeedback.innerHTML = errorHTML;
        });
    }
}
