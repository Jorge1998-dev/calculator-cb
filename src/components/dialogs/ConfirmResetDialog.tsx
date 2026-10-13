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
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface ConfirmResetDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmResetDialog: React.FC<ConfirmResetDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="reset-dialog-title"
      slotProps={{
        paper: {
          sx: {
            backgroundColor: '#0f172a',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 3,
            p: 1,
          },
        },
      }}
    >
      <DialogTitle id="reset-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <WarningAmberIcon sx={{ color: '#ef4444', fontSize: '1.8rem' }} />
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc' }}>
          ¿Restablecer el Escuadrón?
        </Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5 }}>
          Esta acción restablecerá los 5 espacios de campeones, equipamiento de 9 piezas,
          auras y configuraciones de habilidades a los valores iniciales predeterminados.
        </DialogContentText>
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 2,
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}
        >
          <Typography sx={{ color: '#fca5a5', fontSize: '0.8rem', fontWeight: 600 }}>
            ⚠️ Se perderán las velocidades y sintonías configuradas no guardadas.
          </Typography>
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
            onConfirm();
            onClose();
          }}
          variant="contained"
          sx={{
            backgroundColor: '#ef4444',
            color: '#fff',
            fontWeight: 700,
            '&:hover': { backgroundColor: '#dc2626' },
          }}
        >
          Sí, Restablecer
        </Button>
      </DialogActions>
    </Dialog>
  );
};
