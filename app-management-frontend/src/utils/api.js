export function unwrapApiResponse(payload) {
  if (payload && typeof payload === 'object' && 'success' in payload && 'data' in payload) {
    return payload.data;
  }

  return payload;
}

export function extractCollection(payload, fallbackKeys = []) {
  const normalizedPayload = unwrapApiResponse(payload);

  if (Array.isArray(normalizedPayload)) {
    return normalizedPayload;
  }

  if (!normalizedPayload || typeof normalizedPayload !== 'object') {
    return [];
  }

  const candidates = ['content', 'items', 'data', 'results', ...fallbackKeys];
  const match = candidates.find((key) => Array.isArray(normalizedPayload[key]));

  return match ? normalizedPayload[match] : [];
}

export function extractItem(payload, fallbackKeys = []) {
  const normalizedPayload = unwrapApiResponse(payload);

  if (!normalizedPayload || typeof normalizedPayload !== 'object') {
    return normalizedPayload;
  }

  const candidates = ['data', 'item', 'result', ...fallbackKeys];
  const match = candidates.find((key) => normalizedPayload[key] && typeof normalizedPayload[key] === 'object');

  return match ? normalizedPayload[match] : normalizedPayload;
}

export function getErrorMessage(error) {
  const validationErrors = error?.response?.data?.data;

  if (validationErrors && typeof validationErrors === 'object' && !Array.isArray(validationErrors)) {
    const firstEntry = Object.entries(validationErrors)[0];

    if (firstEntry) {
      return `${firstEntry[0]}: ${firstEntry[1]}`;
    }
  }

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
