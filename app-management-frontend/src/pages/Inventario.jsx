import { useCallback } from 'react';
import { Grid } from '@mui/material';
import { obtenerProductos } from '../api/productoApi';
import PageHeader from '../components/common/PageHeader';
import InventoryTable from '../components/tables/InventoryTable';
import useAsyncData from '../hooks/useAsyncData';

const normalizeInventory = (item, index) => ({
  id: item.id ?? item.codigo ?? `${index + 1}`,
  codigo: item.codigo ?? item.code ?? '',
  nombre: item.nombre ?? item.name ?? '',
  categoria: item.categoria ?? item.category ?? 'General',
  entradas: Number(item.entradas ?? item.stockInicial ?? item.stock ?? 0),
  salidas: Number(item.salidas ?? item.unidadesVendidas ?? 0),
  existencias: Number(item.existencias ?? item.stock ?? 0),
});

export default function Inventario() {
  const loadInventory = useCallback(async () => {
    const response = await obtenerProductos();
    return response.map(normalizeInventory);
  }, []);

  const { data } = useAsyncData(loadInventory, { initialData: [] });

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <PageHeader
          title="Inventario"
          subtitle="Monitorea entradas, salidas y existencias con búsqueda, filtros y paginación."
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <InventoryTable rows={data} />
      </Grid>
    </Grid>
  );
}
