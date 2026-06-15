
document.addEventListener("DOMContentLoaded", () => {
    const tareas = JSON.parse(localStorage.getItem("taskmasterTareas")) || [];
    renderizarNotificacionesPagina(tareas);
});



function renderizarNotificacionesPagina(tareas) {
    const cont = document.getElementById("listaNotificacionesPagina");
    cont.innerHTML = "";

    const notifs = generarNotificaciones(tareas);

    if (notifs.length === 0) {
        cont.innerHTML = `<p class="empty-text">No tienes notificaciones relevantes.</p>`;
        return;
    }

    notifs.forEach(n => {
        cont.innerHTML += `
            <div class="notificacion-card">
                <div class="notificacion-icono">${n.icon}</div>
                <div class="notificacion-info">
                    <div class="notificacion-titulo">${n.titulo}</div>
                    <div class="notificacion-desc">${n.desc}</div>
                </div>
            </div>
        `;
    });
}



function generarNotificaciones(tareas) {
    const hoy = new Date();
    const hoyStr = hoy.toISOString().split("T")[0];
    const tresDias = new Date(hoy);
    tresDias.setDate(hoy.getDate() + 3);

    const notifs = [];

    tareas.forEach(t => {
        if (t.estado !== "pendiente") return;

        if (t.fecha && new Date(t.fecha) < hoy) {
            notifs.push({
                icon: "⚠️",
                titulo: "Tarea atrasada",
                desc: `${t.titulo} venció el ${t.fecha}`
            });
        }

        if (t.fecha === hoyStr) {
            notifs.push({
                icon: "📅",
                titulo: "Tarea para hoy",
                desc: t.titulo
            });
        }

        
        if (t.fecha) {
            const f = new Date(t.fecha);
            if (f > hoy && f <= tresDias) {
                notifs.push({
                    icon: "⏰",
                    titulo: "Próxima tarea",
                    desc: `${t.titulo} vence el ${t.fecha}`
                });
            }
        }

        if (t.prioridad === "alta") {
            notifs.push({
                icon: "🔥",
                titulo: "Tarea importante",
                desc: t.titulo
            });
        }
    });

    return notifs;
}
