"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Users,
  Search,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  Trash2,
  Edit,
  Loader2,
  CheckCircle2,
  X
} from 'lucide-react';
import api from '@/services/api';
import { toast } from 'sonner';

interface Client {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);
  const [editingClient, setEditingClient] = useState<number | null>(null);
  const [newClient, setNewClient] = useState({ nombre: '', email: '', telefono: '' });
  const [isSaving, setIsSaving] = useState(false);

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data);
    } catch (error) {
      toast.error('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchClients();
    }
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingClient) {
        await api.put(`/clients/${editingClient}`, newClient);
      } else {
        await api.post('/clients', newClient);
      }
      toast.success(editingClient ? 'Cliente actualizado' : 'Cliente guardado con éxito');
      setModalOpen(false);
      setNewClient({ nombre: '', email: '', telefono: '' });
      setEditingClient(null);
      fetchClients();
    } catch (error) {
      toast.error('Error al guardar el cliente');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client.id);
    setNewClient({
      nombre: client.nombre,
      email: client.email,
      telefono: client.telefono
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    setClientToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;
    try {
      await api.delete(`/clients/${clientToDelete}`);
      setClients(clients.filter(c => c.id !== clientToDelete));
      toast.success('Cliente eliminado correctamente');
      setDeleteModalOpen(false);
      setClientToDelete(null);
    } catch (error) {
      alert('Error al eliminar el cliente');
    }
  };

  const filteredClients = [...clients]
    .sort((a, b) => b.id - a.id)
    .filter(client => 
      client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Gestión de Clientes</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Administra la base de datos de tus clientes.</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl flex items-center space-x-2 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Cliente</span>
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar cliente por nombre o email..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-left text-xs font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="border-none">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
                    </td>
                  </tr>
                ) : filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                      No se encontraron clientes.
                    </td>
                  </tr>
                ) : filteredClients.map((client, index) => (
                  <tr key={client.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-bold text-slate-400">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                          {client.nombre.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-white">{client.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                          <Mail className="w-3.5 h-3.5 mr-2" />
                          {client.email}
                        </div>
                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                          <Phone className="w-3.5 h-3.5 mr-2" />
                          {client.telefono || 'Sin teléfono'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">#{client.id}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2 transition-opacity">
                        <button 
                          onClick={() => handleEdit(client)}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Creación */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <h2 className="font-bold text-lg text-slate-800 dark:text-white">
                {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h2>
              <button 
                onClick={() => {
                  setModalOpen(false);
                  setEditingClient(null);
                  setNewClient({ nombre: '', email: '', telefono: '' });
                }} 
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nombre Completo</label>
                <input
                  required
                  className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                  placeholder="Ej. Juan Pérez"
                  value={newClient.nombre}
                  onChange={(e) => setNewClient({ ...newClient, nombre: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Correo Electrónico</label>
                <input
                  required
                  type="email"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                  placeholder="juan@example.com"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Teléfono (Opcional)</label>
                <input
                  className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                  placeholder="+56 9..."
                  value={newClient.telefono}
                  onChange={(e) => setNewClient({ ...newClient, telefono: e.target.value })}
                />
              </div>
              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{editingClient ? 'Actualizar Cliente' : 'Guardar Cliente'}</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 p-6 text-center">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">¿Confirmar eliminación?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Esta acción eliminará permanentemente al cliente y no se podrá deshacer.
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
