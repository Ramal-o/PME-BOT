const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { setLogChannel, removeLogChannel } = require('../utils/logsConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('logs')
    .setDescription('Configure le système de logs')
    .addSubcommand(sub =>
      sub.setName('set')
        .setDescription('Définit le salon de logs')
        .addChannelOption(opt =>
          opt.setName('salon')
            .setDescription('Salon où envoyer les logs')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('off')
        .setDescription('Désactive les logs'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'set') {
      const salon = interaction.options.getChannel('salon');
      setLogChannel(interaction.guild.id, salon.id);
      return interaction.reply(`✅ Les logs seront envoyés dans ${salon}.`);
    }

    if (sub === 'off') {
      removeLogChannel(interaction.guild.id);
      return interaction.reply('📴 Logs désactivés.');
    }
  }
};
