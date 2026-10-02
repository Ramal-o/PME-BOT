module.exports = {
  name: 'citer',
  description: '?citer <texte> — fait écrire le texte par le bot dans le salon actuel',

  async execute(message, args) {
    const texte = args.join(' ');
    if (!texte) {
      return message.reply('Utilisation : `?citer <texte>`');
    }

    if (!message.member.permissions.has('ManageMessages')) {
      return message.reply("Tu n'as pas la permission d'utiliser cette commande.");
    }

    await message.channel.send(texte);
    await message.delete().catch(() => {}); // nettoie le message de commande si possible
  }
};
