const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('demute')
    .setDescription('Retire le mute (timeout) d\'un membre')
    .addUserOption(opt =>
      opt.setName('utilisateur')
        .setDescription('Le membre à démute')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('raison')
        .setDescription('Raison')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const cibleUser = interaction.options.getUser('utilisateur');
    const raison = interaction.options.getString('raison') || 'Aucune raison fournie';

    const member = await interaction.guild.members.fetch(cibleUser.id).catch(() => null);
    if (!member) {
      return interaction.reply({ content: "Ce membre n'est pas sur le serveur.", ephemeral: true });
    }
    if (!member.communicationDisabledUntilTimestamp || member.communicationDisabledUntilTimestamp < Date.now()) {
      return interaction.reply({ content: `${cibleUser.tag} n'est pas mute actuellement.`, ephemeral: true });
    }

    await member.timeout(null, `${raison} (par ${interaction.user.tag})`);
    await interaction.reply(`🔊 **${cibleUser.tag}** démute. Raison : ${raison}`);
  }
};
