const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api/tasks').replace(/\/$/, '');

async function request(path = '', { body, headers, ...options } = {}) {
    let response;
    // console.log(path);
    // console.log(body);
    // console.log(...headers);
    // console.log(...options);

    try {
        response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
                Accept: 'application/json',
                ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
                ...headers
            },
            ...(body === undefined ? {} : { body: JSON.stringify(body) })
        });
    } catch (error) {
        throw new Error(`Unable to connect to the task API at ${API_URL}.`, { cause: error });
    }

    const responseText = await response.text();
    let data = null;

    if (responseText) {
        try {
            data = JSON.parse(responseText);
        } catch {
            data = { message: responseText };
        }
    }

    if (!response.ok) {
        throw new Error(data?.message || `Task request failed with status ${response.status}.`);
    }

    return data;
}

function taskPath(id) {
    if (id === undefined || id === null || String(id).trim() === '') {
        throw new Error('A task ID is required.');
    }

    return `/${encodeURIComponent(id)}`;
}

export const getTasks = () => request();

export const createTask = (task) => request('', {
    method: 'POST',
    body: task
});

export const updateTask = (data) => request(taskPath(data.id), {
    method: 'PATCH',
    body: data.updates
});


export const deleteTask = (id) => request(taskPath(id), {
    method: 'DELETE'
});