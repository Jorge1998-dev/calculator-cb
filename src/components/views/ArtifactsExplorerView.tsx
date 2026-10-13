import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShieldIcon from '@mui/icons-material/Shield';

interface SetInfo {
  id: string;
  name: string;
  category: '1-9p' | '4p' | '2p' | '1-3p';
  pieces: string;
  bonus: string;
  loreEligible: boolean;
  desc: string;
}

const ALL_SETS: SetInfo[] = [
  // 1-9p Variable
  { id: 'protection', name: 'Protección (Protection)', category: '1-9p', pieces: '1 a 9 piezas', bonus: '+12% a +24% Velocidad, Escudos Protegidos', loreEligible: false, desc: 'Set variable obtenido en Asedio/Arena. Otorga bonificaciones de velocidad acumulativas y probabilidad de proteger bufos y escudos aliados.' },
  { id: 'supersonic', name: 'Supersónico (Supersonic)', category: '1-9p', pieces: '1 a 9 piezas', bonus: '+12% a +44% Velocidad, Reducción de Medidor de Turno', loreEligible: false, desc: 'Set de combate supremo de velocidad. Otorga velocidad masiva (+44% a 9 piezas) e inmunidad parcial a reducciones de Turn-Meter.' },
  { id: 'stoneskin', name: 'Piel de Piedra (Stoneskin)', category: '1-9p', pieces: '1 a 9 piezas', bonus: 'Inmunidad Piel de Piedra, +HP, +RES', loreEligible: false, desc: 'Otorga bufo de Piel de Piedra al inicio del combate que reduce en 85% el daño recibido y otorga inmunidad a debufos.' },
  { id: 'merciless', name: 'Despiadado (Merciless)', category: '1-9p', pieces: '1 a 9 piezas', bonus: '+ATK, +C.DMG, Reducción de CD al golpear', loreEligible: false, desc: 'Set de daño brutal que reduce el cooldown de una habilidad aleatoria al asestar golpes críticos y aumenta estadísticas de ataque.' },
  { id: 'slayer', name: 'Degollador (Slayer)', category: '1-9p', pieces: '1 a 9 piezas', bonus: '+C.RATE, +C.DMG, Relleno de Turn-Meter', loreEligible: false, desc: 'Optimizado para campeones con habilidades de área (AoE). Rellena el Turn-Meter por cada objetivo impactado.' },
  { id: 'pinpoint', name: 'Pinpoint', category: '1-9p', pieces: '1 a 9 piezas', bonus: '+ACC, +5% a +10% SPD, Interrupción', loreEligible: false, desc: 'Incremente la Puntería y proporciona bonificaciones de velocidad escalables en 2p y 4p.' },

  // 4p
  { id: 'swift_parry', name: 'Parada Precipitada (Swift Parry)', category: '4p', pieces: '4 piezas', bonus: '+18% Velocidad, 50% Imperecedero al morir', loreEligible: false, desc: 'Otorga una de las mayores bonificaciones planas de velocidad del juego (+18% SPD) y supervivencia salvavidas.' },
  { id: 'stalwart', name: 'Inquebrantable (Stalwart)', category: '4p', pieces: '4 piezas', bonus: '-30% Daño recibido de ataques de área (AoE)', loreEligible: false, desc: 'Esencial para equipos de Clan Boss tradicionales, reduciendo drásticamente el impacto de los ataques AOE1 y AOE2.' },
  { id: 'lifesteal', name: 'Robo de Vida (Lifesteal)', category: '4p', pieces: '4 piezas', bonus: 'Cura al portador en un 30% del daño infligido', loreEligible: false, desc: 'Pilar histórico de Clan Boss. Mantiene a los campeones con vida al 100% en cada golpe con maestrías de Warmaster o Giant Slayer.' },
  { id: 'savage', name: 'Salvaje (Savage)', category: '4p', pieces: '4 piezas', bonus: 'Ignora el 25% de la Defensa del objetivo', loreEligible: false, desc: 'Aumenta significativamente el daño bruto contra el Clan Boss al eludir parte de su armadura.' },
  { id: 'lethal', name: 'Letal (Lethal)', category: '4p', pieces: '4 piezas', bonus: 'Ignora 25% DEF, +10% Prob. Crítico', loreEligible: false, desc: 'Versión mejorada del conjunto Salvaje, provista en la Torre del Destino (Doom Tower).' },
  { id: 'toxic', name: 'Tóxico (Toxic)', category: '4p', pieces: '4 piezas', bonus: '75% probabilidad de colocar Veneno 2.5% por 2 turnos', loreEligible: false, desc: 'Ideal para campeones que atacan frecuentemente en equipos donde faltan debufos de veneno.' },
  { id: 'reflex', name: 'Reflejos (Reflex)', category: '4p', pieces: '4 piezas', bonus: '40% probabilidad de reducir 1 turno de CD', loreEligible: false, desc: 'Acelera el ciclado de habilidades clave sin alterar la sincronía del medidor de turnos.' },
  { id: 'relentless', name: 'Implacable (Relentless)', category: '4p', pieces: '4 piezas', bonus: '18% probabilidad de otorgar Turno Extra', loreEligible: false, desc: 'Atención: en composiciones Speed Tune estrictas, los turnos extra pueden romper la sintonía si no se calcula con holgura.' },

  // 2p
  { id: 'speed', name: 'Velocidad (Speed)', category: '2p', pieces: '2 piezas', bonus: '+12% Velocidad Base (Lore of Steel: +13.8%)', loreEligible: true, desc: 'El conjunto fundamental para alcanzar los puntos de corte (speed breakpoints) en composiciones 1:1, 2:1 y 3:1.' },
  { id: 'perception', name: 'Percepción (Perception)', category: '2p', pieces: '2 piezas', bonus: '+5% Velocidad, +40 Puntería', loreEligible: true, desc: 'Forjable en la Cripta de Facciones. El set más versátil y balanceado para asegurar debufos y velocidad.' },
  { id: 'righteous', name: 'Justiciero (Righteous)', category: '2p', pieces: '2 piezas', bonus: '+10% Velocidad, +40 Resistencia', loreEligible: true, desc: 'Otorga +10% de velocidad y resistencia para resistir debufos de afinidad o aturdimiento del Boss.' },
  { id: 'divine_speed', name: 'Velocidad Divina (Divine Speed)', category: '2p', pieces: '2 piezas', bonus: '+12% Velocidad, Escudo 15% HP por 3 turnos', loreEligible: true, desc: 'Otorga velocidad básica idéntica al set de velocidad más un escudo protector al inicio de la ronda.' },
  { id: 'killstroke', name: 'Golpe Mortal (Killstroke)', category: '2p', pieces: '2 piezas', bonus: '+5% Velocidad, +20% Daño Crítico', loreEligible: true, desc: 'Combina velocidad y daño crítico para atacantes pesados.' },
  { id: 'defense', name: 'Defensa (Defense)', category: '2p', pieces: '2 piezas', bonus: '+15% Defensa Base (Lore of Steel: +17.25%)', loreEligible: true, desc: 'Incrementa la durabilidad y el daño de campeones basados en defensa, como Wixwell, Valquiria o Krisk.' },
  { id: 'defiant', name: 'Desafiante (Defiant)', category: '2p', pieces: '2 piezas', bonus: '+10% Defensa, -15% Daño de ataques AoE', loreEligible: true, desc: 'Excelente set forjable que mitiga el daño en área de los dos primeros ataques del Boss.' },
  { id: 'resilience', name: 'Resiliencia (Resilience)', category: '2p', pieces: '2 piezas', bonus: '+10% HP, +10% DEF', loreEligible: true, desc: 'Aumenta las estadísticas de supervivencia efectivas.' },

  // Accesorios 1-3p
  { id: 'refresh_accessory', name: 'Accesorios de Refresco (Refresh)', category: '1-3p', pieces: '1 a 3 accesorios', bonus: '5% probabilidad de reset de CD por pieza', loreEligible: false, desc: 'Anillo, Amuleto o Estandarte que otorgan hasta un 15% de probabilidad combinada de reiniciar el cooldown de una habilidad.' },
  { id: 'cleansing_accessory', name: 'Accesorios de Limpieza (Cleansing)', category: '1-3p', pieces: '1 a 3 accesorios', bonus: '8% probabilidad de limpiar 1 debufo por pieza', loreEligible: false, desc: 'Ayuda a limpiar debufos de velocidad o aturdimientos si el campeón es impactado.' },
  { id: 'reaction_accessory', name: 'Accesorios de Reacción (Reaction)', category: '1-3p', pieces: '1 a 3 accesorios', bonus: 'Convierte golpes críticos recibidos en golpes normales', loreEligible: false, desc: 'Mitiga daño masivo en las primeras rondas de combate.' },
];

