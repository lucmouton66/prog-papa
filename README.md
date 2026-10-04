# Prog Papa

App de suivi de programme (séances, séries, historique), installable comme une app sur téléphone.

- Les données restent uniquement sur l'appareil (aucun compte, aucun serveur).
- Déployée automatiquement sur GitHub Pages à chaque push sur `main`.

## Modifier le programme

Le contenu des séances/exercices se trouve dans [`src/lib/seedProgram.ts`](src/lib/seedProgram.ts).
Modifie ce fichier, commit, push : le site se met à jour tout seul en 1-2 minutes.

## Développement local

```bash
npm install
npm run dev
```
