const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { parseDuration } = require('../utils/duration');

const MAX_TIMEOUT_MS = 28 * 24 * 60 * 60 * 1000; // limite Discord

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute (timeout) un membre')
    .addUserOption(opt =>
      opt.setName('utilisateur')
        .setDescription('Le membre à mute')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('raison')
        .setDescription('Raison du mute')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('duree')
        .setDescription('Durée: 10s / 10m / 2h / 7d (vide = 28j max)')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

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
    if (!member) {
      return interaction.reply({ content: "Ce membre n'est pas dans le serveur.", ephemeral: true });
    }
    if (!member.moderatable) {
      return interaction.reply({ content: "Je ne peux pas mute ce membre (rôle trop haut).", ephemeral: true });
    }

    const ms = dureeMs ? Math.min(dureeMs, MAX_TIMEOUT_MS) : MAX_TIMEOUT_MS;
    await member.timeout(ms, `${raison} (par ${interaction.user.tag})`);

    const dureeTxt = dureeMs ? dureeStr : '28 jours (max Discord)';
    await interaction.reply(`🔇 **${cible.tag}** mute pour \`${dureeTxt}\`. Raison : ${raison}`);
  }
};
