
document.addEventListener("DOMContentLoaded", () => {
    actualizarBadgeNotificaciones();
});


function actualizarBadgeNotificaciones() {
    const tareas = JSON.parse(localStorage.getItem("taskmasterTareas")) || [];
    const hoy = new Date();
    const hoyStr = hoy.toISOString().split("T")[0];

    const notifs = new Set();

    tareas.forEach(t => {
        if (t.estado !== "pendiente") return;

        
        if (t.fecha && new Date(t.fecha) < hoy) {
            notifs.add(`atrasada-${t.id}`);
        }

        if (t.fecha === hoyStr) {
            notifs.add(`hoy-${t.id}`);
        }

        if (t.prioridad === "alta") {
            notifs.add(`importante-${t.id}`);
        }
    });

    const badge = document.getElementById("badgeNotificaciones");
    if (!badge) return;

    const count = notifs.size;

    if (count > 0) {
        badge.textContent = count;
        badge.classList.remove("d-none");
    } else {
        badge.classList.add("d-none");
    }
}

function configurarPanelNotificaciones() {
    const btn = document.getElementById("btnNotificaciones");
    const panel = document.getElementById("panelNotificaciones");

    if (!btn || !panel) return;

    if (btn.dataset.listenerAdded) return;
    btn.dataset.listenerAdded = "true";

    btn.addEventListener("click", () => {
        panel.classList.toggle("active");
    });

    document.addEventListener("click", e => {
        if (!panel.contains(e.target) && !btn.contains(e.target)) {
            panel.classList.remove("active");
        }
    });
}


function mostrarToastPremium(mensaje) {
    const cont = document.getElementById("toastContainer");
    if (!cont) return;

    const toast = document.createElement("div");
    toast.className = "toast-premium fade-in";
    toast.textContent = mensaje;

    cont.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-10px)";
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}
