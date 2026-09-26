const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { parseDuration } = require('../utils/duration');
const { addTempBan } = require('../utils/tempbans');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannit un membre')
    .addUserOption(opt =>
      opt.setName('utilisateur')
        .setDescription('Le membre à bannir')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('raison')
        .setDescription('Raison du ban')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('duree')
        .setDescription('Durée: 10s / 10m / 2h / 7d (vide = permanent)')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const cible = interaction.options.getUser('utilisateur');
    const raison = interaction.options.getString('raison');
    const dureeStr = interaction.options.getString('duree');
    const dureeMs = parseDuration(dureeStr);

    if (dureeStr && dureeMs === null) {
      return interaction.reply({
        content: 'Format de durée invalide. Utilise par exemple `10s`, `30m`, `2h` ou `7d`.',
        ephemeral: true
      });
    }

    const member = await interaction.guild.members.fetch(cible.id).catch(() => null);
    if (member && !member.bannable) {
      return interaction.reply({ content: "Je ne peux pas bannir ce membre (rôle trop haut ?).", ephemeral: true });
    }

    await interaction.guild.bans.create(cible.id, { reason: `${raison} (par ${interaction.user.tag})` });

    if (dureeMs) {
      addTempBan(interaction.guild.id, cible.id, Date.now() + dureeMs);
    }

    const dureeTxt = dureeMs ? dureeStr : 'permanent';
    await interaction.reply(`🔨 **${cible.tag}** banni (\`${dureeTxt}\`). Raison : ${raison}`);
  }
};
