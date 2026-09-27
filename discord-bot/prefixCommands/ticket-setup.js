const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

module.exports = {
  name: 'ticket-setup',
  description: '?ticket-setup — poste le panneau de création de ticket dans le salon actuel',

  async execute(message) {
    if (!message.member.permissions.has('ManageChannels')) {
      return message.reply("Tu n'as pas la permission d'utiliser cette commande.");
    }

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

    await message.channel.send({ embeds: [embed], components: [row] });
    await message.delete().catch(() => {});
  }
};
