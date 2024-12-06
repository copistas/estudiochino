document.addEventListener("DOMContentLoaded", () => {
    const rectangles = document.querySelectorAll(".rectangle");
    let isDragging = false;
    let currentRect = null;
    let offsetX, offsetY;

    // Inicia el arrastre
    rectangles.forEach(rectangle => {
        rectangle.addEventListener("mousedown", (e) => {
            isDragging = true;
            currentRect = rectangle;
            offsetX = e.clientX - rectangle.offsetLeft;
            offsetY = e.clientY - rectangle.offsetTop;
            rectangle.style.cursor = "grabbing";
        });
    });

    // Realiza el arrastre
    document.addEventListener("mousemove", (e) => {
        if (isDragging && currentRect) {
            const x = Math.max(0, Math.min(window.innerWidth - currentRect.offsetWidth, e.clientX - offsetX));
            const y = Math.max(0, Math.min(window.innerHeight - currentRect.offsetHeight, e.clientY - offsetY));

            // Verificar colisión
            const rect1 = document.getElementById("rect1").getBoundingClientRect();
            const rect2 = document.getElementById("rect2").getBoundingClientRect();
            const newRect = {
                left: x,
                top: y,
                right: x + currentRect.offsetWidth,
                bottom: y + currentRect.offsetHeight,
            };

            if (currentRect.id === "rect1" && !isOverlapping(newRect, rect2)) {
                currentRect.style.left = `${x}px`;
                currentRect.style.top = `${y}px`;
            } else if (currentRect.id === "rect2" && !isOverlapping(newRect, rect1)) {
                currentRect.style.left = `${x}px`;
                currentRect.style.top = `${y}px`;
            }
        }
    });

    // Finaliza el arrastre
    document.addEventListener("mouseup", () => {
        if (currentRect) {
            currentRect.style.cursor = "grab";
        }
        isDragging = false;
        currentRect = null;
    });

    // Verificar si hay colisión
    function isOverlapping(rectA, rectB) {
        return (
            rectA.left < rectB.right &&
            rectA.right > rectB.left &&
            rectA.top < rectB.bottom &&
            rectA.bottom > rectB.top
        );
    }
});
