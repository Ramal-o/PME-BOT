const { buildBoxEmbed } = require('../utils/boxEmbed');

async function handleMciterModal(interaction) {
  const titre = interaction.fields.getTextInputValue('titre') || null;
  const texte = interaction.fields.getTextInputValue('texte');

  await interaction.channel.send({ embeds: [buildBoxEmbed(titre, texte)] });
  await interaction.reply({ content: 'Box envoyée.', ephemeral: true });
}

module.exports = { handleMciterModal };
