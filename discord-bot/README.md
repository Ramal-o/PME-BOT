# Bot Discord

Le bot répond à la fois aux **commandes slash (/)** et aux **commandes préfixées (?)**.

## Installation

```bash
npm install
```

## Configuration

1. Copie `.env.example` en `.env` et remplis :
   - `DISCORD_TOKEN` : token du bot (Dev Portal > Bot > Reset Token)
   - `CLIENT_ID` : Application ID (Dev Portal > General Information)
   - `GUILD_ID` : ID de ton serveur (active le mode développeur dans Discord, puis clic droit sur le serveur > Copier l'ID)
   - `PREFIX` (optionnel, `?` par défaut)
   - `TICKET_CATEGORY_ID` (optionnel) : ID d'une catégorie où ranger les salons de tickets

2. Dans le Dev Portal > Bot, active ces intents (**obligatoire**) :
   - **MESSAGE CONTENT INTENT** (nécessaire pour les commandes `?`)
   - **SERVER MEMBERS INTENT**

3. Permissions du bot sur le serveur (rôle du bot) :
   - Bannir des membres
   - Expulser des membres (mute/timeout)
   - Gérer les salons
   - Gérer les messages (pour `/citer` et `?citer`)
   - Le rôle du bot doit être au-dessus des membres à sanctionner

## Déployer les commandes slash

À refaire à chaque ajout/modif d'une commande dans `commands/` :

```bash
npm run deploy
```

Les commandes `?` (dans `prefixCommands/`) n'ont besoin d'aucun déploiement, elles marchent dès que le bot est lancé.

## Lancer le bot

```bash
npm start
```

## Commandes disponibles

| Slash | Préfixe | Description |
|---|---|---|
| `/citer message:<texte>` | `?citer <texte>` | Le bot écrit le texte dans le salon actuel |
| `/ban utilisateur raison [duree]` | `?ban <pseudo|@membre> [durée] <raison>` | Bannit (ex: `?ban gilbert 3d harcèlement+insulte`) |
| `/mute utilisateur raison [duree]` | `?mute <pseudo|@membre> [durée] <raison>` | Mute/timeout (ex: `?mute gilbert 10m spam`) |
| `/ticket-setup` | `?ticket-setup` | Poste le panneau "Créer un ticket" |

- Durée au format `10s` / `30m` / `2h` / `7d` (facultative → permanent pour le ban, 28j max pour le mute, limite Discord)
- Le débannissement auto est vérifié chaque minute ; si le bot est resté éteint, ça se fait au redémarrage
- En `?`, pour un membre qui n'est plus sur le serveur, utilise son ID ou une mention plutôt que son pseudo
