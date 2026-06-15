
(function aplicarTemaAntesDeCargar() {
    const saved = localStorage.getItem("taskmasterTheme") || "dark";

    if (saved === "light") {
        document.documentElement.classList.add("light-mode");
        document.body?.classList.add("light-mode");
    }
})();


document.addEventListener("DOMContentLoaded", () => {
    aplicarTemaInicial();
});


function aplicarTemaInicial() {
    const saved = localStorage.getItem("taskmasterTheme") || "dark";

    if (saved === "light") {
        document.body.classList.add("light-mode");
        actualizarIconoTema("light");
    } else {
        document.body.classList.remove("light-mode");
        actualizarIconoTema("dark");
    }
}


function toggleTheme() {
    const isLight = document.body.classList.toggle("light-mode");
    const mode = isLight ? "light" : "dark";

    localStorage.setItem("taskmasterTheme", mode);
    actualizarIconoTema(mode);
}


function actualizarIconoTema(mode) {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    btn.textContent = mode === "light" ? "☀️" : "🌙";
}


function esperarBotonTema() {
    const interval = setInterval(() => {
        const btn = document.getElementById("themeToggle");
        if (!btn) return;

        const saved = localStorage.getItem("taskmasterTheme") || "dark";
        actualizarIconoTema(saved);

        btn.addEventListener("click", toggleTheme);
        clearInterval(interval);
    }, 40);
}
