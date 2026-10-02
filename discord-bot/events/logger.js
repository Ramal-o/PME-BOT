const { EmbedBuilder } = require('discord.js');
const { getLogChannel } = require('../utils/logsConfig');

function registerLogger(client) {
  async function sendLog(guild, embed) {
    if (!guild) return;
    const channelId = getLogChannel(guild.id);
    if (!channelId) return;
    const channel = guild.channels.cache.get(channelId);
    if (!channel) return;
    await channel.send({ embeds: [embed] }).catch(() => {});
  }

  // Message supprimé — montre le contenu si le bot l'avait en cache
  client.on('messageDelete', async message => {
    if (!message.guild || message.author?.bot) return;

    const contenu = message.content
      ? message.content
      : "*Contenu indisponible (message trop ancien, pas en cache)*";

    const embed = new EmbedBuilder()
      .setColor(0xED4245)
      .setAuthor({
        name: message.author ? message.author.tag : 'Auteur inconnu',
        iconURL: message.author?.displayAvatarURL?.()
      })
      .setDescription(`🗑️ **Message supprimé** dans ${message.channel}\n>>> ${contenu}`)
      .setFooter({ text: `ID auteur : ${message.author?.id || '?'}` })
      .setTimestamp();

    const piece = message.attachments?.first();
    if (piece) embed.addFields({ name: 'Pièce jointe', value: piece.url });

    await sendLog(message.guild, embed);
  });

  // Message modifié
  client.on('messageUpdate', async (oldMsg, newMsg) => {
    if (!newMsg.guild || newMsg.author?.bot) return;
    if (oldMsg.content === newMsg.content) return;

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setAuthor({ name: newMsg.author.tag, iconURL: newMsg.author.displayAvatarURL() })
      .setDescription(`✏️ **Message modifié** dans ${newMsg.channel} — [Aller au message](${newMsg.url})`)
      .addFields(
        { name: 'Avant', value: (oldMsg.content || '*(vide/inconnu)*').slice(0, 1024) },
        { name: 'Après', value: (newMsg.content || '*(vide)*').slice(0, 1024) }
      )
      .setTimestamp();

    await sendLog(newMsg.guild, embed);
  });

  // Arrivées / départs
  client.on('guildMemberAdd', async member => {
    const embed = new EmbedBuilder()
      .setColor(0x57F287)
      .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
      .setDescription(`➡️ ${member} a rejoint le serveur`)
      .addFields({ name: 'Compte créé', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>` })
      .setTimestamp();
    await sendLog(member.guild, embed);
  });

  client.on('guildMemberRemove', async member => {
    const embed = new EmbedBuilder()
      .setColor(0xED4245)
      .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
      .setDescription(`⬅️ **${member.user.tag}** a quitté le serveur`)
      .setTimestamp();
    await sendLog(member.guild, embed);
  });

  // Bans / débans (couvre aussi un ban fait depuis l'interface Discord, pas que /ban ?ban)
  client.on('guildBanAdd', async ban => {
    const embed = new EmbedBuilder()
      .setColor(0xED4245)
      .setAuthor({ name: ban.user.tag, iconURL: ban.user.displayAvatarURL() })
      .setDescription(`🔨 **${ban.user.tag}** a été banni`)
      .setTimestamp();
    await sendLog(ban.guild, embed);
  });

  client.on('guildBanRemove', async ban => {
    const embed = new EmbedBuilder()
      .setColor(0x57F287)
      .setAuthor({ name: ban.user.tag, iconURL: ban.user.displayAvatarURL() })
      .setDescription(`♻️ **${ban.user.tag}** a été débanni`)
      .setTimestamp();
    await sendLog(ban.guild, embed);
  });

  // Pseudo changé + mute posé/retiré
  client.on('guildMemberUpdate', async (oldMember, newMember) => {
    if (oldMember.nickname !== newMember.nickname) {
      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL() })
        .setDescription(`✏️ Pseudo modifié pour ${newMember}`)
        .addFields(
          { name: 'Avant', value: oldMember.nickname || oldMember.user.username, inline: true },
          { name: 'Après', value: newMember.nickname || newMember.user.username, inline: true }
        )
        .setTimestamp();
      await sendLog(newMember.guild, embed);
    }

    const etaitMute = oldMember.communicationDisabledUntilTimestamp > Date.now();
    const estMute = newMember.communicationDisabledUntilTimestamp > Date.now();

    if (!etaitMute && estMute) {
      const embed = new EmbedBuilder()
        .setColor(0xFEE75C)
        .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL() })
        .setDescription(`🔇 ${newMember} mute jusqu'à <t:${Math.floor(newMember.communicationDisabledUntilTimestamp / 1000)}:f>`)
        .setTimestamp();
      await sendLog(newMember.guild, embed);
    } else if (etaitMute && !estMute) {
      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL() })
        .setDescription(`🔊 Mute retiré pour ${newMember}`)
        .setTimestamp();
      await sendLog(newMember.guild, embed);
    }
  });

  // Salons
  client.on('channelCreate', async channel => {
    if (!channel.guild) return;
    const embed = new EmbedBuilder()
      .setColor(0x57F287)
      .setDescription(`📁 Salon créé : ${channel}`)
      .setTimestamp();
    await sendLog(channel.guild, embed);
  });

  client.on('channelDelete', async channel => {
    if (!channel.guild) return;
    const embed = new EmbedBuilder()
      .setColor(0xED4245)
      .setDescription(`📁 Salon supprimé : #${channel.name}`)
      .setTimestamp();
    await sendLog(channel.guild, embed);
  });

  // Rôles
  client.on('roleCreate', async role => {
    const embed = new EmbedBuilder()
      .setColor(0x57F287)
      .setDescription(`🏷️ Rôle créé : ${role}`)
      .setTimestamp();
    await sendLog(role.guild, embed);
  });

  client.on('roleDelete', async role => {
    const embed = new EmbedBuilder()
      .setColor(0xED4245)
      .setDescription(`🏷️ Rôle supprimé : ${role.name}`)
      .setTimestamp();
    await sendLog(role.guild, embed);
  });
}

module.exports = { registerLogger };
