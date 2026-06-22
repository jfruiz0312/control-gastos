import { useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PRODUCT_CATEGORY_OPTIONS } from '../../utils/catalogs';

const productSchema = yup.object({
  codigo: yup.string().required('El código es obligatorio'),
  nombre: yup.string().required('El nombre es obligatorio'),
  descripcion: yup.string(),
  categoria: yup.string().required('La categoría es obligatoria'),
  precioCompra: yup
    .number()
    .typeError('Debe ser un número válido')
    .positive('Debe ser un valor positivo')
    .required('El precio de compra es obligatorio'),
  precioVenta: yup
    .number()
    .typeError('Debe ser un número válido')
    .positive('Debe ser un valor positivo')
    .required('El precio de venta es obligatorio'),
  stock: yup
    .number()
    .typeError('Debe ser un número válido')
    .min(0, 'No puede ser negativo')
    .required('El stock es obligatorio'),
  stockMinimo: yup
    .number()
    .typeError('Debe ser un número válido')
    .min(0, 'No puede ser negativo')
    .required('El stock mínimo es obligatorio'),
  estado: yup.boolean().default(true),
});

const defaultValues = {
  codigo: '',
  nombre: '',
  descripcion: '',
  categoria: '',
  precioCompra: '',
  precioVenta: '',
  stock: 0,
  stockMinimo: 0,
  estado: true,
};

export default function ProductFormDialog({ open, initialValues, onClose, onSubmit }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(initialValues ? { ...defaultValues, ...initialValues } : defaultValues);
  }, [initialValues, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initialValues?.id ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.25 }}>
          {[
            { name: 'codigo', label: 'Código', md: 4 },
            { name: 'nombre', label: 'Nombre', md: 8 },
            { name: 'descripcion', label: 'Descripción', md: 12, multiline: true, rows: 3 },
          ].map((field) => (
            <Grid key={field.name} size={{ xs: 12, md: field.md }}>
              <Controller
                name={field.name}
                control={control}
                render={({ field: controllerField }) => (
                  <TextField
                    {...controllerField}
                    label={field.label}
                    fullWidth
                    multiline={field.multiline}
                    rows={field.rows}
                    error={Boolean(errors[field.name])}
                    helperText={errors[field.name]?.message}
                  />
                )}
              />
            </Grid>
          ))}

          <Grid size={{ xs: 12, md: 4 }}>
            <Controller
              name="categoria"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Categoría"
                  fullWidth
                  error={Boolean(errors.categoria)}
                  helperText={errors.categoria?.message}
                >
                  {PRODUCT_CATEGORY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Controller
              name="precioCompra"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Precio compra"
                  type="number"
                  fullWidth
                  error={Boolean(errors.precioCompra)}
                  helperText={errors.precioCompra?.message}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Controller
              name="precioVenta"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Precio venta"
                  type="number"
                  fullWidth
                  error={Boolean(errors.precioVenta)}
                  helperText={errors.precioVenta?.message}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Stock"
                  type="number"
                  fullWidth
                  error={Boolean(errors.stock)}
                  helperText={errors.stock?.message}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Controller
              name="stockMinimo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Stock mínimo"
                  type="number"
                  fullWidth
                  error={Boolean(errors.stockMinimo)}
                  helperText={errors.stockMinimo?.message}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Controller
              name="estado"
              control={control}
              render={({ field }) => (
                <Stack justifyContent="center" sx={{ height: '100%' }}>
                  <FormControlLabel
                    control={<Switch checked={field.value} onChange={(event) => field.onChange(event.target.checked)} />}
                    label="Producto activo"
                  />
                </Stack>
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
