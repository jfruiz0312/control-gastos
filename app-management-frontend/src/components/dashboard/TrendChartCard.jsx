import { Card, CardContent, Stack, Typography } from '@mui/material';
import { BarChart, LineChart } from '@mui/x-charts';

export default function TrendChartCard({ title, subtitle, labels, data, type = 'bar', color = '#1976d2' }) {
  const isLine = type === 'line';

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={3}>
          <div>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </div>

          {isLine ? (
            <LineChart
              height={300}
              xAxis={[{ scaleType: 'point', data: labels }]}
              series={[{ data, color, area: true, showMark: false }]}
              margin={{ left: 60, right: 20, top: 20, bottom: 30 }}
            />
          ) : (
            <BarChart
              height={300}
              xAxis={[{ scaleType: 'band', data: labels }]}
              series={[{ data, color }]}
              margin={{ left: 60, right: 20, top: 20, bottom: 30 }}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
