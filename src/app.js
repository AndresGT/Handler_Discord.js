import { Client, Collection } from "discord.js";
import { config } from "dotenv";
import { loadEvents } from "./handlers/eventHandler.js";
import { loadSlashCommands } from "./handlers/slashCommandHandler.js";

config(); // Cargar variables de entorno

// Definir intents como un número
const intents = 53608447; // Asegúrate de que este número incluya todos los intents necesarios

const client = new Client({ intents });

client.slashCommands = new Collection();

client.on("interactionCreate", async (interaction) => {
  // Verificar si la interacción es un comando slash
  if (!interaction.isChatInputCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error al ejecutar el comando ${interaction.commandName}:`, error);
    await interaction.reply({
      content: "Hubo un error al ejecutar este comando.",
      flags: MessageFlags.Ephemeral,
    });
  }
});

(async () => {
    try {
        await client.login(process.env.DISCORD_TOKEN);
        await loadEvents(client);
        await loadSlashCommands(client);
    } catch (err) {
        console.error("Error al iniciar el bot:", err);
    }
})();

// Manejadores globales de errores
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
});