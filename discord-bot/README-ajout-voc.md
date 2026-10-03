## Ajout : logs vocaux

Le module vocal est actif dès que tu remplaces `events/logger.js` et `index.js` — pas besoin
d'activer quoi que ce soit dans le Dev Portal (GuildVoiceStates n'est pas un intent privilégié).

Ce qui est loggé :
- Rejoint un salon vocal
- Quitte un salon vocal
- Change de salon vocal (move)
- Se mute / démute (self-mute)
- Se met en sourdine / retire sa sourdine (self-deaf)
