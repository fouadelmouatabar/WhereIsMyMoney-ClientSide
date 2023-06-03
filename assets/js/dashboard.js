function logout(e) {
    if(e != undefined) {
        e.preventDefault();
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("Logged out successfully");
    window.location = "signin.html";
}
