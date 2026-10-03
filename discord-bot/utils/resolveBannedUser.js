// Résout un GuildBan (utilisateur banni) à partir d'un ID, d'une mention, ou d'un pseudo.
async function resolveBannedUser(guild, texte) {
  if (!texte) return null;

  const mentionMatch = /^<@!?(\d+)>$/.exec(texte);
  const id = mentionMatch ? mentionMatch[1] : (/^\d{15,20}$/.test(texte) ? texte : null);

  const bans = await guild.bans.fetch().catch(() => null);
  if (!bans) return null;

  if (id) {
    return bans.get(id) || null;
  }

  const lower = texte.toLowerCase();
  return bans.find(b =>
    b.user.username.toLowerCase() === lower ||
    b.user.tag?.toLowerCase() === lower
  ) || null;
}

module.exports = { resolveBannedUser };
