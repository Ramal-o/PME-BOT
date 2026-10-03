const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('citer')
    .setDescription('Fait écrire un message au bot dans le salon actuel')
    .addStringOption(opt =>
      opt.setName('message')
        .setDescription('Le texte à envoyer')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const texte = interaction.options.getString('message');
    await interaction.channel.send(texte);
    await interaction.reply({ content: 'Message envoyé.', ephemeral: true });
  }
};
