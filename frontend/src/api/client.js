/**
 * API Client pentru comunicarea cu backend-ul
 */

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Funcție helper pentru request-uri GET
 * @param {string} path - calea endpoint-ului (ex: /grills)
 * @param {object} options - opțiuni (authToken, etc.)
 */
async function apiGet(path, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (options.authToken) {
        headers['Authorization'] = `Bearer ${options.authToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'GET',
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Eroare la comunicarea cu serverul');
    }

    return data;
}

/**
 * Funcție helper pentru request-uri POST
 * @param {string} path - calea endpoint-ului
 * @param {object} body - corpul request-ului
 * @param {object} options - opțiuni (authToken, etc.)
 */
async function apiPost(path, body, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (options.authToken) {
        headers['Authorization'] = `Bearer ${options.authToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Eroare la comunicarea cu serverul');
    }

    return data;
}

/**
 * Funcție helper pentru request-uri PUT
 * @param {string} path - calea endpoint-ului
 * @param {object} body - corpul request-ului
 * @param {object} options - opțiuni (authToken, etc.)
 */
async function apiPut(path, body, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (options.authToken) {
        headers['Authorization'] = `Bearer ${options.authToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Eroare la comunicarea cu serverul');
    }

    return data;
}

/**
 * Funcție helper pentru request-uri DELETE
 * @param {string} path - calea endpoint-ului
 * @param {object} options - opțiuni (authToken, etc.)
 */
async function apiDelete(path, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (options.authToken) {
        headers['Authorization'] = `Bearer ${options.authToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'DELETE',
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Eroare la comunicarea cu serverul');
    }

    return data;
}

export const apiClient = {
    get: apiGet,
    post: apiPost,
    put: apiPut,
    delete: apiDelete,
};

export default apiClient;
