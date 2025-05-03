# 🛠️ Backend-Installation

Dieses Projekt verwendet **Node.js**, **Express**, **MongoDB**, **TypeScript** und weitere Tools für ein modernes Backend-Setup.

## 📦 Voraussetzungen

Stelle sicher, dass folgende Programme installiert sind:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- npm (wird mit Node.js installiert)

---

## 🚀 Setup & Installation

Führe folgende Schritte im Terminal aus, um das Projekt aufzusetzen:

```bash
# 1. Projekt initialisieren
npm init -y

# 2. Express, Mongoose und TypeScript installieren
npm i express mongoose typescript

# 3. Dev-Abhängigkeiten installieren
npm i --save-dev nodemon ts-node

# 4. TypeScript-Konfiguration erstellen
npx tsc --init

# 5. Typdefinitionen für Express hinzufügen
npm i --save-dev @types/express

# 6. JWT für Authentifizierung installieren
npm i jsonwebtoken
npm i --save-dev @types/jsonwebtoken

# 7. dotenv für Umgebungsvariablen
npm i dotenv --save

# 8. (Optional) bcrypt für Passwort-Hashing
npm i bcrypt
npm i --save-dev @types/bcrypt

# 9. (optional) Thunder Client wie extension  auf VSCODE
thunderclient ist wie postman um endpoints-methods in Route-ordner zu testen

#10. create file '.env' statt '.env.example' 
 danach Kopiere bitte den Inhalt von '.env.example' zu '.env'
#11. MongoDB-Compass öffnen und ein Database 'fresh-cart' und collection/sammlung 'users' erstellen danach verbinden'connect'
