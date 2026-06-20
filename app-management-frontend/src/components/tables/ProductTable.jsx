import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { Chip, IconButton, Paper, Stack, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { formatCurrency, formatNumber, getStatusChipColor } from '../../utils/formatters';

export default function ProductTable({ rows, onEdit, onDelete }) {
  const columns = [
    { field: 'codigo', headerName: 'Código', flex: 1, minWidth: 120 },
    { field: 'nombre', headerName: 'Nombre', flex: 1.5, minWidth: 180 },
    { field: 'categoria', headerName: 'Categoría', flex: 1, minWidth: 140 },
    {
      field: 'precioCompra',
      headerName: 'Precio compra',
      flex: 1,
      minWidth: 140,
      valueFormatter: (value) => formatCurrency(value),
    },
    {
      field: 'precioVenta',
      headerName: 'Precio venta',
      flex: 1,
      minWidth: 140,
      valueFormatter: (value) => formatCurrency(value),
    },
    {
      field: 'stock',
      headerName: 'Stock',
      flex: 0.8,
      minWidth: 110,
      valueFormatter: (value) => formatNumber(value),
    },
    {
      field: 'estado',
      headerName: 'Estado',
      flex: 0.9,
      minWidth: 120,
      renderCell: ({ row }) => (
        <Chip
          label={row.estado ? 'Activo' : 'Inactivo'}
          color={getStatusChipColor(row.estado)}
          size="small"
          variant={row.estado ? 'filled' : 'outlined'}
        />
      ),
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      sortable: false,
      filterable: false,
      width: 120,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Editar producto">
            <IconButton color="primary" onClick={() => onEdit(row)} size="small">
              <EditRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar producto">
            <IconButton color="error" onClick={() => onDelete(row)} size="small">
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Paper sx={{ height: 560, p: 1.5 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
              page: 0,
            },
          },
        }}
        disableRowSelectionOnClick
      />
    </Paper>
  );
}
