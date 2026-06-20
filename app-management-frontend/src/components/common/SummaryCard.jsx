import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { Avatar, Card, CardContent, Stack, Typography } from '@mui/material';

export default function SummaryCard({ title, value, subtitle, icon: Icon = TrendingUpRoundedIcon, color = 'primary.main' }) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Stack spacing={0.75}>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h5">{value}</Typography>
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          </Stack>
          <Avatar sx={{ bgcolor: color, width: 52, height: 52 }}>
            <Icon />
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}
