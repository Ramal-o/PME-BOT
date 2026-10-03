const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'logs.json');

function load() {
  if (!fs.existsSync(FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return {};
  }
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function setLogChannel(guildId, channelId) {
  const data = load();
  data[guildId] = channelId;
  save(data);
}

function getLogChannel(guildId) {
  const data = load();
  return data[guildId] || null;
}

function removeLogChannel(guildId) {
  const data = load();
  delete data[guildId];
  save(data);
}

module.exports = { setLogChannel, getLogChannel, removeLogChannel };
