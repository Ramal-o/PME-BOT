const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { resolveBannedUser } = require('../utils/resolveBannedUser');
const { removeTempBan } = require('../utils/tempbans');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deban')
    .setDescription('Débannit un membre')
    .addStringOption(opt =>
      opt.setName('utilisateur')
        .setDescription("ID ou pseudo de l'utilisateur banni")
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('raison')
        .setDescription('Raison')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const cibleArg = interaction.options.getString('utilisateur');
    const raison = interaction.options.getString('raison') || 'Aucune raison fournie';

    const ban = await resolveBannedUser(interaction.guild, cibleArg);
    if (!ban) {
      return interaction.reply({ content: `Aucun ban trouvé pour \`${cibleArg}\`.`, ephemeral: true });
    }

    await interaction.guild.bans.remove(ban.user.id, `${raison} (par ${interaction.user.tag})`);
    removeTempBan(interaction.guild.id, ban.user.id);

    await interaction.reply(`♻️ **${ban.user.tag}** débanni. Raison : ${raison}`);
  }
};
