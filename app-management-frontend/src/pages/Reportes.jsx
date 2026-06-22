import { useCallback, useMemo, useState } from 'react';
import { Box, Card, CardContent, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';
import { obtenerGastos } from '../api/gastoApi';
import { obtenerReporteGanancias, obtenerReporteInventario, obtenerReporteVentas } from '../api/reporteApi';
import PageHeader from '../components/common/PageHeader';
import useAsyncData from '../hooks/useAsyncData';
import { EXPENSE_TYPE_OPTIONS, getCatalogLabel } from '../utils/catalogs';
import { formatCurrency, formatNumber } from '../utils/formatters';

const normalizeInventoryReport = (item, index) => ({
  id: item.id ?? item.codigo ?? `${index + 1}`,
  producto: item.nombre ?? `Producto ${index + 1}`,
  existencias: Number(item.stockActual ?? 0),
  stockMinimo: Number(item.stockMinimo ?? 0),
});

export default function Reportes() {
  const [tab, setTab] = useState(0);

  const loadReports = useCallback(async () => {
    const [ganancias, inventario, ventas, gastos] = await Promise.all([
      obtenerReporteGanancias(),
      obtenerReporteInventario(),
      obtenerReporteVentas(),
      obtenerGastos(),
    ]);

    return {
      ganancias,
      inventario: {
        ...inventario,
        productosStockBajo: (inventario?.productosStockBajo || []).map(normalizeInventoryReport),
      },
      ventas,
      gastos,
    };
  }, []);

  const { data } = useAsyncData(loadReports, {
    initialData: {
      ganancias: {},
      inventario: {},
      ventas: {},
      gastos: [],
    },
  });

  const profitBars = useMemo(
    () => [
      { periodo: 'Histórica', valor: Number(data.ganancias?.gananciaTotalHistorica ?? 0) },
      { periodo: 'Mensual', valor: Number(data.ganancias?.gananciaMensualActual ?? 0) },
      { periodo: 'Anual', valor: Number(data.ganancias?.gananciaAnualActual ?? 0) },
    ],
    [data.ganancias],
  );

  const annualProfit = Number(data.ganancias?.gananciaAnualActual ?? 0);
  const monthlyTotal = Number(data.ganancias?.gananciaMensualActual ?? 0);

  const bestSelling = useMemo(
    () =>
      [...(data.ganancias?.gananciasPorProducto || [])]
        .sort((a, b) => Number(b.unidadesVendidas ?? 0) - Number(a.unidadesVendidas ?? 0))
        .slice(0, 5)
        .map((item) => ({
          label: item.nombreProducto,
          value: Number(item.unidadesVendidas ?? 0),
          gain: Number(item.gananciaTotal ?? 0),
        })),
    [data.ganancias],
  );

  const expenseCategories = useMemo(() => {
    const totalsByType = data.gastos.reduce((accumulator, item) => {
      const type = item.tipoGasto || 'OTROS';
      const currentTotal = accumulator.get(type) || 0;
      accumulator.set(type, currentTotal + Number(item.monto ?? 0));
      return accumulator;
    }, new Map());

    return Array.from(totalsByType.entries()).map(([type, amount], index) => ({
      id: index + 1,
      label: getCatalogLabel(EXPENSE_TYPE_OPTIONS, type, type),
      value: amount,
    }));
  }, [data.gastos]);

  const lowStockProducts = data.inventario?.productosStockBajo || [];
  const inventorySummary = useMemo(
    () => [
      { label: 'Productos activos', value: formatNumber(data.inventario?.totalProductosActivos ?? 0) },
      { label: 'Unidades en stock', value: formatNumber(data.inventario?.totalUnidadesStock ?? 0) },
      { label: 'Valor a costo', value: formatCurrency(data.inventario?.valorInventarioCosto ?? 0) },
      { label: 'Valor a venta', value: formatCurrency(data.inventario?.valorInventarioVenta ?? 0) },
      { label: 'Ventas mensuales', value: formatCurrency(data.ventas?.totalVentasMensuales ?? 0) },
      { label: 'Ventas anuales', value: formatCurrency(data.ventas?.totalVentasAnuales ?? 0) },
    ],
    [data.inventario, data.ventas],
  );

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
                  xAxis={[{ scaleType: 'band', data: profitBars.map((item) => item.periodo) }]}
                  series={[{ data: profitBars.map((item) => item.valor), color: '#1976d2' }]}
                  margin={{ left: 60, right: 20, top: 10, bottom: 30 }}
                />
              )}

              {tab === 1 && (
                <Box sx={{ height: 320 }}>
                  <BarChart
                    height={320}
                    xAxis={[{ scaleType: 'band', data: lowStockProducts.map((item) => item.producto) }]}
                    series={[{ data: lowStockProducts.map((item) => item.existencias), color: '#009688' }]}
                    margin={{ left: 60, right: 20, top: 10, bottom: 60 }}
                  />
                </Box>
              )}

              {tab === 2 && (
                <Stack spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    Productos con mejor resultado
                  </Typography>
                  <PieChart
                    height={320}
                    series={[
                      {
                        data: bestSelling.map((item, index) => ({
                          id: index,
                          label: item.label,
                          value: item.gain || item.value,
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
                  <Stack alignItems="flex-end">
                    <Typography variant="body2" fontWeight={600}>
                      {formatNumber(item.value)} unidades
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatCurrency(item.gain)}
                    </Typography>
                  </Stack>
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
              {lowStockProducts.slice(0, 3).map((item) => (
                <Stack key={item.id} direction="row" justifyContent="space-between">
                  <Typography variant="body2">{item.producto}</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatNumber(item.existencias)} / min {formatNumber(item.stockMinimo)}
                  </Typography>
                </Stack>
              ))}
              {inventorySummary.map((item) => (
                <Stack key={item.label} direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {item.value}
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
