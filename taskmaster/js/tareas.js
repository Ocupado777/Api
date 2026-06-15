let tareasGlobal = [];
let subtareasTemp = [];

document.addEventListener("DOMContentLoaded", () => {
    tareasGlobal = cargarTareas();
    inicializarFiltrosTareas();
    renderizarTareas();
    asignarEventosModal();
});

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



function inicializarFiltrosTareas() {
    const filtroEstado = get("filtroEstado");
    const filtroPrioridad = get("filtroPrioridad");
    const filtroProyecto = get("filtroProyecto");
    const filtroTexto = get("filtroTexto");

    const proyectosUnicos = [...new Set(tareasGlobal.map(t => t.proyecto).filter(Boolean))];
    proyectosUnicos.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p;
        opt.textContent = p;
        filtroProyecto.appendChild(opt);
    });

    let debounceTimer;
    filtroTexto.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(renderizarTareas, 200);
    });

    [filtroEstado, filtroPrioridad, filtroProyecto].forEach(ctrl => {
        ctrl.addEventListener("input", renderizarTareas);
    });
}



function renderizarTareas() {
    const cont = get("listaTareas");
    cont.innerHTML = "";

    if (!tareasGlobal.length) {
        cont.innerHTML = `<p class="empty-text">No tienes tareas registradas.</p>`;
        return;
    }

    let lista = filtrarTareas();

    if (!lista.length) {
        cont.innerHTML = `<p class="empty-text">No hay tareas que coincidan con los filtros.</p>`;
        return;
    }

    lista.sort((a, b) => {
        const fa = new Date(a.fecha || "2100-01-01");
        const fb = new Date(b.fecha || "2100-01-01");
        return fa - fb;
    });

    lista.forEach(t => cont.innerHTML += crearItemTareaHTML(t));

    asignarEventosTarjetas();
}

function filtrarTareas() {
    const estado = get("filtroEstado").value;
    const prioridad = get("filtroPrioridad").value;
    const proyecto = get("filtroProyecto").value;
    const texto = get("filtroTexto").value.toLowerCase();

    return tareasGlobal.filter(t => {
        if (estado !== "todos" && t.estado !== estado) return false;
        if (prioridad !== "todas" && t.prioridad !== prioridad) return false;
        if (proyecto !== "todos" && t.proyecto !== proyecto) return false;
        if (texto && !t.titulo.toLowerCase().includes(texto)) return false;
        return true;
    });
}

function crearItemTareaHTML(t) {
    const prioridadIcon =
        t.prioridad === "alta" ? "🔥" :
        t.prioridad === "media" ? "⚡" :
        "🌱";

    const subtareasHtml = (t.subtareas || [])
        .map(s => `
            <li>
                <input type="checkbox" class="subtarea-toggle"
                       data-tarea-id="${t.id}"
                       data-sub-id="${s.id}"
                       ${s.completada ? "checked" : ""}>
                <span>${s.titulo}</span>
            </li>
        `)
        .join("");

    return `
        <div class="lista-tareas-item fade-in">
            <div class="lista-tareas-info">
                <div class="lista-tareas-titulo">${t.titulo}</div>
                <div class="lista-tareas-detalle">
                    ${t.fecha ? ` · ${t.fecha}` : ""}
                    ${t.proyecto ? ` · ${t.proyecto}` : ""}
                </div>

                <div class="lista-tareas-tags">
                    <span class="tag-pill tag-prioridad-${t.prioridad}">
                        ${prioridadIcon} ${t.prioridad}
                    </span>
                    <span class="tag-pill tag-estado-${t.estado}">
                        ${t.estado}
                    </span>
                </div>

                ${subtareasHtml ? `<ul class="subtareas-list">${subtareasHtml}</ul>` : ""}
            </div>

            <div class="lista-tareas-actions">
                <button class="btn-icon-small btn-toggle-estado" data-id="${t.id}">✔️</button>
                <button class="btn-icon-small btn-editar-tarea" data-id="${t.id}">✏️</button>
                <button class="btn-icon-small btn-eliminar-tarea" data-id="${t.id}">🗑️</button>
            </div>
        </div>
    `;
}



function asignarEventosTarjetas() {
    document.querySelectorAll(".btn-editar-tarea").forEach(btn =>
        btn.addEventListener("click", () => abrirModalEditarTarea(btn.dataset.id))
    );

    document.querySelectorAll(".btn-eliminar-tarea").forEach(btn =>
        btn.addEventListener("click", () => eliminarTarea(btn.dataset.id))
    );

    document.querySelectorAll(".btn-toggle-estado").forEach(btn =>
        btn.addEventListener("click", () => toggleEstadoTarea(btn.dataset.id))
    );

    document.querySelectorAll(".subtarea-toggle").forEach(chk =>
        chk.addEventListener("change", () =>
            toggleSubtareaDesdeTarjeta(chk.dataset.tareaId, chk.dataset.subId)
        )
    );
}



function asignarEventosModal() {
    const btnGuardar = get("guardarTarea");
    const btnAgregarSub = get("btnAgregarSubtarea");

    if (btnGuardar) btnGuardar.addEventListener("click", guardarTareaDesdeModal);
    if (btnAgregarSub) btnAgregarSub.addEventListener("click", agregarSubtareaDesdeModal);
}

