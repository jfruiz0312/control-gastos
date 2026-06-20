import { useCallback, useMemo } from 'react';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import { Grid } from '@mui/material';
import dayjs from 'dayjs';
import { obtenerCompras } from '../api/compraApi';
import { obtenerGastos } from '../api/gastoApi';
import { obtenerProductos } from '../api/productoApi';
import { obtenerVentas } from '../api/ventaApi';
import PageHeader from '../components/common/PageHeader';
import SummaryCard from '../components/common/SummaryCard';
import TrendChartCard from '../components/dashboard/TrendChartCard';
import RecentTransactionsTable from '../components/tables/RecentTransactionsTable';
import useAsyncData from '../hooks/useAsyncData';
import { formatCurrency, formatDateTime, formatNumber, sumBy } from '../utils/formatters';

const getId = (item, index) => item.id ?? item.codigo ?? item.productoId ?? `${index + 1}`;

const monthKeys = Array.from({ length: 6 }).map((_, index) => dayjs().subtract(5 - index, 'month').format('YYYY-MM'));

export default function Dashboard() {
  const loadDashboard = useCallback(async () => {
    const [productos, compras, ventas, gastos] = await Promise.all([
      obtenerProductos(),
      obtenerCompras(),
      obtenerVentas(),
      obtenerGastos(),
    ]);

    return { productos, compras, ventas, gastos };
  }, []);

  const { data } = useAsyncData(loadDashboard, {
    initialData: {
      productos: [],
      compras: [],
      ventas: [],
      gastos: [],
    },
  });

  const metrics = useMemo(() => {
    const totalCompras = sumBy(data.compras, (item) => item.totalCompra ?? item.total ?? item.montoTotal);
    const totalVentas = sumBy(data.ventas, (item) => item.total ?? item.totalVenta);
    const gastosOperativos = sumBy(data.gastos, (item) => item.monto ?? item.valor);
    const inventario = sumBy(data.productos, (item) => item.stock ?? item.existencias ?? 0);
    const gananciaNeta = totalVentas - totalCompras - gastosOperativos;

    return { totalCompras, totalVentas, gastosOperativos, inventario, gananciaNeta };
  }, [data]);

  const salesDataset = useMemo(
    () =>
      monthKeys.map((key) =>
        sumBy(
          data.ventas.filter((item) => dayjs(item.fecha ?? item.createdAt).format('YYYY-MM') === key),
          (item) => item.total ?? item.totalVenta,
        ),
      ),
    [data.ventas],
  );

  const expenseDataset = useMemo(
    () =>
      monthKeys.map((key) =>
        sumBy(
          data.gastos.filter((item) => dayjs(item.fecha ?? item.createdAt).format('YYYY-MM') === key),
          (item) => item.monto ?? item.valor,
        ),
      ),
    [data.gastos],
  );

  const salesRows = useMemo(
    () =>
      data.ventas.slice(0, 5).map((item, index) => ({
        id: getId(item, index),
        cliente: item.cliente ?? item.nombreCliente ?? 'Cliente general',
        fecha: item.fecha ?? item.createdAt,
        total: item.total ?? item.totalVenta ?? 0,
      })),
    [data.ventas],
  );

  const purchaseRows = useMemo(
    () =>
      data.compras.slice(0, 5).map((item, index) => ({
        id: getId(item, index),
        proveedor: item.proveedor ?? item.nombreProveedor ?? 'Proveedor',
        fecha: item.fecha ?? item.createdAt,
        total: item.totalCompra ?? item.total ?? 0,
      })),
    [data.compras],
  );

  const salesColumns = [
    { field: 'cliente', headerName: 'Cliente', flex: 1.4, minWidth: 180 },
    { field: 'fecha', headerName: 'Fecha', flex: 1, minWidth: 150, valueFormatter: (value) => formatDateTime(value) },
    { field: 'total', headerName: 'Total', flex: 1, minWidth: 140, valueFormatter: (value) => formatCurrency(value) },
  ];

  const purchaseColumns = [
    { field: 'proveedor', headerName: 'Proveedor', flex: 1.4, minWidth: 180 },
    { field: 'fecha', headerName: 'Fecha', flex: 1, minWidth: 150, valueFormatter: (value) => formatDateTime(value) },
    { field: 'total', headerName: 'Total', flex: 1, minWidth: 140, valueFormatter: (value) => formatCurrency(value) },
  ];

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <PageHeader
          title="Dashboard"
          subtitle="Visualiza indicadores clave del negocio, tendencias operativas y movimientos recientes."
        />
      </Grid>

      {[
        {
          title: 'Total Compras',
          value: formatCurrency(metrics.totalCompras),
          subtitle: 'Compras registradas',
          icon: LocalShippingRoundedIcon,
        },
        {
          title: 'Total Ventas',
          value: formatCurrency(metrics.totalVentas),
          subtitle: 'Ventas acumuladas',
          icon: ShoppingBagRoundedIcon,
          color: 'secondary.main',
        },
        {
          title: 'Gastos Operativos',
          value: formatCurrency(metrics.gastosOperativos),
          subtitle: 'Costo operativo total',
          icon: PaymentsRoundedIcon,
          color: 'warning.main',
        },
        {
          title: 'Ganancia Neta',
          value: formatCurrency(metrics.gananciaNeta),
          subtitle: 'Ventas - compras - gastos',
          icon: AttachMoneyRoundedIcon,
          color: metrics.gananciaNeta >= 0 ? 'success.main' : 'error.main',
        },
        {
          title: 'Inventario',
          value: formatNumber(metrics.inventario),
          subtitle: 'Unidades disponibles',
          icon: InventoryRoundedIcon,
        },
      ].map((card) => (
        <Grid size={{ xs: 12, sm: 6, xl: 2.4 }} key={card.title}>
          <SummaryCard {...card} />
        </Grid>
      ))}

      <Grid size={{ xs: 12, lg: 7 }}>
        <TrendChartCard
          title="Tendencia de ventas"
          subtitle="Comportamiento mensual de las ventas en los últimos 6 meses."
          labels={monthKeys.map((item) => dayjs(`${item}-01`).format('MMM YY'))}
          data={salesDataset}
          type="line"
          color="#1976d2"
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 5 }}>
        <TrendChartCard
          title="Tendencia de gastos"
          subtitle="Distribución mensual de gastos operativos."
          labels={monthKeys.map((item) => dayjs(`${item}-01`).format('MMM YY'))}
          data={expenseDataset}
          type="bar"
          color="#009688"
        />
      </Grid>

      <Grid size={{ xs: 12, xl: 6 }}>
        <RecentTransactionsTable
          title="Últimas ventas"
          subtitle="Movimientos comerciales más recientes."
          rows={salesRows}
          columns={salesColumns}
        />
      </Grid>
      <Grid size={{ xs: 12, xl: 6 }}>
        <RecentTransactionsTable
          title="Últimas compras"
          subtitle="Órdenes de abastecimiento registradas."
          rows={purchaseRows}
          columns={purchaseColumns}
        />
      </Grid>
    </Grid>
  );
}
