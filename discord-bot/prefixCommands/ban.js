const { resolveMember } = require('../utils/resolveMember');
const { parseSanctionArgs } = require('../utils/parseSanctionArgs');
const { addTempBan } = require('../utils/tempbans');

module.exports = {
  name: 'ban',
  description: '?ban <pseudo|@membre> [durée] <raison> — ex: ?ban gilbert 3d harcèlement+insulte',

  async execute(message, args) {
    if (!message.member.permissions.has('BanMembers')) {
      return message.reply("Tu n'as pas la permission d'utiliser cette commande.");
    }
    if (args.length < 2) {
      return message.reply('Utilisation : `?ban <pseudo|@membre> [durée] <raison>` (ex: `?ban gilbert 3d harcèlement+insulte`)');
    }

    const { cibleArg, dureeStr, dureeMs, raison } = parseSanctionArgs(args);
    const cible = await resolveMember(message.guild, cibleArg);

    if (!cible) {
      return message.reply(`Membre \`${cibleArg}\` introuvable.`);
    }
    if (!cible.bannable) {
      return message.reply("Je ne peux pas bannir ce membre (rôle trop haut ou permissions insuffisantes).");
    }

    await message.guild.bans.create(cible.id, { reason: `${raison} (par ${message.author.tag})` });

    if (dureeMs) {
      addTempBan(message.guild.id, cible.id, Date.now() + dureeMs);
    }

    const dureeTxt = dureeMs ? dureeStr : 'permanent';
    await message.channel.send(`🔨 **${cible.user.tag}** banni (\`${dureeTxt}\`). Raison : ${raison}`);
  }
};
