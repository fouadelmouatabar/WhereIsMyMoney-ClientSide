
checkLoggedIn();

function logout(e) {
    if(e != undefined) {
        e.preventDefault();
    }
    localStorage.clear();
    window.location = "signin.html";
}