## Ajout : /demute, ?demute, /deban, ?deban

Nouveaux fichiers :
- commands/demute.js, prefixCommands/demute.js
- commands/deban.js, prefixCommands/deban.js
- utils/resolveBannedUser.js (nouveau)

Fichier remplacé :
- utils/tempbans.js (ajoute removeTempBan, utilisée par deban pour annuler un
  déban automatique programmé si tu débannis quelqu'un à la main avant l'échéance)

Usage :
- `?demute <pseudo|@membre> [raison]` / `/demute utilisateur:<@membre> [raison]`
- `?deban <id|pseudo> [raison]` / `/deban utilisateur:<id ou pseudo> [raison]`

Pour deban, utilise de préférence l'ID (le pseudo d'un utilisateur banni n'est pas
toujours fiable à rechercher, contrairement à un membre encore présent sur le serveur).
