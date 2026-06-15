    

document.addEventListener("DOMContentLoaded", () => {
    cargarConfiguracion();
    asignarEventosConfiguracion();
});



function get(id) {
    return document.getElementById(id);
}

function cargarConfigLocal() {
    return JSON.parse(localStorage.getItem("taskmasterConfig")) || {
        tema: "dark",
        fuente: "normal",
        animaciones: "on",
        color: "#8b5cf6"
    };
}

function guardarConfigLocal(config) {
    localStorage.setItem("taskmasterConfig", JSON.stringify(config));
}

 

function cargarConfiguracion() {
    const config = cargarConfigLocal();

    get("configTema").value = config.tema;
    get("configFuente").value = config.fuente;
    get("configAnimaciones").value = config.animaciones;

    document.documentElement.style.setProperty("--accent", config.color);

    aplicarTema(config.tema);

    aplicarFuente(config.fuente);

    aplicarAnimaciones(config.animaciones);

    actualizarAvatarConColor(config.color);
}



function asignarEventosConfiguracion() {
    get("configTema").addEventListener("change", guardarConfiguracion);
    get("configFuente").addEventListener("change", guardarConfiguracion);
    get("configAnimaciones").addEventListener("change", guardarConfiguracion);

    document.querySelectorAll(".color-opcion").forEach(c => {
        c.addEventListener("click", () => {
            const color = c.dataset.color;
            document.documentElement.style.setProperty("--accent", color);
            guardarConfiguracion();
        });
    });

    get("btnResetTodo").addEventListener("click", resetearTodo);
}



function guardarConfiguracion() {
    const tema = get("configTema").value;
    const fuente = get("configFuente").value;
    const animaciones = get("configAnimaciones").value;
    const color = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();

    const config = { tema, fuente, animaciones, color };
    guardarConfigLocal(config);

    localStorage.setItem("taskmasterTheme", tema);

    aplicarTema(tema);
    aplicarFuente(fuente);
    aplicarAnimaciones(animaciones);
    actualizarAvatarConColor(color);

    mostrarToastPremium("Configuración guardada.");
}



function aplicarTema(tema) {
    if (tema === "light") {
        document.body.classList.add("light-mode");
    } else {
        document.body.classList.remove("light-mode");
    }

    const btn = get("themeToggle");
    if (btn) btn.textContent = tema === "light" ? "☀️" : "🌙";
}

function aplicarFuente(fuente) {
    const tamaños = {
        normal: "16px",
        grande: "18px",
        xl: "20px"
    };
    document.body.style.fontSize = tamaños[fuente] || "16px";
}

function aplicarAnimaciones(anim) {
    if (anim === "off") {
        document.body.classList.add("no-anim");
    } else {
        document.body.classList.remove("no-anim");
    }
}

function actualizarAvatarConColor(color) {
    const headerAvatar = document.querySelector(".avatar-premium");
    if (headerAvatar) headerAvatar.style.background = color;

    const perfilAvatar = get("perfilAvatar");
    if (perfilAvatar) perfilAvatar.style.background = color;

    const perfil = JSON.parse(localStorage.getItem("taskmasterPerfil")) || {};
    perfil.color = color;
    localStorage.setItem("taskmasterPerfil", JSON.stringify(perfil));
}



function resetearTodo() {
    localStorage.clear();
    mostrarToastPremium("Datos restablecidos.");
    setTimeout(() => location.reload(), 800);
}
