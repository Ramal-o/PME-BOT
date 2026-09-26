require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const command = require(path.join(commandsPath, file));
  commands.push(command.data.toJSON());
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`Déploiement de ${commands.length} commande(s)...`);

    // Enregistrement sur un seul serveur (GUILD_ID) : instantané, idéal en développement.
    // Pour un déploiement global (tous les serveurs, ~1h de propagation), remplace la ligne
    // ci-dessous par Routes.applicationCommands(process.env.CLIENT_ID).
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );

    console.log('Commandes déployées avec succès.');
  } catch (err) {
    console.error(err);
  }
})();
