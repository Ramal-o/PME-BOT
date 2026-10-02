const { resolveMember } = require('../utils/resolveMember');
const { parseSanctionArgs } = require('../utils/parseSanctionArgs');

const MAX_TIMEOUT_MS = 28 * 24 * 60 * 60 * 1000; // limite Discord pour le timeout (28 jours)

module.exports = {
  name: 'mute',
  description: '?mute <pseudo|@membre> [durée] <raison> — ex: ?mute gilbert 10m spam',

  async execute(message, args) {
    if (!message.member.permissions.has('ModerateMembers')) {
      return message.reply("Tu n'as pas la permission d'utiliser cette commande.");
    }
    if (args.length < 2) {
      return message.reply('Utilisation : `?mute <pseudo|@membre> [durée] <raison>` (ex: `?mute gilbert 10m spam`)');
    }

    const { cibleArg, dureeStr, dureeMs, raison } = parseSanctionArgs(args);
    const cible = await resolveMember(message.guild, cibleArg);

    if (!cible) {
      return message.reply(`Membre \`${cibleArg}\` introuvable.`);
    }
    if (!cible.moderatable) {
      return message.reply("Je ne peux pas mute ce membre (rôle trop haut ou permissions insuffisantes).");
    }

    const ms = dureeMs ? Math.min(dureeMs, MAX_TIMEOUT_MS) : MAX_TIMEOUT_MS;
    await cible.timeout(ms, `${raison} (par ${message.author.tag})`);

    const dureeTxt = dureeMs ? dureeStr : '28 jours (max Discord)';
    await message.channel.send(`🔇 **${cible.user.tag}** mute pour \`${dureeTxt}\`. Raison : ${raison}`);
  }
};
