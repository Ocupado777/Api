

document.addEventListener("DOMContentLoaded", () => {
    aplicarConfiguracionGlobal();
    inicializarPerfilEnHeader();
});


function aplicarConfiguracionGlobal() {
    const config = JSON.parse(localStorage.getItem("taskmasterConfig")) || {
        fuente: "normal",
        animaciones: "on",
        color: "#8b5cf6"
    };

    document.documentElement.style.setProperty("--accent", config.color);

    const tamaños = {
        normal: "16px",
        grande: "18px",
        xl: "20px"
    };
    document.body.style.fontSize = tamaños[config.fuente] || "16px";

    if (config.animaciones === "off") {
        document.body.classList.add("no-anim");
    } else {
        document.body.classList.remove("no-anim");
    }
}


function inicializarPerfilEnHeader() {
    const interval = setInterval(() => {
        const headerName = document.getElementById("userName");
        const headerAvatar = document.getElementById("userAvatar");

        if (!headerName || !headerAvatar) return;

        aplicarPerfilEnHeader();
        clearInterval(interval);
    }, 40);
}


function aplicarPerfilEnHeader() {
    const perfil = JSON.parse(localStorage.getItem("taskmasterPerfil")) || {
        nombre: "Usuario",
        frase: "",
        color: "#8b5cf6"
    };

    const headerName = document.getElementById("userName");
    const headerAvatar = document.getElementById("userAvatar");

    if (headerName) headerName.textContent = perfil.nombre;

    if (headerAvatar) {
        headerAvatar.textContent = perfil.nombre.charAt(0).toUpperCase();
        headerAvatar.style.background = perfil.color;
    }
}
