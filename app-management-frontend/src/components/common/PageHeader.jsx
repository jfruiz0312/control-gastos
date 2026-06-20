import { Breadcrumbs, Link, Stack, Typography } from '@mui/material';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { Link as RouterLink, useLocation } from 'react-router-dom';

function buildBreadcrumbs(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Inicio', path: '/dashboard' }];

  segments.forEach((segment, index) => {
    breadcrumbs.push({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: `/${segments.slice(0, index + 1).join('/')}`,
    });
  });

  return breadcrumbs;
}

export default function PageHeader({ title, subtitle, action }) {
  const { pathname } = useLocation();
  const breadcrumbs = buildBreadcrumbs(pathname);

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', md: 'center' }}
      spacing={2}
    >
      <Stack spacing={1}>
        <Breadcrumbs separator={<NavigateNextRoundedIcon fontSize="small" />} aria-label="breadcrumb">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return isLast ? (
              <Typography key={crumb.path} color="text.primary" variant="body2">
                {crumb.label}
              </Typography>
            ) : (
              <Link key={crumb.path} component={RouterLink} to={crumb.path} color="inherit" underline="hover">
                {crumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
        <div>
          <Typography variant="h4">{title}</Typography>
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        </div>
      </Stack>
      {action}
    </Stack>
  );
}
