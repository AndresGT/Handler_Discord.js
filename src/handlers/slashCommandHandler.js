import { default as ascii } from "ascii-table";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Obtener __dirname equivalente en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para cargar comandos slash
async function loadSlashCommands(client) {
  const table = new ascii().setHeading("SLASH COMMANDS", "STATUS");
  const commandsPath = path.join(__dirname, "../commands/slashcommands"); // Carpeta donde están los comandos
  const rest = client.rest; // Acceso al REST API de Discord

  try {
    // Leer las categorías de comandos
    const categories = await fs.readdir(commandsPath);
    const commands = [];

    for (const category of categories) {
      const categoryPath = path.join(commandsPath, category);
      const files = await fs.readdir(categoryPath);

      // Filtrar solo archivos .js
      const jsFiles = files.filter((file) => file.endsWith(".js"));

      for (const fileName of jsFiles) {
        const filePath = path.join(categoryPath, fileName);
        const commandModule = await import(filePath); // Importar dinámicamente el archivo
        const command = commandModule.default;

        if (command && command.data && command.execute) {
          // Agregar el comando a la colección del cliente
          client.slashCommands.set(command.data.name, command);
          commands.push(command.data.toJSON());
          table.addRow(fileName, "LOADED");
        } else {
          table.addRow(fileName, "FAILED");
        }
      }
    }

    console.log(table.toString());

    // Registrar los comandos slash en Discord
    const applicationCommands = client.application?.commands;
    if (applicationCommands) {
      await applicationCommands.set(commands); // Registrar comandos globalmente
      console.log("\n | Comandos Slash Cargados Correctamente".green);
    } else {
      console.error("No se pudo registrar los comandos slash: aplicación no disponible.");
    }
  } catch (error) {
    console.error("Error al cargar comandos slash:", error);
  }
}

export { loadSlashCommands };