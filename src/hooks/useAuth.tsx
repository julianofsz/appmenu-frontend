import { showMassage } from '@/adapters/showMassage';
import api from '@/lib/api';
import type { LoginApiResponse, LoginPayload } from '@/types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setAuthenticated(true);
      } catch (error) {
        console.error('Token inválido:', error);
      }
    }
    setLoading(false);
  }, []);

  async function authUser(data: LoginApiResponse) {
    setAuthenticated(true);
    localStorage.setItem('token', data.token);

    console.log('Token salvo no localStorage:', localStorage.getItem('token'));

    api.defaults.headers.Authorization = `Bearer ${data.token}`;
    navigate('/dashboard/pedidos');
  }

  async function login(user: LoginPayload) {
    try {
      const response = await api.post('/users/Login', user);
      await authUser(response.data);
      showMassage.success('Login realizado com sucesso!');
    } catch (error) {
      console.log('Erro ao fazer login:', error);
      showMassage.error('Erro ao fazer login. Verifique suas credenciais.');
    }
  }
  function logout() {
    setAuthenticated(false);
    localStorage.removeItem('token');
    delete api.defaults.headers.Authorization;
    navigate('/login');
    showMassage.warning('Logout realizado com sucesso!');
  }

  return { authenticated, loading, login, logout };
}
