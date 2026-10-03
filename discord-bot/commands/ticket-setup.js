const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-setup')
    .setDescription('Poste le panneau pour créer des tickets')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🎫 Support')
      .setDescription('Clique sur le bouton ci-dessous pour ouvrir un ticket.')
      .setColor(0x5865F2);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('ticket_create')
        .setLabel('Créer un ticket')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🎫')
    );

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: 'Panneau posté.', ephemeral: true });
  }
};
