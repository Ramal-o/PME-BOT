const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mciter')
    .setDescription('Crée une box (embed) avec un titre et un texte')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('mciter_modal')
      .setTitle('Créer une box');

    const titreInput = new TextInputBuilder()
      .setCustomId('titre')
      .setLabel('Titre (optionnel)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const texteInput = new TextInputBuilder()
      .setCustomId('texte')
      .setLabel('Texte')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(titreInput),
      new ActionRowBuilder().addComponents(texteInput)
    );

    await interaction.showModal(modal);
  }
};
