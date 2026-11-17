// Helper de peticiones HTTP (evolución del helpFetch del Laboratorio 4).
// Ahora recibe la URL base para poder usarse con json-server y con Express.
export const helpFetch = (URL) => {
  const customFetch = async (endpoint, options = {}) => {
    options.method = options.method || 'GET';
    options.headers = { 'Content-Type': 'application/json', ...options.headers };
    if (options.body) options.body = JSON.stringify(options.body);

    let response;
    try {
      response = await fetch(`${URL}${endpoint}`, options);
    } catch {
      // El servidor no está encendido o no hay red
      throw { error: true, status: 0, statusText: 'No se pudo conectar con el servidor. Verifique que esté en ejecución.' };
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw {
        error: true,
        status: response.status,
        statusText: data.error || response.statusText || 'Error en la petición',
        errores: data.errores || {},
      };
    }
    return data;
  };

  return {
    get: (endpoint) => customFetch(endpoint),
    post: (endpoint, body) => customFetch(endpoint, { method: 'POST', body }),
    put: (endpoint, body) => customFetch(endpoint, { method: 'PUT', body }),
    patch: (endpoint, body) => customFetch(endpoint, { method: 'PATCH', body }),
    del: (endpoint) => customFetch(endpoint, { method: 'DELETE' }),
  };
};
