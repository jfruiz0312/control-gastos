import { useCallback, useMemo } from 'react';
import { Grid } from '@mui/material';
import { obtenerProductos } from '../api/productoApi';
import { obtenerVentas, registrarVenta } from '../api/ventaApi';
import PageHeader from '../components/common/PageHeader';
import SalesForm from '../components/forms/SalesForm';
import RecentTransactionsTable from '../components/tables/RecentTransactionsTable';
import { useAppContext } from '../context/AppContext';
import useAsyncData from '../hooks/useAsyncData';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const normalizeProduct = (item, index) => ({
  id: item.id ?? item.codigo ?? `${index + 1}`,
  nombre: item.nombre ?? '',
  precioCompra: Number(item.precioCompra ?? 0),
  precioVenta: Number(item.precioVenta ?? 0),
});

const normalizeSale = (item, index) => ({
  id: item.id ?? `${index + 1}`,
  cliente: item.cliente ?? 'Cliente general',
  fecha: item.fechaVenta,
  subtotal: Number(
    item.detalles?.reduce((total, detail) => total + Number(detail.subtotalVenta ?? 0), 0) ?? item.totalVenta ?? 0,
  ),
  total: Number(item.totalVenta ?? 0),
  gananciaEstimada: Number(item.gananciaTotal ?? 0),
});

export default function Ventas() {
  const { showSnackbar } = useAppContext();

  const loadData = useCallback(async () => {
    const [productsResponse, salesResponse] = await Promise.all([obtenerProductos(), obtenerVentas()]);

    return {
      products: productsResponse.map(normalizeProduct),
      sales: salesResponse.map(normalizeSale),
    };
  }, []);

  const { data, reload } = useAsyncData(loadData, {
    initialData: {
      products: [],
      sales: [],
    },
  });

  const columns = [
    { field: 'cliente', headerName: 'Cliente', flex: 1.4, minWidth: 180 },
    { field: 'fecha', headerName: 'Fecha', flex: 1, minWidth: 150, valueFormatter: (value) => formatDateTime(value) },
    { field: 'subtotal', headerName: 'Subtotal', flex: 1, minWidth: 140, valueFormatter: (value) => formatCurrency(value) },
    { field: 'total', headerName: 'Total', flex: 1, minWidth: 140, valueFormatter: (value) => formatCurrency(value) },
    {
      field: 'gananciaEstimada',
      headerName: 'Ganancia estimada',
      flex: 1,
      minWidth: 170,
      valueFormatter: (value) => formatCurrency(value),
    },
  ];

  const sales = useMemo(() => data.sales.slice(0, 10), [data.sales]);

  const handleSubmit = async (payload) => {
    await registrarVenta(payload);
    showSnackbar('Venta registrada correctamente', 'success');
    reload();
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <PageHeader
          title="Ventas"
          subtitle="Gestiona ventas con cálculo automático de subtotal, total y rentabilidad estimada."
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <SalesForm products={data.products} onSubmit={handleSubmit} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <RecentTransactionsTable
          title="Historial de ventas"
          subtitle="Últimos movimientos comerciales del sistema."
          rows={sales}
          columns={columns}
        />
      </Grid>
    </Grid>
  );
}
