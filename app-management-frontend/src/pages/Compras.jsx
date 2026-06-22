import { useCallback, useMemo } from 'react';
import { Grid } from '@mui/material';
import { obtenerCompras, registrarCompra } from '../api/compraApi';
import { obtenerProductos } from '../api/productoApi';
import PageHeader from '../components/common/PageHeader';
import PurchaseForm from '../components/forms/PurchaseForm';
import RecentTransactionsTable from '../components/tables/RecentTransactionsTable';
import { useAppContext } from '../context/AppContext';
import useAsyncData from '../hooks/useAsyncData';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const normalizeProduct = (item, index) => ({
  id: item.id ?? item.codigo ?? `${index + 1}`,
  nombre: item.nombre ?? '',
  precioCompra: Number(item.precioCompra ?? 0),
});

const normalizePurchase = (item, index) => ({
  id: item.id ?? `${index + 1}`,
  proveedor: item.proveedor ?? 'Proveedor',
  fecha: item.fechaCompra,
  totalCompra: Number(item.subtotalCompra ?? 0),
  costoOperativo: Number(item.totalGastosAsociados ?? 0),
  costoReal: Number(item.totalCompra ?? 0),
});

export default function Compras() {
  const { showSnackbar } = useAppContext();

  const loadData = useCallback(async () => {
    const [productsResponse, purchasesResponse] = await Promise.all([obtenerProductos(), obtenerCompras()]);

    return {
      products: productsResponse.map(normalizeProduct),
      purchases: purchasesResponse.map(normalizePurchase),
    };
  }, []);

  const { data, reload } = useAsyncData(loadData, {
    initialData: {
      products: [],
      purchases: [],
    },
  });

  const columns = [
    { field: 'proveedor', headerName: 'Proveedor', flex: 1.5, minWidth: 180 },
    { field: 'fecha', headerName: 'Fecha', flex: 1, minWidth: 150, valueFormatter: (value) => formatDateTime(value) },
    {
      field: 'totalCompra',
      headerName: 'Total compra',
      flex: 1,
      minWidth: 150,
      valueFormatter: (value) => formatCurrency(value),
    },
    {
      field: 'costoOperativo',
      headerName: 'Costo operativo',
      flex: 1,
      minWidth: 160,
      valueFormatter: (value) => formatCurrency(value),
    },
    {
      field: 'costoReal',
      headerName: 'Costo real',
      flex: 1,
      minWidth: 140,
      valueFormatter: (value) => formatCurrency(value),
    },
  ];

  const purchases = useMemo(() => data.purchases.slice(0, 10), [data.purchases]);

  const handleSubmit = async (payload) => {
    await registrarCompra(payload);
    showSnackbar('Compra registrada correctamente', 'success');
    reload();
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <PageHeader
          title="Compras"
          subtitle="Registra compras con detalle de productos, costos asociados y valor real de abastecimiento."
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <PurchaseForm products={data.products} onSubmit={handleSubmit} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <RecentTransactionsTable
          title="Historial de compras"
          subtitle="Últimas compras registradas en el sistema."
          rows={purchases}
          columns={columns}
        />
      </Grid>
    </Grid>
  );
}
