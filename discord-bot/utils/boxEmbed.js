const { EmbedBuilder } = require('discord.js');

function buildBoxEmbed(titre, texte) {
  const embed = new EmbedBuilder()
    .setDescription(texte)
    .setColor(0x5865F2);

  if (titre) embed.setTitle(titre);

  return embed;
}

module.exports = { buildBoxEmbed };
