

let proyectosGlobal = [];
let tareasGlobal = [];



document.addEventListener("DOMContentLoaded", () => {
    proyectosGlobal = cargarProyectos();
    tareasGlobal = cargarTareas();

    renderizarProyectos();
    asignarEventosModalProyecto();
});



function cargarProyectos() {
    return JSON.parse(localStorage.getItem("taskmasterProyectos")) || [];
}

function guardarProyectos() {
    localStorage.setItem("taskmasterProyectos", JSON.stringify(proyectosGlobal));
}

function cargarTareas() {
    return JSON.parse(localStorage.getItem("taskmasterTareas")) || [];
}

function guardarTareas() {
    localStorage.setItem("taskmasterTareas", JSON.stringify(tareasGlobal));
}

function generarId() {
    return crypto.randomUUID();
}

function get(id) {
    return document.getElementById(id);
}



function renderizarProyectos() {
    const cont = get("listaProyectos");
    cont.innerHTML = "";

    if (!proyectosGlobal.length) {
        cont.innerHTML = `<p class="empty-text">No tienes proyectos creados.</p>`;
        return;
    }

    proyectosGlobal.sort((a, b) => {
        const fa = new Date(a.fecha || "2100-01-01");
        const fb = new Date(b.fecha || "2100-01-01");
        return fa - fb;
    });

    proyectosGlobal.forEach(p => cont.innerHTML += crearProyectoHTML(p));

    asignarEventosTarjetasProyecto();
}

function crearProyectoHTML(p) {
    const icono =
        p.prioridad === "alta" ? "🔥" :
        p.prioridad === "media" ? "⚡" :
        "🌱";

    const tareasProyecto = tareasGlobal.filter(t => t.proyecto === p.nombre);

    const tareasHTML = tareasProyecto.length
        ? tareasProyecto.map(t => `<li>• ${t.titulo}</li>`).join("")
        : `<li>No hay tareas en este proyecto</li>`;

    return `
        <div class="proyecto-card fade-in">

            <div class="proyecto-header">
                <div class="proyecto-icon">${icono}</div>
                <div>
                    <div class="proyecto-nombre">${p.nombre}</div>
                    <div class="proyecto-descripcion">${p.descripcion || ""}</div>
                </div>
            </div>

            <ul class="proyecto-tareas">
                ${tareasHTML}
            </ul>

            <div class="proyecto-footer">
                Fecha límite: ${p.fecha || "Sin fecha"}
            </div>

            <div class="d-flex gap-2 mt-3">
                <button class="btn-icon-small btn-editar-proyecto" data-id="${p.id}">✏️</button>
                <button class="btn-icon-small btn-eliminar-proyecto" data-id="${p.id}">🗑</button>
            </div>

        </div>
    `;
}



function asignarEventosTarjetasProyecto() {
    document.querySelectorAll(".btn-editar-proyecto").forEach(btn =>
        btn.addEventListener("click", () => abrirModalEditarProyecto(btn.dataset.id))
    );

    document.querySelectorAll(".btn-eliminar-proyecto").forEach(btn =>
        btn.addEventListener("click", () => eliminarProyecto(btn.dataset.id))
    );
}



function asignarEventosModalProyecto() {
    const btnGuardar = get("guardarProyecto");
    if (btnGuardar) btnGuardar.addEventListener("click", guardarProyectoDesdeModal);
}

function abrirModalEditarProyecto(id) {
    const p = proyectosGlobal.find(x => x.id === id);
    if (!p) return;

    get("proyectoId").value = p.id;
    get("proyectoNombre").value = p.nombre;
    get("proyectoDescripcion").value = p.descripcion;
    get("proyectoFecha").value = p.fecha;
    get("proyectoPrioridad").value = p.prioridad;

    get("modalProyectoTitulo").textContent = "Editar proyecto";

    new bootstrap.Modal(get("modalProyecto")).show();
}



function guardarProyectoDesdeModal() {
    const id = get("proyectoId").value;
    const nombre = get("proyectoNombre").value.trim();
    const descripcion = get("proyectoDescripcion").value.trim();
    const fecha = get("proyectoFecha").value;
    const prioridad = get("proyectoPrioridad").value;

    if (!nombre) {
        mostrarToastPremium("El nombre es obligatorio.");
        return;
    }

    if (id) {
        const idx = proyectosGlobal.findIndex(p => p.id === id);
        if (idx !== -1) {
            const nombreAnterior = proyectosGlobal[idx].nombre;

            proyectosGlobal[idx] = {
                ...proyectosGlobal[idx],
                nombre,
                descripcion,
                fecha,
                prioridad
            };

            tareasGlobal = tareasGlobal.map(t =>
                t.proyecto === nombreAnterior ? { ...t, proyecto: nombre } : t
            );
            guardarTareas();
        }

        mostrarToastPremium("Proyecto actualizado.");
    } else {
    
        proyectosGlobal.push({
            id: generarId(),
            nombre,
            descripcion,
            fecha,
            prioridad
        });

        mostrarToastPremium("Proyecto creado.");
    }

    guardarProyectos();
    renderizarProyectos();

    bootstrap.Modal.getInstance(get("modalProyecto")).hide();
}



function eliminarProyecto(id) {
    const proyecto = proyectosGlobal.find(p => p.id === id);
    if (!proyecto) return;

    tareasGlobal = tareasGlobal.filter(t => t.proyecto !== proyecto.nombre);
    guardarTareas();

    proyectosGlobal = proyectosGlobal.filter(p => p.id !== id);
    guardarProyectos();

    renderizarProyectos();
    mostrarToastPremium("Proyecto eliminado.");
}
