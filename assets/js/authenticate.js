

checkLoggedOut();

function checkLoggedOut() {
    const userId = localStorage.getItem("accessToken");
    const token = localStorage.getItem("accountId");
    if(token != null && userId != null) {
        window.location = `dashboard.html`;
    }
}