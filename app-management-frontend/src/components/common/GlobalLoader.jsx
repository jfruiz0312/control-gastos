import { Backdrop, CircularProgress, Stack, Typography } from '@mui/material';

export default function GlobalLoader({ open }) {
  return (
    <Backdrop
      open={open}
      sx={(theme) => ({
        color: '#fff',
        zIndex: theme.zIndex.drawer + 100,
        backdropFilter: 'blur(3px)',
      })}
    >
      <Stack spacing={2} alignItems="center">
        <CircularProgress color="inherit" />
        <Typography variant="body2">Cargando información...</Typography>
      </Stack>
    </Backdrop>
  );
}
