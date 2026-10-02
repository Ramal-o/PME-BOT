// Parse une durée type "10s", "5m", "2h", "3d" -> millisecondes.
// Retourne null si le format est invalide ou vide (= permanent).
function parseDuration(str) {
  if (!str) return null;
  const match = /^(\d+)\s*(s|m|h|d)$/i.exec(str.trim());
  if (!match) return null;

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };
  return value * multipliers[unit];
}

module.exports = { parseDuration };
