import { useMemo, useState } from 'react';
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { navigationItems } from '../../utils/navigation';
import { useAppContext } from '../../context/AppContext';

const drawerWidth = 280;
const collapsedWidth = 88;

export default function MainLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { mode, toggleColorMode } = useAppContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const currentDrawerWidth = useMemo(() => (collapsed ? collapsedWidth : drawerWidth), [collapsed]);

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      <Toolbar sx={{ px: 2, display: 'flex', justifyContent: collapsed ? 'center' : 'space-between' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <AccountBalanceWalletRoundedIcon color="primary" />
          {!collapsed && (
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                Control de Gastos
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Operaciones y ventas
              </Typography>
            </Box>
          )}
        </Stack>
        {!isMobile && (
          <IconButton size="small" onClick={() => setCollapsed((current) => !current)}>
            <ChevronLeftRoundedIcon
              sx={{
                transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease-in-out',
              }}
            />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {navigationItems.map((item) => {
          const selected = pathname === item.path;
          const Icon = item.icon;

          return (
            <Tooltip title={collapsed ? item.label : ''} placement="right" key={item.path}>
              <ListItemButton
                selected={selected}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  mb: 1,
                  minHeight: 50,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 2,
                }}
              >
                <ListItemIcon sx={{ minWidth: collapsed ? 0 : 42, color: 'inherit', justifyContent: 'center' }}>
                  <Icon />
                </ListItemIcon>
                {!collapsed && <ListItemText primary={item.label} />}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { md: `${currentDrawerWidth}px` },
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {isMobile && (
              <IconButton edge="start" onClick={() => setMobileOpen(true)}>
                <MenuRoundedIcon />
              </IconButton>
            )}
            <Box>
              <Typography variant="h6">Sistema de Control Operativo</Typography>
              <Typography variant="caption" color="text.secondary">
                Gestión de compras, ventas, gastos e inventario
              </Typography>
            </Box>
          </Stack>
          <Tooltip title={mode === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}>
            <IconButton onClick={toggleColorMode}>
              {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: currentDrawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: currentDrawerWidth,
              boxSizing: 'border-box',
              transition: theme.transitions.create('width', {
                duration: theme.transitions.duration.standard,
              }),
              overflowX: 'hidden',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          p: { xs: 2, md: 4 },
          pt: { xs: 11, md: 13 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
