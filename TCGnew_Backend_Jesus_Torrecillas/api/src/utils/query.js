const AppError = require('./AppError');

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 10;

const badQuery = (field, message) =>
  new AppError(400, 'INVALID_QUERY', 'Parámetros de consulta no válidos', [{ field, message }]);

// Entero positivo estricto ("2" sí; "0", "-1", "1.5", "abc" no)
const parsePositiveInt = (value, field) => {
  if (!/^\d+$/.test(String(value)) || Number(value) < 1) {
    throw badQuery(field, 'Debe ser un entero positivo');
  }
  return Number(value);
};

// page y limit. limit tiene un máximo para que nadie pida 1.000.000 de registros de golpe.
const parsePagination = (query) => {
  const page = query.page === undefined ? 1 : parsePositiveInt(query.page, 'page');
  let limit = query.limit === undefined ? DEFAULT_LIMIT : parsePositiveInt(query.limit, 'limit');
  if (limit > MAX_LIMIT) {
    throw badQuery('limit', `El máximo permitido es ${MAX_LIMIT}`);
  }
  return { page, limit, skip: (page - 1) * limit };
};

// sort=name  -> ascendente | sort=-createdAt -> descendente. Solo campos de la lista blanca.
const parseSort = (sort, allowedFields, defaultSort = '-createdAt') => {
  const value = sort === undefined ? defaultSort : String(sort);
  const field = value.startsWith('-') ? value.slice(1) : value;
  if (!allowedFields.includes(field)) {
    throw badQuery('sort', `Campos permitidos: ${allowedFields.join(', ')}`);
  }
  return { [field]: value.startsWith('-') ? -1 : 1 };
};

// active=true|false
const parseActive = (active) => {
  if (active === undefined) return undefined;
  if (active !== 'true' && active !== 'false') {
    throw badQuery('active', 'Debe ser true o false');
  }
  return active === 'true';
};

// name=info -> búsqueda parcial, sin distinguir mayúsculas. Se escapan los caracteres especiales
// de regex para que el usuario no pueda inyectar expresiones regulares.
const parseNameFilter = (name) => {
  if (name === undefined) return undefined;
  if (typeof name !== 'string' || name.trim() === '') {
    throw badQuery('name', 'Debe ser un texto no vacío');
  }
  const escaped = name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(escaped, 'i');
};

const buildPagination = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

module.exports = { parsePagination, parseSort, parseActive, parseNameFilter, buildPagination };