
const dashNotifs = document.querySelector("#dashNotifs");
const profileBtn = document.querySelector(".profile-btn");

// checkLoggedOut();
setAvatar();
dashCurrency();
dashStats();

window.addEventListener('load', function() {
    let currentPage = this.window.location.href;
    showNotification(dashNotifs);
    if (currentPage.includes('dashboard.html')) {
        let ctx = document.querySelector("#dashBarChart");
        BarChart(ctx, ["INCOME", "EXPENSE"]);
        PieChart();
    } else if (currentPage.includes('incomes.html')) {
        let ctx = document.querySelector("#incomesBarChart");
        BarChart(ctx, ["INCOME"]);
        PieChart();
    } else if (currentPage.includes('expenses.html')) {
        let ctx = document.querySelector("#expensesBarChart");
        BarChart(ctx, ["EXPENSE"]);
        PieChart();
    }
});

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

function addTransaction(formId, transType) {
    const form = document.getElementById(formId);
    const operFeedback = form.querySelector(".operation-feedback");
    const operType = form.querySelector(".operation-type");
    const operAmount = form.querySelector(".operation-amount");
    const operDesc = form.querySelector(".operation-desc");
    let formErrors = false;
    var operTypeVal = "";
    if(transType == undefined) {
        operTypeVal = getRadiosVal(operType, "operType");
        if(operTypeVal == "") {
            inputError(operType, errorRequiredField);
            formErrors = true;
        } else {
            inputValid(operType);
        }
    } else {
        operTypeVal = transType
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
            "operationType": operTypeVal,
            "description": operDesc.value,
            "accountId": userId
        }
        axios.post(url, bodyParams, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })
        .then((response) => {
            // console.log(response);
            // localStorage.setItem("notifType", "success");
            // localStorage.setItem("notifText", "New operation added successfully!");
            if(operTypeVal == "INCOME") {
                window.location = "incomes.html";
            } else if (operTypeVal == "EXPENSE") {
                window.location = "expenses.html";
            } else {
                location.reload();
            }
        }).catch((err) => {
            let alertError = `<div class="alert alert-danger">${err.response.data.message}</div>`;
            operFeedback.innerHTML = alertError;
        });
    }
}

// const ctx2 = document.getElementById('myChart2');
// const chart2 = new Chart(ctx2, config);



// function getStats() {
//     const accessToken = localStorage.getItem("accessToken");
//     const userId = localStorage.getItem("accountId");
//     const url = `${baseUrl}/operation/all/stats/${userId}`;
//     console.log(url);
//     console.log(accessToken);
//     console.log(userId);
//     const bodyParams = {
//         "startDate": "2023-06-24",
//         "columnFrame": "DAY",
//         "operationType": "INCOME"
//     }
//     axios.put(url, bodyParams, {
//         headers: {
//             Authorization: `Bearer ${accessToken}`,
//         }
//     })
//     .then((response) => {
//         console.log(response.data);
//     });
// }


function dashCurrency() {
    let currency = localStorage.getItem("currency");
    let elements = document.querySelectorAll(".currency");
    for (let i = 0; i < elements.length; i++) {
        elements[i].textContent = currency;
    }
}

