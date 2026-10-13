import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  IconButton,
  Chip,
} from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import ShieldIcon from '@mui/icons-material/Shield';
import GroupsIcon from '@mui/icons-material/Groups';
import TuneIcon from '@mui/icons-material/Tune';
import HelpIcon from '@mui/icons-material/Help';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export type NavView = 'calculator' | 'timeline' | 'artifacts' | 'champions' | 'settings';

interface SidebarNavigationProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  onOpenHelpDialog: () => void;
  onOpenResetDialog: () => void;
  bossDifficulty: string;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  currentView,
  onSelectView,
  onOpenHelpDialog,
  onOpenResetDialog,
  bossDifficulty,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const drawerWidth = isCollapsed ? 68 : 240;

  const navItems = [
    {
      id: 'calculator' as NavView,
      label: 'Sintonizador',
      sublabel: 'Escuadrón & Turnos',
      icon: <SpeedIcon />,
      color: '#38bdf8',
    },
    {
      id: 'timeline' as NavView,
      label: 'Línea de Tiempo',
      sublabel: '50 Rondas Completas',
      icon: <ViewTimelineIcon />,
      color: '#a855f7',
    },
    {
      id: 'artifacts' as NavView,
      label: 'Artefactos y Sets',
      sublabel: '1 a 9 Ranuras',
      icon: <ShieldIcon />,
      color: '#10b981',
    },
    {
      id: 'champions' as NavView,
      label: 'Compendio',
      sublabel: '1,047 Campeones',
      icon: <GroupsIcon />,
      color: '#eab308',
    },
    {
      id: 'settings' as NavView,
      label: 'Dificultad & Presets',
      sublabel: bossDifficulty,
      icon: <TuneIcon />,
      color: '#f97316',
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#0a0f1d',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          color: '#f8fafc',
          transition: 'width 0.2s ease-in-out',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      <Box>
        {/* Brand / Logo Section */}
        <Box
          sx={{
            p: isCollapsed ? 1.5 : 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            minHeight: 64,
          }}
        >
          {!isCollapsed && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #eab308 0%, #b45309 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 12px rgba(234, 179, 8, 0.35)',
                }}
              >
                <Typography sx={{ fontWeight: 900, fontSize: '1rem', color: '#070b14' }}>
                  👑
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', lineHeight: 1.1, color: '#f8fafc' }}>
                  RAID CB
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>
                  Calculadora 50T
                </Typography>
              </Box>
            </Box>
          )}

          <IconButton
            size="small"
            onClick={() => setIsCollapsed(!isCollapsed)}
            sx={{
              color: '#94a3b8',
              '&:hover': { color: '#f8fafc', backgroundColor: 'rgba(255, 255, 255, 0.05)' },
            }}
          >
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>

        {/* Navigation Items */}
        <List sx={{ px: 1, py: 1.5 }}>
          {navItems.map((item) => {
            const isSelected = currentView === item.id;

            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip title={isCollapsed ? item.label : ''} placement="right" arrow>
                  <ListItemButton
                    selected={isSelected}
                    onClick={() => onSelectView(item.id)}
                    sx={{
                      borderRadius: '8px',
                      minHeight: 46,
                      px: isCollapsed ? 1.5 : 2,
                      justifyContent: isCollapsed ? 'center' : 'initial',
                      backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                      borderLeft: isSelected ? `3px solid ${item.color}` : '3px solid transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      },
                      '&.Mui-selected:hover': {
                        backgroundColor: 'rgba(56, 189, 248, 0.16)',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: isCollapsed ? 0 : 1.5,
                        justifyContent: 'center',
                        color: isSelected ? item.color : '#94a3b8',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    {!isCollapsed && (
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontSize: '0.82rem',
                              fontWeight: isSelected ? 700 : 500,
                              color: isSelected ? '#f8fafc' : '#cbd5e1',
                            }}
                          >
                            {item.label}
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ fontSize: '0.65rem', color: '#64748b' }}>
                            {item.sublabel}
                          </Typography>
                        }
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Bottom Actions: Ayuda & Reinicio */}
      <Box sx={{ p: 1, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <List disablePadding>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <Tooltip title={isCollapsed ? 'Guía y Ayuda' : ''} placement="right" arrow>
              <ListItemButton
                onClick={onOpenHelpDialog}
                sx={{
                  borderRadius: '8px',
                  minHeight: 40,
                  px: isCollapsed ? 1.5 : 2,
                  justifyContent: isCollapsed ? 'center' : 'initial',
                  color: '#94a3b8',
                  '&:hover': { color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.08)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? 0 : 1.5, color: 'inherit' }}>
                  <HelpIcon fontSize="small" />
                </ListItemIcon>
                {!isCollapsed && (
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 600 }}>
                        Guía de Uso
                      </Typography>
                    }
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>

          <ListItem disablePadding>
            <Tooltip title={isCollapsed ? 'Restablecer Escuadrón' : ''} placement="right" arrow>
              <ListItemButton
                onClick={onOpenResetDialog}
                sx={{
                  borderRadius: '8px',
                  minHeight: 40,
                  px: isCollapsed ? 1.5 : 2,
                  justifyContent: isCollapsed ? 'center' : 'initial',
                  color: '#f87171',
                  '&:hover': { color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.08)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? 0 : 1.5, color: 'inherit' }}>
                  <RestartAltIcon fontSize="small" />
                </ListItemIcon>
                {!isCollapsed && (
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 600 }}>
                        Restablecer
                      </Typography>
                    }
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>

        {!isCollapsed && (
          <Box sx={{ mt: 1, px: 1, textAlign: 'center' }}>
            <Chip
              label="100% Offline"
              size="small"
              sx={{
                fontSize: '0.62rem',
                height: 20,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            />
          </Box>
        )}
      </Box>
    </Drawer>
  );
};
