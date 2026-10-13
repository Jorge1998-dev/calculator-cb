import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Breadcrumbs,
  Link,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GroupsIcon from '@mui/icons-material/Groups';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ShieldIcon from '@mui/icons-material/Shield';
import type { ChampionData } from '../../types';
import { ChampionAvatar } from '../champion/ChampionAvatar';
import { parseChampionSkills } from '../../core/calculator/skillUtils';
import { detectChampionAura } from '../../core/calculator/auraUtils';

interface ChampionCompendiumViewProps {
  allChampions: ChampionData[];
  onEquipInSlot: (champ: ChampionData, slotIndex: number) => void;
}

const ITEMS_PER_PAGE = 18;

// Las 16 facciones oficiales de SendaPlays / Raid: Shadow Legends en español
const FACTIONS_LIST = [
  { id: 'all', name: 'Todas las Facciones', slug: '' },
  { id: 'Hidalgos', name: 'Hidalgos', slug: 'hidalgos' },
  { id: 'Altos Elfos', name: 'Altos Elfos', slug: 'altos-elfos' },
  { id: 'Orden Sagrada', name: 'Orden Sagrada', slug: 'orden-sagrada' },
  { id: 'Bárbaros', name: 'Bárbaros', slug: 'barbaros' },
  { id: 'Ogretes', name: 'Ogretes', slug: 'ogretes' },
  { id: 'Hombres Lagarto', name: 'Hombres Lagarto', slug: 'hombres-lagarto' },
  { id: 'Cambiapieles', name: 'Cambiapieles', slug: 'cambiapieles' },
  { id: 'Orcos', name: 'Orcos', slug: 'orcos' },
  { id: 'Engendros', name: 'Engendros', slug: 'engendros' },
  { id: 'No Muertos', name: 'No Muertos', slug: 'no-muertos' },
  { id: 'Elfos Oscuros', name: 'Elfos Oscuros', slug: 'elfos-oscuros' },
  { id: 'Aparecidos', name: 'Aparecidos', slug: 'aparecidos' },
  { id: 'Enanos', name: 'Enanos', slug: 'enanos' },
  { id: 'Sombríos', name: 'Sombríos', slug: 'sombrios' },
  { id: 'Vigías Silvanos', name: 'Vigías Silvanos', slug: 'vigias-silvanos' },
  { id: 'Argonitas', name: 'Argonitas', slug: 'argonitas' },
];

