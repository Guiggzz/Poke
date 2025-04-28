# Poke

Un projet basé sur l'univers Pokémon qui vous permet d'explorer et d'interagir avec le monde des Pokémon.

## Description

Ce projet est une application qui exploite l'API fournie par un professeur pour offrir une expérience interactive avec l'univers Pokémon. Les utilisateurs peuvent:
- Explorer la liste des Pokémon disponibles dans l'API
- Consulter les détails de chaque Pokémon (statistiques, types, évolutions)
- Rechercher des Pokémon par nom ou caractéristiques
- Interagir avec les fonctionnalités définies par l'API du professeur

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/Guiggzz/Poke.git

# Accéder au répertoire du projet
cd Poke

# Installer les dépendances
npm install
# ou
yarn install

# Lancer l'application en mode développement
npm run dev
# ou
yarn run dev
```

## Technologies utilisées

- [React.js](https://reactjs.org/) - Bibliothèque JavaScript pour construire l'interface utilisateur
- API du professeur - API qui fournit les données Pokémon pour ce projet
- [CSS/SCSS](https://sass-lang.com/) - Pour le style et la mise en page
- [Axios](https://axios-http.com/) - Client HTTP pour les requêtes API

## Fonctionnalités

### Catalogue de Pokémon
- Affichage paginé de tous les Pokémon existants
- Filtrage par type, génération, etc.
- Recherche rapide par nom

### Fiche détaillée
- Statistiques complètes
- Chaîne d'évolution
- Attaques disponibles
- Lieux où les trouver

### Système d'équipe
- Constitution d'équipes personnalisées
- Analyse des forces et faiblesses
- Sauvegarde des équipes favorites

## Captures d'écran

*Ajoutez ici des captures d'écran de votre application*

## Structure du projet

```
Poke/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── PokemonList/
│   │   ├── PokemonDetail/
│   │   ├── SearchBar/
│   │   └── ...
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   └── ...
│   ├── App.js
│   └── index.js
└── package.json
```

## API Utilisée

Ce projet utilise l'API fournie par le professeur pour accéder aux données Pokémon.

Exemples potentiels d'endpoints (à adapter selon l'API réelle):
- `GET /api/pokemon` : Liste des Pokémon
- `GET /api/pokemon/{id}` : Détails d'un Pokémon spécifique
- `GET /api/types` : Informations sur les types de Pokémon

## Contribution

Les contributions sont les bienvenues! Pour contribuer:

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Remerciements

- Le professeur pour la mise à disposition de l'API Pokémon utilisée dans ce projet
- La communauté Pokémon pour son soutien constant
- Nintendo et The Pokémon Company pour cet univers incroyable

---

Projet créé par [Guiggzz](https://github.com/Guiggzz)