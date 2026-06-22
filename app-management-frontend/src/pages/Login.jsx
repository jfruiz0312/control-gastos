import { useMemo, useState } from 'react';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/api';

const schema = yup.object({
  username: yup.string().required('El usuario es obligatorio'),
  password: yup.string().required('La contraseña es obligatoria'),
});

const defaultValues = {
  username: 'bladan',
  password: 'admin123',
};

export default function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const redirectTo = useMemo(() => location.state?.from?.pathname || '/dashboard', [location.state]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onSubmit = async (values) => {
    setSubmitError('');

    try {
      await login(values);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.14)}, ${alpha(
          theme.palette.secondary.main,
          0.18,
        )})`,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 1080, overflow: 'hidden' }}>
        <Grid container>
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              p: { xs: 4, md: 6 },
              background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Stack spacing={3}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: 3,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: alpha('#ffffff', 0.14),
                }}
              >
                <AccountBalanceWalletRoundedIcon sx={{ fontSize: 40 }} />
              </Box>
              <div>
                <Typography variant="h4" gutterBottom>
                  Control de Gastos Operativos
                </Typography>
                <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.86) }}>
                  Accede a compras, ventas, inventario, gastos y reportes desde una sola plataforma.
                </Typography>
              </div>
              <Stack spacing={1.5}>
                {[
                  'Autenticación segura con JWT',
                  'Dashboard ejecutivo con indicadores operativos',
                  'Gestión unificada de productos, inventario y finanzas',
                ].map((item) => (
                  <Typography key={item} variant="body2" sx={{ color: alpha('#ffffff', 0.88) }}>
                    • {item}
                  </Typography>
                ))}
              </Stack>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <CardContent sx={{ p: { xs: 4, md: 6 } }}>
              <Stack spacing={3}>
                <div>
                  <Typography variant="h5" gutterBottom>
                    Iniciar sesión
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ingresa tus credenciales para continuar.
                  </Typography>
                </div>

                {submitError && <Alert severity="error">{submitError}</Alert>}

                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Usuario"
                      fullWidth
                      autoComplete="username"
                      error={Boolean(errors.username)}
                      helperText={errors.username?.message}
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Contraseña"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      autoComplete="current-password"
                      error={Boolean(errors.password)}
                      helperText={errors.password?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton edge="end" onClick={() => setShowPassword((current) => !current)}>
                              {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />

                <Button variant="contained" size="large" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                  {isSubmitting ? 'Validando...' : 'Ingresar'}
                </Button>
              </Stack>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
