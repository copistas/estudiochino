document.addEventListener("DOMContentLoaded", async () => {
    const csvPath = "gramatica.csv"; // Ruta del archivo CSV
    const container = document.querySelector("#rectangles-container");

    try {
        // Leer y procesar el archivo CSV
        const response = await fetch(csvPath);
        const csvText = await response.text();

        // Dividir en bloques (cada bloque tiene 3 filas)
        const rows = csvText.trim().split("\n");
        const blocks = [];
        for (let i = 0; i < rows.length; i += 3) {
            const block = {
                pinyin: rows[i].split(",").slice(1), // Ignorar encabezado
                ejercicio: rows[i + 1].split(",").slice(1), // Ignorar encabezado
                correcto: rows[i + 2].split(",").slice(1), // Ignorar encabezado
            };
            blocks.push(block);
        }

        // Seleccionar el segundo bloque
        const secondBlock = blocks[1]; // Segundo bloque presente en el archivo
        if (!secondBlock) {
            throw new Error("El segundo bloque no está disponible en el archivo CSV.");
        }

        // Usar la primera línea del segundo bloque (fila "pinyin")
        const pinyinValues = secondBlock.pinyin;

        // Crear y agregar rectángulos con los datos de la primera línea del segundo bloque
        pinyinValues.forEach(value => {
            const rect = document.createElement("div");
            rect.classList.add("rectangle");
            rect.textContent = value; // Asignar el texto del valor
            container.appendChild(rect);
        });
    } catch (error) {
        console.error("Error al procesar el archivo CSV:", error);
    }
});
