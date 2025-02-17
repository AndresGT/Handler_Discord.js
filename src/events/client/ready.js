import chalk from 'chalk'; // Importa chalk correctamente

export default {
  name: 'ready',
  once: true,

  async execute(client) {
    try {
      if (!client.user) {
        console.error(chalk.red('| Error: client.user no está disponible.'));
        return;
      }

      console.log(chalk.green(`| Bot encendido con la cuenta de: ${client.user.tag}`));
    } catch (error) {
      console.error(chalk.red('| Error al ejecutar el evento "ready":'), error);
    }
  },
};