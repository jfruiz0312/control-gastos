import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { IconButton, Paper, Stack, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function ExpenseTable({ rows, onEdit, onDelete }) {
  const columns = [
    { field: 'tipoGasto', headerName: 'Tipo de gasto', flex: 1, minWidth: 160 },
    { field: 'descripcion', headerName: 'Descripción', flex: 2, minWidth: 220 },
    {
      field: 'fecha',
      headerName: 'Fecha',
      flex: 1,
      minWidth: 130,
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: 'monto',
      headerName: 'Monto',
      flex: 1,
      minWidth: 140,
      valueFormatter: (value) => formatCurrency(value),
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Editar gasto">
            <IconButton color="primary" onClick={() => onEdit(row)} size="small">
              <EditRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar gasto">
            <IconButton color="error" onClick={() => onDelete(row)} size="small">
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Paper sx={{ height: 520, p: 1.5 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: 10,
            },
          },
        }}
        disableRowSelectionOnClick
      />
    </Paper>
  );
}
