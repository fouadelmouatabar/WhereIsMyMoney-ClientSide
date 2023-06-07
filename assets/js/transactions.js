
const transactionsList = document.querySelector("#transactionsList");
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
                    <tr class='clickable-row' data-href='#'>
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
                    <tr class='clickable-row' data-href='#'>
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
