
/**
 * Inércia API Client
 * Centraliza as chamadas ao backend garantindo o envio do x-project-id
 */

const getBaseUrl = () => {
  // Se estivermos em produção atrás do Nginx, usamos o path relativo /api
  // Em desenvolvimento local, poderíamos apontar para localhost:4000
  return '/api';
};

const BASE_URL = getBaseUrl();

export const api = {
  async get(endpoint: string, projectId?: string) {
    const headers: Record<string, string> = { 
      'Content-Type': 'application/json' 
    };
    
    if (projectId) {
      headers['x-project-id'] = projectId;
    }

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, { headers });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP Error: ${res.status}`);
      }
      
      return await res.json();
    } catch (err: any) {
      console.error(`[API GET ERROR] ${endpoint}:`, err);
      throw err;
    }
  },

  async post(endpoint: string, data: any, projectId?: string) {
    const headers: Record<string, string> = { 
      'Content-Type': 'application/json' 
    };
    
    if (projectId) {
      headers['x-project-id'] = projectId;
    }

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP Error: ${res.status}`);
      }
      
      return await res.json();
    } catch (err: any) {
      console.error(`[API POST ERROR] ${endpoint}:`, err);
      throw err;
    }
  }
};