function abrirModalEditarTarea(id) {
    const tarea = tareasGlobal.find(t => t.id === id);
    if (!tarea) return;

    get("tareaId").value = tarea.id;
    get("tareaTitulo").value = tarea.titulo;
    get("tareaDescripcion").value = tarea.descripcion;
    get("tareaFecha").value = tarea.fecha;
    get("tareaPrioridad").value = tarea.prioridad;
    get("tareaProyecto").value = tarea.proyecto;

    subtareasTemp = tarea.subtareas ? [...tarea.subtareas] : [];
    renderizarSubtareasModal();

    get("modalTareaTitulo").textContent = "Editar tarea";

    new bootstrap.Modal(get("modalTarea")).show();
}



function agregarSubtareaDesdeModal() {
    const input = get("subtareaInput"); 
    const texto = input.value.trim();
    if (!texto) return;

    subtareasTemp.push({
        id: generarId(),
        titulo: texto,
        completada: false
    });

    input.value = "";
    renderizarSubtareasModal();
}

function renderizarSubtareasModal() {
    const ul = get("subtareasListaModal");
    ul.innerHTML = "";

    subtareasTemp.forEach(s => {
        ul.innerHTML += `
            <li>
                <div class="subtarea-left">
                    <input type="checkbox" ${s.completada ? "checked" : ""} data-id="${s.id}">
                    <span>${s.titulo}</span>
                </div>
                <div class="subtarea-actions">
                    <button data-id="${s.id}" class="subtarea-delete">🗑</button>
                </div>
            </li>
        `;
    });

    ul.querySelectorAll("input[type='checkbox']").forEach(chk =>
        chk.addEventListener("change", () => {
            const id = chk.dataset.id;
            const sub = subtareasTemp.find(s => s.id === id);
            if (sub) sub.completada = chk.checked;
        })
    );

    ul.querySelectorAll(".subtarea-delete").forEach(btn =>
        btn.addEventListener("click", () => {
            subtareasTemp = subtareasTemp.filter(s => s.id !== btn.dataset.id);
            renderizarSubtareasModal();
        })
    );
}



function guardarTareaDesdeModal() {
    const id = get("tareaId").value;
    const titulo = get("tareaTitulo").value.trim();
    const descripcion = get("tareaDescripcion").value.trim();
    const fecha = get("tareaFecha").value;
    const prioridad = get("tareaPrioridad").value;
    const proyecto = get("tareaProyecto").value.trim();

    if (!titulo) {
        mostrarToastPremium("El título es obligatorio.");
        return;
    }

    const estado =
        subtareasTemp.length > 0 && subtareasTemp.every(s => s.completada)
            ? "completada"
            : "pendiente";

    if (id) {
        const idx = tareasGlobal.findIndex(t => t.id === id);
        if (idx !== -1) {
            tareasGlobal[idx] = {
                ...tareasGlobal[idx],
                titulo,
                descripcion,
                fecha,
                prioridad,
                proyecto,
                subtareas: [...subtareasTemp],
                estado
            };
        }
        mostrarToastPremium("Tarea actualizada.");
    } else {
        tareasGlobal.push({
            id: generarId(),
            titulo,
            descripcion,
            fecha,
            prioridad,
            proyecto,
            estado,
            subtareas: [...subtareasTemp]
        });
        mostrarToastPremium("Tarea creada.");
    }

    guardarTareas();
    renderizarTareas();
    actualizarResumen(tareasGlobal, JSON.parse(localStorage.getItem("taskmasterProyectos")) || []);
    actualizarBadgeNotificaciones();

    bootstrap.Modal.getInstance(get("modalTarea")).hide();
    subtareasTemp = [];
}


function eliminarTarea(id) {
    tareasGlobal = tareasGlobal.filter(t => t.id !== id);
    guardarTareas();
    renderizarTareas();
    actualizarResumen(tareasGlobal, JSON.parse(localStorage.getItem("taskmasterProyectos")) || []);
    actualizarBadgeNotificaciones();
    mostrarToastPremium("Tarea eliminada.");
}

function toggleEstadoTarea(id) {
    const tarea = tareasGlobal.find(t => t.id === id);
    if (!tarea) return;

    const nuevoEstado = tarea.estado === "pendiente" ? "completada" : "pendiente";

    tarea.estado = nuevoEstado;

    if (tarea.subtareas) {
        tarea.subtareas = tarea.subtareas.map(s => ({
            ...s,
            completada: nuevoEstado === "completada"
        }));
    }

    guardarTareas();
    renderizarTareas();
    actualizarResumen(tareasGlobal, JSON.parse(localStorage.getItem("taskmasterProyectos")) || []);
    actualizarBadgeNotificaciones();
    mostrarToastPremium("Estado actualizado.");
}

function toggleSubtareaDesdeTarjeta(tareaId, subId) {
    const tarea = tareasGlobal.find(t => t.id === tareaId);
    if (!tarea) return;

    const sub = tarea.subtareas.find(s => s.id === subId);
    if (!sub) return;

    sub.completada = !sub.completada;

    tarea.estado =
        tarea.subtareas.every(s => s.completada) ? "completada" : "pendiente";

    guardarTareas();
    renderizarTareas();
    actualizarResumen(tareasGlobal, JSON.parse(localStorage.getItem("taskmasterProyectos")) || []);
    actualizarBadgeNotificaciones();
    mostrarToastPremium("Subtarea actualizada.");
}
