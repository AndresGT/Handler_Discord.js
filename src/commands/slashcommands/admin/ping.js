import { SlashCommandBuilder, EmbedBuilder, Message, MessageFlags } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Muestra el ping del bot y la latencia de WebSocket."),

    async execute(interaction) {
        try {
            // Medir la latencia del bot
            const startTime = Date.now();
            await interaction.deferReply({ flags: MessageFlags.Ephemeral }); // Respuesta efímera inicial
            const botLatency = Date.now() - startTime;

            // Obtener el ping de WebSocket
            const wsPing = interaction.client.ws.ping;

            // Crear el embed con los datos
            const embed = createPingEmbed(wsPing, botLatency, interaction);

            // Responder con el embed
            await interaction.editReply({ embeds: [embed] });

            // Programar la eliminación de la respuesta después de 10 segundos
            scheduleDeletion(interaction);
        } catch (error) {
            handleError(interaction, error);
        }
    },
};

/**
 * Crea un embed personalizado con los datos de ping.
 * @param {number} wsPing - Ping de WebSocket.
 * @param {number} botLatency - Latencia del bot.
 * @param {Interaction} interaction - Interacción del comando.
 * @returns {EmbedBuilder} - Embed configurado.
 */
function createPingEmbed(wsPing, botLatency, interaction) {
    return new EmbedBuilder()
        .setTitle("🏓 Pong!")
        .setDescription(
            `**WebSocket Ping**: ${wsPing}ms\n` +
                `**Latencia del Bot**: ${botLatency}ms`,
        )
        .setColor("#0099ff")
        .setFooter({
            text: "Tiempo de respuesta",
            iconURL: interaction.client.user.displayAvatarURL(),
        })
        .setTimestamp();
}

/**
 * Programa la eliminación de la respuesta después de un tiempo.
 * @param {Interaction} interaction - Interacción del comando.
 */
function scheduleDeletion(interaction) {
    setTimeout(async () => {
        try {
            await interaction.deleteReply();
        } catch (error) {
            console.error("Error al eliminar la respuesta:", error);
        }
    }, 10000); // 10 segundos
}

/**
 * Maneja errores durante la ejecución del comando.
 * @param {Interaction} interaction - Interacción del comando.
 * @param {Error} error - Error ocurrido.
 */
function handleError(interaction, error) {
    console.error("Error al ejecutar el comando /ping:", error);
    interaction.reply({
        content: "Hubo un error al ejecutar este comando.",
        ephemeral: true,
    }).catch(console.error);
}