async function dashStats() {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("accountId");
    const url = `${baseUrl}/operation/all/stats/${userId}`;
    let today = new Date();
    let year = today.getFullYear();
    let month = (today.getMonth() + 1).toString().padStart(2, '0');
    let day = today.getDate().toString().padStart(2, '0');
    today = year + '-' + month + '-' + day;
    const dayIncomes = document.querySelector("#dayIncomes");
    const weekIncomes = document.querySelector("#weekIncomes");
    const monthIncomes = document.querySelector("#monthIncomes");
    const yearIncomes = document.querySelector("#yearIncomes");
    const dayExpenses = document.querySelector("#dayExpenses");
    const weekExpenses = document.querySelector("#weekExpenses");
    const monthExpenses = document.querySelector("#monthExpenses");
    const yearExpenses = document.querySelector("#yearExpenses");
    const dayBalance = document.querySelector("#dayBalance");
    const weekBalance = document.querySelector("#weekBalance");
    const monthBalance = document.querySelector("#monthBalance");
    const yearBalance = document.querySelector("#yearBalance");

    const dayIncomesVal = await axios.put(
        url,
        {
            "startDate": today,
            "columnFrame": "DAY",
            "operationType": "INCOME"
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        }
    );
    const weekIncomesVal = await axios.put(
        url,
        {
            "startDate": today,
            "columnFrame": "WEEK",
            "operationType": "INCOME"
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        }
    );
    const monthIncomesVal = await axios.put(
        url,
        {
            "startDate": `${year}-${month}-01`,
            "columnFrame": "MONTH",
            "operationType": "INCOME"
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        }
    );
    const yearIncomesVal = await axios.put(
        url,
        {
            "startDate": `${year}-01-01`,
            "columnFrame": "YEAR",
            "operationType": "INCOME"
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        }
    );

    const dayExpensesVal = await axios.put(
        url,
        {
            "startDate": today,
            "columnFrame": "DAY",
            "operationType": "EXPENSE"
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        }
    );
    const weekExpensesVal = await axios.put(
        url,
        {
            "startDate": today,
            "columnFrame": "WEEK",
            "operationType": "EXPENSE"
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        }
    );
    const monthExpensesVal = await axios.put(
        url,
        {
            "startDate": `${year}-${month}-01`,
            "columnFrame": "MONTH",
            "operationType": "EXPENSE"
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        }
    );
    const yearExpensesVal = await axios.put(
        url,
        {
            "startDate": `${year}-01-01`,
            "columnFrame": "YEAR",
            "operationType": "EXPENSE"
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        }
    );

    if (typeof(dayIncomes) != 'undefined' && dayIncomes != null) {
        dayIncomes.textContent = dayIncomesVal.data[0].sum.toFixed(2);
    }
    if (typeof(weekIncomes) != 'undefined' && weekIncomes != null) {
        weekIncomes.textContent = weekIncomesVal.data[0].sum.toFixed(2);
    }
    if (typeof(monthIncomes) != 'undefined' && monthIncomes != null) {
        monthIncomes.textContent = monthIncomesVal.data[0].sum.toFixed(2);
    }
    if (typeof(yearIncomes) != 'undefined' && yearIncomes != null) {
        yearIncomes.textContent = yearIncomesVal.data[0].sum.toFixed(2);
    }
    if (typeof(dayExpenses) != 'undefined' && dayExpenses != null) {
        dayExpenses.textContent = dayExpensesVal.data[0].sum.toFixed(2);
    }
    if (typeof(weekExpenses) != 'undefined' && weekExpenses != null) {
        weekExpenses.textContent = weekExpensesVal.data[0].sum.toFixed(2);
    }
    if (typeof(monthExpenses) != 'undefined' && monthExpenses != null) {
        monthExpenses.textContent = monthExpensesVal.data[0].sum.toFixed(2);
    }
    if (typeof(yearExpenses) != 'undefined' && yearExpenses != null) {
        yearExpenses.textContent = yearExpensesVal.data[0].sum.toFixed(2);
    }
    if (typeof(dayBalance) != 'undefined' && dayBalance != null) {
        const dayBalanceVal = dayIncomesVal.data[0].sum - dayExpensesVal.data[0].sum;
        dayBalance.textContent = dayBalanceVal.toFixed(2);
    }
    if (typeof(weekBalance) != 'undefined' && weekBalance != null) {
        const weekBalanceVal = weekIncomesVal.data[0].sum - weekExpensesVal.data[0].sum;
        if (weekBalanceVal >= 0) {
            weekBalance.parentNode.className = 'text-end text-success-x';
        } else if (weekBalanceVal < 0) {
            weekBalance.parentNode.className = 'text-end text-danger-x';
        }
        weekBalance.textContent = weekBalanceVal.toFixed(2);
    }
    if (typeof(monthBalance) != 'undefined' && monthBalance != null) {
        const monthBalanceVal = monthIncomesVal.data[0].sum - monthExpensesVal.data[0].sum;
        if (monthBalanceVal >= 0) {
            monthBalance.parentNode.className = 'text-end text-success-x';
        } else if (monthBalanceVal < 0) {
            monthBalance.parentNode.className = 'text-end text-danger-x';
        }
        monthBalance.textContent = monthBalanceVal.toFixed(2);
    }
    if (typeof(yearBalance) != 'undefined' && yearBalance != null) {
        const yearBalanceVal = yearIncomesVal.data[0].sum - yearExpensesVal.data[0].sum;
        if (yearBalanceVal >= 0) {
            yearBalance.parentNode.className = 'text-end text-success-x';
        } else if (yearBalanceVal < 0) {
            yearBalance.parentNode.className = 'text-end text-danger-x';
        }
        yearBalance.textContent = yearBalanceVal.toFixed(2);
    }
    const data = new Array();
    for (let i = 0; i < dayIncomesVal.data.length; i++) {
        data[i] = dayIncomesVal.data[i].sum;
    }
}

