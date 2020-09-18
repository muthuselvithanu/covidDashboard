var loginDiv = document.getElementById("login");
var registerDiv = document.getElementById("register");
var usernameErrDiv = document.getElementById('usernameErr');
var emaillErrDiv = document.getElementById('emailErr');
var passwordErrDiv = document.getElementById('passwordErr');
var zipErrDiv = document.getElementById('zipErr');
let input = document.getElementsByTagName('input');
for (let i = 0; i < input.length; i++) {
    input[i].oninput = changeInput;
}
window.onload = function () {
    registerDiv.style.display = 'none';
};
function registerme() {
    loginDiv.style.display = "none";
    registerDiv.style.display = "block";
}
function goToLogin() {
    loginDiv.style.display = "block";
    registerDiv.style.display = "none";
}
function changeInput(e) {
    if ((e.target.id == "city") || (e.target.id == "state") || (e.target.id == "country")) {
        return;
    }
    if (e.target.value !== "") {
        e.target.classList.remove("errorborder");
        e.target.nextElementSibling.style.display = "none";
    }
}
function validateLoginForm() {
    let isValid = true;
    let name = loginform.user_name.value;
    let pwd = loginform.password.value;
    let nameDiv = document.getElementById('nameErr');
    let pwdDiv = document.getElementById('pwdErr');
    if (name == "" || !(name.includes("@")) || !(name.includes(".co"))) {
        loginform.name.classList.add("errorborder");
        nameDiv.innerHTML = errorMessages.email;
        nameDiv.style.display = "block";
        isValid = false;
    }
    if (pwd == "" || pwd.length < 6 || pwd.length > 12) {
        loginform.password.classList.add("errorborder");
        pwdDiv.innerHTML = errorMessages.password;
        pwdDiv.style.display = "block";
        isValid = false;
    }
    return isValid;
}
function validateRegisterForm() {
    let isValid = true;
    let alphaNum = /^[0-9a-zA-Z]+$/;
    let emailExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let pwdExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
    if (!(registerForm.username.value.match(alphaNum))) {
        registerForm.username.classList.add("errorborder");
        usernameErrDiv.innerHTML = errorMessages.username;
        usernameErrDiv.style.display = "block";
        isValid = false;
    }
    if (!(registerForm.email.value.match(emailExp))) {
        registerForm.email.classList.add("errorborder");
        emaillErrDiv.innerHTML = errorMessages.email;
        emaillErrDiv.style.display = "block";
        isValid = false;
    }
    if (!(registerForm.password.value.match(pwdExp))) {
        registerForm.password.classList.add("errorborder");
        passwordErrDiv.innerHTML = errorMessages.password;
        passwordErrDiv.style.display = "block";
        isValid = false;
    }
    if (!(registerForm.zip.value.match(alphaNum))) {
        registerForm.zip.classList.add("errorborder");
        zipErrDiv.innerHTML = errorMessages.zipcode;
        zipErrDiv.style.display = "block";
        isValid = false;
    }
    return isValid;
}
function onRegisterSubmit() {
    if (validateRegisterForm()) {
        let payload = {
            username: document.getElementById("name").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            state: document.getElementById("state").value,
            country: document.getElementById("country").value,
            zipcode: document.getElementById("zipcode").value
        };
        axios.post("/saveRegisterForm", payload)
            .then(function (response) {
                if (response.status == 200) {
                    document.getElementById("errormsg").innerHTML = response.statusText;
                    document.getElementById("register_form").reset();
                    var timer = setTimeout(function () {
                        location.href = "index.html";
                    }, 1000);
                }
            })
            .catch(function (error) {
                if (error.response.status == 400) {
                    document.getElementById("errormsg").innerHTML = error.response.statusText;
                }
                if (error.response.status == 500) {
                    document.getElementById("errormsg").innerHTML = error.response.statusText;
                }
            });
    }
}
//LOGIN FORM CHECK
function onLoginSubmit() {
    if (validateLoginForm()) {
        let payload = {
            username: document.getElementById("login_name").value,
            password: document.getElementById("login_password").value
        };
        axios.post("/saveLoginForm", payload)
            .then(function (response) {
                if (response.status == 200) {
                    localStorage.setItem("name", response.statusText);
                    location.href = "./src/overview.html";
                }
            })
            .catch(function (error) {
                if (error.response.status == 400) {
                    document.getElementById("loginerrormsg").innerHTML = error.response.statusText;
                }
                if (error.response.status == 500) {
                    document.getElementById("loginerrormsg").innerHTML = error.response.statusText;
                }
            });
    }
}




