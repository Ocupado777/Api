
const showMessage = (element, text, color = "red") => {
    if (!element) return;
    element.textContent = text;
    element.style.color = color;
};


const session = localStorage.getItem("taskmasterSession");

if (session === "active") {
    const path = window.location.pathname;

    if (path.includes("login") || path.includes("register")) {
        window.location.href = "index.html";
    }
}


const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const pass = document.getElementById("password").value.trim();

        if (!email || !pass) {
            return showMessage(loginMessage, "Completa todos los campos.");
        }

        const user = JSON.parse(localStorage.getItem("taskmasterUser"));

        if (!user) {
            return showMessage(loginMessage, "No existe ninguna cuenta registrada.");
        }

        if (email !== user.email || pass !== user.password) {
            return showMessage(loginMessage, "Correo o contraseña incorrectos.");
        }

        showMessage(loginMessage, "Inicio de sesión exitoso. Redirigiendo...", "var(--accent)");

        localStorage.setItem("taskmasterSession", "active");

        if (!localStorage.getItem("taskmasterPerfil")) {
            localStorage.setItem("taskmasterPerfil", JSON.stringify({
                nombre: user.name,
                frase: "",
                color: "#8b5cf6"
            }));
        }

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);
    });
}


const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const pass = document.getElementById("password").value.trim();
        const confirm = document.getElementById("confirm").value.trim();

        if (!name || !email || !pass || !confirm) {
            return showMessage(registerMessage, "Completa todos los campos.");
        }

        if (pass !== confirm) {
            return showMessage(registerMessage, "Las contraseñas no coinciden.");
        }

        const existing = JSON.parse(localStorage.getItem("taskmasterUser"));
        if (existing && existing.email === email) {
            return showMessage(registerMessage, "Este correo ya está registrado.");
        }

        const user = { name, email, password: pass };
        localStorage.setItem("taskmasterUser", JSON.stringify(user));

        localStorage.setItem("taskmasterPerfil", JSON.stringify({
            nombre: name,
            frase: "",
            color: "#8b5cf6"
        }));

        showMessage(registerMessage, "Cuenta creada exitosamente. Redirigiendo...", "var(--accent)");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1200);
    });
}


function cerrarSesion() {
    localStorage.removeItem("taskmasterSession");
    window.location.href = "login.html";
}
