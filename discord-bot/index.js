require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { handleTicketButton } = require('./handlers/tickets');
const { checkTempBans } = require('./utils/tempbans');

const PREFIX = process.env.PREFIX || '?';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent // intent privilégié : à activer dans le Dev Portal
  ]
});

// Commandes slash (/)
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

// Commandes préfixées (?)
client.prefixCommands = new Collection();
const prefixCommandsPath = path.join(__dirname, 'prefixCommands');
for (const file of fs.readdirSync(prefixCommandsPath).filter(f => f.endsWith('.js'))) {
  const command = require(path.join(prefixCommandsPath, file));
  client.prefixCommands.set(command.name, command);
}

client.once('ready', () => {
  console.log(`Connecté en tant que ${client.user.tag} — commandes / actives, préfixe "${PREFIX}" actif`);
  checkTempBans(client);
  setInterval(() => checkTempBans(client), 60 * 1000); // vérifie les tempbans chaque minute
});

// Commandes ? (messages texte)
client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const commandName = args.shift().toLowerCase();
  const command = client.prefixCommands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (err) {
    console.error(err);
    message.reply('Une erreur est survenue.').catch(() => {});
  }
});

// Commandes / et boutons
client.on('interactionCreate', async interaction => {
  try {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      await command.execute(interaction);
    } else if (interaction.isButton() && interaction.customId.startsWith('ticket_')) {
      await handleTicketButton(interaction);
    }
  } catch (err) {
    console.error(err);
    const payload = { content: 'Une erreur est survenue.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(payload).catch(() => {});
    } else {
      await interaction.reply(payload).catch(() => {});
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
