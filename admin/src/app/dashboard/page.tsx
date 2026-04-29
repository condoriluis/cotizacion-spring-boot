"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Users,
  Package,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ExternalLink
} from 'lucide-react';
import api from '@/services/api';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  trend: string;
  isUp: boolean;
  color: string;
}

const StatCard = ({ title, value, icon: Icon, trend, isUp, color }: StatCardProps) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-xl", color)}>
        <Icon className="text-white w-6 h-6" />
      </div>
      <div className={cn(
        "flex items-center text-xs font-bold px-2 py-1 rounded-full",
        isUp ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
      )}>
        {isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        {trend}
      </div>
    </div>
    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{value}</h3>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState({
    clients: 0,
    products: 0,
    quotationsCount: 0,
    totalRevenue: '$0.00'
  });
  const [recentQuotations, setRecentQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [chartData, setChartData] = useState<any[]>([]);
  const [productSalesData, setProductSalesData] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    setCurrentTime(new Date().toLocaleTimeString());
    const fetchData = async () => {
      try {
        const [clients, products, quotations] = await Promise.all([
          api.get('/clients'),
          api.get('/products'),
          api.get('/quotations')
        ]);

        const total = quotations.data.reduce((acc: number, q: any) => acc + q.total, 0);

        // Sort and get last 5 for activity
        const sorted = [...quotations.data].sort((a: any, b: any) =>
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        ).slice(0, 5);

        setStats({
          clients: clients.data.length,
          products: products.data.length,
          quotationsCount: quotations.data.length,
          totalRevenue: `$${total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`
        });
        setRecentQuotations(sorted);

        // Datos para gráfico de área
        const revenueMap = quotations.data.reduce((acc: any, q: any) => {
          const date = new Date(q.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
          acc[date] = (acc[date] || 0) + q.total;
          return acc;
        }, {});
        const areaData = Object.keys(revenueMap).map(date => ({ name: date, total: revenueMap[date] })).slice(-7);
        setChartData(areaData);

        // Datos para gráfico de barras
        const productMap = quotations.data.flatMap((q: any) => q.items).reduce((acc: any, item: any) => {
          const name = item.productNombre || `P${item.productId}`;
          acc[name] = (acc[name] || 0) + item.cantidad;
          return acc;
        }, {});
        const barData = Object.keys(productMap).map(name => ({ name: name.split(' ')[0], fullName: name, cantidad: productMap[name] }))
          .sort((a, b) => b.cantidad - a.cantidad).slice(0, 5);
        setProductSalesData(barData);
      } catch (error) {
        console.error('Error fetching stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Panel de Resumen</h1>
            <p className="text-slate-500 dark:text-slate-400">Datos de las cotizaciones.</p>
          </div>
          <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500">
            <Clock className="w-3 h-3 text-emerald-500" />
            <span>Actualizado: {currentTime || '--:--:--'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Clientes"
            value={stats.clients}
            icon={Users}
            trend="+12%"
            isUp={true}
            color="bg-emerald-600"
          />
          <StatCard
            title="Catálogo Productos"
            value={stats.products}
            icon={Package}
            trend="+3%"
            isUp={true}
            color="bg-purple-600"
          />
          <StatCard
            title="Cotizaciones Emitidas"
            value={stats.quotationsCount}
            icon={FileText}
            trend="+5%"
            isUp={true}
            color="bg-orange-500"
          />
          <StatCard
            title="Valor en Proceso"
            value={stats.totalRevenue}
            icon={TrendingUp}
            trend="+18%"
            isUp={true}
            color="bg-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Ingresos (Área) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="mb-6">
              <h3 className="font-bold text-slate-800 dark:text-white">Flujo de Ingresos</h3>
              <p className="text-xs text-slate-500">Evolución de las cotizaciones en los últimos días</p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis
                    hide={true}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }}
                    itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Productos (Barras) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="mb-6">
              <h3 className="font-bold text-slate-800 dark:text-white">Demanda de Productos</h3>
              <p className="text-xs text-slate-500">Top 5 productos más solicitados en cotizaciones</p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productSalesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis hide={true} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }}
                  />
                  <Bar dataKey="cantidad" radius={[6, 6, 0, 0]} barSize={40}>
                    {productSalesData.map((entry, index) => {
                      const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#f43f5e', '#06b6d4'];
                      return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 dark:text-white">Actividad Reciente (Cotizaciones Reales)</h3>
              <Link href="/dashboard/quotations" className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold hover:underline flex items-center">
                Ver historial <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="py-10 flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-slate-400">Cargando datos reales...</p>
                </div>
              ) : recentQuotations.length === 0 ? (
                <div className="py-10 text-center text-slate-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No hay cotizaciones recientes en la base de datos.</p>
                </div>
              ) : recentQuotations.map((q) => (
                <div key={q.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                  <div className="flex items-center space-x-4">
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 p-2.5 rounded-xl">
                      <FileText className="text-emerald-600 dark:text-emerald-400 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{q.clientNombre}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                        Folio #{1000 + q.id} • {new Date(q.fecha).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-800 dark:text-white">${q.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</p>
                    <span className={cn(
                      "text-[9px] font-black px-1.5 py-0.5 rounded uppercase",
                      q.estado === 'PENDIENTE' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                    )}>
                      {q.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 rounded-2xl text-white flex flex-col justify-between overflow-hidden relative min-h-[220px]">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Acceso Rápido</h3>
                <p className="text-emerald-100/80 text-sm mb-6 leading-relaxed">Genera cotizaciones profesionales conectadas a tu inventario real.</p>
                <button
                  onClick={() => window.location.href = '/dashboard/quotations'}
                  className="bg-white text-emerald-600 font-bold px-6 py-3 rounded-xl hover:bg-emerald-50 transition-all flex items-center group"
                >
                  Nueva Cotización
                  <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
              <FileText className="absolute -right-10 -bottom-10 w-48 h-48 text-white/10 rotate-12" />
            </div>

            <div className="bg-slate-900 dark:bg-emerald-600 p-6 rounded-2xl text-white">
              <h4 className="text-sm font-bold mb-4 opacity-80 uppercase tracking-widest">Estado del Sistema</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span>API Backend</span>
                  <span className="flex items-center text-emerald-400 font-bold">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" /> Operativo
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Base de Datos</span>
                  <span className="flex items-center text-emerald-400 font-bold">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" /> Conectado
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );

}
