const { resolveMember } = require('../utils/resolveMember');

module.exports = {
  name: 'demute',
  description: '?demute <pseudo|@membre> [raison] — retire le mute (timeout) d\'un membre',

  async execute(message, args) {
    if (!message.member.permissions.has('ModerateMembers')) {
      return message.reply("Tu n'as pas la permission d'utiliser cette commande.");
    }
    if (!args.length) {
      return message.reply('Utilisation : `?demute <pseudo|@membre> [raison]`');
    }

    const cibleArg = args[0];
    const raison = args.slice(1).join(' ') || 'Aucune raison fournie';

    const cible = await resolveMember(message.guild, cibleArg);
    if (!cible) {
      return message.reply(`Membre \`${cibleArg}\` introuvable.`);
    }
    if (!cible.communicationDisabledUntilTimestamp || cible.communicationDisabledUntilTimestamp < Date.now()) {
      return message.reply(`${cible.user.tag} n'est pas mute actuellement.`);
    }

    await cible.timeout(null, `${raison} (par ${message.author.tag})`);
    await message.channel.send(`🔊 **${cible.user.tag}** démute. Raison : ${raison}`);
  }
};
