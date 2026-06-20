import { Card, CardContent, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function RecentTransactionsTable({ title, subtitle, rows, columns }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%' }}>
        <Stack spacing={2} sx={{ height: '100%' }}>
          <div>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </div>
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            hideFooterSelectedRowCount
            pageSizeOptions={[5]}
            initialState={{
              pagination: {
                paginationModel: {
                  page: 0,
                  pageSize: 5,
                },
              },
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
