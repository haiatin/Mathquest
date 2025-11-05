# 🚀 Guide de Déploiement - MathQuest Odyssey

## 📱 Options pour tester depuis votre téléphone

Le jeu est maintenant prêt à être déployé en ligne ! Voici 3 options faciles :

---

## ⚡ Option 1 : Vercel (RECOMMANDÉ - 2 minutes)

**Le plus rapide et gratuit !**

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Cliquez sur "New Project"
4. Sélectionnez le repo `haiatin/test`
5. Sélectionnez la branche `claude/mathquest-odyssey-game-011CUn5mdntkySFnGMYGZqEH`
6. Cliquez sur "Deploy"

✅ Vercel détectera automatiquement Vite et utilisera `vercel.json`

**Résultat** : Vous aurez une URL type `mathquest-odyssey.vercel.app` accessible depuis votre téléphone !

---

## 🎯 Option 2 : Netlify (aussi simple)

1. Allez sur [netlify.com](https://netlify.com)
2. Connectez-vous avec GitHub
3. Cliquez sur "Add new site" → "Import an existing project"
4. Sélectionnez GitHub et le repo `haiatin/test`
5. Sélectionnez la branche `claude/mathquest-odyssey-game-011CUn5mdntkySFnGMYGZqEH`
6. Cliquez sur "Deploy"

✅ Netlify utilisera automatiquement `netlify.toml`

**Résultat** : URL type `mathquest-odyssey.netlify.app`

---

## 🏛️ Option 3 : GitHub Pages (gratuit, intégré)

### Configuration automatique :

1. Allez sur votre repo GitHub : `https://github.com/haiatin/test`
2. Allez dans **Settings** → **Pages**
3. Dans "Source", sélectionnez "GitHub Actions"
4. Mergez ou pushez la branche vers `main` (ou configurez pour votre branche actuelle)
5. Le workflow `.github/workflows/deploy.yml` se lancera automatiquement

**Résultat** : URL type `https://haiatin.github.io/test/`

### Pour forcer le déploiement maintenant :

```bash
# Merger vers main (si c'est votre branche de déploiement)
git checkout main
git merge claude/mathquest-odyssey-game-011CUn5mdntkySFnGMYGZqEH
git push origin main
```

Ou dans l'interface GitHub :
1. Allez dans "Actions"
2. Sélectionnez "Deploy to GitHub Pages"
3. Cliquez "Run workflow"

---

## 🎮 Test Local (si vous avez accès à un ordinateur)

```bash
npm run dev
# Ouvrir http://localhost:3000
```

---

## 📦 Fichiers de déploiement créés

- ✅ `vercel.json` - Configuration Vercel
- ✅ `netlify.toml` - Configuration Netlify
- ✅ `.github/workflows/deploy.yml` - GitHub Actions pour Pages
- ✅ `dist/` - Build de production prêt

---

## 🌐 Après le déploiement

Une fois déployé, vous pourrez :

1. 📱 Jouer depuis votre téléphone
2. 🔗 Partager le lien avec d'autres
3. 💾 La progression est sauvegardée dans le navigateur
4. ✨ Toutes les fonctionnalités fonctionnent (hints, bar model, etc.)

---

## 🆘 Besoin d'aide ?

**Option la plus simple** : Vercel
- Déploiement automatique
- URL gratuite
- HTTPS inclus
- Mises à jour automatiques

**URL de test attendue** :
- Vercel : `https://test-[random].vercel.app`
- Netlify : `https://[random].netlify.app`
- GitHub Pages : `https://haiatin.github.io/test/`

---

## ✨ C'est prêt !

Le jeu est 100% fonctionnel et optimisé pour mobile :
- Interface responsive
- Touch-friendly
- Animations fluides
- Sauvegarde automatique

**Amusez-vous bien !** 🎉🏛️
