const {
  ChannelType,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require('discord.js');

async function handleTicketButton(interaction) {
  if (interaction.customId === 'ticket_create') {
    await createTicket(interaction);
  } else if (interaction.customId === 'ticket_close') {
    await closeTicket(interaction);
  }
}

async function createTicket(interaction) {
  const { guild, user } = interaction;
  const existing = guild.channels.cache.find(c => c.name === `ticket-${user.username.toLowerCase()}`);
  if (existing) {
    return interaction.reply({ content: `Tu as déjà un ticket ouvert : ${existing}`, ephemeral: true });
  }

  const categoryId = process.env.TICKET_CATEGORY_ID || null;

  const channel = await guild.channels.create({
    name: `ticket-${user.username}`,
    type: ChannelType.GuildText,
    parent: categoryId || undefined,
    permissionOverwrites: [
      { id: guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
      {
        id: user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory
        ]
      },
      {
        id: guild.members.me.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ManageChannels
        ]
      }
    ]
  });

  const embed = new EmbedBuilder()
    .setTitle('🎫 Ticket ouvert')
    .setDescription(`Bienvenue ${user}, explique ta demande. Un membre du staff va te répondre.`)
    .setColor(0x5865F2);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('ticket_close')
      .setLabel('Fermer le ticket')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('🔒')
  );

  await channel.send({ content: `${user}`, embeds: [embed], components: [row] });
  await interaction.reply({ content: `Ticket créé : ${channel}`, ephemeral: true });
}

async function closeTicket(interaction) {
  await interaction.reply('🔒 Ticket fermé, ce salon va être supprimé dans 5 secondes...');
  setTimeout(() => {
    interaction.channel.delete().catch(() => {});
  }, 5000);
}

module.exports = { handleTicketButton };
