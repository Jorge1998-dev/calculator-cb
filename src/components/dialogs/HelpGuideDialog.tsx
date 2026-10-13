import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

interface HelpGuideDialogProps {
  open: boolean;
  onClose: () => void;
}

export const HelpGuideDialog: React.FC<HelpGuideDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="help-dialog-title"
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: '#0f172a',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: 3,
            p: 1,
          },
        },
      }}
    >
      <DialogTitle id="help-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <MenuBookIcon sx={{ color: '#38bdf8', fontSize: '2rem' }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc' }}>
            Guía de True Speed, Turnos y Clan Boss
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Mecánica canónica exacta de Raid: Shadow Legends
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
          <Typography sx={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.85rem', mb: 0.5 }}>
            ⚡ 1. ¿Qué es True Speed (Velocidad Real)?
          </Typography>
          <Typography sx={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: 1.5 }}>
            La velocidad que muestra la pantalla del juego es redondeada a un entero. Sin embargo, el motor interno de Raid
            almacena valores fraccionarios con precisión de coma flotante de 32 bits generados por:
          </Typography>
          <ul style={{ margin: '6px 0 0 16px', padding: 0, color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.6 }}>
            <li><strong>Sets de 2 Piezas:</strong> Velocidad (+12%), Percepción (+5%), Justiciero (+10%), Velocidad Divina (+12%).</li>
            <li><strong>Maestría Lore of Steel:</strong> Otorga +15% adicional a las bonificaciones de sets básicos de 2 piezas.</li>
            <li><strong>Sets Variables (1-9p):</strong> Protección (+12% a +24%), Supersónico (+12% a +44%), Pinpoint.</li>
            <li><strong>Aura de Velocidad:</strong> Afecta únicamente sobre la Velocidad Base del campeón.</li>
          </ul>
        </Box>

        <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
          <Typography sx={{ fontWeight: 700, color: '#34d399', fontSize: '0.85rem', mb: 0.5 }}>
            ⏱️ 2. Motor de Ticks del Medidor de Turnos (Turn-Meter Tick Engine)
          </Typography>
          <Typography sx={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: 1.5 }}>
            Cada "tick" de combate en Raid incrementa el medidor de todos los personajes según la fórmula oficial:
          </Typography>
          <Box sx={{ p: 1, my: 1, backgroundColor: '#070b14', borderRadius: 1.5, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Typography sx={{ fontFamily: 'monospace', color: '#fcd34d', fontSize: '0.82rem', textAlign: 'center' }}>
              TurnMeter += TrueSpeed × 0.07 por Tick
            </Typography>
          </Box>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.78rem' }}>
            Cuando algún combatiente alcanza el 100%, toma su turno. Si varios superan el 100% en el mismo tick, actúa quien tenga mayor medidor; en caso de empate, la posición en el escuadrón (Slot 1 al 5) define el desempate.
          </Typography>
        </Box>

        <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(234, 179, 8, 0.05)', border: '1px solid rgba(234, 179, 8, 0.15)' }}>
          <Typography sx={{ fontWeight: 700, color: '#fde047', fontSize: '0.85rem', mb: 0.5 }}>
            🛡️ 3. Equipamiento de 9 Ranuras y Bloqueo de Habilidades
          </Typography>
          <Typography sx={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: 1.5 }}>
            - <strong>9 Ranuras (6 Artefactos + 3 Accesorios):</strong> Puedes combinar cualquier cantidad de sets o piezas sueltas hasta un límite estricto de 9.
            <br />
            - <strong>Habilidades Pasivas:</strong> No tienen turnos ni prioridad de uso; se marcan como situacionales.
            <br />
            - <strong>Bloqueo ("No Usar"):</strong> Puedes desactivar cualquier habilidad activa con un solo click para que el campeón nunca la use en combate.
          </Typography>
        </Box>
      </DialogContent>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: '#38bdf8',
            color: '#070b14',
            fontWeight: 800,
            '&:hover': { backgroundColor: '#0ea5e9' },
          }}
        >
          Entendido
        </Button>
      </DialogActions>
    </Dialog>
  );
};
