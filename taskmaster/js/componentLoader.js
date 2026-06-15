    

async function cargarComponente(id, ruta, callback) {
    try {
        const res = await fetch(ruta);
        if (!res.ok) throw new Error(`Error ${res.status}`);

        const html = await res.text();
        const el = document.getElementById(id);

        if (el) {
            el.innerHTML = html;
            if (callback) callback();
        }
    } catch (err) {
        console.error("Error cargando componente:", ruta, err);
    }
}



function marcarSidebarActivo() {
    const menu = document.getElementById("sidebarMenu");
    if (!menu) return;

    const links = menu.querySelectorAll("a");
    const path = window.location.pathname.split("/").pop() || "index.html";

    links.forEach(a => {
        const href = a.getAttribute("href");
        a.classList.toggle("active", href === path);
    });
}



function inicializarHeader() {
    const btnTheme = document.getElementById("themeToggle");
    if (btnTheme) btnTheme.addEventListener("click", toggleTheme);

    const mode = localStorage.getItem("taskmasterTheme") || "dark";
    actualizarIconoTema(mode);

    if (typeof aplicarPerfilEnHeader === "function") {
        aplicarPerfilEnHeader();
    }

    if (typeof configurarPanelNotificaciones === "function") {
        configurarPanelNotificaciones();
    }

    if (typeof actualizarBadgeNotificaciones === "function") {
        actualizarBadgeNotificaciones();
    }
}



function inicializarSidebarResponsive() {
    const sidebar = document.querySelector(".sidebar-premium");
    const toggleBtn = document.querySelector(".sidebar-toggle-btn");

    if (!sidebar || !toggleBtn) return;

    toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("active");
    });
}



document.addEventListener("DOMContentLoaded", () => {

    cargarComponente("header", "components/header.html", () => {
        inicializarHeader();
    });

    cargarComponente("sidebar", "components/sidebar.html", () => {
        marcarSidebarActivo();
        inicializarSidebarResponsive();
    });
});
