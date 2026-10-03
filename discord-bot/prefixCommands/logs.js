const { setLogChannel, removeLogChannel } = require('../utils/logsConfig');

module.exports = {
  name: 'logs',
  description: '?logs set #salon | ?logs off — configure le salon de logs',

  async execute(message, args) {
    if (!message.member.permissions.has('ManageGuild')) {
      return message.reply("Tu n'as pas la permission d'utiliser cette commande.");
    }

    const sub = args[0]?.toLowerCase();

    if (sub === 'off') {
      removeLogChannel(message.guild.id);
      return message.reply('📴 Logs désactivés.');
    }

    if (sub === 'set') {
      const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
      if (!channel) {
        return message.reply('Utilisation : `?logs set #salon`');
      }
      setLogChannel(message.guild.id, channel.id);
      return message.reply(`✅ Les logs seront envoyés dans ${channel}.`);
    }

    return message.reply('Utilisation : `?logs set #salon` ou `?logs off`');
  }
};
