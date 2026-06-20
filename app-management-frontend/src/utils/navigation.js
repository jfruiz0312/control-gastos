import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import WarehouseRoundedIcon from '@mui/icons-material/WarehouseRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';

export const navigationItems = [
  { label: 'Dashboard', path: '/dashboard', icon: DashboardRoundedIcon },
  { label: 'Productos', path: '/productos', icon: Inventory2RoundedIcon },
  { label: 'Compras', path: '/compras', icon: ShoppingCartRoundedIcon },
  { label: 'Ventas', path: '/ventas', icon: PointOfSaleRoundedIcon },
  { label: 'Gastos', path: '/gastos', icon: ReceiptLongRoundedIcon },
  { label: 'Inventario', path: '/inventario', icon: WarehouseRoundedIcon },
  { label: 'Reportes', path: '/reportes', icon: QueryStatsRoundedIcon },
];
