const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'tempbans.json');

function load() {
  if (!fs.existsSync(FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return [];
  }
}

function save(list) {
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2));
}

function addTempBan(guildId, userId, unbanAt) {
  const list = load();
  list.push({ guildId, userId, unbanAt });
  save(list);
}

// Retire un ban temporaire programmé (ex: déban manuel avant l'échéance).
function removeTempBan(guildId, userId) {
  const list = load();
  save(list.filter(e => !(e.guildId === guildId && e.userId === userId)));
}

// Vérifie et débanni les membres dont la durée est écoulée.
async function checkTempBans(client) {
  const list = load();
  const now = Date.now();
  const remaining = [];

  for (const entry of list) {
    if (entry.unbanAt <= now) {
      const guild = client.guilds.cache.get(entry.guildId);
      if (guild) {
        await guild.bans.remove(entry.userId, 'Fin du ban temporaire').catch(() => {});
      }
    } else {
      remaining.push(entry);
    }
  }
  save(remaining);
}

module.exports = { addTempBan, removeTempBan, checkTempBans };
