import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, Receipt, ShoppingCart } from "lucide-react";
import { StatsCard } from "../components/StatsCard";
import { SalesChart } from "../components/SalesChart";
import { PaymentMethodChart } from "../components/PaymentMethodChart";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface Transaction {
  id: number;
  namaBarang: string;
  jumlah: number;
  hargaBeli: number;
  hargaJual: number;
  diskon: number;
  pajak: number;
  kasir: string;
  metodePembayaran: string;
  total: number;
  createdAt: string;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

export function Laporan() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/transactions")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // ── Filter bulan ini ──────────────────────────────────────────
  const now = new Date();
  const bulanIni = transactions.filter((t) => {
    const d = new Date(t.createdAt.replace(" ", "T"));
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  // ── Stats ─────────────────────────────────────────────────────
  const penjualanBulanIni = bulanIni.reduce((s, t) => s + t.total, 0);
  const keuntunganBulanIni = bulanIni.reduce(
    (s, t) => s + (t.hargaJual - t.hargaBeli) * t.jumlah, 0
  );
  const totalTransaksi = bulanIni.length;
  const produkTerjual = bulanIni.reduce((s, t) => s + t.jumlah, 0);

  // ── Penjualan per Kategori 
  const categoryMap: Record<string, { penjualan: number; keuntungan: number }> = {};
  bulanIni.forEach((t) => {
    // Gunakan 2 kata pertama nama barang sebagai kategori visual
    const cat = t.namaBarang.split(" ").slice(0, 2).join(" ");
    if (!categoryMap[cat]) categoryMap[cat] = { penjualan: 0, keuntungan: 0 };
    categoryMap[cat].penjualan += t.total;
    categoryMap[cat].keuntungan += (t.hargaJual - t.hargaBeli) * t.jumlah;
  });
  const categoryData = Object.entries(categoryMap)
    .map(([kategori, val]) => ({ kategori, ...val }))
    .sort((a, b) => b.penjualan - a.penjualan)
    .slice(0, 6);

  // ── Produk Terlaris ───────────────────────────────────────────
  const produkMap: Record<string, { terjual: number; revenue: number }> = {};
  transactions.forEach((t) => {
    if (!produkMap[t.namaBarang]) produkMap[t.namaBarang] = { terjual: 0, revenue: 0 };
    produkMap[t.namaBarang].terjual += t.jumlah;
    produkMap[t.namaBarang].revenue += t.total;
  });
  const produkTerlaris = Object.entries(produkMap)
    .map(([nama, val]) => ({ nama, ...val }))
    .sort((a, b) => b.terjual - a.terjual)
    .slice(0, 5);

  // ── Kasir Terbaik ─────────────────────────────────────────────
  const kasirMap: Record<string, { transaksi: number; revenue: number }> = {};
  transactions.forEach((t) => {
    if (!kasirMap[t.kasir]) kasirMap[t.kasir] = { transaksi: 0, revenue: 0 };
    kasirMap[t.kasir].transaksi += 1;
    kasirMap[t.kasir].revenue += t.total;
  });
  const kasirTerbaik = Object.entries(kasirMap)
    .map(([nama, val]) => ({ nama, ...val }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Memuat data laporan...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Laporan
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ringkasan performa penjualan bulan{" "}
          {now.toLocaleString("id-ID", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Penjualan Bulan Ini"
          value={formatCurrency(penjualanBulanIni)}
          change="+12.5%"
          isPositive={true}
          icon={DollarSign}
          iconBgColor="bg-blue-100 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatsCard
          title="Keuntungan Bulan Ini"
          value={formatCurrency(keuntunganBulanIni)}
          change="+8.3%"
          isPositive={true}
          icon={TrendingUp}
          iconBgColor="bg-green-100 dark:bg-green-900/20"
          iconColor="text-green-600 dark:text-green-400"
        />
        <StatsCard
          title="Total Transaksi"
          value={totalTransaksi.toString()}
          change="+15.2%"
          isPositive={true}
          icon={Receipt}
          iconBgColor="bg-purple-100 dark:bg-purple-900/20"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <StatsCard
          title="Produk Terjual"
          value={produkTerjual.toString()}
          change="+22.1%"
          isPositive={true}
          icon={ShoppingCart}
          iconBgColor="bg-orange-100 dark:bg-orange-900/20"
          iconColor="text-orange-600 dark:text-orange-400"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <PaymentMethodChart />
      </div>

      {/* Penjualan per Produk */}
      <Card>
        <CardHeader>
          <CardTitle>Penjualan per Produk (Bulan Ini)</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Belum ada data transaksi bulan ini
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={categoryData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-800"
                />
                <XAxis
                  dataKey="kategori"
                  className="text-xs"
                  stroke="currentColor"
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  className="text-xs"
                  stroke="currentColor"
                  tickFormatter={(v) =>
                    v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v.toString()
                  }
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="penjualan" fill="#3b82f6" name="Penjualan" radius={[8, 8, 0, 0]} />
                <Bar dataKey="keuntungan" fill="#10b981" name="Keuntungan" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Produk Terlaris & Kasir Terbaik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Produk Terlaris (Semua Waktu)</CardTitle>
          </CardHeader>
          <CardContent>
            {produkTerlaris.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Belum ada data transaksi
              </div>
            ) : (
              <div className="space-y-3">
                {produkTerlaris.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {item.nama}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.terjual} unit terjual
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {formatCurrency(item.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kasir Terbaik (Semua Waktu)</CardTitle>
          </CardHeader>
          <CardContent>
            {kasirTerbaik.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Belum ada data transaksi
              </div>
            ) : (
              <div className="space-y-3">
                {kasirTerbaik.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                        {item.nama.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {item.nama}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.transaksi} transaksi
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {formatCurrency(item.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}