import type { Circuit, Program } from '../types'

function circuit(c: Circuit): Circuit {
  return c
}

export function buildSeedProgram(): Program {
  return {
    id: 'programme-1',
    name: 'Programme Papa',
    sessions: [
      {
        id: 'mardi',
        name: 'Mardi — Mobilité + Prévention full body + abdo',
        circuits: [
          circuit({
            id: 'p-mar-c1',
            name: 'Mobilité',
            tours: 3,
            repos: 60,
            exercises: [
              {
                id: 'p-mar-1',
                name: 'Contraction + assouplissement bras tendu',
                reps: '5 x (5s/5s) / bras',
                note: 'Bras tendu devant toi : contracte 5s puis relâche/étire 5s, alterne par bras.',
              },
              {
                id: 'p-mar-2',
                name: 'Circle',
                reps: '6',
                note: "Allongé au sol, trace un grand cercle avec le bras en cherchant l'amplitude max : va devant puis repars derrière, rotation du poignet à 180° au milieu.",
              },
              {
                id: 'p-mar-3',
                name: 'Squat profond',
                reps: '30-45s',
                unit: 'secondes',
                note: 'Descends en squat complet et reste en bas, dos droit, le temps indiqué.',
              },
            ],
          }),
          circuit({
            id: 'p-mar-c2',
            name: 'Renfo + Prévention',
            tours: 3,
            repos: 120,
            intensite: 'RPE 7',
            exercises: [
              {
                id: 'p-mar-4',
                name: 'Iso fentes bulgare + traction élastique',
                reps: '30-45s',
                unit: 'secondes',
                note: "Fente bulgare tenue en isométrie ; élastique fixé au niveau du genou qui tire vers l'intérieur — résiste pour garder le genou aligné.",
              },
              {
                id: 'p-mar-5',
                name: 'Ponté pelvien + abduction',
                reps: '12',
                note: 'Pont fessier au sol, écarte les genoux (élastique) en haut du mouvement.',
              },
              {
                id: 'p-mar-6',
                name: 'Dead bug',
                reps: '16-20',
                note: 'Allongé sur le dos, bas du dos plaqué au sol, étends bras et jambe opposés en alternance.',
              },
              {
                id: 'p-mar-7',
                name: 'Planche latérale + tirage',
                reps: '10/côté',
                note: "Gainage latéral + tirage (rowing) avec l'élastique du bras libre.",
              },
              {
                id: 'p-mar-8',
                name: 'Palof press OH',
                reps: '10/côté',
                note: 'Élastique tendu sur le côté : pousse les bras au-dessus de la tête en résistant à la rotation.',
              },
            ],
          }),
        ],
      },
      {
        id: 'jeudi',
        name: 'Jeudi — Mobilité + renfo full body',
        circuits: [
          circuit({
            id: 'p-jeu-c1',
            name: 'Mobilité',
            tours: 3,
            repos: 60,
            exercises: [
              {
                id: 'p-jeu-1',
                name: 'RE / RI au sol',
                reps: '5 x (5s/5s) / bras',
                note: "Allongé sur le côté, bras à 90° de l'épaule : pousse 5s vers le bas (rotation interne) puis 5s vers le haut (rotation externe).",
              },
              {
                id: 'p-jeu-2',
                name: 'Pigeon pose dynamique',
                reps: '5 x 5s amplitude max',
                note: "Posture du pigeon en mouvement répété, cherche l'amplitude max à chaque répétition.",
              },
              {
                id: 'p-jeu-3',
                name: 'Superman',
                reps: '20-30s',
                unit: 'secondes',
                note: 'Ventre au sol, lève bras et jambes tendus et maintiens.',
              },
            ],
          }),
          circuit({
            id: 'p-jeu-c2',
            name: 'Renfo + Prévention',
            tours: 3,
            repos: 120,
            intensite: 'RPE 8',
            exercises: [
              {
                id: 'p-jeu-4',
                name: 'Tirage + R2 OH',
                reps: '12/bras',
                note: 'Tirage (rowing) classique puis termine en montant la main au-dessus de la tête.',
              },
              {
                id: 'p-jeu-5',
                name: 'Pompes excentrique',
                reps: '10',
                note: 'Pompes en ralentissant la descente au maximum.',
              },
              {
                id: 'p-jeu-6',
                name: 'Pistol excentrique sur banc',
                reps: '6/côté',
                note: 'Squat une jambe assisté par le banc, descente contrôlée.',
              },
              {
                id: 'p-jeu-7',
                name: 'Monster walk',
                reps: '10/côté',
                note: 'Élastique aux chevilles/genoux, marche latérale en squat partiel.',
              },
            ],
          }),
        ],
      },
      {
        id: 'samedi',
        name: 'Samedi — Mobilité + renfo full body',
        circuits: [
          circuit({
            id: 'p-sam-c1',
            name: 'Mobilité',
            tours: 3,
            repos: 90,
            exercises: [
              {
                id: 'p-sam-1',
                name: 'Cars hanche',
                reps: '6/côté',
                note: "Rotation articulaire contrôlée de la hanche : cherche l'amplitude max dans tous les sens.",
              },
              {
                id: 'p-sam-2',
                name: 'Contraction + assouplissement bras tendu',
                reps: '5 x (5s/5s) / bras',
                note: 'Bras tendu devant toi : contracte 5s puis relâche/étire 5s, alterne par bras.',
              },
              {
                id: 'p-sam-3',
                name: 'OH squat avec élastique',
                reps: '10',
                note: 'Squat bras tendus au-dessus de la tête, élastique placé autour des genoux.',
              },
            ],
          }),
          circuit({
            id: 'p-sam-c2',
            name: 'Renfo + Prévention',
            tours: 3,
            repos: 120,
            intensite: 'RPE 7',
            exercises: [
              {
                id: 'p-sam-4',
                name: 'Bird dog',
                reps: '8/côté',
                note: 'Quadrupédie, étends bras et jambe opposés en gardant le dos stable.',
              },
              {
                id: 'p-sam-5',
                name: 'Tirage bûcheron controlatéral',
                reps: '10/côté',
                note: 'Genou droit sur le banc, main droite qui tire, jambe gauche tendue en arrière, ramène le coude vers la hanche.',
              },
              {
                id: 'p-sam-6',
                name: 'Écarté haltère',
                reps: '10',
                note: 'Couché sur le banc, écarté avec haltères pour les pectoraux.',
              },
              {
                id: 'p-sam-7',
                name: 'Hollow',
                reps: '20-40s',
                unit: 'secondes',
                note: 'Allongé, bras et jambes légèrement levés, bas du dos plaqué au sol.',
              },
            ],
          }),
        ],
      },
    ],
  }
}