export const ChampionCompendiumView: React.FC<ChampionCompendiumViewProps> = ({
  allChampions,
  onEquipInSlot,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaction, setSelectedFaction] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [page, setPage] = useState(1);

  // Modal para ver datos detallados del campeón (estilo SendaPlays / Titus Plumanegra)
  const [activeChampionModal, setActiveChampionModal] = useState<ChampionData | null>(null);

  // Menú de asignación de ranura de escuadrón
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedChampToEquip, setSelectedChampToEquip] = useState<ChampionData | null>(null);

  // Conteo de campeones por facción
  const factionCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allChampions.length };
    allChampions.forEach((c) => {
      const f = c.spanishFaction || c.class?.faction || 'Desconocida';
      counts[f] = (counts[f] || 0) + 1;
    });
    return counts;
  }, [allChampions]);

  // Filtrado de campeones (por facción, rareza y texto de búsqueda en inglés/español)
  const filteredChamps = useMemo(() => {
    return allChampions.filter((c) => {
      const cFaction = c.spanishFaction || c.class?.faction || '';
      const matchesFaction = selectedFaction === 'all' || cFaction.toLowerCase() === selectedFaction.toLowerCase();

      const cRarity = c.class?.rarity?.toLowerCase() || '';
      const matchesRarity =
        selectedRarity === 'all' ||
        cRarity === selectedRarity.toLowerCase() ||
        (selectedRarity === 'Mythical' && (cRarity === 'mítico' || cRarity === 'mitico')) ||
        (selectedRarity === 'Legendary' && (cRarity === 'legendario' || cRarity === 'legendaria')) ||
        (selectedRarity === 'Epic' && (cRarity === 'épico' || cRarity === 'epico')) ||
        (selectedRarity === 'Rare' && (cRarity === 'raro' || cRarity === 'rara'));

      if (!matchesFaction || !matchesRarity) return false;

      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase().trim();
      return (
        c.name.toLowerCase().includes(term) ||
        (c.spanishName && c.spanishName.toLowerCase().includes(term)) ||
        (c.englishName && c.englishName.toLowerCase().includes(term)) ||
        cFaction.toLowerCase().includes(term) ||
        (c.sendaSlug && c.sendaSlug.toLowerCase().includes(term))
      );
    });
  }, [allChampions, selectedFaction, selectedRarity, searchTerm]);

  const pageCount = Math.ceil(filteredChamps.length / ITEMS_PER_PAGE);
  const displayedChamps = filteredChamps.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleOpenEquipMenu = (event: React.MouseEvent<HTMLButtonElement>, champ: ChampionData) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedChampToEquip(champ);
  };

  const handleCloseEquipMenu = () => {
    setAnchorEl(null);
    setSelectedChampToEquip(null);
  };

  const handleAssignToSlot = (slotIdx: number) => {
    if (selectedChampToEquip) {
      onEquipInSlot(selectedChampToEquip, slotIdx);
    }
    handleCloseEquipMenu();
  };

  const handleSelectFaction = (factionId: string) => {
    setSelectedFaction(factionId);
    setPage(1);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1440, margin: '0 auto' }}>
      {/* Breadcrumb estilo SendaPlays */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
          <Link
            underline="hover"
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setSelectedFaction('all');
              setSelectedRarity('all');
              setSearchTerm('');
              setPage(1);
            }}
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            🏠 Inicio
          </Link>
          <Link
            underline="hover"
            color={selectedFaction === 'all' ? '#eab308' : 'inherit'}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setSelectedFaction('all');
              setPage(1);
            }}
            sx={{ cursor: 'pointer', fontWeight: selectedFaction === 'all' ? 700 : 500 }}
          >
            Guías de Campeones
          </Link>
          {selectedFaction !== 'all' && (
            <Typography sx={{ color: '#facc15', fontWeight: 700, fontSize: '0.85rem' }}>
              {selectedFaction}
            </Typography>
          )}
        </Breadcrumbs>

        <Chip
          label={`${filteredChamps.length} Campeones Encontrados`}
          size="small"
          sx={{ backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#facc15', fontWeight: 700 }}
        />
      </Box>

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            color: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            fontSize: { xs: '1.5rem', md: '2rem' },
          }}
        >
          <GroupsIcon sx={{ fontSize: '2.4rem', color: '#eab308' }} />
          Guías de Campeones {selectedFaction !== 'all' ? `• Facción ${selectedFaction}` : ''}
        </Typography>
        <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem', mt: 0.5 }}>
          Explora la base de datos oficial de campeones, carátulas en alta resolución, atributos ideales de equipo, habilidades y equipamiento recomendado.
        </Typography>
      </Box>

      {/* Selector de Facciones (Listado de todas las facciones) */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', mb: 1, letterSpacing: '0.05em' }}>
          Filtrar por Facción:
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': { height: 6 },
            '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 3 },
          }}
        >
          {FACTIONS_LIST.map((fac) => {
            const count = factionCounts[fac.id] || 0;
            const isSelected = selectedFaction === fac.id;
            return (
              <Chip
                key={fac.id}
                label={`${fac.name} (${count})`}
                clickable
                onClick={() => handleSelectFaction(fac.id)}
                sx={{
                  flexShrink: 0,
                  backgroundColor: isSelected ? 'rgba(234, 179, 8, 0.22)' : 'rgba(30, 41, 59, 0.8)',
                  color: isSelected ? '#fde047' : '#cbd5e1',
                  fontWeight: isSelected ? 800 : 600,
                  border: '1px solid',
                  borderColor: isSelected ? '#eab308' : 'rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(234, 179, 8, 0.15)',
                    borderColor: 'rgba(234, 179, 8, 0.5)',
                  },
                }}
              />
            );
          })}
        </Box>
      </Box>

      {/* Buscador y Filtro por Rareza */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 3 }}>
        <TextField
          size="small"
          placeholder="Buscar por nombre (Esp/Ing), facción o rol..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          sx={{
            flex: { xs: '1 1 100%', sm: '0 0 340px' },
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
          {[
            { id: 'all', label: 'Todas las Rarezas' },
            { id: 'Mythical', label: 'Mítico' },
            { id: 'Legendary', label: 'Legendario' },
            { id: 'Epic', label: 'Épico' },
            { id: 'Rare', label: 'Raro' },
          ].map((rar) => (
            <Chip
              key={rar.id}
              label={rar.label}
              clickable
              onClick={() => {
                setSelectedRarity(rar.id);
                setPage(1);
              }}
              sx={{
                backgroundColor:
                  selectedRarity === rar.id
                    ? 'rgba(56, 189, 248, 0.2)'
                    : 'rgba(255, 255, 255, 0.05)',
                color: selectedRarity === rar.id ? '#38bdf8' : '#cbd5e1',
                fontWeight: 700,
                border: '1px solid',
                borderColor: selectedRarity === rar.id ? '#38bdf8' : 'transparent',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Grid de Campeones con Carátula Oficial y Datos */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 2.5 }}>
        {displayedChamps.map((c) => {
          const aura = detectChampionAura(c);
          const parsedSkills = parseChampionSkills(c);
          const displayName = c.spanishName || c.name;
          const altName = c.name !== displayName ? c.name : (c.englishName && c.englishName !== displayName ? c.englishName : null);
          const factionName = c.spanishFaction || c.class?.faction || 'Desconocida';

          return (
            <Box
              key={`${c.name}-${factionName}`}
              onClick={() => setActiveChampionModal(c)}
              sx={{
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: 2.5,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'rgba(234, 179, 8, 0.5)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                  transform: 'translateY(-3px)',
                },
              }}
            >
              <Box>
                {/* Header de la Tarjeta: Carátula Oficial + Nombre + Rareza */}
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 1.5 }}>
                  {/* Carátula Oficial del Campeón (Punto principal) */}
                  <Box sx={{ flexShrink: 0 }}>
                    <ChampionAvatar
                      name={displayName}
                      rarity={c.class?.rarity}
                      affinity={c.class?.affinity}
                      avatarUrl={c.avatarUrl}
                      size="lg"
                      showAffinity={true}
                    />
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: 800,
                            fontSize: '1.05rem',
                            color: '#f8fafc',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          title={displayName}
                        >
                          {displayName}
                        </Typography>
                        {altName && (
                          <Typography
                            sx={{
                              fontSize: '0.72rem',
                              color: '#94a3b8',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {altName}
                          </Typography>
                        )}
                      </Box>

                      <Chip
                        label={c.class?.rarity}
                        size="small"
                        sx={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          height: 20,
                          backgroundColor:
                            c.class?.rarity === 'Mythical'
                              ? 'rgba(236, 72, 153, 0.15)'
                              : c.class?.rarity === 'Legendary'
                              ? 'rgba(234, 179, 8, 0.15)'
                              : c.class?.rarity === 'Epic'
                              ? 'rgba(168, 85, 247, 0.15)'
                              : 'rgba(56, 189, 248, 0.15)',
                          color:
                            c.class?.rarity === 'Mythical'
                              ? '#f472b6'
                              : c.class?.rarity === 'Legendary'
                              ? '#facc15'
                              : c.class?.rarity === 'Epic'
                              ? '#c084fc'
                              : '#38bdf8',
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.5, flexWrap: 'wrap' }}>
                      <Chip
                        label={factionName}
                        size="small"
                        sx={{
                          fontSize: '0.65rem',
                          height: 18,
                          backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          color: '#cbd5e1',
                        }}
                      />
                      <Typography sx={{ fontSize: '0.7rem', color: '#64748b' }}>
                        • {c.class?.role || 'Tanque'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Estadísticas Base */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0.8, mb: 1.5 }}>
                  <Box sx={{ p: 0.6, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 1.5, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700 }}>VEL</Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 800 }}>{c.stats.spd || 100}</Typography>
                  </Box>
                  <Box sx={{ p: 0.6, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 1.5, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700 }}>DEF</Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 800 }}>{c.stats.def || 1000}</Typography>
                  </Box>
                  <Box sx={{ p: 0.6, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 1.5, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700 }}>HP</Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: '#f87171', fontWeight: 800 }}>{c.stats.hp || 15000}</Typography>
                  </Box>
                  <Box sx={{ p: 0.6, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 1.5, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700 }}>PUNT</Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: '#fcd34d', fontWeight: 800 }}>{c.stats.acc || 0}</Typography>
                  </Box>
                </Box>

                {/* Indicador de Aura */}
                {aura.hasAura ? (
                  <Box sx={{ p: 0.8, mb: 1, backgroundColor: 'rgba(234, 179, 8, 0.08)', borderRadius: 1.5, border: '1px solid rgba(234, 179, 8, 0.2)' }}>
                    <Typography sx={{ fontSize: '0.72rem', color: '#fde047', fontWeight: 700 }}>
                      👑 Aura: {aura.description}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ p: 0.6, mb: 1, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.68rem', color: '#64748b' }}>
                      ⚪ Sin Aura nativa
                    </Typography>
                  </Box>
                )}

                {/* Habilidades Resumidas */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {parsedSkills.slice(0, 3).map((sk) => (
                    <Box
                      key={sk.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.7rem',
                        p: 0.5,
                        borderRadius: 1,
                        backgroundColor: sk.isPassive ? 'rgba(56, 189, 248, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.68rem', color: sk.isPassive ? '#38bdf8' : '#eab308' }}>
                          {sk.alias}
                        </Typography>
                        <Typography sx={{ color: '#cbd5e1', fontSize: '0.7rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {sk.name}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.62rem', color: '#64748b', fontFamily: 'monospace' }}>
                        {sk.isPassive ? 'Pasiva' : `CD: ${sk.cooldown}T`}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Botones de Acción: Ver Ficha & Asignar */}
              <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', gap: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveChampionModal(c);
                  }}
                  sx={{
                    color: '#94a3b8',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    textTransform: 'none',
                    '&:hover': { borderColor: '#facc15', color: '#facc15' },
                  }}
                >
                  Ver Ficha / Guía
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  size="small"
                  startIcon={<AddCircleIcon sx={{ fontSize: '1rem' }} />}
                  onClick={(e) => handleOpenEquipMenu(e, c)}
                  sx={{
                    backgroundColor: 'rgba(56, 189, 248, 0.2)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(56, 189, 248, 0.35)',
                      borderColor: '#38bdf8',
                    },
                  }}
                >
                  Equipar
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Paginación */}
      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, val) => setPage(val)}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#cbd5e1',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(234, 179, 8, 0.2)',
                  color: '#facc15',
                  fontWeight: 800,
                },
              },
            }}
          />
        </Box>
      )}

      {/* Modal Detallado de Guía del Campeón (Estilo SendaPlays / Titus Plumanegra) */}
      {activeChampionModal && (
        <Dialog
          open={Boolean(activeChampionModal)}
          onClose={() => setActiveChampionModal(null)}
          maxWidth="md"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                backgroundColor: '#0a0f1d',
                backgroundImage: 'radial-gradient(circle at top right, rgba(234, 179, 8, 0.08), transparent 70%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 3,
                color: '#f8fafc',
                p: { xs: 1.5, sm: 2.5 },
              },
            },
          }}
        >
          {/* Header del Modal */}
          <DialogTitle sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                Guía Oficial • {activeChampionModal.spanishFaction || activeChampionModal.class?.faction}
              </Typography>
            </Box>
            <IconButton onClick={() => setActiveChampionModal(null)} sx={{ color: '#94a3b8', '&:hover': { color: '#f8fafc' } }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: { xs: 1, sm: 2 } }}>
            {/* Cabecera Hero con Carátula Grande y Estadísticas Exactas */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
                p: 2.5,
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                borderRadius: 2.5,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                mb: 3,
              }}
            >
              {/* Carátula Grande Oficial */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <ChampionAvatar
                  name={activeChampionModal.spanishName || activeChampionModal.name}
                  rarity={activeChampionModal.class?.rarity}
                  affinity={activeChampionModal.class?.affinity}
                  avatarUrl={activeChampionModal.avatarUrl}
                  size="lg"
                  showAffinity={false}
                />
                <Chip
                  label={activeChampionModal.class?.rarity}
                  size="small"
                  sx={{
                    fontWeight: 800,
                    fontSize: '0.7rem',
                    backgroundColor: 'rgba(234, 179, 8, 0.2)',
                    color: '#facc15',
                    border: '1px solid rgba(234, 179, 8, 0.4)',
                  }}
                />
              </Box>

              {/* Datos Generales y Stats */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                    {activeChampionModal.spanishName || activeChampionModal.name}
                  </Typography>
                  <Chip
                    label={activeChampionModal.sendaGuide?.role || activeChampionModal.class?.role || 'Defensa'}
                    size="small"
                    sx={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#e2e8f0', fontWeight: 700 }}
                  />
                  <Chip
                    label={`Afinidad: ${activeChampionModal.class?.affinity || 'Void'}`}
                    size="small"
                    sx={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', fontWeight: 700 }}
                  />
                </Box>

                {activeChampionModal.englishName && activeChampionModal.englishName !== activeChampionModal.name && (
                  <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', mb: 2 }}>
                    Nombre en inglés: <strong>{activeChampionModal.englishName}</strong>
                  </Typography>
                )}

                {/* Grid de Estadísticas Completas */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(4, 1fr)', sm: 'repeat(8, 1fr)' },
                    gap: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.35)',
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 700 }}>HP</Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#f87171', fontWeight: 800 }}>{activeChampionModal.stats.hp}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 700 }}>VEL</Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 800 }}>{activeChampionModal.stats.spd}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 700 }}>ATK</Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#fb923c', fontWeight: 800 }}>{activeChampionModal.stats.atk}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 700 }}>DEF</Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 800 }}>{activeChampionModal.stats.def}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 700 }}>PUNT</Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#fcd34d', fontWeight: 800 }}>{activeChampionModal.stats.acc}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 700 }}>P. CRÍT</Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 800 }}>{activeChampionModal.stats.crate}%</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 700 }}>D. CRÍT</Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 800 }}>{activeChampionModal.stats.cmdg || 50}%</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 700 }}>RES</Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#a78bfa', fontWeight: 800 }}>{activeChampionModal.stats.resist}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Función y Usos (Guía SendaPlays) */}
            {(activeChampionModal.sendaGuide?.role || activeChampionModal.sendaGuide?.uses) && (
              <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {activeChampionModal.sendaGuide.role && (
                  <Box sx={{ p: 2, backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 2, borderLeft: '4px solid #eab308' }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#facc15', textTransform: 'uppercase', mb: 0.5 }}>
                      FUNCIÓN
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                      {activeChampionModal.sendaGuide.role}
                    </Typography>
                  </Box>
                )}

                {activeChampionModal.sendaGuide.uses && (
                  <Box sx={{ p: 2, backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 2, borderLeft: '4px solid #38bdf8' }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', mb: 0.5 }}>
                      USOS RECOMENDADOS
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                      {activeChampionModal.sendaGuide.uses}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Atributos de Equipo Ideales (Recomendaciones de SendaPlays) */}
            {activeChampionModal.sendaGuide?.equipment && (
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShieldIcon sx={{ fontSize: '1.1rem', color: '#eab308' }} />
                  Atributos de Equipo Ideales (Guía SendaPlays)
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' }, gap: 1.5 }}>
                  {Object.entries(activeChampionModal.sendaGuide.equipment).map(([slotKey, slotData]) => {
                    if (slotKey === 'note') return null;
                    const dataObj = slotData as { stat?: string; note?: string };
                    const slotNames: Record<string, string> = {
                      weapon: 'Arma',
                      helmet: 'Casco',
                      shield: 'Escudo',
                      gloves: 'Guantes',
                      chest: 'Pecho',
                      boots: 'Botas',
                      ring: 'Anillo',
                      amulet: 'Amuleto',
                      banner: 'Estandarte',
                    };
                    return (
                      <Box
                        key={slotKey}
                        sx={{
                          p: 1.2,
                          backgroundColor: 'rgba(15, 23, 42, 0.6)',
                          borderRadius: 1.5,
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                          {slotNames[slotKey] || slotKey}
                        </Typography>
                        <Typography sx={{ fontSize: '0.85rem', color: '#facc15', fontWeight: 800 }}>
                          {dataObj.stat || 'Estadística'}
                        </Typography>
                        {dataObj.note && (
                          <Typography sx={{ fontSize: '0.68rem', color: '#64748b', mt: 0.2 }}>
                            {dataObj.note}
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* Sets Recomendados */}
            {activeChampionModal.sendaGuide?.gear && activeChampionModal.sendaGuide.gear.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', mb: 1 }}>
                  Sets de Artefactos Sugeridos:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {activeChampionModal.sendaGuide.gear.map((g) => (
                    <Chip
                      key={g}
                      label={g.toUpperCase()}
                      size="small"
                      sx={{ backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#facc15', fontWeight: 700 }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Habilidades Completas */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', mb: 1.5 }}>
                Habilidades y Mecánicas
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {(activeChampionModal.skills || []).map((sk, idx) => {
                  const isPassive =
                    sk.name?.toLowerCase().includes('pasiv') ||
                    (sk.passive && (Array.isArray(sk.passive) ? sk.passive.length > 0 : Boolean(sk.passive))) ||
                    (sk.cooldown === 0 && idx > 0);
                  const alias = isPassive ? 'Pasiva' : `A${idx + 1}`;
                  return (
                    <Box
                      key={`${sk.name}-${idx}`}
                      sx={{
                        p: 1.5,
                        backgroundColor: 'rgba(15, 23, 42, 0.65)',
                        borderRadius: 2,
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={alias}
                            size="small"
                            sx={{
                              fontWeight: 800,
                              backgroundColor: isPassive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                              color: isPassive ? '#38bdf8' : '#facc15',
                            }}
                          />
                          <Typography sx={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.9rem' }}>
                            {sk.name}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                          {isPassive ? 'Pasiva' : `Cooldown: ${sk.cooldown || 0} turnos`}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5, mt: 1 }}>
                        {sk.description || 'Sin descripción disponible.'}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Enlaces y Acciones */}
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              {activeChampionModal.sendaSlug && (
                <Button
                  component="a"
                  href={`https://www.sendaplays.com/guias-de-campeones/${activeChampionModal.spanishFaction ? activeChampionModal.spanishFaction.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-') : 'hidalgos'}/${activeChampionModal.sendaSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  startIcon={<OpenInNewIcon />}
                  sx={{ color: '#facc15', borderColor: 'rgba(234, 179, 8, 0.4)', fontWeight: 700 }}
                >
                  Ver Guía Original en SendaPlays
                </Button>
              )}

              {activeChampionModal.sendaGuide?.youtubeLink && (
                <Button
                  component="a"
                  href={activeChampionModal.sendaGuide.youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  startIcon={<YouTubeIcon />}
                  sx={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.4)', fontWeight: 700 }}
                >
                  Ver Video en YouTube
                </Button>
              )}

              <Box sx={{ ml: 'auto' }}>
                <Button
                  variant="contained"
                  startIcon={<AddCircleIcon />}
                  onClick={(e) => handleOpenEquipMenu(e, activeChampionModal)}
                  sx={{
                    backgroundColor: '#eab308',
                    color: '#000000',
                    fontWeight: 800,
                    '&:hover': { backgroundColor: '#facc15' },
                  }}
                >
                  Equipar en Escuadrón
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}

      {/* Menú de Ranuras de Escuadrón (Slot 1-5) */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseEquipMenu}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              minWidth: 200,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
            Asignar a Ranura de Escuadrón:
          </Typography>
        </Box>
        {[0, 1, 2, 3, 4].map((slotIdx) => (
          <MenuItem
            key={slotIdx}
            onClick={() => handleAssignToSlot(slotIdx)}
            sx={{
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#f1f5f9',
              py: 1,
              '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' },
            }}
          >
            {slotIdx === 0 ? '👑 Ranura 1 (Líder del Equipo)' : `Ranura ${slotIdx + 1}`}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
