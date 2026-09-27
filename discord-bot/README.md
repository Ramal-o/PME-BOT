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
| `/mciter` (ouvre une fenêtre) | `?mciter <texte>` | Met le texte dans une box (embed) — 1ère ligne = titre si plusieurs lignes |
| Clic droit sur un message > Apps > **mciter** | `?mciter` (en réponse au message) | Reprend le message dans une box (embed) avec auteur, avatar et image éventuelle |

- Durée au format `10s` / `30m` / `2h` / `7d` (facultative → permanent pour le ban, 28j max pour le mute, limite Discord)
- Le débannissement auto est vérifié chaque minute ; si le bot est resté éteint, ça se fait au redémarrage
- En `?`, pour un membre qui n'est plus sur le serveur, utilise son ID ou une mention plutôt que son pseudo
- **mciter** : en `?`, tape le texte directement, Maj+Entrée pour sauter une ligne (1ère ligne = titre si tu as plusieurs lignes). En `/`, `/mciter` ouvre une fenêtre (modal) avec un champ titre et une zone de texte multi-lignes — plus confortable pour un long règlement.

## Déploiement sur Railway (24/7)

1. **Mettre le code sur GitHub**
   - Crée un dépôt (public ou privé) sur GitHub
   - Depuis le dossier `discord-bot` :
     ```bash
     git init
     git add .
     git commit -m "Bot Discord"
     git branch -M main
     git remote add origin https://github.com/<ton-compte>/<ton-repo>.git
     git push -u origin main
     ```
   - `.env` n'est jamais poussé (il est dans `.gitignore`) : les secrets se configurent directement sur Railway, à l'étape suivante.

2. **Créer le projet Railway**
   - Sur [railway.app](https://railway.app), "New Project" → "Deploy from GitHub repo" → sélectionne ton dépôt
   - Railway détecte automatiquement Node.js (`package.json`) et utilisera `npm start` (défini dans `railway.json`)

3. **Ajouter les variables d'environnement**
   - Dans le projet Railway → onglet **Variables**, ajoute les mêmes clés que dans `.env.example` :
     `DISCORD_TOKEN`, `CLIENT_ID`, `GUILD_ID`, `PREFIX`, `TICKET_CATEGORY_ID`

4. **Enregistrer les commandes slash (une seule fois)**
   - Railway ne relance `npm run deploy` que si tu le demandes. Le plus simple : lance-le en local une fois (avec ton `.env` local rempli) avant de déployer :
     ```bash
     npm run deploy
     ```
   - Les commandes `?` n'ont besoin d'aucun déploiement, elles marchent dès que le bot tourne.

5. **Déployer**
   - Railway build et démarre automatiquement à chaque push sur `main`
   - Vérifie les logs dans l'onglet **Deployments** : tu dois voir `Connecté en tant que ...`

6. **Mettre à jour le bot plus tard**
   - Modifie le code, `git commit` + `git push` → Railway redéploie tout seul
   - Si tu as ajouté/changé une commande `/`, relance `npm run deploy` en local (ou configure Railway pour l'exécuter en "one-off command" via son CLI)
