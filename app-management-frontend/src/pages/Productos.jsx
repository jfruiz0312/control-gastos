import { useCallback, useMemo, useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Button, Grid } from '@mui/material';
import { actualizarProducto, crearProducto, eliminarProducto, obtenerProductos } from '../api/productoApi';
import ConfirmDialog from '../components/common/ConfirmDialog';
import PageHeader from '../components/common/PageHeader';
import ProductFormDialog from '../components/forms/ProductFormDialog';
import ProductTable from '../components/tables/ProductTable';
import { useAppContext } from '../context/AppContext';
import useAsyncData from '../hooks/useAsyncData';

const normalizeProduct = (item, index) => ({
  id: item.id ?? item.codigo ?? `${index + 1}`,
  codigo: item.codigo ?? '',
  nombre: item.nombre ?? '',
  descripcion: item.descripcion ?? '',
  categoria: item.categoriaProducto ?? '',
  precioCompra: Number(item.precioCompra ?? 0),
  precioVenta: Number(item.precioVenta ?? 0),
  stock: Number(item.stockActual ?? 0),
  stockMinimo: Number(item.stockMinimo ?? 0),
  estado: Boolean(item.activo ?? true),
});

export default function Productos() {
  const { showSnackbar } = useAppContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const loadProducts = useCallback(async () => {
    const response = await obtenerProductos();
    return response.map(normalizeProduct);
  }, []);

  const { data: products, setData: setProducts, reload } = useAsyncData(loadProducts, { initialData: [] });

  const handleCreate = () => {
    setSelectedProduct(null);
    setDialogOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleSave = async (formValues) => {
    const payload = {
      codigo: formValues.codigo,
      nombre: formValues.nombre,
      descripcion: formValues.descripcion,
      categoriaProducto: formValues.categoria,
      precioCompra: Number(formValues.precioCompra),
      precioVenta: Number(formValues.precioVenta),
      stockActual: Number(formValues.stock),
      stockMinimo: Number(formValues.stockMinimo),
      activo: Boolean(formValues.estado),
    };

    if (selectedProduct?.id) {
      await actualizarProducto(selectedProduct.id, payload);
      showSnackbar('Producto actualizado correctamente', 'success');
    } else {
      await crearProducto(payload);
      showSnackbar('Producto creado correctamente', 'success');
    }

    setDialogOpen(false);
    reload();
  };

  const handleDelete = async () => {
    if (!productToDelete) {
      return;
    }

    await eliminarProducto(productToDelete.id);
    setProducts((currentRows) => currentRows.filter((item) => item.id !== productToDelete.id));
    setProductToDelete(null);
    showSnackbar('Producto eliminado correctamente', 'success');
  };

  const rows = useMemo(() => products, [products]);

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <PageHeader
          title="Productos"
          subtitle="Administra el catálogo de productos, sus precios y el estado de disponibilidad."
          action={
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={handleCreate}>
              Nuevo producto
            </Button>
          }
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ProductTable rows={rows} onEdit={handleEdit} onDelete={setProductToDelete} />
      </Grid>

      <ProductFormDialog
        open={dialogOpen}
        initialValues={selectedProduct}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        open={Boolean(productToDelete)}
        title="Eliminar producto"
        description={`Se eliminará el producto "${productToDelete?.nombre || ''}". Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDelete}
      />
    </Grid>
  );
}
