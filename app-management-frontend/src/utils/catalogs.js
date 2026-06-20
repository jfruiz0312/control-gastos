export const PRODUCT_CATEGORY_OPTIONS = [
  { value: 'ZAPATOS', label: 'Zapatos' },
  { value: 'CAMISAS', label: 'Camisas' },
  { value: 'PANTALONES', label: 'Pantalones' },
  { value: 'ACCESORIOS', label: 'Accesorios' },
];

export const EXPENSE_TYPE_OPTIONS = [
  { value: 'TRANSPORTE', label: 'Transporte' },
  { value: 'COMBUSTIBLE', label: 'Combustible' },
  { value: 'ALIMENTACION', label: 'Alimentación' },
  { value: 'ENVIO', label: 'Envío' },
  { value: 'IMPREVISTOS', label: 'Imprevistos' },
  { value: 'OTROS', label: 'Otros' },
];

export function getCatalogLabel(options, value, fallback = '—') {
  return options.find((option) => option.value === value)?.label ?? fallback;
}

export function buildAssociatedExpenses(expensesByType, dateValue) {
  const catalogEntries = [
    ['TRANSPORTE', 'Transporte', Number(expensesByType?.transporte || 0)],
    ['ALIMENTACION', 'Alimentación', Number(expensesByType?.alimentacion || 0)],
    ['ENVIO', 'Envío', Number(expensesByType?.envio || 0)],
    ['OTROS', 'Otros', Number(expensesByType?.otros || 0)],
  ];

  return catalogEntries
    .filter(([, , amount]) => amount > 0)
    .map(([type, label, amount]) => ({
      tipoGasto: type,
      descripcion: `Gasto asociado de ${label.toLowerCase()}`,
      monto: amount,
      fecha: dateValue,
    }));
}
