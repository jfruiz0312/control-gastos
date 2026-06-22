import { useCallback, useMemo, useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Button, Grid } from '@mui/material';
import dayjs from 'dayjs';
import { obtenerGastos, registrarGasto } from '../api/gastoApi';
import PageHeader from '../components/common/PageHeader';
import ExpenseFormDialog from '../components/forms/ExpenseFormDialog';
import ExpenseTable from '../components/tables/ExpenseTable';
import { useAppContext } from '../context/AppContext';
import useAsyncData from '../hooks/useAsyncData';

const normalizeExpense = (item, index) => ({
  id: item.id ?? item.gastoId ?? `${index + 1}`,
  tipoGasto: item.tipoGasto ?? item.categoria ?? 'OTROS',
  descripcion: item.descripcion ?? item.description ?? '',
  fecha: item.fecha ?? item.createdAt,
  monto: Number(item.monto ?? item.valor ?? 0),
});

export default function Gastos() {
  const { showSnackbar } = useAppContext();
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadExpenses = useCallback(async () => {
    const response = await obtenerGastos();
    return response.map(normalizeExpense);
  }, []);

  const { data: expenses, reload } = useAsyncData(loadExpenses, { initialData: [] });

  const handleSave = async (values) => {
    const payload = {
      tipoGasto: values.tipoGasto,
      descripcion: values.descripcion,
      fecha: values.fecha?.toISOString?.() || values.fecha,
      monto: Number(values.monto),
    };

    await registrarGasto(payload);
    showSnackbar('Gasto registrado correctamente', 'success');
    setDialogOpen(false);
    reload();
  };

  const currentMonthExpenses = useMemo(
    () => expenses.filter((item) => dayjs(item.fecha).isSame(dayjs(), 'month')),
    [expenses],
  );

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <PageHeader
          title="Gastos Operativos"
          subtitle={`Consulta y administra gastos operativos. Gastos del mes: ${currentMonthExpenses.length}.`}
          action={
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => {
                setDialogOpen(true);
              }}
            >
              Nuevo gasto
            </Button>
          }
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ExpenseTable rows={expenses} />
      </Grid>

      <ExpenseFormDialog
        open={dialogOpen}
        initialValues={null}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSave}
      />
    </Grid>
  );
}
