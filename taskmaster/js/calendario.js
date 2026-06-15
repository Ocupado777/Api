

let tareasGlobal = [];
let fechaActual = new Date();



document.addEventListener("DOMContentLoaded", () => {
    tareasGlobal = cargarTareas();

    asignarEventosNavegacion();
    renderizarCalendario();
});



function cargarTareas() {
    return JSON.parse(localStorage.getItem("taskmasterTareas")) || [];
}

function get(id) {
    return document.getElementById(id);
}

function nombreMes(m) {
    const meses = [
        "Enero","Febrero","Marzo","Abril","Mayo","Junio",
        "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
    ];
    return meses[m];
}



function asignarEventosNavegacion() {
    get("btnMesAnterior").addEventListener("click", () => cambiarMes(-1));
    get("btnMesSiguiente").addEventListener("click", () => cambiarMes(1));
    get("btnHoy").addEventListener("click", () => {
        fechaActual = new Date();
        renderizarCalendario();
    });
}

function cambiarMes(delta) {
    fechaActual.setMonth(fechaActual.getMonth() + delta);
    renderizarCalendario();
}



function renderizarCalendario() {
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();

    get("tituloMes").textContent = `${nombreMes(mes)} ${año}`;

    const grid = get("calendarioGrid");
    grid.innerHTML = "";

    const primerDia = new Date(año, mes, 1).getDay();
    const diasMes = new Date(año, mes + 1, 0).getDate();

    for (let i = 0; i < primerDia; i++) {
        grid.innerHTML += `<div></div>`;
    }

    for (let d = 1; d <= diasMes; d++) {
        const fechaStr = new Date(año, mes, d).toISOString().split("T")[0];
        const tareasDia = tareasGlobal.filter(t => t.fecha === fechaStr);

        grid.innerHTML += crearDiaHTML(d, fechaStr, tareasDia);
    }

    asignarEventosDias();
}


function crearDiaHTML(dia, fechaStr, tareasDia) {
    const hoyStr = new Date().toISOString().split("T")[0];
    const esHoy = fechaStr === hoyStr;

    const tareasHTML = tareasDia
        .sort((a, b) => prioridadValor(b.prioridad) - prioridadValor(a.prioridad))
        .map(t => crearTareaHTML(t))
        .join("");

    return `
        <div class="calendario-dia fade-in ${esHoy ? "calendario-hoy" : ""}" data-fecha="${fechaStr}">
            <div class="calendario-dia-numero">${dia}</div>
            <div class="calendario-tareas">${tareasHTML}</div>
            <div class="btn-agregar-dia" data-fecha="${fechaStr}">+</div>
        </div>
    `;
}

function prioridadValor(p) {
    return p === "alta" ? 3 : p === "media" ? 2 : 1;
}

function crearTareaHTML(t) {
    const clase =
        t.prioridad === "alta" ? "tarea-alta" :
        t.prioridad === "media" ? "tarea-media" :
        "tarea-baja";

    const icono =
        t.prioridad === "alta" ? "🔥" :
        t.prioridad === "media" ? "⚡" :
        "🌱";

    return `
        <div class="calendario-tarea ${clase}">
            ${icono} ${t.titulo} (${t.proyecto || "Sin proyecto"})
        </div>
    `;
}



function asignarEventosDias() {
    document.querySelectorAll(".calendario-dia").forEach(dia =>
        dia.addEventListener("click", () => abrirModalDia(dia.dataset.fecha))
    );

    document.querySelectorAll(".btn-agregar-dia").forEach(btn =>
        btn.addEventListener("click", e => {
            e.stopPropagation();
            window.location.href = `tareas.html?fecha=${btn.dataset.fecha}`;
        })
    );
}



function abrirModalDia(fecha) {
    const lista = get("listaTareasDia");
    lista.innerHTML = "";

    const tareasDia = tareasGlobal.filter(t => t.fecha === fecha);

    if (!tareasDia.length) {
        lista.innerHTML = `<li class="empty-text">No hay tareas este día.</li>`;
    } else {
        tareasDia.forEach(t => {
            lista.innerHTML += `
                <li class="lista-dashboard-item fade-in">
                    <strong>${t.titulo}</strong><br>
                    <span class="text-muted small">
                        Proyecto: ${t.proyecto || "Sin proyecto"} · Prioridad: ${t.prioridad}
                    </span>
                </li>
            `;
        });
    }

    get("modalDiaTitulo").textContent = `Tareas del ${fecha}`;
    new bootstrap.Modal(get("modalDia")).show();
}
