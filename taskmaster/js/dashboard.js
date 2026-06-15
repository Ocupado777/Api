

document.addEventListener("DOMContentLoaded", () => {
    const tareas = JSON.parse(localStorage.getItem("taskmasterTareas")) || [];
    const proyectos = JSON.parse(localStorage.getItem("taskmasterProyectos")) || [];

    actualizarResumen(tareas, proyectos);
    construirListasDashboard(tareas);
    construirProyectosDashboard(proyectos);
    construirGraficoPrioridades(tareas);
    construirMiniCalendario(tareas);
    construirNotificacionesDashboard(tareas);
});



function actualizarResumen(tareas, proyectos) {
    const total = tareas.length;
    const pendientes = tareas.filter(t => t.estado === "pendiente").length;
    const completadas = tareas.filter(t => t.estado === "completada").length;
    const activos = proyectos.filter(p => !p.estado || p.estado === "activo").length;

    setText("totalTareas", total);
    setText("tareasPendientes", pendientes);
    setText("tareasCompletadas", completadas);
    setText("proyectosActivos", activos);
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}



function construirListasDashboard(tareas) {
    const hoy = new Date();
    const hoyStr = hoy.toISOString().split("T")[0];

    const tresDias = new Date(hoy);
    tresDias.setDate(hoy.getDate() + 3);

    const finSemana = new Date(hoy);
    finSemana.setDate(hoy.getDate() + 7);

    const pendientes = tareas.filter(t => t.estado === "pendiente");

    renderListaPremium(
        "listaHoy",
        pendientes.filter(t => t.fecha === hoyStr),
        "No tienes tareas para hoy"
    );

    renderListaPremium(
        "listaProximas",
        pendientes.filter(t => t.fecha && new Date(t.fecha) > hoy && new Date(t.fecha) <= tresDias),
        "No tienes tareas próximas"
    );

    renderListaPremium(
        "listaSemana",
        pendientes.filter(t => t.fecha && new Date(t.fecha) >= hoy && new Date(t.fecha) <= finSemana),
        "No tienes tareas esta semana"
    );

    renderListaPremium(
        "listaImportantes",
        pendientes.filter(t => t.prioridad === "alta"),
        "No tienes tareas importantes"
    );
}

function renderListaPremium(id, lista, mensajeVacio) {
    const cont = document.getElementById(id);
    if (!cont) return;

    cont.innerHTML = "";

    if (lista.length === 0) {
        cont.innerHTML = `<li class="empty-text">${mensajeVacio}</li>`;
        return;
    }

    lista
        .sort((a, b) => new Date(a.fecha || 0) - new Date(b.fecha || 0))
        .forEach(t => cont.innerHTML += crearItemTareaDashboard(t));
}

function crearItemTareaDashboard(t) {
    const fecha = t.fecha ? ` · ${t.fecha}` : "";
    const proyecto = t.proyecto ? ` · ${t.proyecto}` : "";

    const icon =
        t.prioridad === "alta" ? "🔥" :
        t.prioridad === "media" ? "⚡" :
        t.prioridad === "baja" ? "🌱" : "";

    const prioridad = t.prioridad ? ` · ${icon} ${t.prioridad}` : "";

    return `
        <li class="lista-dashboard-item fade-in">
            <strong>${t.titulo}</strong><br>
            <span class="text-muted small">${fecha}${proyecto}${prioridad}</span>
        </li>
    `;
}



function construirProyectosDashboard(proyectos) {
    const cont = document.getElementById("listaProyectosDashboard");
    if (!cont) return;

    cont.innerHTML = "";

    if (!proyectos.length) {
        cont.innerHTML = `<p class="empty-text">No tienes proyectos aún.</p>`;
        return;
    }

    proyectos.slice(0, 5).forEach(p => {
        const tareas = p.tareas || [];
        const total = tareas.length;
        const completadas = tareas.filter(t => t.estado === "completada").length;

        cont.innerHTML += `
            <div class="notificacion-item fade-in">
                <div class="notificacion-icon">📁</div>
                <div class="notificacion-texto">
                    <div class="notificacion-titulo">${p.nombre || "Proyecto sin nombre"}</div>
                    <div class="notificacion-descripcion">
                        Estado: ${p.estado || "activo"} · Tareas: ${completadas}/${total}
                    </div>
                </div>
            </div>
        `;
    });
}