export const ArtifactsExplorerView: React.FC = () => {
  const [filterCat, setFilterCat] = useState<'all' | '1-9p' | '4p' | '2p' | '1-3p'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSets = ALL_SETS.filter((s) => {
    const matchesCat = filterCat === 'all' || s.category === filterCat;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.bonus.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ShieldIcon sx={{ fontSize: '2.4rem', color: '#10b981' }} />
          Catálogo Oficial de Artefactos y Sets (1 a 9 Ranuras)
        </Typography>
        <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem', mt: 0.5 }}>
          Compendio de conjuntos de 2 piezas, 4 piezas, sets variables de 9 ranuras y accesorios de Raid: Shadow Legends.
        </Typography>
      </Box>

      {/* Filter Bar */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 3 }}>
        <TextField
          size="small"
          placeholder="Buscar set o estadística..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: 320,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 2,
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="Todos los Sets"
            clickable
            onClick={() => setFilterCat('all')}
            sx={{
              backgroundColor: filterCat === 'all' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: filterCat === 'all' ? '#38bdf8' : '#cbd5e1',
              fontWeight: 700,
              border: '1px solid',
              borderColor: filterCat === 'all' ? '#38bdf8' : 'transparent',
            }}
          />
          <Chip
            label="Sets Variables (1-9p)"
            clickable
            onClick={() => setFilterCat('1-9p')}
            sx={{
              backgroundColor: filterCat === '1-9p' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: filterCat === '1-9p' ? '#f59e0b' : '#cbd5e1',
              fontWeight: 700,
              border: '1px solid',
              borderColor: filterCat === '1-9p' ? '#f59e0b' : 'transparent',
            }}
          />
          <Chip
            label="Sets de 4 Piezas"
            clickable
            onClick={() => setFilterCat('4p')}
            sx={{
              backgroundColor: filterCat === '4p' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: filterCat === '4p' ? '#a855f7' : '#cbd5e1',
              fontWeight: 700,
              border: '1px solid',
              borderColor: filterCat === '4p' ? '#a855f7' : 'transparent',
            }}
          />
          <Chip
            label="Sets de 2 Piezas"
            clickable
            onClick={() => setFilterCat('2p')}
            sx={{
              backgroundColor: filterCat === '2p' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: filterCat === '2p' ? '#10b981' : '#cbd5e1',
              fontWeight: 700,
              border: '1px solid',
              borderColor: filterCat === '2p' ? '#10b981' : 'transparent',
            }}
          />
          <Chip
            label="Accesorios (1-3p)"
            clickable
            onClick={() => setFilterCat('1-3p')}
            sx={{
              backgroundColor: filterCat === '1-3p' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: filterCat === '1-3p' ? '#ec4899' : '#cbd5e1',
              fontWeight: 700,
              border: '1px solid',
              borderColor: filterCat === '1-3p' ? '#ec4899' : 'transparent',
            }}
          />
        </Box>
      </Box>

      {/* Sets Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 2 }}>
        {filteredSets.map((s) => (
          <Box
            key={s.id}
            sx={{
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 2.5,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'rgba(56, 189, 248, 0.3)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>
                  {s.name}
                </Typography>
                <Chip
                  label={s.pieces}
                  size="small"
                  sx={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    height: 20,
                    backgroundColor:
                      s.category === '1-9p'
                        ? 'rgba(245, 158, 11, 0.15)'
                        : s.category === '4p'
                        ? 'rgba(168, 85, 247, 0.15)'
                        : s.category === '2p'
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(236, 72, 153, 0.15)',
                    color:
                      s.category === '1-9p'
                        ? '#f59e0b'
                        : s.category === '4p'
                        ? '#a855f7'
                        : s.category === '2p'
                        ? '#10b981'
                        : '#ec4899',
                  }}
                />
              </Box>

              <Box sx={{ p: 1, my: 1, backgroundColor: 'rgba(0, 0, 0, 0.25)', borderRadius: 1.5, border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8' }}>
                  Bono: {s.bonus}
                </Typography>
              </Box>

              <Typography sx={{ fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.5, mt: 1 }}>
                {s.desc}
              </Typography>
            </Box>

            {s.loreEligible && (
              <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label="Aplica Lore of Steel (+15%)"
                  size="small"
                  sx={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    height: 18,
                    backgroundColor: 'rgba(234, 179, 8, 0.12)',
                    color: '#fde047',
                    border: '1px solid rgba(234, 179, 8, 0.25)',
                  }}
                />
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
