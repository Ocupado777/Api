document.addEventListener("DOMContentLoaded", () => {
    cargarPerfil();
    asignarEventosPerfil();
});

const get = id => document.getElementById(id);

function cargarPerfilLocal() {
    return JSON.parse(localStorage.getItem("taskmasterPerfil")) || {
        nombre: "Usuario",
        frase: "",
        tema: "dark",
        color: "#8b5cf6"
    };
}

function guardarPerfilLocal(perfil) {
    localStorage.setItem("taskmasterPerfil", JSON.stringify(perfil));
}

function cargarPerfil() {
    const perfil = cargarPerfilLocal();

    get("perfilNombre").value = perfil.nombre;
    get("perfilFrase").value = perfil.frase;
    get("perfilTema").value = perfil.tema;

    const avatar = get("perfilAvatar");
    avatar.style.background = perfil.color;
    avatar.textContent = perfil.nombre.charAt(0).toUpperCase();

    aplicarTemaDesdePerfil(perfil.tema);
    actualizarHeaderPerfil(perfil);
}

function actualizarHeaderPerfil(perfil) {
    const headerName = get("userName");
    const headerAvatar = get("userAvatar");

    if (headerName) headerName.textContent = perfil.nombre;

    if (headerAvatar) {
        headerAvatar.textContent = perfil.nombre.charAt(0).toUpperCase();
        headerAvatar.style.background = perfil.color;
    }
}

function asignarEventosPerfil() {
    const btnGuardar = get("btnGuardarPerfil");
    const btnColor = get("btnCambiarColor");
    const btnCerrar = get("btnCerrarSesion");

    if (btnGuardar) btnGuardar.addEventListener("click", guardarPerfil);
    if (btnColor) btnColor.addEventListener("click", cambiarColorAvatar);

    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
            if (typeof cerrarSesion === "function") {
                cerrarSesion();
            } else {
                localStorage.removeItem("taskmasterSession");
                window.location.href = "login.html";
            }
        });
    }
}

function guardarPerfil() {
    const nombre = get("perfilNombre").value.trim();
    const frase = get("perfilFrase").value.trim();
    const tema = get("perfilTema").value;

    if (!nombre) {
        mostrarToastPremium("El nombre es obligatorio.");
        return;
    }

    const avatar = get("perfilAvatar");
    const color = avatar.style.background;

    const perfil = { nombre, frase, tema, color };

    guardarPerfilLocal(perfil);
    localStorage.setItem("taskmasterTheme", tema);

    aplicarTemaDesdePerfil(tema);
    actualizarHeaderPerfil(perfil);

    mostrarToastPremium("Perfil actualizado.");
}

function cambiarColorAvatar() {
    const colores = [
        "#8b5cf6", "#4c1d95", "#0ea5e9",
        "#10b981", "#f59e0b", "#ef4444",
        "#ec4899", "#6366f1"
    ];

    const nuevo = colores[Math.floor(Math.random() * colores.length)];

    const avatar = get("perfilAvatar");
    avatar.style.background = nuevo;
}

function aplicarTemaDesdePerfil(tema) {
    if (tema === "light") {
        document.body.classList.add("light-mode");
    } else {
        document.body.classList.remove("light-mode");
    }

    const btn = get("themeToggle");
    if (btn) {
        btn.textContent = tema === "light" ? "☀️" : "🌙";
    }
}
