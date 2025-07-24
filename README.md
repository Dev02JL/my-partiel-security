# Application Web Sécurisée

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Créer un fichier `.env` avec :
```
SESSION_SECRET=votre-secret-tres-securise-changez-moi-en-production
NODE_ENV=development
```

3. Lancer l'application :
```bash
node app.js
```

## Corrections de Sécurité Appliquées

### ✅ Failles Corrigées :

1. **XSS Stocké** - Échappement des caractères spéciaux dans les messages
2. **Injection de Code** - Validation et nettoyage des entrées login
3. **IDOR** - Protection contre l'accès aux données d'autres utilisateurs
4. **Session Insecure** - Configuration sécurisée des sessions
5. **Validation des Entrées** - Validation et nettoyage de toutes les entrées
6. **Headers de Sécurité** - Ajout de headers de protection
7. **Gestion d'Erreurs** - Messages d'erreur sécurisés

### 🔒 Mesures de Sécurité Actives :

- Validation stricte des entrées utilisateur
- Échappement des caractères spéciaux
- Headers de sécurité (CSP, XSS Protection, etc.)
- Sessions sécurisées avec cookies httpOnly
- Protection contre l'accès non autorisé aux données
- Messages d'erreur génériques

### ⚠️ Recommandations Supplémentaires :

1. **En Production :**
   - Utiliser HTTPS
   - Changer le SESSION_SECRET
   - Implémenter un rate limiting
   - Ajouter des logs de sécurité
   - Hasher les mots de passe avec bcrypt

2. **Améliorations Futures :**
   - Implémenter des tokens CSRF
   - Ajouter une authentification à deux facteurs
   - Mettre en place un système de logs d'audit
   - Implémenter une politique de mots de passe forts

## Comptes de Test

- **Alice** : username: `alice`, password: `1234`
- **Bob** : username: `bob`, password: `abcd`

## Accès

L'application est accessible sur : http://localhost:3000 