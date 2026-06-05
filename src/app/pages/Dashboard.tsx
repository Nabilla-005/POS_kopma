import { useState,useEffect } from "react";
import { TrendingUp, DollarSign, Receipt, Users } from "lucide-react";
import { StatsCard } from "../components/StatsCard";
import { SalesChart } from "../components/SalesChart";
import { PaymentMethodChart } from "../components/PaymentMethodChart";
import { TransactionTable } from "../components/TransactionTable";
import { AddTransactionModal } from "../components/AddTransactionModal";

export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [dashboard, setDashboard] = useState({
    totalPenjualan: 0,
    totalKeuntungan: 0,
    totalTransaksi: 0,
    totalPelanggan: 0,
  });

  useEffect(() => {
  fetch("http://localhost:5000/dashboard")
    .then((res) => res.json())
    .then((data) => setDashboard(data))
    .catch((err) => console.log(err));
}, []);

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Selamat datang di sistem POS Kopma Itenas! Berikut adalah ringkasan kinerja penjualan dan aktivitas terbaru Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Penjualan"
            value={`Rp ${dashboard.totalPenjualan.toLocaleString("id-ID")}`}
            change="+12.5%"
            isPositive={true}
            icon={DollarSign}
            iconBgColor="bg-blue-100 dark:bg-blue-900/20"
            iconColor="text-blue-600 dark:text-blue-400"
          />
          <StatsCard
            title="Total Keuntungan"
            value={`Rp ${dashboard.totalKeuntungan.toLocaleString("id-ID")}`}
            change="+8.3%"
            isPositive={true}
            icon={TrendingUp}
            iconBgColor="bg-green-100 dark:bg-green-900/20"
            iconColor="text-green-600 dark:text-green-400"
          />
          <StatsCard
            title="Jumlah Transaksi"
            value={dashboard.totalTransaksi.toString()}
            change="+15.2%"
            isPositive={true}
            icon={Receipt}
            iconBgColor="bg-purple-100 dark:bg-purple-900/20"
            iconColor="text-purple-600 dark:text-purple-400"
          />
          <StatsCard
            title="Jumlah Pelanggan"
            value={dashboard.totalPelanggan.toString()}
            change="-3.1%"
            isPositive={false}
            icon={Users}
            iconBgColor="bg-orange-100 dark:bg-orange-900/20"
            iconColor="text-orange-600 dark:text-orange-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesChart />
          <PaymentMethodChart />
        </div>

        <TransactionTable onAddTransaction={() => setIsModalOpen(true)} />
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}