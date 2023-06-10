
const transactionsList = document.querySelector("#transactionsList");
const editModal = document.getElementById('editOperationModal');
const bsEditModal = new bootstrap.Modal(editModal);
const modalBody = editModal.querySelector('.modal-body');

const editOperType = document.querySelector("#editOperType");
const editOperAmount = document.querySelector("#editOperAmount");
const editOperDesc = document.querySelector("#editOperDesc");
const editOperId = document.querySelector("#editOperId");
const editOperDelete = document.querySelector("#editOperDelete");
const editOperUpdate = document.querySelector("#editOperUpdate");

window.onload = function() {
    var currentPage = window.location.href;
    if (currentPage.indexOf('transactions.html') !== -1) {
        setTransactions();
    } else if (currentPage.indexOf('incomes.html') !== -1) {
        setTransactions("INCOME");
    } else if (currentPage.indexOf('expenses.html') !== -1) {
        setTransactions("EXPENSE");
    }
};

function setTransactions(operType) {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("accountId");
    const url = `${baseUrl}/operation/all/${userId}`;
    const currency = localStorage.getItem("currency");
    console.log(userId);
    axios.get(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    .then((response) => {
        return response.data;
    })
    .then((transactions) => {
        let transTable = `
        <div class="table-responsive">
            <table class="table align-middle">
                <thead>
                    <tr>
                        <th>Operation Label</th>
                        <th>Operation Type</th>
                        <th>Date</th>
                        <th class="text-end">Amount</th>
                    </tr>
                </thead>
                <tbody>`;
        for (let i = 0; i < transactions.length; i++) {
            const operationId = transactions[i].operationId;
            const operationType = transactions[i].operationType;
            const operationDate = transactions[i].operationDate;
            const operationDesc = transactions[i].description;
            const operationAmount = transactions[i].amount;
            
            let badgeClass = "warning";
            if(operationType === "INCOME") {
                badgeClass = "success";
            } else if(operationType === "EXPENSE") {
                badgeClass = "danger";
            }
            if((operType === "INCOME" && operationType === "INCOME") || (operType === "EXPENSE" && operationType === "EXPENSE") || operType === undefined) {
                transTable += `
                <tr class='clickable-row' data-id='${operationId}'>
                    <td>${operationDesc}</td>
                    <td>
                        <span class="badge badge-light-${badgeClass}">${operationType}</span>
                    </td>
                    <td>${formatDate(operationDate)}</td>
                    <td class="text-end">${operationAmount} ${currency}</td>
                </tr>`;
            }
        }  
        transTable += `</tbody></table></div>`;
        transactionsList.innerHTML = transTable;
        return transactions;
    })
    .then((transactions) => {
        const transactionsTr = transactionsList.querySelectorAll("tbody tr");
        for (var i = 0; i < transactionsTr.length; i++) {
            transactionsTr[i].addEventListener('click', function(event) {
                let transactionId = this.getAttribute('data-id');
                for (var i = 0; i < transactions.length; i++) {
                    if(transactions[i].operationId == transactionId) {
                        editOperAmount.value = transactions[i].amount;
                        editOperDesc.value = transactions[i].description;
                        editOperId.value = transactions[i].operationId;
                        let operTypeRadio = modalBody.querySelector("#editOperType");
                        setRadiosVal(operTypeRadio, "operType", transactions[i].operationType);
                        editOperDelete.setAttribute('data-id', transactionId);
                        editOperUpdate.setAttribute('data-id', transactionId);
                        // modalContent = `
                        //     <button class="btn btn-light-danger" type="button" onclick="deleteTransaction('${transactions[i].operationId}')">Delete</button>
                        //     <button class="btn btn-primary" type="button" onclick="editTransaction('${transactions[i].operationId}')">Update</button>
                        // `;
                        // editModal.querySelector('#modalFooter').innerHTML = modalContent;
                        bsEditModal.show();
                    }
                }
            });
        }
        return transactions;
    }).then((transactions) => {
        editOperDelete.addEventListener('click', function(event) {
            let transactionId = this.getAttribute('data-id');
            deleteTransaction(transactionId);
        });
        editOperUpdate.addEventListener('click', function(event) {
            let transactionId = this.getAttribute('data-id');
            editTransaction(transactionId);
        });
    });
}

// function getTransactions() {
//     const accessToken = localStorage.getItem("accessToken");
//     const userId = localStorage.getItem("accountId");
//     const url = `${baseUrl}/operation/all/${userId}`;
//     console.log(userId);
//     axios.get(url, {
//         headers: {
//             Authorization: `Bearer ${accessToken}`
//         }
//     })
//     .then((response) => {
//         let data = JSON.stringify(response.data);
//         return response.data;
//     });
// }

function editTransaction(operationId) {
    console.log(operationId);
    let formErrors = false;
    // if(getRadiosVal(editOperType, "operType") == "") {
    //     inputError(editOperType, errorRequiredField);
    //     formErrors = true;
    // } else {
    //     inputValid(editOperType);
    // }
    if(editOperAmount.value == "") {
        inputError(editOperAmount, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(editOperAmount);
    }
    if(editOperDesc.value == "") {
        inputError(editOperDesc, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(editOperDesc);
    }

    if(formErrors === false) {
        const accessToken = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("accountId");
        const url = `${baseUrl}/operation/update/${operationId}`;
        const bodyParams = {
            "amount": editOperAmount.value,
            "operationType": getRadiosVal(editOperType, "operType"),
            "description": editOperDesc.value,
            "accountId": userId
        }
        axios.put(url, bodyParams, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })
        .then((response) => {
            console.log(response);
            setTransactions();
            bsEditModal.hide();
        }).catch((err) => {
            console.log(err);
        });
    }
}

function deleteTransaction(operationId) {
    const accessToken = localStorage.getItem("accessToken");
    const url = `${baseUrl}/operation/delete/${operationId}`;
    axios.delete(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    .then((response) => {
        setTransactions();
        bsEditModal.hide();
    }).catch((err) => {
        console.log(err);
    });
}