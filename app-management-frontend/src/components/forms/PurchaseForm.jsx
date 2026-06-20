import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { formatCurrency } from '../../utils/formatters';

const schema = yup.object({
  proveedor: yup.string().required('El proveedor es obligatorio'),
  fecha: yup.mixed().required('La fecha es obligatoria'),
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
        precioUnitario: yup
          .number()
          .typeError('Debe ser un número válido')
          .positive('Debe ser un valor positivo')
          .required('El precio unitario es obligatorio'),
      }),
    )
    .min(1, 'Debe agregar al menos un producto'),
  gastosAsociados: yup.object({
    transporte: yup.number().typeError('Debe ser numérico').min(0).required(),
    alimentacion: yup.number().typeError('Debe ser numérico').min(0).required(),
    envio: yup.number().typeError('Debe ser numérico').min(0).required(),
    otros: yup.number().typeError('Debe ser numérico').min(0).required(),
  }),
});

const defaultValues = {
  proveedor: '',
  fecha: dayjs(),
  detalles: [{ producto: null, cantidad: 1, precioUnitario: '' }],
  gastosAsociados: {
    transporte: 0,
    alimentacion: 0,
    envio: 0,
    otros: 0,
  },
};

export default function PurchaseForm({ products, onSubmit }) {
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
  const expenses = watch('gastosAsociados');

  const totalCompra = details.reduce(
    (total, item) => total + Number(item?.cantidad || 0) * Number(item?.precioUnitario || 0),
    0,
  );
  const costoOperativo =
    Number(expenses?.transporte || 0) +
    Number(expenses?.alimentacion || 0) +
    Number(expenses?.envio || 0) +
    Number(expenses?.otros || 0);
  const costoReal = totalCompra + costoOperativo;

  const submitHandler = async (values) => {
    await onSubmit({
      proveedor: values.proveedor,
      fecha: values.fecha?.toISOString?.() || values.fecha,
      detalles: values.detalles.map((item) => ({
        productoId: item.producto?.id,
        cantidad: Number(item.cantidad),
        precioUnitario: Number(item.precioUnitario),
      })),
      gastosAsociados: {
        transporte: Number(values.gastosAsociados.transporte),
        alimentacion: Number(values.gastosAsociados.alimentacion),
        envio: Number(values.gastosAsociados.envio),
        otros: Number(values.gastosAsociados.otros),
      },
      totalCompra,
      costoOperativo,
      costoReal,
    });

    reset(defaultValues);
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6">Registrar compra</Typography>
            <Typography variant="body2" color="text.secondary">
              Registra la compra, sus costos asociados y el impacto operativo total.
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="proveedor"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Proveedor"
                    fullWidth
                    error={Boolean(errors.proveedor)}
                    helperText={errors.proveedor?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="fecha"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Fecha"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: Boolean(errors.fecha),
                        helperText: errors.fecha?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">Detalle de productos</Typography>
              <Button
                startIcon={<AddRoundedIcon />}
                onClick={() => append({ producto: null, cantidad: 1, precioUnitario: '' })}
              >
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
                        onChange={(_, value) => controllerField.onChange(value)}
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
                    name={`detalles.${index}.precioUnitario`}
                    control={control}
                    render={({ field: controllerField }) => (
                      <TextField
                        {...controllerField}
                        label="Precio unitario"
                        type="number"
                        fullWidth
                        error={Boolean(errors.detalles?.[index]?.precioUnitario)}
                        helperText={errors.detalles?.[index]?.precioUnitario?.message}
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

          <Divider />

          <Stack spacing={2}>
            <Typography variant="subtitle1">Gastos asociados</Typography>
            <Grid container spacing={2}>
              {[
                { name: 'transporte', label: 'Transporte' },
                { name: 'alimentacion', label: 'Alimentación' },
                { name: 'envio', label: 'Envío' },
                { name: 'otros', label: 'Otros' },
              ].map((field) => (
                <Grid size={{ xs: 12, md: 3 }} key={field.name}>
                  <Controller
                    name={`gastosAsociados.${field.name}`}
                    control={control}
                    render={({ field: controllerField }) => (
                      <TextField {...controllerField} label={field.label} type="number" fullWidth />
                    )}
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>

          <Divider />

          <Grid container spacing={2}>
            {[
              { label: 'Total compra', value: totalCompra },
              { label: 'Costo operativo', value: costoOperativo },
              { label: 'Costo real', value: costoReal },
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
              Guardar compra
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
