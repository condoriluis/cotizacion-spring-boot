"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  FileText, 
  Search, 
  Plus, 
  Loader2, 
  X, 
  User, 
  ShoppingCart, 
  Trash2,
  ChevronRight,
  Printer,
  Clock,
  CheckCircle2,
  Send,
  AlertTriangle
} from 'lucide-react';
import api from '@/services/api';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  { ssr: false }
);
import QuotationPDF from '@/components/QuotationPDF';

interface Quotation {
  id: number;
  clientNombre: string;
  fecha: string;
  estado: string;
  total: number;
}

interface Client {
  id: number;
  nombre: string;
}

interface Product {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create flow state
  const [isModalOpen, setModalOpen] = useState(false);
  const [catalogSearchTerm, setCatalogSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [selectedClientId, setSelectedClientId] = useState<number | ''>('');
  const [selectedItems, setSelectedItems] = useState<{productId: number, nombre: string, cantidad: number, precio: number}[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fetchData = async () => {
    try {
      const [qRes, cRes, pRes] = await Promise.all([
        api.get('/quotations'),
        api.get('/clients'),
        api.get('/products')
      ]);
      setQuotations(qRes.data);
      setClients(cRes.data);
      setProducts(pRes.data);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsClient(true);
      fetchData();
    }
  }, []);

  const addItem = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existing = selectedItems.find(item => item.productId === productId);
    if (existing) {
      setSelectedItems(selectedItems.map(item => 
        item.productId === productId ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setSelectedItems([...selectedItems, { productId, nombre: product.nombre, cantidad: 1, precio: product.precio }]);
    }
  };

  const removeItem = (productId: number) => {
    setSelectedItems(selectedItems.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    return selectedItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  };

  const handleCreate = async () => {
    if (!selectedClientId && selectedItems.length === 0) {
      setValidationError('Debes seleccionar un cliente y agregar al menos un producto.');
      return;
    }
    if (!selectedClientId) {
      setValidationError('Debes seleccionar un cliente para la cotización.');
      return;
    }
    if (selectedItems.length === 0) {
      setValidationError('Debes agregar al menos un producto a la cotización.');
      return;
    }
    
    setIsSaving(true);
    try {
      await api.post('/quotations', {
        clienteId: selectedClientId,
        items: selectedItems.map(item => ({
          productId: item.productId,
          cantidad: item.cantidad
        }))
      });
      setModalOpen(false);
      setSelectedItems([]);
      setSelectedClientId('');
      setCatalogSearchTerm('');
      toast.success('Cotización creada con éxito');
      fetchData();
    } catch (error) {
      toast.error('Error al crear la cotización.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewDetails = async (id: number) => {
    try {
      const response = await api.get(`/quotations/${id}`);
      setSelectedQuotation(response.data);
      setDetailsModalOpen(true);
    } catch (error) {
      toast.error('Error al cargar detalles de la cotización');
    }
  };

  const handlePrint = async (id: number) => {
    try {
      const response = await api.get(`/quotations/${id}`);
      setSelectedQuotation(response.data);
      setPreviewModalOpen(true);
    } catch (error) {
      toast.error('Error al generar previsualización');
    }
  };

  const handleDelete = (id: number) => {
    setQuotationToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!quotationToDelete) return;
    try {
      await api.delete(`/quotations/${quotationToDelete}`);
      setQuotations(quotations.filter(q => q.id !== quotationToDelete));
      toast.success('Cotización eliminada correctamente');
      setDeleteModalOpen(false);
      setQuotationToDelete(null);
    } catch (error) {
      toast.error('Error al eliminar la cotización');
    }
  };

  const handleSendToClient = async (id: number) => {
    setIsSendingEmail(true);
    try {
      // Simulamos el envío y actualizamos el estado en el backend
      await api.patch(`/quotations/${id}/status`, null, { params: { status: 'ENVIADA' } });
      
      // Actualizamos la lista local
      setQuotations(quotations.map(q => q.id === id ? { ...q, estado: 'ENVIADA' } : q));
      
      // Simulación de delay para UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowSuccessModal(true);
      setDetailsModalOpen(false);
      setPreviewModalOpen(false);
    } catch (error) {
      alert('Error al enviar la cotización');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleAcceptQuotation = async (id: number) => {
    try {
      await api.patch(`/quotations/${id}/status`, null, { params: { status: 'ACEPTADA' } });
      setQuotations(quotations.map(q => q.id === id ? { ...q, estado: 'ACEPTADA' } : q));
      toast.success('Cotización aceptada. El stock ha sido actualizado.');
      setDetailsModalOpen(false);
      setPreviewModalOpen(false);
      fetchData(); // Recargamos para ver stock actualizado en catálogo
    } catch (error) {
      toast.error('Error al aceptar la cotización');
    }
  };

  const filteredQuotations = [...quotations]
    .sort((a, b) => b.id - a.id)
    .filter(q => 
      (q.clientNombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (1000 + q.id).toString().includes(searchTerm)
    );

  const filteredCatalog = products.filter(p => 
    p.nombre.toLowerCase().includes(catalogSearchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Cotizaciones</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Gestiona y genera nuevas cotizaciones para tus clientes.</p>
          </div>
          <button 
            onClick={() => setModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl flex items-center space-x-2 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Cotización</span>
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Buscar por cliente o folio..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-none">
                  <th className="px-6 py-4">Folio</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="border-none">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
                    </td>
                  </tr>
                ) : filteredQuotations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                      No se encontraron cotizaciones.
                    </td>
                  </tr>
                ) : filteredQuotations.map((q, index) => (
                  <tr key={q.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-bold text-slate-400">{index + 1}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">#{1000 + q.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{q.clientNombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {isClient ? new Date(q.fecha).toLocaleDateString() : '...'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-bold",
                        q.estado === 'PENDIENTE' ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" : 
                        q.estado === 'ACEPTADA' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      )}>
                        {q.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800 dark:text-white">
                      ${q.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handlePrint(q.id)}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleViewDetails(q.id)}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(q.id)}
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

      {/* Modal de Creación Gigante */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-600 p-2 rounded-xl">
                  <FileText className="text-white w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-slate-800 dark:text-white">Generador de Cotización</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">Nueva Orden de Venta</p>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
              {/* Selección de Productos (Izquierda) */}
              <div className="w-1/2 p-6 overflow-y-auto border-r border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30">
                <div className="mb-6">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">1. Seleccionar Cliente</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm dark:text-white"
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(Number(e.target.value))}
                  >
                    <option value="">-- Elige un cliente --</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">2. Agregar Productos</label>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" 
                      placeholder="Buscar en catálogo..." 
                      value={catalogSearchTerm}
                      onChange={(e) => setCatalogSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    {filteredCatalog.length === 0 ? (
                      <p className="text-center text-slate-400 py-4 text-sm italic">Sin resultados</p>
                    ) : filteredCatalog.map(p => (
                      <div key={p.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex justify-between items-center group hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">{p.nombre}</p>
                          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">${p.precio.toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={() => addItem(p.id)}
                          className="bg-slate-50 dark:bg-slate-700 group-hover:bg-emerald-600 group-hover:text-white text-slate-400 p-2 rounded-xl transition-all"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resumen de Cotización (Derecha) */}
              <div className="w-1/2 p-6 flex flex-col bg-white dark:bg-slate-900">
                <div className="flex items-center space-x-2 mb-6">
                  <ShoppingCart className="text-slate-400 w-5 h-5" />
                  <h3 className="font-bold text-slate-800 dark:text-white">Resumen de Orden</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 mb-6">
                  {selectedItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 space-y-4">
                      <ShoppingCart className="w-16 h-16 opacity-20" />
                      <p className="font-medium text-center">No hay productos en la cotización aún.</p>
                    </div>
                  ) : selectedItems.map(item => (
                    <div key={item.productId} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <div>
                        <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{item.nombre}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Cantidad: {item.cantidad} x ${item.precio}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-slate-700 dark:text-slate-200">${(item.precio * item.cantidad).toLocaleString()}</span>
                        <button onClick={() => removeItem(item.productId)} className="text-rose-400 hover:text-rose-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Subtotal</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">${calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xl">
                    <span className="text-slate-800 dark:text-white font-black">Total</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-black">${calculateTotal().toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={handleCreate}
                    disabled={isSaving || selectedItems.length === 0}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-sm transition-all flex items-center justify-center space-x-2"
                  >
                    {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Confirmar y Enviar Cotización</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Validación de Cotización */}
      {validationError && (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 text-center">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Información incompleta</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed font-medium">
              {validationError}
            </p>
            <button 
              onClick={() => setValidationError(null)}
              className="w-full py-4 bg-slate-900 dark:bg-emerald-600 text-white font-bold rounded-2xl hover:bg-slate-800 dark:hover:bg-emerald-700 transition-all active:scale-[0.98]"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
      
      {/* Modal de Detalles de Cotización */}
      {isDetailsModalOpen && selectedQuotation && (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <h2 className="font-bold text-xl text-slate-800 dark:text-white">Detalle de Cotización</h2>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">Folio #{1000 + selectedQuotation.id}</p>
              </div>
              <button onClick={() => setDetailsModalOpen(false)} className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm text-slate-400 hover:text-slate-600 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Cliente</p>
                  <p className="font-bold text-slate-800 dark:text-white text-lg">{selectedQuotation.clientNombre}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Fecha de Emisión</p>
                  <p className="font-medium text-slate-600 dark:text-slate-300">
                    {isClient ? new Date(selectedQuotation.fecha).toLocaleDateString() : '...'}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <th className="pb-3">Producto</th>
                      <th className="pb-3 text-center">Cant.</th>
                      <th className="pb-3 text-right">Precio</th>
                      <th className="pb-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {selectedQuotation.items?.map((item: any, idx: number) => (
                      <tr key={idx} className="border-t border-slate-100 dark:border-slate-800">
                        <td className="py-3 font-semibold text-slate-700 dark:text-slate-300">{item.productNombre}</td>
                        <td className="py-3 text-center text-slate-600 dark:text-slate-400">{item.cantidad}</td>
                        <td className="py-3 text-right text-slate-600 dark:text-slate-400">${item.precioUnitario.toLocaleString()}</td>
                        <td className="py-3 text-right font-bold text-slate-800 dark:text-white">${(item.precioUnitario * item.cantidad).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <div className="w-48 space-y-2">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">${selectedQuotation.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black text-emerald-600 dark:text-emerald-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Total</span>
                    <span>${selectedQuotation.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex space-x-3">
              <PDFDownloadLink 
                document={<QuotationPDF quotation={selectedQuotation} />} 
                fileName={`Cotizacion_${1000 + selectedQuotation.id}.pdf`}
                className="flex-1 bg-slate-800 dark:bg-slate-700 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-all flex items-center justify-center space-x-2"
              >
                {({ loading }) => (
                  <>
                    <Printer className="w-5 h-5" />
                    <span>{loading ? 'Generando...' : 'Descargar PDF'}</span>
                  </>
                )}
              </PDFDownloadLink>
              {selectedQuotation.estado === 'PENDIENTE' && (
                <button 
                  onClick={() => handleSendToClient(selectedQuotation.id)}
                  disabled={isSendingEmail}
                  className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSendingEmail ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Enviar al Cliente</span>
                    </>
                  )}
                </button>
              )}

              {selectedQuotation.estado === 'ENVIADA' && (
                <button 
                  onClick={() => handleAcceptQuotation(selectedQuotation.id)}
                  className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Aceptar Cotización</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Modal de Previsualización de PDF */}
      {isPreviewModalOpen && selectedQuotation && (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col h-[90vh]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <h2 className="font-bold text-xl text-slate-800 dark:text-white">Vista Previa de Impresión</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Folio #{1000 + selectedQuotation.id}</p>
              </div>
              <button onClick={() => setPreviewModalOpen(false)} className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm text-slate-400 hover:text-slate-600 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-4">
              {isClient && (
                <PDFViewer width="100%" height="100%" className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
                  <QuotationPDF quotation={selectedQuotation} />
                </PDFViewer>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex space-x-3">
              <button 
                onClick={() => setPreviewModalOpen(false)}
                className="flex-1 px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 transition-all"
              >
                Cerrar
              </button>
              
              {selectedQuotation.estado === 'PENDIENTE' && (
                <button 
                  onClick={() => handleSendToClient(selectedQuotation.id)}
                  disabled={isSendingEmail}
                  className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSendingEmail ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Enviar al Cliente</span>
                    </>
                  )}
                </button>
              )}

              {selectedQuotation.estado === 'ENVIADA' && (
                <button 
                  onClick={() => handleAcceptQuotation(selectedQuotation.id)}
                  className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Aceptar Cotización</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 p-8 text-center">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">¿Eliminar cotización?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
              Esta acción eliminará permanentemente la cotización Folio #{quotationToDelete ? 1000 + quotationToDelete : ''}. Esta operación no se puede deshacer.
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Éxito en Envío */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 text-center">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">¡Enviado con éxito!</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
              La cotización ha sido enviada correctamente al cliente. El estado se ha actualizado a <span className="text-emerald-600 font-bold">ENVIADA</span>.
            </p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-4 bg-slate-900 dark:bg-emerald-600 text-white font-bold rounded-2xl hover:bg-slate-800 dark:hover:bg-emerald-700 transition-all active:scale-[0.98]"
            >
              Excelente
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

// Helper local function
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
