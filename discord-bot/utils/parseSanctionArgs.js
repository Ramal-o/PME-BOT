const { parseDuration } = require('./duration');

// args: [utilisateur, ...reste] où le 2e token peut être une durée (10s/10m/2h/7d)
// Retourne { cibleArg, dureeStr, dureeMs, raison }
function parseSanctionArgs(args) {
  const cibleArg = args[0];
  const dureeStr = args[1];
  const dureeMs = parseDuration(dureeStr);

  const raisonArgs = dureeMs !== null ? args.slice(2) : args.slice(1);
  const raison = raisonArgs.join(' ') || 'Aucune raison fournie';

  return {
    cibleArg,
    dureeStr: dureeMs !== null ? dureeStr : null,
    dureeMs,
    raison
  };
}

module.exports = { parseSanctionArgs };