async function DashBarChart() {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("accountId");
    const url = `${baseUrl}/operation/all/stats/${userId}`;
    const startDate = "2023-01-01";

    let incomes = await axios.put(
        url,
        {
            "startDate": startDate,
            "columnFrame": "DAY",
            "operationType": "INCOME"
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        }
    );

    let expenses = await axios.put(
        url,
        {
            "startDate": startDate,
            "columnFrame": "DAY",
            "operationType": "EXPENSE"
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        }
    );

    console.log(incomes);
    console.log(expenses);
    
    let ctx = document.querySelector("#dashBarChart");
    let data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Weekly Sales',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: 'rgba(54, 162, 235)',
            borderWidth: 0,
            borderRadius: 4,
            borderSkipped: false
        }, {
            label: 'Weekly Sales',
            data: [81, 56, 55, 40, 65, 59, 80],
            backgroundColor: '#e55977',
            borderWidth: 0,
            borderRadius: 4,
            borderSkipped: false
        }]
    };

    let config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };
    let chart = new Chart(ctx, config);
}

function PieChart() {
    let ctx = document.querySelector("#pieChart");
    let data = {
        datasets: [{
            data: [300, 100],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)'
            ],
            hoverOffset: 4
        }]
    };
    let config = {
        type: 'doughnut',
        data: data,
    };
    let chart = new Chart(ctx, config);
}

async function BarChart(ctx, operationTypes) {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("accountId");
    const url = `${baseUrl}/operation/all/stats/${userId}`;
    let startDate = lastSevenDays();
    let dataArr = new Array();
    for (let i = 0; i < operationTypes.length; i++) {
        let data = await axios.put(
            url,
            {
                "startDate": startDate,
                "columnFrame": "DAY",
                "operationType": operationTypes[i]
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }
        );
        dataArr.push(data.data);
    }
    let Sums = new Array();
    let Dates = new Array();
    for (let z = 0; z < dataArr.length; z++) {
        let operDate = startDate;
        let incomesSum = new Array();
        for (let i = 0; i < 7; i++) {
            operDate = new Date(operDate);
            operDate.setDate(operDate.getDate() + 1);
            let year = operDate.getFullYear();
            let month = (operDate.getMonth() + 1).toString().padStart(2, '0');
            let day = operDate.getDate().toString().padStart(2, '0');
            operDate = year + '-' + month + '-' + day;
            let sum = 0;
            for (let j = 0; j < dataArr[z].length; j++) {
                if (dataArr[z][j].date === operDate) {
                    sum = dataArr[z][j].sum;
                }
            }
            incomesSum.push(sum);
            if(z === 0) {
                Dates.push(chartDate(operDate));
            }
        }
        Sums.push(incomesSum);
    }
    
    let data = {
        labels: Dates,
        datasets: []
    };

    for (let i = 0; i < dataArr.length; i++) {
        let bgColors = [, ''];
        let labels = ['', ''];
        data.datasets[i] = {
            label: 'Incomes',
            data: Sums[i],
            backgroundColor: bgColors[i],
            borderWidth: 0,
            borderRadius: 4,
            borderSkipped: false
        }
        if(operationTypes[i] == "INCOME") {
            data.datasets[i].label = "Incomes";
            data.datasets[i].backgroundColor = '#3091d3';
        } else if(operationTypes[i] == "EXPENSE") {
            data.datasets[i].label = "Expenses";
            data.datasets[i].backgroundColor = '#e55977';
        }
    }

    let config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };
    let chart = new Chart(ctx, config);
}
