// mini-projet-vulnerable/app.js

// Chargement des variables d'environnement
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const app = express();

// Headers de sécurité
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 heures
  }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let users = [
  { id: 1, username: 'alice', password: '1234' },
  { id: 2, username: 'bob', password: 'abcd' }
];

let messages = [];

// Page de login
app.get('/', (req, res) => {
  res.render('login');
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Validation des entrées
  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).send('Données invalides');
  }
  // Nettoyage des entrées
  const cleanUsername = username.trim();
  const cleanPassword = password.trim();
  
  const user = users.find(u => u.username === cleanUsername && u.password === cleanPassword);
  if (user) {
    req.session.user = user;
    res.redirect('/dashboard');
  } else {
    res.status(401).send('Identifiants incorrects');
  }
});


app.get('/contact', (req, res) => {
  res.render('contact', { messages });
});

app.post('/contact', (req, res) => {
  const { message } = req.body;
  
  // Validation des entrées
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).send('Message invalide');
  }
  
  // Limitation de la taille du message
  if (message.length > 1000) {
    return res.status(400).send('Message trop long (maximum 1000 caractères)');
  }
  
  // Nettoyage basique du message
  const cleanMessage = message.trim().replace(/<script>/gi, '').replace(/<\/script>/gi, '');
  messages.push(cleanMessage);
  res.redirect('/contact');
});


app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  // Protection IDOR : l'utilisateur ne peut voir que son propre profil
  const user = users.find(u => u.id === req.session.user.id);
  if (!user) {
    return res.status(404).send('Utilisateur non trouvé');
  }
  res.render('dashboard', { user });
});


app.get('/edit-profile', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  res.render('edit');
});

app.post('/edit-profile', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  
  const { username } = req.body;
  
  // Validation des entrées
  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    return res.status(400).send('Nom d\'utilisateur invalide (minimum 3 caractères)');
  }
  
  // Nettoyage et validation
  const cleanUsername = username.trim().replace(/[<>]/g, '');
  
  const user = users.find(u => u.id === req.session.user.id);
  if (!user) {
    return res.status(404).send('Utilisateur non trouvé');
  }
  
  user.username = cleanUsername;
  res.redirect('/dashboard');
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erreur interne du serveur');
});

// Gestionnaire pour les routes non trouvées
app.use((req, res) => {
  res.status(404).send('Page non trouvée');
});

// Server
app.listen(3000, () => {
  console.log('Application sécurisée en cours sur http://localhost:3000');
});
