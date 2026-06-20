import { useCallback, useMemo, useState } from 'react';
import { Box, Card, CardContent, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';
import dayjs from 'dayjs';
import { obtenerReporteGanancias, obtenerReporteInventario, obtenerReporteVentas } from '../api/reporteApi';
import PageHeader from '../components/common/PageHeader';
import useAsyncData from '../hooks/useAsyncData';
import { formatCurrency, formatNumber, sumBy } from '../utils/formatters';

const normalizeInventoryReport = (item, index) => ({
  id: item.id ?? item.codigo ?? `${index + 1}`,
  producto: item.producto ?? item.nombre ?? `Producto ${index + 1}`,
  existencias: Number(item.existencias ?? item.stock ?? 0),
});

const normalizeSalesReport = (item, index) => ({
  id: item.id ?? item.codigo ?? `${index + 1}`,
  producto: item.producto ?? item.nombre ?? `Producto ${index + 1}`,
  cantidad: Number(item.cantidad ?? item.totalVendido ?? 0),
  total: Number(item.total ?? item.monto ?? 0),
});

export default function Reportes() {
  const [tab, setTab] = useState(0);

  const loadReports = useCallback(async () => {
    const [ganancias, inventario, ventas] = await Promise.all([
      obtenerReporteGanancias(),
      obtenerReporteInventario(),
      obtenerReporteVentas(),
    ]);

    return {
      ganancias,
      inventario: inventario.map(normalizeInventoryReport),
      ventas: ventas.map(normalizeSalesReport),
    };
  }, []);

  const { data } = useAsyncData(loadReports, {
    initialData: {
      ganancias: {},
      inventario: [],
      ventas: [],
    },
  });

  const monthlyProfit = useMemo(() => {
    if (Array.isArray(data.ganancias?.mensual)) {
      return data.ganancias.mensual;
    }

    return Array.from({ length: 6 }).map((_, index) => ({
      periodo: dayjs().subtract(5 - index, 'month').format('MMM YY'),
      valor: Number(data.ganancias?.gananciaMensual ?? 0),
    }));
  }, [data.ganancias]);

  const annualProfit = Number(data.ganancias?.gananciaAnual ?? sumBy(monthlyProfit, (item) => item.valor));
  const monthlyTotal = Number(data.ganancias?.gananciaMensual ?? monthlyProfit.at(-1)?.valor ?? 0);

  const bestSelling = useMemo(
    () =>
      [...data.ventas]
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 5)
        .map((item) => ({ label: item.producto, value: item.cantidad })),
    [data.ventas],
  );

  const expenseCategories = useMemo(() => {
    const source = data.ganancias?.gastosPorCategoria;

    if (Array.isArray(source) && source.length > 0) {
      return source.map((item, index) => ({
        id: item.id ?? `${index + 1}`,
        label: item.categoria ?? item.tipo ?? `Categoría ${index + 1}`,
        value: Number(item.monto ?? item.valor ?? 0),
      }));
    }

    return [
      { id: 1, label: 'Transporte', value: 35 },
      { id: 2, label: 'Alimentación', value: 20 },
      { id: 3, label: 'Envío', value: 25 },
      { id: 4, label: 'Otros', value: 20 },
    ];
  }, [data.ganancias]);

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <PageHeader
          title="Reportes"
          subtitle="Analiza rentabilidad, inventario y desempeño comercial con reportes interactivos."
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Ganancia mensual
            </Typography>
            <Typography variant="h4">{formatCurrency(monthlyTotal)}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Ganancia anual
            </Typography>
            <Typography variant="h4">{formatCurrency(annualProfit)}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Tabs value={tab} onChange={(_, nextValue) => setTab(nextValue)} variant="scrollable">
                <Tab label="Ganancias" />
                <Tab label="Inventario" />
                <Tab label="Ventas" />
                <Tab label="Gastos" />
              </Tabs>

              {tab === 0 && (
                <BarChart
                  height={320}
                  xAxis={[{ scaleType: 'band', data: monthlyProfit.map((item) => item.periodo) }]}
                  series={[{ data: monthlyProfit.map((item) => Number(item.valor ?? item.ganancia ?? 0)), color: '#1976d2' }]}
                  margin={{ left: 60, right: 20, top: 10, bottom: 30 }}
                />
              )}

              {tab === 1 && (
                <Box sx={{ height: 320 }}>
                  <BarChart
                    height={320}
                    xAxis={[{ scaleType: 'band', data: data.inventario.map((item) => item.producto) }]}
                    series={[{ data: data.inventario.map((item) => item.existencias), color: '#009688' }]}
                    margin={{ left: 60, right: 20, top: 10, bottom: 60 }}
                  />
                </Box>
              )}

              {tab === 2 && (
                <Stack spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    Productos más vendidos
                  </Typography>
                  <PieChart
                    height={320}
                    series={[
                      {
                        data: bestSelling.map((item, index) => ({
                          id: index,
                          label: item.label,
                          value: item.value,
                        })),
                        innerRadius: 40,
                        outerRadius: 120,
                      },
                    ]}
                  />
                </Stack>
              )}

              {tab === 3 && (
                <Stack spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    Gastos por categoría
                  </Typography>
                  <PieChart
                    height={320}
                    series={[
                      {
                        data: expenseCategories,
                        innerRadius: 40,
                        outerRadius: 120,
                      },
                    ]}
                  />
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top productos
            </Typography>
            <Stack spacing={1.5}>
              {bestSelling.map((item) => (
                <Stack key={item.label} direction="row" justifyContent="space-between">
                  <Typography variant="body2">{item.label}</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatNumber(item.value)} unidades
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Inventario consolidado
            </Typography>
            <Stack spacing={1.5}>
              {data.inventario.slice(0, 5).map((item) => (
                <Stack key={item.id} direction="row" justifyContent="space-between">
                  <Typography variant="body2">{item.producto}</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatNumber(item.existencias)} en stock
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
