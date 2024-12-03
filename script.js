document.addEventListener("DOMContentLoaded", () => {
    const rectangle = document.querySelector(".rectangle");

    let isDragging = false;
    let offsetX, offsetY;

    // Inicia el arrastre
    rectangle.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - rectangle.offsetLeft;
        offsetY = e.clientY - rectangle.offsetTop;
        rectangle.style.cursor = "grabbing";
    });

    // Realiza el arrastre
    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            const x = Math.max(0, Math.min(window.innerWidth - rectangle.offsetWidth, e.clientX - offsetX));
            const y = Math.max(0, Math.min(window.innerHeight - rectangle.offsetHeight, e.clientY - offsetY));

            rectangle.style.left = `${x}px`;
            rectangle.style.top = `${y}px`;
        }
    });

    // Finaliza el arrastre
    document.addEventListener("mouseup", () => {
        isDragging = false;
        rectangle.style.cursor = "grab";
    });
});
