import fs from 'fs';

const filePath = 'src/data/champions.json';
const champions = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const lydia = champions.find(
  (c) =>
    c.name.toLowerCase().includes('lydia the deathsiren') ||
    (c.spanishName && c.spanishName.toLowerCase().includes('lydia la sirena'))
);

if (!lydia) {
  console.error('Lydia not found!');
  process.exit(1);
}

console.log('Found Lydia:', lydia.name, lydia.spanishName);

// Update skills to match SendaPlays official Spanish names, descriptions and books
lydia.skills = [
  {
    cooldown: 0,
    booked_cooldown: 0,
    cooldown_blocked: 0,
    damage_based_on: ['ATK'],
    name: 'Opresión (ATK)',
    description:
      '[Efecto activo] Ataca a 1 enemigo. Tiene un 75% de probabilidad de aplicar un debufo de [Miedo] durante 1 turno. Tiene un 75% de probabilidad de aumentar la duración de cualquier debufo de [Sensibilidad al veneno] en 1 turno.\n\n[Efecto pasivo] Ataca a los campeones enemigos con esta habilidad siempre que aplican un debufo de [Congelar], [Aturdir], [Miedo] o [Miedo de Verdad] a un aliado. El número de ataques aumenta según la cantidad de debufos aplicados: 1 ataque por cada debufo de [Congelar], [Aturdir], [Miedo] o [Miedo de Verdad]. El primer ataque será contra el atacante, mientras que todos los golpes adicionales atacarán a enemigos aleatorios. Solo puede atacar a cada enemigo una vez.',
    passive: [],
    effect: [
      {
        id: 'add_debuff',
        amount: 1,
        turns: 1,
        enemy: 'single',
        debuff: 'fear',
      },
      {
        id: 'add_debuff',
        amount: 1,
        turns: 0,
        enemy: 'single',
        debuff: 'extend_debuff',
      },
    ],
    books: [
      'Nivel 2: Daño +10%',
      'Nivel 3: Daño +10%',
      'Nivel 4: Probabilidad de Bufo / Debufo +10%',
      'Nivel 5: Probabilidad de Bufo / Debufo +15%',
    ],
  },
  {
    cooldown: 4,
    booked_cooldown: 3,
    cooldown_blocked: 0,
    damage_based_on: ['ATK'],
    name: 'Lamento de Sirena (ATK)',
    description:
      'Ataca a todos los enemigos. Tiene un 75% de probabilidad de aplicar un debufo del 60% [Reducir DEF] y un debufo del 25% [Debilitar] durante 2 turnos. También aplica un bufo del 25% [Fortalecer] y un bufo del 30% [Aumentar VEL] a todos los aliados durante 2 turnos.',
    passive: [],
    effect: [
      {
        id: 'add_debuff',
        amount: 60,
        turns: 2,
        enemy: 'all',
        debuff: 'defdown',
      },
      {
        id: 'add_debuff',
        amount: 25,
        turns: 2,
        enemy: 'all',
        debuff: 'weak',
      },
      {
        id: 'add_buff',
        amount: 25,
        turns: 2,
        champions: 'allies',
        buff: 'str',
      },
      {
        id: 'add_buff',
        amount: 30,
        turns: 2,
        champions: 'allies',
        buff: 'speedup',
      },
    ],
    books: [
      'Nivel 2: Daño +10%',
      'Nivel 3: Probabilidad de Bufo / Debufo +10%',
      'Nivel 4: Probabilidad de Bufo / Debufo +15%',
      'Nivel 5: Tiempo de Reutilización -1',
    ],
  },
  {
    cooldown: 5,
    booked_cooldown: 3,
    cooldown_blocked: 0,
    damage_based_on: ['ATK', 'ATK'],
    name: 'Nulificación (ATK)',
    description:
      'Ataca a 1 enemigo 2 veces. El primer golpe tiene un 75% de probabilidad de aplicar un debufo del 25% [Sensibilidad al veneno] durante 2 turnos. El segundo golpe tiene un 75% de probabilidad de aplicar un debufo de [Bloquear bufos] y [Bloquear habilidades Activas] o 2 turnos.',
    passive: [],
    effect: [
      {
        id: 'add_debuff',
        amount: 25,
        turns: 2,
        enemy: 'single',
        debuff: 'poison_sense',
      },
      {
        id: 'add_debuff',
        amount: 1,
        turns: 2,
        enemy: 'single',
        debuff: 'blockbuff',
      },
      {
        id: 'add_debuff',
        amount: 1,
        turns: 2,
        enemy: 'single',
        debuff: 'Place Debuff',
      },
    ],
    books: [
      'Nivel 2: Daño +10%',
      'Nivel 3: Probabilidad de Bufo / Debufo +10%',
      'Nivel 4: Probabilidad de Bufo / Debufo +15%',
      'Nivel 5: Tiempo de Reutilización -1',
      'Nivel 6: Tiempo de Reutilización -1',
    ],
  },
  {
    cooldown: 0,
    booked_cooldown: 0,
    cooldown_blocked: 0,
    damage_based_on: ['ATK'],
    name: 'Abrazo de Muerte (Pasiva)',
    description:
      'Niega los intentos de revivir del enemigo. Esto funciona incluso si este Campeón está muerto. Si este Campeón está vivo cuando se niega la reanimación de un enemigo, revive a todos los aliados muertos con un 50% de HP y un 50% de barra de turno. Otorga un turno extra en su lugar si no hay aliados muertos. Si este Campeón muere cuando se niega la reanimación del enemigo, revive a este Campeón con un 50% de HP y un 50% de barra de turno. Esto ignorará Bloquear Revivir.',
    passive: ['passive'],
    effect: [],
    books: [
      'Nivel 2: Tiempo de Reutilización -1',
      'Nivel 3: Tiempo de Reutilización -1',
    ],
  },
];

fs.writeFileSync(filePath, JSON.stringify(champions, null, 2), 'utf8');
console.log('Successfully updated Lydia skills in champions.json!');
