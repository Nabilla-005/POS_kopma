import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, Receipt, ShoppingCart } from "lucide-react";
import { StatsCard } from "../components/StatsCard";
import { SalesChart } from "../components/SalesChart";
import { PaymentMethodChart } from "../components/PaymentMethodChart";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const categoryData = [
  { kategori: "Elektronik", penjualan: 45000000, keuntungan: 12000000 },
  { kategori: "Aksesoris", penjualan: 32000000, keuntungan: 9000000 },
];

export function Laporan() {

  const [laporan, setLaporan] = useState({
    penjualanBulanIni: 0,
    keuntunganBulanIni: 0,
    totalTransaksi: 0,
    produkTerjual: 0,
  });

  useEffect(() => {
    fetch("http://localhost:5000/laporan")
      .then((res) => res.json())
      .then((data) => setLaporan(data))
      .catch((err) => console.log(err));
  }, []);

 return (
  <div className="space-y-6">

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Penjualan Bulan Ini"
        value={`Rp ${laporan.penjualanBulanIni.toLocaleString("id-ID")}`}
        change="+12.5%"
        isPositive={true}
        icon={DollarSign}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />

      <StatsCard
        title="Keuntungan Bulan Ini"
        value={`Rp ${laporan.keuntunganBulanIni.toLocaleString("id-ID")}`}
        change="+8.3%"
        isPositive={true}
        icon={TrendingUp}
        iconBgColor="bg-green-100 dark:bg-green-900/20"
        iconColor="text-green-600 dark:text-green-400"
      />

      <StatsCard
        title="Total Transaksi"
        value={laporan.totalTransaksi.toString()}
        change="+15.2%"
        isPositive={true}
        icon={Receipt}
        iconBgColor="bg-purple-100 dark:bg-purple-900/20"
        iconColor="text-purple-600 dark:text-purple-400"
      />

      <StatsCard
        title="Produk Terjual"
        value={laporan.produkTerjual.toString()}
        change="+22.1%"
        isPositive={true}
        icon={ShoppingCart}
        iconBgColor="bg-orange-100 dark:bg-orange-900/20"
        iconColor="text-orange-600 dark:text-orange-400"
      />
    </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <PaymentMethodChart />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Penjualan per Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
              <XAxis dataKey="kategori" className="text-xs" stroke="currentColor" />
              <YAxis className="text-xs" stroke="currentColor" />
              <Tooltip
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
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Produk Terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { nama: "Laptop Asus ROG", terjual: 45, revenue: "Rp 81 Juta" },
                { nama: "Mouse Logitech MX Master", terjual: 38, revenue: "Rp 38 Juta" },
                { nama: "Keyboard Mechanical", terjual: 32, revenue: "Rp 48 Juta" },
                { nama: "Monitor LG UltraWide", terjual: 28, revenue: "Rp 140 Juta" },
                { nama: "Webcam Logitech C920", terjual: 25, revenue: "Rp 32,5 Juta" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
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
                    {item.revenue}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kasir Terbaik</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { nama: "Ahmad", transaksi: 156, revenue: "Rp 89 Juta" },
                { nama: "Siti", transaksi: 142, revenue: "Rp 78 Juta" },
                { nama: "Budi", transaksi: 128, revenue: "Rp 65 Juta" },
                { nama: "Rina", transaksi: 115, revenue: "Rp 58 Juta" },
                { nama: "Dedi", transaksi: 98, revenue: "Rp 45 Juta" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                      {item.nama.charAt(0)}
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
                    {item.revenue}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}