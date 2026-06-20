export function extractCollection(payload, fallbackKeys = []) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const candidates = ['content', 'items', 'data', 'results', ...fallbackKeys];
  const match = candidates.find((key) => Array.isArray(payload[key]));

  return match ? payload[match] : [];
}

export function extractItem(payload, fallbackKeys = []) {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  const candidates = ['data', 'item', 'result', ...fallbackKeys];
  const match = candidates.find((key) => payload[key] && typeof payload[key] === 'object');

  return match ? payload[match] : payload;
}

export function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Ocurrió un error inesperado al comunicarse con la API.'
  );
}

export function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function toDateLabel(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString();
}
