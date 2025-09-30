const BASE_URL = 'https://mkhzwqfpayjgbzmbfjfn.supabase.co/rest/v1/fornecedor';

// Substitua pela sua chave anônima do Supabase (encontre em Project Settings > API > anon key)
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1raHp3cWZwYXlqZ2J6bWJmamZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNTEyNjYsImV4cCI6MjA2NDgyNzI2Nn0.F-_2kyN2lEXvtgY8c0XbWZmlAESVzlBd3Uv6NiaOBD4';

export const fornecedorService = {
  listar: async () => {
    const response = await fetch(`${BASE_URL}?select=*`, {
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    if (!response.ok) throw new Error('Erro ao buscar fornecedores');
    return response.json();
  }
};