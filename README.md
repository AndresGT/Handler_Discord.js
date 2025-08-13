# 🤖 Mi Bot de Discord (Handler Discord.js)

Un bot de Discord personalizable construido con **Discord.js v14**, que utiliza una arquitectura modular con manejadores (handlers) dedicados para comandos de prefijo, comandos de barra diagonal (slash) y eventos del cliente.

[![Versión de Discord.js](https.img.shields.io/badge/discord.js-v14-blue.svg?logo=discord&logoColor=white)](https://discord.js.org/#/)
[![Licencia: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Características

* **Arquitectura Modular:** El código está separado en tres handlers independientes para una máxima organización y escalabilidad.
* **Doble Sistema de Comandos:** Soporte nativo tanto para comandos de prefijo (`!comando`) como para comandos de barra diagonal (`/comando`).
* **Carga Dinámica:** Cada handler lee y registra automáticamente los archivos de sus respectivas carpetas. ¡Solo tienes que crear el archivo y el bot hará el resto!
* **Estructura de Carpetas Clara:** La organización de archivos está diseñada para ser intuitiva y fácil de expandir.

---

## 📂 Estructura de Archivos

Para que los handlers funcionen correctamente, el proyecto debe seguir la siguiente estructura de carpetas:

```
tu-proyecto/
├── 📂 node_modules/
├── 📂 src/
│   ├── 📂 commands/
│   │   ├── 📂 prefixcommands/ # Comandos de Prefijo (!ping)
│   │   │   └── 📂 public/
│   │   │       └── ping.js
│   │   └── 📂 slashcommands/  # Comandos de Barra Diagonal (/ping)
│   │       └── 📂 admin/
│   │           └── ping.js
│   ├── 📂 events/
│   │   └── 📂 client/         # Eventos del Bot (ready, guildMemberAdd)
│   │       ├── ready.js
│   │       └── guildMemberAdd.js
│   └── 📂 handlers/            # La lógica de los manejadores
│       ├── eventHandler.js
│       ├── prefixCommandHandler.js
│       └── slashCommandHandler.js
├── 📜 app.js                 # Archivo de entrada principal
├── 📜 package.json
└── ... el resto de tus archivos
```

---

## 🚀 Instalación y Uso

### 1. Prerrequisitos

* [Node.js](https://nodejs.org/) `v16.9.0` o superior.
* Dependencias de `package.json` instaladas.
    ```sh
    npm install
    ```

### 2. Configuración Principal

Tu archivo `app.js` es el punto de entrada que orquesta los handlers. Debería lucir similar a esto, donde se inicializa el cliente de Discord y se le pasan los handlers.

**Ejemplo de `app.js`:**
```javascript
const { Client, GatewayIntentBits, Collection } = require('discord.js');
// Asumiendo que tienes un archivo de configuración para tu token y otros datos
// const { token } = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers, // Necesario para guildMemberAdd
    ]
});

// Creamos colecciones para almacenar los comandos
client.prefixCommands = new Collection();
client.slashCommands = new Collection();

// --- INICIALIZACIÓN DE HANDLERS ---
// Requerimos y ejecutamos cada handler, pasándole el cliente
// La ruta puede variar si estás dentro de /src o en la raíz
require('./src/handlers/eventHandler')(client);
require('./src/handlers/prefixCommandHandler')(client);
require('./src/handlers/slashCommandHandler')(client); // Puede que este necesite más lógica para el deploy

// Iniciamos sesión con el token del bot
// client.login(token);
client.login("TU_TOKEN_DE_DISCORD_AQUÍ");

```

---

## 📝 Creando Nuevos Módulos

### Cómo crear un nuevo Comando de Prefijo

1.  Ve a la carpeta `src/commands/prefixcommands/`.
2.  Elige una categoría (ej: `public`) o crea una nueva.
3.  Crea un nuevo archivo `.js` con el nombre del comando.

**Ejemplo en `src/commands/prefixcommands/public/saludo.js`:**
```javascript
module.exports = {
    name: 'saludo',
    description: 'Envía un saludo amigable.',
    // alias: ['hola', 'hi'], // Opcional: otros nombres para el comando
    execute(message, args) {
        message.channel.send(`¡Hola, ${message.author}!`);
    },
};
```

### Cómo crear un nuevo Comando Slash

1.  Ve a la carpeta `src/commands/slashcommands/`.
2.  Elige una categoría (ej: `admin`) o crea una nueva.
3.  Crea un nuevo archivo `.js`.

**Ejemplo en `src/commands/slashcommands/public/userinfo.js`:**
```javascript
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Muestra información sobre un usuario.')
        .addUserOption(option => 
            option.setName('usuario')
                  .setDescription('El usuario del que quieres ver la info')
                  .setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const embed = new EmbedBuilder()
            .setTitle(`Información de ${user.username}`)
            .setColor('#0099ff')
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: 'Tag', value: user.tag, inline: true },
                { name: 'ID', value: user.id, inline: true },
                { name: 'Se unió el', value: user.createdAt.toLocaleDateString(), inline: false }
            );

        await interaction.reply({ embeds: [embed] });
    },
};
```

### Cómo crear un nuevo Evento

1.  Ve a la carpeta `src/events/client/`.
2.  Crea un archivo `.js` con el nombre exacto del evento de Discord.js.

**Ejemplo para el evento `messageCreate` en `src/events/client/messageCreate.js`:**
```javascript
const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Ignorar mensajes de otros bots o sin el prefijo
        if (message.author.bot) return;
        
        // Aquí iría la lógica para procesar el mensaje
        console.log(`${message.author.tag} en #${message.channel.name} dijo: ${message.content}`);
    },
};
```

---

## 🤝 Contribuciones

Si deseas contribuir, ¡eres bienvenido! Por favor, abre un "issue" para discutir los cambios que te gustaría hacer o crea una "pull request" directamente.
