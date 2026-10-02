const { buildBoxEmbed } = require('../utils/boxEmbed');

module.exports = {
  name: 'mciter',
  description: '?mciter <texte> — met le texte dans une box (embed). Si tu sautes une ligne, la 1ère ligne devient le titre.',

  async execute(message, args, rawContent) {
    if (!message.member.permissions.has('ManageMessages')) {
      return message.reply("Tu n'as pas la permission d'utiliser cette commande.");
    }
    if (!rawContent) {
      return message.reply('Utilisation : `?mciter <texte>` (Maj+Entrée pour sauter une ligne — la 1ère ligne sert de titre si tu as plusieurs lignes)');
    }

    const lignes = rawContent.split('\n');
    let titre = null;
    let texte = rawContent;

    if (lignes.length > 1) {
      titre = lignes[0];
      texte = lignes.slice(1).join('\n').trim() || '\u200b';
    }

    await message.channel.send({ embeds: [buildBoxEmbed(titre, texte)] });
    await message.delete().catch(() => {});
  }
};
