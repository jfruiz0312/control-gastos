import { useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { EXPENSE_TYPE_OPTIONS } from '../../utils/catalogs';

const expenseSchema = yup.object({
  tipoGasto: yup.string().required('El tipo de gasto es obligatorio'),
  descripcion: yup.string().required('La descripción es obligatoria'),
  fecha: yup.mixed().required('La fecha es obligatoria'),
  monto: yup
    .number()
    .typeError('Debe ser un número válido')
    .positive('Debe ser un valor positivo')
    .required('El monto es obligatorio'),
});

const defaultValues = {
  tipoGasto: '',
  descripcion: '',
  fecha: dayjs(),
  monto: '',
};

export default function ExpenseFormDialog({ open, initialValues, onClose, onSubmit }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(expenseSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(
      initialValues
        ? {
            ...initialValues,
            fecha: initialValues.fecha ? dayjs(initialValues.fecha) : dayjs(),
          }
        : defaultValues,
    );
  }, [initialValues, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialValues?.id ? 'Editar gasto' : 'Registrar gasto'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.25 }}>
          <Grid size={{ xs: 12 }}>
            <Controller
              name="tipoGasto"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Tipo de gasto"
                  fullWidth
                  error={Boolean(errors.tipoGasto)}
                  helperText={errors.tipoGasto?.message}
                >
                  {EXPENSE_TYPE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Controller
              name="descripcion"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descripción"
                  fullWidth
                  multiline
                  rows={3}
                  error={Boolean(errors.descripcion)}
                  helperText={errors.descripcion?.message}
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
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="monto"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Monto"
                  type="number"
                  fullWidth
                  error={Boolean(errors.monto)}
                  helperText={errors.monto?.message}
                />
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
