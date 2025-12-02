# 🌡️ GenHack 2025 - Climate Heat Dashboard Frontend

> **React 19 + Vite + Deck.gl + MapLibre** - Dashboard interactif pour l'analyse des îlots de chaleur urbains

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📦 Stack Technique

- **React 19** : Framework UI moderne
- **Vite** : Build tool ultra-rapide
- **TypeScript** : Typage statique
- **Tailwind CSS** : Styling utilitaire
- **Deck.gl** : Visualisation géospatiale GPU-accelerated
- **MapLibre GL JS** : Cartes vectorielles open-source
- **Zustand** : Gestion d'état légère

## 🗂️ Structure du Projet

```
src/
├── components/        # Composants React
│   └── MapView.tsx   # Composant principal de carte
├── store/            # Zustand stores
├── types/            # Types TypeScript
├── App.tsx           # Composant racine
└── main.tsx          # Point d'entrée
```

## 🎨 Features

### ✅ Phase 1 - Jour 1 (01 Déc)
- [x] Setup React 19 + Vite + Tailwind
- [x] Configuration Deck.gl + MapLibre
- [x] Carte de base avec fond sombre (Dark Mode)
- [x] Structure de base de l'application

### 🔜 À venir
- [ ] StationLayer pour visualiser les stations ECA&D
- [ ] Graphiques temporels (Recharts/Nivo)
- [ ] Timeline Slider pour navigation temporelle
- [ ] HeatmapLayer pour visualiser les zones de chaleur
- [ ] Scrollytelling interactif

## 🎯 Roadmap

Voir `ROADMAP_TODOS.md` pour la roadmap complète.

## 📚 Documentation

- [Deck.gl Documentation](https://deck.gl/docs)
- [MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/)
- [React Map GL](https://visgl.github.io/react-map-gl/)
