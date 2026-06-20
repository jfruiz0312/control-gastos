import dayjs from 'dayjs';

export const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const formatNumber = (value) =>
  new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const formatDate = (value, template = 'DD/MM/YYYY') => (value ? dayjs(value).format(template) : '—');

export const formatDateTime = (value) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '—');

export const sumBy = (items = [], selector) =>
  items.reduce((total, item) => total + Number(selector(item) || 0), 0);

export const getStatusChipColor = (active) => (active ? 'success' : 'default');
