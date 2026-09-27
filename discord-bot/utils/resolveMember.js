// Résout un membre à partir de ce que l'utilisateur a tapé : mention, ID, ou pseudo.
async function resolveMember(guild, texte) {
  if (!texte) return null;

  const mentionMatch = /^<@!?(\d+)>$/.exec(texte);
  const id = mentionMatch ? mentionMatch[1] : (/^\d{15,20}$/.test(texte) ? texte : null);

  if (id) {
    return guild.members.fetch(id).catch(() => null);
  }

  // Recherche par pseudo / nom d'utilisateur (préfixe, insensible à la casse)
  const results = await guild.members.fetch({ query: texte, limit: 1 }).catch(() => null);
  if (results && results.size) return results.first();

  return null;
}

module.exports = { resolveMember };
