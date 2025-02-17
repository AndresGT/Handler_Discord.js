import { default as ascii } from "ascii-table";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Obtener __dirname equivalente en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para cargar eventos
async function loadEvents(client) {
  const table = new ascii().setHeading("EVENTS", "STATUS");
  const eventsPath = path.join(__dirname, "../events");

  try {
    // Leer las categorías de eventos
    const categories = await fs.readdir(eventsPath);

    for (const category of categories) {
      const categoryPath = path.join(eventsPath, category);
      const files = await fs.readdir(categoryPath);

      // Filtrar solo archivos .js
      const jsFiles = files.filter((file) => file.endsWith(".js"));

      for (const fileName of jsFiles) {
        const filePath = path.join(categoryPath, fileName);
        const event = await import(filePath); // Usamos import dinámico

        if (event.default) {
          const eventName = event.default.name;

          if (event.default.once) {
            client.once(eventName, (...args) =>
              event.default.execute(...args, client),
            );
          } else {
            client.on(eventName, (...args) =>
              event.default.execute(...args, client),
            );
          }

          table.addRow(fileName, "LOADED");
        } else {
          table.addRow(fileName, "FAILED");
        }
      }
    }

    console.log(table.toString());
    console.log("\n | Eventos Cargados Correctamente".green);
  } catch (error) {
    console.error("Error al cargar eventos:", error);
  }
}

export { loadEvents };