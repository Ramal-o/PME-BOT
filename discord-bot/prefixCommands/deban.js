const { resolveBannedUser } = require('../utils/resolveBannedUser');
const { removeTempBan } = require('../utils/tempbans');

module.exports = {
  name: 'deban',
  description: '?deban <id|pseudo> [raison] — débannit un membre',

  async execute(message, args) {
    if (!message.member.permissions.has('BanMembers')) {
      return message.reply("Tu n'as pas la permission d'utiliser cette commande.");
    }
    if (!args.length) {
      return message.reply('Utilisation : `?deban <id|pseudo> [raison]`');
    }

    const cibleArg = args[0];
    const raison = args.slice(1).join(' ') || 'Aucune raison fournie';

    const ban = await resolveBannedUser(message.guild, cibleArg);
    if (!ban) {
      return message.reply(`Aucun ban trouvé pour \`${cibleArg}\`.`);
    }

    await message.guild.bans.remove(ban.user.id, `${raison} (par ${message.author.tag})`);
    removeTempBan(message.guild.id, ban.user.id);

    await message.channel.send(`♻️ **${ban.user.tag}** débanni. Raison : ${raison}`);
  }
};
