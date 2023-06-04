const userFullName = document.getElementById("profileName");
const userDate = document.getElementById("profileDate");
const userFname = document.getElementById("userFname");
const userLname = document.getElementById("userLname");
const userGender = document.getElementById("userGender");
const userAddress = document.getElementById("userAddress");
const userCity = document.getElementById("userCity");
const userCountry = document.getElementById("userCountry");
const userPhone = document.getElementById("userPhone");
const userPhoneCode = document.getElementById("userPhoneCode");
const userPhoneNumber = document.getElementById("userPhoneNumber");
const userBirthDate = document.getElementById("userBirthDate");
const userBirthDay = document.getElementById("userBirthDay");
const userBirthMonth = document.getElementById("userBirthMonth");
const userBirthYear = document.getElementById("userBirthYear");
const userCurrency = document.getElementById("userCurrency");
const errorMsgRequired = "This field is required.";
const profileFeedback = document.getElementById("profileFeedback");
const deleteAccountFeedback = document.getElementById("deleteAccountFeedback");
const confirmDeleteInput = document.getElementById("confirmDeleteInput");


window.onload = setUserInfo;

function setUserInfo() {
    if(localStorage.getItem("firstName")  !== null && localStorage.getItem("lastName")  !== null ) {
        userFullName.innerText = `${localStorage.getItem("firstName")} ${localStorage.getItem("lastName")}`;
        userFname.value = localStorage.getItem("firstName");
        userLname.value = localStorage.getItem("lastName");
    }
    if(localStorage.getItem("creationDate")  !== null ) {
        let creationDate = localStorage.getItem("creationDate");
        userDate.innerText += ` ${creationDate}`;
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
        inputError(userFname, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(userFname);
    }
    if(userLname.value == "") {
        inputError(userLname, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(userLname);
    }
    if(getRadiosVal(userGender, "gender") == "") {
        inputError(userGender, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(userGender);
    }
    if(userBirthYear.value == "" ||
        userBirthMonth.value == "" ||
        userBirthDay.value == "" ) {
        inputError(userBirthDate, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(userBirthDate);
    }
    if(userAddress.value == "") {
        inputError(userAddress, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(userAddress);
    }
    if(userCity.value == "") {
        inputError(userCity, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(userCity);
    }
    if(userCountry.value == "") {
        inputError(userCountry, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(userCountry);
    }
    if(userPhoneCode.value == "" ||
        userPhoneNumber.value == "") {
        inputError(userPhone, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(userPhone);
    }
    if(userPhoneNumber.value == "") {
        inputError(userPhone, errorMsgRequired);
        formErrors = true;
    } else {
        inputValid(userPhone);
    }
    if(formErrors == false) {
        const accessToken = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("accountId");
        const url = `${baseUrl}/account/update/user-infos/`;
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
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                id: userId,
            },
        })
        .then((response) => {
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
            let alertSuccess = `<div class="alert alert-danger">${response.data.message}</div>`;
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
        document.getElementById("deleteHelper").classList.add("text-danger"); 
        formErrors = true;
    } else {
        inputValid(confirmDeleteInput);
        document.getElementById("deleteHelper").classList.remove("text-danger");
    }
    if(formErrors === false) {
        const accessToken = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("accountId");
        const url = `${baseUrl}/account/delete/`;
        axios.delete(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                id: userId,
            },
        })
        .then((response) => {
            let alertSuccess = `<div class="alert alert-success">${response.data.message}</div>`;
            deleteAccountFeedback.innerHTML = alertSuccess;
        }).catch((err) => {
            let alertError = `<div class="alert alert-danger">${err.response.data.message}</div>`;
            deleteAccountFeedback.innerHTML = alertError;
        });
    }
}