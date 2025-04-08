export const dataType = () => [
  { name: 'Fenêtre Battante fixe ou oscillante' },
  { name: 'Fenêtre coulissante' },
  { name: 'Porte-fenêtre battante sans sous bassement' },
  { name: 'Porte-fenêtre battante avec sous bassement' },
  { name: 'Porte-fenêtre coulissante' }
]

export const dataMateriauxFenetre = () => [
  { name: 'Inconnu' },
  { name: 'Bois ou bois métal' },
  { name: 'PVC' },
  { name: 'Métal' },
  { name: 'Métal rupteur Pth' }
]

export const dataMateriauxPorte = () => [
  { name: 'Métal' },
  { name: 'Bois' },
  { name: 'PVC' },
  { name: 'Métal + rupture de pont thermique' }
]

export const dataFicheNavetteVitrage = () => [
  { name: 'Simple vitrage' },
  { name: 'Simple vitrage + survitrage' },
  { name: 'Double vitrage' },
  { name: 'Triple vitrage' }
]

export const dataFicheNavetteOrientation = () => [
  { name: 'Nord-Sud' },
  { name: 'Est-Ouest' },
  { name: 'N-E' },
  { name: 'S-E' },
  { name: 'S-O' }
]
