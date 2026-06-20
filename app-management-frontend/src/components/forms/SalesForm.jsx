import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { formatCurrency } from '../../utils/formatters';

const schema = yup.object({
  cliente: yup.string().required('El cliente es obligatorio'),
  detalles: yup
    .array()
    .of(
      yup.object({
        producto: yup.object().required('El producto es obligatorio'),
        cantidad: yup
          .number()
          .typeError('Debe ser un número válido')
          .positive('Debe ser un valor positivo')
          .required('La cantidad es obligatoria'),
        precioVenta: yup
          .number()
          .typeError('Debe ser un número válido')
          .positive('Debe ser un valor positivo')
          .required('El precio de venta es obligatorio'),
      }),
    )
    .min(1, 'Debe agregar al menos un producto'),
});

const defaultValues = {
  cliente: '',
  detalles: [{ producto: null, cantidad: 1, precioVenta: '' }],
};

export default function SalesForm({ products, onSubmit }) {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'detalles',
  });

  const details = watch('detalles');
  const subtotal = details.reduce((total, item) => total + Number(item?.cantidad || 0) * Number(item?.precioVenta || 0), 0);
  const total = subtotal;
  const gananciaEstimada = details.reduce((sum, item) => {
    const costo = Number(item?.producto?.precioCompra || 0);
    const precioVenta = Number(item?.precioVenta || 0);
    return sum + Number(item?.cantidad || 0) * (precioVenta - costo);
  }, 0);

  const submitHandler = async (values) => {
    await onSubmit({
      cliente: values.cliente,
      detalles: values.detalles.map((item) => ({
        productoId: item.producto?.id,
        cantidad: Number(item.cantidad),
        precioVenta: Number(item.precioVenta),
      })),
      subtotal,
      total,
      gananciaEstimada,
    });

    reset(defaultValues);
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6">Registrar venta</Typography>
            <Typography variant="body2" color="text.secondary">
              Registra ventas y calcula automáticamente subtotal, total y ganancia estimada.
            </Typography>
          </Box>

          <Controller
            name="cliente"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Cliente"
                fullWidth
                error={Boolean(errors.cliente)}
                helperText={errors.cliente?.message}
              />
            )}
          />

          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">Detalle de venta</Typography>
              <Button startIcon={<AddRoundedIcon />} onClick={() => append({ producto: null, cantidad: 1, precioVenta: '' })}>
                Agregar línea
              </Button>
            </Stack>

            {fields.map((field, index) => (
              <Grid container spacing={2} key={field.id}>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Controller
                    name={`detalles.${index}.producto`}
                    control={control}
                    render={({ field: controllerField }) => (
                      <Autocomplete
                        options={products}
                        value={controllerField.value}
                        onChange={(_, value) => {
                          controllerField.onChange(value);
                        }}
                        getOptionLabel={(option) => option?.nombre || ''}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Producto"
                            error={Boolean(errors.detalles?.[index]?.producto)}
                            helperText={errors.detalles?.[index]?.producto?.message}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Controller
                    name={`detalles.${index}.cantidad`}
                    control={control}
                    render={({ field: controllerField }) => (
                      <TextField
                        {...controllerField}
                        label="Cantidad"
                        type="number"
                        fullWidth
                        error={Boolean(errors.detalles?.[index]?.cantidad)}
                        helperText={errors.detalles?.[index]?.cantidad?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Controller
                    name={`detalles.${index}.precioVenta`}
                    control={control}
                    render={({ field: controllerField }) => (
                      <TextField
                        {...controllerField}
                        label="Precio venta"
                        type="number"
                        fullWidth
                        error={Boolean(errors.detalles?.[index]?.precioVenta)}
                        helperText={errors.detalles?.[index]?.precioVenta?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 1 }}>
                  <Stack justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
                    <IconButton color="error" onClick={() => remove(index)} disabled={fields.length === 1}>
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>
            ))}
          </Stack>

          <Grid container spacing={2}>
            {[
              { label: 'Subtotal', value: subtotal },
              { label: 'Total', value: total },
              { label: 'Ganancia estimada', value: gananciaEstimada },
            ].map((item) => (
              <Grid key={item.label} size={{ xs: 12, md: 4 }}>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'action.hover' }}>
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="h6">{formatCurrency(item.value)}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="flex-end">
            <Button variant="contained" onClick={handleSubmit(submitHandler)} disabled={isSubmitting}>
              Guardar venta
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