function construirGraficoPrioridades(tareas) {
    const cont = document.getElementById("graficoPrioridades");
    if (!cont) return;

    cont.innerHTML = "";

    if (!tareas.length) {
        cont.innerHTML = `<p class="empty-text">No hay tareas para mostrar prioridades.</p>`;
        return;
    }

    const bajas = tareas.filter(t => t.prioridad === "baja").length;
    const medias = tareas.filter(t => t.prioridad === "media").length;
    const altas = tareas.filter(t => t.prioridad === "alta").length;

    const total = bajas + medias + altas || 1;

    const porc = (n) => Math.round((n / total) * 100);

    cont.innerHTML = `
        ${crearBarra("Prioridad baja", bajas, porc(bajas), "bg-success")}
        ${crearBarra("Prioridad media", medias, porc(medias), "bg-warning")}
        ${crearBarra("Prioridad alta", altas, porc(altas), "bg-danger")}
    `;
}

function crearBarra(label, count, porc, color) {
    return `
        <div class="mb-2 fade-in">
            <span class="text-muted small">${label} (${count})</span>
            <div class="progress">
                <div class="progress-bar ${color}" style="width: ${porc}%"></div>
            </div>
        </div>
    `;
}



function construirMiniCalendario(tareas) {
    const cont = document.getElementById("miniCalendario");
    if (!cont) return;

    cont.innerHTML = "";

    const hoy = new Date();
    const mes = hoy.getMonth();
    const año = hoy.getFullYear();
    const finMes = new Date(año, mes + 1, 0);

    const tareasPorFecha = agruparTareasPorFecha(tareas);

    cont.innerHTML += `<p class="text-muted small mb-2">${nombreMes(mes)} ${año}</p>`;
    cont.innerHTML += `<div class="mini-cal-grid" id="miniCalGrid"></div>`;

    const grid = document.getElementById("miniCalGrid");

    for (let d = 1; d <= finMes.getDate(); d++) {
        const fechaStr = new Date(año, mes, d).toISOString().split("T")[0];
        const lista = tareasPorFecha[fechaStr] || [];

        grid.innerHTML += `
            <div class="mini-cal-dia fade-in ${lista.length ? "con-tareas" : ""}">
                <span>${d}</span>
                <span class="small ${lista.length ? "text-warning" : "text-muted"}">
                    ${lista.length ? `${lista.length} tarea(s)` : ""}
                </span>
            </div>
        `;
    }
}

function agruparTareasPorFecha(tareas) {
    const map = {};
    tareas.forEach(t => {
        if (!t.fecha) return;
        if (!map[t.fecha]) map[t.fecha] = [];
        map[t.fecha].push(t);
    });
    return map;
}

function nombreMes(m) {
    const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    return meses[m] || "";
}

// ============================================================
// NOTIFICACIONES DEL DASHBOARD
// ============================================================

function construirNotificacionesDashboard(tareas) {
    const cont = document.getElementById("listaNotificaciones");
    if (!cont) return;

    cont.innerHTML = "";

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
                titulo: "Para hoy",
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

    if (!notifs.length) {
        cont.innerHTML = `<p class="empty-text">No tienes notificaciones relevantes.</p>`;
        return;
    }

    notifs.slice(0, 10).forEach(n => {
        cont.innerHTML += `
            <div class="notificacion-item fade-in">
                <div class="notificacion-icon">${n.icon}</div>
                <div class="notificacion-texto">
                    <div class="notificacion-titulo">${n.titulo}</div>
                    <div class="notificacion-descripcion">${n.desc}</div>
                </div>
            </div>
        `;
    });
}
