const operFeedback = document.querySelector("#operFeedback");
const operType = document.querySelector("#operType");
const operAmount = document.querySelector("#operAmount");
const operDesc = document.querySelector("#operDesc");
const dashNotifs = document.querySelector("#dashNotifs");
const profileBtn = document.querySelector(".profile-btn");

checkLoggedIn();
setAvatar();
window.onload = showNotification(dashNotifs);

function setAvatar() {
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
            profileBtn.innerHTML = `<img src="${url}" />`;
        })
        .catch((err) => {
            console.log(err);
            return;
        });
    }
}

function showNotification(dashFeedback) {
    if( localStorage.getItem("notifType") !== null &&
        localStorage.getItem("notifText") !== null ) {
        let notif = localStorage.getItem("notifType");
        let notifText = localStorage.getItem("notifText");
        let notifHTML = `<div class="alert alert-${notif}">${notifText}</div>`;
        dashFeedback.innerHTML = notifHTML;
        localStorage.removeItem("notif");
        localStorage.removeItem("notifText");
        setTimeout(function() {
            dashFeedback.innerHTML = "";
        }, 3000); 
    }
}

function logout(e) {
    if(e != undefined) {
        e.preventDefault();
    }
    localStorage.clear();
    window.location = "index.html";
}

function addTransaction() {
    let formErrors = false;
    if(getRadiosVal(operType, "operType") == "") {
        inputError(operType, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(operType);
    }
    if(operAmount.value == "") {
        inputError(operAmount, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(operAmount);
    }
    if(operDesc.value == "") {
        inputError(operDesc, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(operDesc);
    }

    if(formErrors === false) {
        const accessToken = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("accountId");
        const url = `${baseUrl}/operation/add`;
        const bodyParams = {
            "amount": operAmount.value,
            "operationType": getRadiosVal(operType, "operType"),
            "description": operDesc.value,
            "accountId": userId
        }
        axios.post(url, bodyParams, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })
        .then((response) => {
            console.log(response);
            localStorage.setItem("notifType", "success");
            localStorage.setItem("notifText", "New operation added successfully!");
            window.location = "transactions.html";
        }).catch((err) => {
            let alertError = `<div class="alert alert-danger">${err.response.data.message}</div>`;
            deleteAccountFeedback.innerHTML = alertError;
        });
    }
}