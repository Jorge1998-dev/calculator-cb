import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

interface PresetConfirmDialogProps {
  open: boolean;
  presetKey: string | null;
  onClose: () => void;
  onConfirm: (presetKey: string) => void;
}

const PRESET_DESCRIPTIONS: Record<string, { title: string; desc: string; champs: string[]; badge: string }> = {
  'wixwell-infinity': {
    title: 'Wixwell Infinity Shield (Meta)',
    desc: 'Composición moderna de Escudo Infinito. Wixwell coloca Escudo, Aumento de Defensa 60% e Inmutable en su A3, y extiende indefinidamente los bufos con su A2.',
    champs: ['Vault Keeper Wixwell (239 SPD)', 'Godseeker Aniri (210 SPD)', 'Demytha (254 SPD)', 'Geomancer (175 SPD)', 'Lydia the Deathsiren (215 SPD)'],
    badge: 'Escudo Infinito',
  },
  'myth-heir': {
    title: 'Myth-Heir (Inmortal 3:1)',
    desc: 'Composición clásica e infalible con Demytha y Heiress. Asegura inmunidad permanente a aturdimiento y daño.',
    champs: ['Demytha (274 SPD)', 'Heiress (245 SPD)', 'Seeker (180 SPD)', 'Deacon Armstrong (185 SPD)', 'Ninja (156 SPD)'],
    badge: '3:1 Ratio',
  },
  'bateater': {
    title: 'BatEater (2x Maneater Inmortal)',
    desc: 'Doble Maneater con Seeker para ciclo de 2 turnos con Bloqueo de Daño ininterrumpido en Ultra-Pesadilla.',
    champs: ['Maneater 1 (265 SPD)', 'Maneater 2 (239 SPD)', 'Seeker (248 SPD)', 'Pain Keeper (246 SPD)', 'Dracomorph (220 SPD)'],
    badge: '2:1 Inmortal',
  },
};

export const PresetConfirmDialog: React.FC<PresetConfirmDialogProps> = ({
  open,
  presetKey,
  onClose,
  onConfirm,
}) => {
  if (!presetKey || !PRESET_DESCRIPTIONS[presetKey]) return null;

  const preset = PRESET_DESCRIPTIONS[presetKey];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="preset-dialog-title"
      slotProps={{
        paper: {
          sx: {
            backgroundColor: '#0f172a',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: 3,
            p: 1,
            maxWidth: 500,
          },
        },
      }}
    >
      <DialogTitle id="preset-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <AutoFixHighIcon sx={{ color: '#38bdf8', fontSize: '1.8rem' }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc', lineHeight: 1.2 }}>
            Cargar Sintonía: {preset.title}
          </Typography>
          <Chip
            label={preset.badge}
            size="small"
            sx={{
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              fontWeight: 700,
              fontSize: '0.65rem',
              height: 20,
              mt: 0.5,
            }}
          />
        </Box>
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ color: '#cbd5e1', fontSize: '0.85rem', mb: 2 }}>
          {preset.desc}
        </DialogContentText>

        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', mb: 1 }}>
          Campeones y Velocidades que se configurarán:
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
          {preset.champs.map((ch, idx) => (
            <Box
              key={idx}
              sx={{
                p: 1,
                borderRadius: 1.5,
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8' }}>
                Slot {idx + 1}:
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9' }}>
                {ch}
              </Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: '#cbd5e1',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            '&:hover': { borderColor: 'rgba(255, 255, 255, 0.4)', backgroundColor: 'rgba(255, 255, 255, 0.05)' },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={() => {
            onConfirm(presetKey);
            onClose();
          }}
          variant="contained"
          sx={{
            backgroundColor: '#38bdf8',
            color: '#070b14',
            fontWeight: 800,
            '&:hover': { backgroundColor: '#0ea5e9' },
          }}
        >
          Cargar Sintonía
        </Button>
      </DialogActions>
    </Dialog>
  );
};
