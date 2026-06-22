import { useMemo, useState } from 'react';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { InputAdornment, Paper, Stack, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { getCatalogLabel, PRODUCT_CATEGORY_OPTIONS } from '../../utils/catalogs';

export default function InventoryTable({ rows }) {
  const [query, setQuery] = useState('');

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return rows;
    }

    return rows.filter((row) =>
      [row.codigo, row.nombre, row.categoria].some((value) =>
        String(value || '')
          .toLowerCase()
          .includes(normalizedQuery),
      ),
    );
  }, [query, rows]);

  const columns = [
    { field: 'codigo', headerName: 'Código', flex: 1, minWidth: 120 },
    { field: 'nombre', headerName: 'Producto', flex: 1.8, minWidth: 200 },
    {
      field: 'categoria',
      headerName: 'Categoría',
      flex: 0.9,
      minWidth: 140,
      valueFormatter: (value) => getCatalogLabel(PRODUCT_CATEGORY_OPTIONS, value, value || '—'),
    },
    {
      field: 'stockActual',
      headerName: 'Stock actual',
      flex: 0.9,
      minWidth: 120,
      valueFormatter: (value) => formatNumber(value),
    },
    {
      field: 'stockMinimo',
      headerName: 'Stock mínimo',
      flex: 0.9,
      minWidth: 120,
      valueFormatter: (value) => formatNumber(value),
    },
    {
      field: 'valorCosto',
      headerName: 'Valor costo',
      flex: 1,
      minWidth: 150,
      valueFormatter: (value) => formatCurrency(value),
    },
    {
      field: 'valorVenta',
      headerName: 'Valor venta',
      flex: 1,
      minWidth: 150,
      valueFormatter: (value) => formatCurrency(value),
    },
  ];

  return (
    <Stack spacing={2}>
      <TextField
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar por código, nombre o categoría"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
      <Paper sx={{ height: 560, p: 1.5 }}>
        <DataGrid
          rows={filteredRows}
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
    </Stack>
  );
}
