document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector("#showNamesButton");
    const textBox = document.querySelector("#namesOutput");
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]; // Nombres de días hábiles
    const cantRect = daysOfWeek.length; // Número de rectángulos basado en el array
    const rectangles = [];
    let isDragging = false;
    let currentRect = null;
    let offsetX = 0, offsetY = 0;

    // Verifica si los elementos existen
    if (!button || !textBox) {
        console.error("Elementos del DOM no encontrados: verifica los IDs en el archivo HTML.");
        return;
    }

    // Crear rectángulos dinámicamente
    daysOfWeek.forEach((day, index) => {
        const rect = document.createElement("div");
        rect.classList.add("rectangle");
        rect.innerHTML = `<span>${day}</span>`;
        document.body.appendChild(rect);
        rectangles.push(rect);

        // Posicionar sin traslaparse al inicio
        let x, y;
        do {
            x = Math.random() * (window.innerWidth - rect.offsetWidth);
            y = Math.random() * (window.innerHeight - rect.offsetHeight);
        } while (rectangles.some(r => checkOverlap(r, { offsetLeft: x, offsetTop: y, offsetWidth: rect.offsetWidth, offsetHeight: rect.offsetHeight })));

        rect.style.left = `${x}px`;
        rect.style.top = `${y}px`;

        // Agregar eventos de ratón y táctiles
        addDragEvents(rect);
    });

    // Evitar traslapes al mover
    function checkOverlap(rect1, rect2) {
        return !(
            rect1.offsetLeft + rect1.offsetWidth <= rect2.offsetLeft ||
            rect2.offsetLeft + rect2.offsetWidth <= rect1.offsetLeft ||
            rect1.offsetTop + rect1.offsetHeight <= rect2.offsetTop ||
            rect2.offsetTop + rect2.offsetHeight <= rect1.offsetTop
        );
    }

    function addDragEvents(rect) {
        const startDrag = (e) => {
            if (e.target !== rect) return; // Solo afecta a los rectángulos
            e.preventDefault(); // Prevenir desplazamiento de la página
            isDragging = true;
            currentRect = rect;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            offsetX = clientX - rect.offsetLeft;
            offsetY = clientY - rect.offsetTop;
            rect.style.cursor = "grabbing";
        };

        const doDrag = (e) => {
            if (!isDragging || !currentRect) return;
            e.preventDefault(); // Prevenir desplazamiento de la página
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            let x = Math.max(0, Math.min(window.innerWidth - currentRect.offsetWidth, clientX - offsetX));
            let y = Math.max(0, Math.min(window.innerHeight - currentRect.offsetHeight, clientY - offsetY));

            // Evitar traslapes después del movimiento
            const tempRect = { offsetLeft: x, offsetTop: y, offsetWidth: currentRect.offsetWidth, offsetHeight: currentRect.offsetHeight };
            if (!rectangles.some(r => r !== currentRect && checkOverlap(r, tempRect))) {
                currentRect.style.left = `${x}px`;
                currentRect.style.top = `${y}px`;
            }
        };

        const endDrag = (e) => {
            if (!isDragging) return;
            e.preventDefault(); // Prevenir desplazamiento de la página
            isDragging = false;
            currentRect.style.cursor = "grab";
            currentRect = null;
        };

        // Eventos de ratón
        rect.addEventListener("mousedown", startDrag);
        document.addEventListener("mousemove", doDrag);
        document.addEventListener("mouseup", endDrag);

        // Eventos táctiles
        rect.addEventListener("touchstart", startDrag);
        document.addEventListener("touchmove", doDrag);
        document.addEventListener("touchend", endDrag);
    }

    // Botón: Mostrar nombres de rectángulos ordenados por eje X
    button.addEventListener("click", () => {
        const sortedNames = rectangles
            .map((rect) => ({ name: rect.innerText, x: rect.offsetLeft }))
            .sort((a, b) => a.x - b.x)
            .map((rect) => rect.name);

        textBox.value = sortedNames.join(", ") || "Sin nombres disponibles.";
    });
});

/* Cómo modificar para usar nombres desde CSS en el futuro
Reemplaza la función getRectangleNames para extraer datos de un archivo CSS
usando una lógica que lea los valores de las reglas CSS. Esto centraliza la lógica y
evita cambios dispersos en el código. */