
const BASE_URL = '/api';

export const api = {
  async get(endpoint: string, projectId?: string) {
    const headers: any = { 'Content-Type': 'application/json' };
    if (projectId) headers['x-project-id'] = projectId;

    const res = await fetch(`${BASE_URL}${endpoint}`, { headers });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'API Request failed');
    }
    return res.json();
  },

  async post(endpoint: string, data: any, projectId?: string) {
    const headers: any = { 'Content-Type': 'application/json' };
    if (projectId) headers['x-project-id'] = projectId;

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'API Request failed');
    }
    return res.json();
  }
};
