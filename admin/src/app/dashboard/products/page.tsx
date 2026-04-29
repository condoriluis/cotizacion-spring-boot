"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Package, 
  Search, 
  Plus, 
  Trash2, 
  Edit,
  Loader2,
  X,
  AlertTriangle,
  Tag,
  Boxes
} from 'lucide-react';
import api from '@/services/api';
import { toast } from 'sonner';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [newProduct, setNewProduct] = useState({ nombre: '', precio: 0, stock: 0 });
  const [isSaving, setIsSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchProducts();
    }
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct}`, newProduct);
      } else {
        await api.post('/products', newProduct);
      }
      toast.success(editingProduct ? 'Producto actualizado' : 'Producto creado con éxito');
      setModalOpen(false);
      setNewProduct({ nombre: '', precio: 0, stock: 0 });
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      toast.error('Error al guardar el producto.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product.id);
    setNewProduct({
      nombre: product.nombre,
      precio: product.precio,
      stock: product.stock
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    setProductToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/products/${productToDelete}`);
      setProducts(products.filter(p => p.id !== productToDelete));
      toast.success('Producto eliminado correctamente');
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      alert('Error al eliminar el producto');
    }
  };

  const filteredProducts = [...products]
    .sort((a, b) => b.id - a.id)
    .filter(product => 
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Catálogo de Productos</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Gestiona tus productos y niveles de stock.</p>
          </div>
          <button 
            onClick={() => setModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl flex items-center space-x-2 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Producto</span>
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Buscar producto por nombre..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-left text-xs font-black text-slate-400 uppercase tracking-widest border-none">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">Precio</th>
                  <th className="px-6 py-4">Stock</th>
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
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                      No se encontraron productos.
                    </td>
                  </tr>
                ) : filteredProducts.map((product, index) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-bold text-slate-400">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-white">{product.nombre}</span>
                          <p className="text-xs text-slate-400">SKU: PROD-{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center font-bold text-slate-700 dark:text-slate-200">
                        <Tag className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                        ${product.precio.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Boxes className="w-4 h-4 mr-2 text-slate-400" />
                        <span className={cn(
                          "font-semibold",
                          product.stock <= 5 ? "text-orange-500" : "text-slate-700 dark:text-slate-300"
                        )}>
                          {product.stock} uds.
                        </span>
                        {product.stock <= 5 && (
                          <div className="ml-2 bg-orange-50 text-orange-500 p-1 rounded-full" title="Bajo Stock">
                            <AlertTriangle className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2 transition-opacity">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
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
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button 
                onClick={() => {
                  setModalOpen(false);
                  setEditingProduct(null);
                  setNewProduct({ nombre: '', precio: 0, stock: 0 });
                }} 
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nombre del Producto</label>
                <input 
                  required
                  className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                  placeholder="Ej. Laptop HP Envy"
                  value={newProduct.nombre}
                  onChange={(e) => setNewProduct({...newProduct, nombre: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Precio ($)</label>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                    placeholder="0.00"
                    value={newProduct.precio}
                    onChange={(e) => setNewProduct({...newProduct, precio: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Stock Inicial</label>
                  <input 
                    required
                    type="number"
                    className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                    placeholder="0"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                  />
                </div>
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
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{editingProduct ? 'Actualizar Producto' : 'Guardar Producto'}</span>}
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
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">¿Eliminar producto?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Esta acción eliminará permanentemente el producto del inventario.
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

// Helper local function
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
