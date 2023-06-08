
const transactionsList = document.querySelector("#transactionsList");
const editModal = document.getElementById('editOperationModal');
const bsEditModal = new bootstrap.Modal(editModal);
const modalBody = editModal.querySelector('.modal-body');

const editOperType = document.querySelector("#editOperType");
const editOperAmount = document.querySelector("#editOperAmount");
const editOperDesc = document.querySelector("#editOperDesc");


setTransactions();

function setTransactions() {
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
            transTable += `
                    <tr class='clickable-row' data-id='${transactions[i].operationId}'>
                        <td>${operationDesc}</td>
                        <td>
                            <span class="badge badge-light-${badgeClass}">${operationType}</span>
                        </td>
                        <td>${operationDate}</td>
                        <td class="text-end">${operationAmount} ${currency}</td>
                    </tr>`;
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
                        modalContent = `
                            <div class="sign-form">
                                <div class="operation-feedback" id="operFeedback"></div>
                                <div class="row">
                                    <div class="col-12">
                                        <div class="mb-3">
                                            <label class="form-label">Operation Type <span class="form-label-required">*</span></label>
                                            <div class="radio-btns" id="editOperType">
                                                <label>
                                                    <input type="radio" name="operType" value="INCOME">
                                                    <span>Income</span>
                                                </label>
                                                <label>
                                                    <input type="radio" name="operType" value="EXPENSE">
                                                    <span>Expense</span>
                                                </label>
                                            </div>
                                            <div class="invalid-feedback"></div>
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <div class="mb-3">
                                            <label for="" class="form-label">Amount <span class="form-label-required">*</span></label>
                                            <input type="text" class="form-control" id="editOperAmount" value="${transactions[i].amount}">
                                            <div class="invalid-feedback"></div>
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <div class="mb-3">
                                            <label for="" class="form-label">Motif / Description <span class="form-label-required">*</span></label>
                                            <input type="text" class="form-control" id="editOperDesc" value="${transactions[i].description}">
                                            <div class="invalid-feedback"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between align-items-center">
                                    <button class="btn btn-light-danger" type="button" onclick="deleteTransaction('${transactions[i].operationId}')">Delete</button>
                                    <button class="btn btn-primary" type="button" onclick="editTransaction('${transactions[i].operationId}')">Update</button>
                                </div>
                            </div>
                        `;
                        modalBody.innerHTML = modalContent;
                        let operTypeRadio = modalBody.querySelector("#editOperType");
                        setRadiosVal(operTypeRadio, "operType", transactions[i].operationType);
                        bsEditModal.show();
                    }
                }
            });
        }
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
    if(operAmount.value == "") {
        inputError(editOperAmount, errorRequiredField);
        formErrors = true;
    } else {
        inputValid(editOperAmount);
    }
    if(operDesc.value == "") {
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