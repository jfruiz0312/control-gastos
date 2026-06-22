import { useCallback } from 'react';
import { Grid } from '@mui/material';
import { obtenerProductos } from '../api/productoApi';
import PageHeader from '../components/common/PageHeader';
import InventoryTable from '../components/tables/InventoryTable';
import useAsyncData from '../hooks/useAsyncData';

const normalizeInventory = (item, index) => ({
  id: item.id ?? item.codigo ?? `${index + 1}`,
  codigo: item.codigo ?? '',
  nombre: item.nombre ?? '',
  categoria: item.categoriaProducto ?? '',
  stockActual: Number(item.stockActual ?? 0),
  stockMinimo: Number(item.stockMinimo ?? 0),
  valorCosto: Number(item.stockActual ?? 0) * Number(item.precioCompra ?? 0),
  valorVenta: Number(item.stockActual ?? 0) * Number(item.precioVenta ?? 0),
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
          subtitle="Monitorea existencias, stock mínimo y valorización del inventario con búsqueda y paginación."
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <InventoryTable rows={data} />
      </Grid>
    </Grid>
  );
}
