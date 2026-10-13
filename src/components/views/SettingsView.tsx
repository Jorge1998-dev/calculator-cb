import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import type { ClanBossDifficulty, ClanBossAffinity } from '../../types';

interface SettingsViewProps {
  difficulty: ClanBossDifficulty;
  onDifficultyChange: (d: ClanBossDifficulty) => void;
  affinity: ClanBossAffinity;
  onAffinityChange: (a: ClanBossAffinity) => void;
  onOpenPresetDialog: (key: string) => void;
  onOpenResetDialog: () => void;
}

const DIFFICULTIES: { id: ClanBossDifficulty; label: string; speed: number; desc: string }[] = [
  { id: 'Ultra-Nightmare', label: 'Ultra-Pesadilla (UNM)', speed: 190, desc: 'Velocidad base 190. El reto máximo de Clan Boss para recompensas de cofres trascendentes.' },
  { id: 'Nightmare', label: 'Pesadilla (NM)', speed: 170, desc: 'Velocidad base 170. Sintonía clásica 1:1 de 171-189 SPD.' },
  { id: 'Brutal', label: 'Brutal', speed: 160, desc: 'Velocidad base 160.' },
  { id: 'Hard', label: 'Difícil (Hard)', speed: 140, desc: 'Velocidad base 140.' },
  { id: 'Normal', label: 'Normal', speed: 110, desc: 'Velocidad base 110.' },
  { id: 'Easy', label: 'Fácil (Easy)', speed: 90, desc: 'Velocidad base 90.' },
];

const AFFINITIES: { id: ClanBossAffinity; label: string; color: string; desc: string }[] = [
  { id: 'Void', label: 'Vacío (Void)', color: '#c084fc', desc: 'Sin desventajas de afinidad. Estado inicial del Clan Boss (100% a 50% HP).' },
  { id: 'Spirit', label: 'Espíritu (Spirit)', color: '#4ade80', desc: 'El AOE1 coloca debufo de Disminuir Velocidad (30%), crítico para sintonías sin Bloqueo de Debufos.' },
  { id: 'Force', label: 'Fuerza (Force)', color: '#f87171', desc: 'Desventaja elemental para campeones de Magia (golpes débiles).' },
  { id: 'Magic', label: 'Magia (Magic)', color: '#60a5fa', desc: 'Desventaja elemental para campeones de Espíritu.' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  difficulty,
  onDifficultyChange,
  affinity,
  onAffinityChange,
  onOpenPresetDialog,
  onOpenResetDialog,
}) => {
  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TuneIcon sx={{ fontSize: '2.4rem', color: '#f97316' }} />
          Ajustes de Clan Boss y Sintonías Predeterminadas
        </Typography>
        <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem', mt: 0.5 }}>
          Configura los parámetros globales del combate: dificultad del Jefe de Clan, afinidad elemental y carga de composiciones de renombre.
        </Typography>
      </Box>

      {/* Dificultad Section */}
      <Box sx={{ mb: 4, p: 2.5, backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#f8fafc', mb: 1 }}>
          👑 Dificultad del Clan Boss
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', mb: 2 }}>
          Selecciona la dificultad para ajustar automáticamente la velocidad base del Boss y los puntos de sintonización.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 1.5 }}>
          {DIFFICULTIES.map((d) => {
            const isSelected = difficulty === d.id;

            return (
              <Box
                key={d.id}
                onClick={() => onDifficultyChange(d.id)}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid',
                  borderColor: isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.06)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'rgba(56, 189, 248, 0.4)',
                    backgroundColor: 'rgba(56, 189, 248, 0.08)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: isSelected ? '#38bdf8' : '#f1f5f9' }}>
                    {d.label}
                  </Typography>
                  <Chip
                    label={`${d.speed} SPD`}
                    size="small"
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.68rem',
                      height: 20,
                      backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      color: isSelected ? '#38bdf8' : '#94a3b8',
                    }}
                  />
                </Box>
                <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  {d.desc}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Afinidad Section */}
      <Box sx={{ mb: 4, p: 2.5, backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#f8fafc', mb: 1 }}>
          🔮 Afinidad Elemental del Clan Boss
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', mb: 2 }}>
          La afinidad del Boss determina mecánicas críticas, como el debufo de Disminuir Velocidad en Espíritu (Spirit).
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 1.5 }}>
          {AFFINITIES.map((a) => {
            const isSelected = affinity === a.id;

            return (
              <Box
                key={a.id}
                onClick={() => onAffinityChange(a.id)}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  backgroundColor: isSelected ? `${a.color}20` : 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid',
                  borderColor: isSelected ? a.color : 'rgba(255, 255, 255, 0.06)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: a.color,
                    backgroundColor: `${a.color}15`,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: a.color }} />
                  <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#f1f5f9' }}>
                    {a.label}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  {a.desc}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Presets & Reset Section */}
      <Box sx={{ p: 2.5, backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#f8fafc', mb: 1 }}>
          ⚡ Sintonías Predeterminadas (Speed Tune Presets)
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', mb: 2 }}>
          Carga con un solo clic configuraciones probadas que alcanzan las 50 rondas garantizadas en Ultra-Pesadilla.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<AutoFixHighIcon />}
            onClick={() => onOpenPresetDialog('wixwell-infinity')}
            sx={{
              backgroundColor: '#eab308',
              color: '#070b14',
              fontWeight: 800,
              px: 2.5,
              py: 1,
              '&:hover': { backgroundColor: '#ca8a04' },
            }}
          >
            🛡️ Cargar "Wixwell Infinity"
          </Button>

          <Button
            variant="contained"
            startIcon={<AutoFixHighIcon />}
            onClick={() => onOpenPresetDialog('myth-heir')}
            sx={{
              backgroundColor: '#38bdf8',
              color: '#070b14',
              fontWeight: 800,
              px: 2.5,
              py: 1,
              '&:hover': { backgroundColor: '#0ea5e9' },
            }}
          >
            Cargar "Myth-Heir" (3:1)
          </Button>

          <Button
            variant="contained"
            startIcon={<AutoFixHighIcon />}
            onClick={() => onOpenPresetDialog('bateater')}
            sx={{
              backgroundColor: '#a855f7',
              color: '#fff',
              fontWeight: 800,
              px: 2.5,
              py: 1,
              '&:hover': { backgroundColor: '#9333ea' },
            }}
          >
            Cargar "BatEater" (2:1)
          </Button>

          <Button
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={onOpenResetDialog}
            sx={{
              color: '#f87171',
              borderColor: 'rgba(239, 68, 68, 0.4)',
              fontWeight: 700,
              px: 2.5,
              py: 1,
              '&:hover': {
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
              },
            }}
          >
            Restablecer Escuadrón
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
