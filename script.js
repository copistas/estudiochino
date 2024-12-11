document.addEventListener("DOMContentLoaded", () => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]; // Nombres de días hábiles
    const cantRect = daysOfWeek.length; // Número de rectángulos basado en el array
    const rectangles = [];

    console.log(`Número de rectángulos: ${cantRect}`);

    /**
     * Método para obtener nombres dinámicamente.
     * En el futuro, podría ser reemplazado por lógica para leer desde un archivo CSS.
     */
    const getRectangleNames = () => daysOfWeek;

    // Crear rectángulos dinámicamente
    const rectangleNames = getRectangleNames();
    rectangleNames.forEach((name, index) => {
        const rectangle = document.createElement("div");
        rectangle.classList.add("rectangle");
        rectangle.id = `rect${index + 1}`;
        rectangle.innerHTML = `<span>${name}</span>`;
        rectangle.style.position = "absolute";

        // Posicionar sin traslapar
        let x, y;
        do {
            x = Math.random() * (window.innerWidth - 100); // Ajusta 100 al tamaño del rectángulo
            y = Math.random() * (window.innerHeight - 50); // Ajusta 50 al tamaño del rectángulo
        } while (rectangles.some(other => 
            x < other.offsetLeft + other.offsetWidth &&
            x + 100 > other.offsetLeft &&
            y < other.offsetTop + other.offsetHeight &&
            y + 50 > other.offsetTop
        ));

        rectangle.style.left = `${x}px`;
        rectangle.style.top = `${y}px`;

        document.body.appendChild(rectangle);
        rectangles.push(rectangle);
    });

    let isDragging = false;
    let currentRect = null;
    let offsetX, offsetY;
    let lastValidPosition = { x: 0, y: 0 }; // Guardar la última posición válida

    // Habilitar el arrastre
    rectangles.forEach(rectangle => {
        rectangle.addEventListener("mousedown", (e) => {
            isDragging = true;
            currentRect = rectangle;
            offsetX = e.clientX - rectangle.offsetLeft;
            offsetY = e.clientY - rectangle.offsetTop;
            lastValidPosition = { x: rectangle.offsetLeft, y: rectangle.offsetTop }; // Guardar la posición antes de mover
            rectangle.style.cursor = "grabbing";
        });
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging && currentRect) {
            const x = Math.max(0, Math.min(window.innerWidth - currentRect.offsetWidth, e.clientX - offsetX));
            const y = Math.max(0, Math.min(window.innerHeight - currentRect.offsetHeight, e.clientY - offsetY));
            currentRect.style.left = `${x}px`;
            currentRect.style.top = `${y}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        if (isDragging && currentRect) {
            // Verificar si hay traslape
            const isOverlapping = rectangles.some(other => 
                other !== currentRect && // No comparar consigo mismo
                currentRect.offsetLeft < other.offsetLeft + other.offsetWidth &&
                currentRect.offsetLeft + currentRect.offsetWidth > other.offsetLeft &&
                currentRect.offsetTop < other.offsetTop + other.offsetHeight &&
                currentRect.offsetTop + currentRect.offsetHeight > other.offsetTop
            );

            if (isOverlapping) {
                // Si hay traslape, devolver a la última posición válida
                currentRect.style.left = `${lastValidPosition.x}px`;
                currentRect.style.top = `${lastValidPosition.y}px`;
            } else {
                // Actualizar la última posición válida
                lastValidPosition = { x: currentRect.offsetLeft, y: currentRect.offsetTop };
            }

            currentRect.style.cursor = "grab";
            currentRect = null;
            isDragging = false;
        }
    });

    // Botón para mostrar nombres visibles en orden de izquierda a derecha
    document.getElementById("showNamesButton").addEventListener("click", () => {
        const visibleNames = rectangles
            .map(rect => ({
                name: rect.querySelector("span")?.textContent || "sin nombre",
                x: rect.offsetLeft
            }))
            .sort((a, b) => a.x - b.x) // Ordenar por posición en el eje X
            .map(rect => rect.name); // Extraer solo los nombres

        const outputField = document.getElementById("namesOutput");
        outputField.value = visibleNames.join(", ");
    });
});

/* Cómo modificar para usar nombres desde CSS en el futuro
Reemplaza la función getRectangleNames para extraer datos de un archivo CSS
usando una lógica que lea los valores de las reglas CSS. Esto centraliza la lógica y
evita cambios dispersos en el código. */