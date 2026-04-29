"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react';
import api from '@/services/api';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('role', response.data.role);
      toast.success('¡Bienvenido al sistema de cotizaciones!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error('Error al iniciar sesión. Verifica tus credenciales.');
      setError('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
      {/* Botón de tema en la esquina */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 sm:p-12 relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-600/5 dark:bg-emerald-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-emerald-600 p-4 rounded-2xl mb-4 transform hover:scale-110 transition-transform duration-300">
              <FileText className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">QuotationJS</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-center mt-2">Ingresa tus credenciales para acceder</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Usuario</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  required
                  type="text"
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-600 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-medium text-slate-800 dark:text-white placeholder:text-slate-400"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Contraseña</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-11 pr-12 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-600 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-medium text-slate-800 dark:text-white placeholder:text-slate-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-bold p-4 rounded-2xl animate-shake">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span>INICIAR SESIÓN</span>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-slate-400 dark:text-slate-500 font-medium">
            ¿No tienes cuenta? <span className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer">Contacta al soporte</span>
          </p>
        </div>
      </div>
    </div>
  );
}
