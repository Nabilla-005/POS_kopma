import { useState, useEffect } from "react";
import { TransactionTable } from "../components/TransactionTable";
import { AddTransactionModal } from "../components/AddTransactionModal";
import { TrendingUp, DollarSign, CreditCard } from "lucide-react";
import { StatsCard } from "../components/StatsCard";
import { toast } from "sonner";

interface Transaction {
  id: number;
  total: number;
  createdAt: string;
}

export function Transaksi() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    transaksiHariIni: 0,
    penjualanHariIni: 0,
    rataRataTransaksi: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
  try {
    const res = await fetch("http://localhost:3001/api/transactions");
    const data: Transaction[] = res.ok ? await res.json() : [];

    // Parse format "2026-06-10 18:52:39" dengan aman
    const parseDate = (str: string) => new Date(str.replace(" ", "T"));

    // Filter transaksi hari ini
    const today = new Date().toDateString();
    const hariIni = data.filter(
      (t) => parseDate(t.createdAt).toDateString() === today
    );

    const penjualanHariIni = hariIni.reduce((sum, t) => sum + t.total, 0);
    const transaksiHariIni = hariIni.length;
    const rataRataTransaksi =
      transaksiHariIni > 0
        ? Math.floor(penjualanHariIni / transaksiHariIni)
        : 0;

    setStats({ transaksiHariIni, penjualanHariIni, rataRataTransaksi });
  } catch (error) {
    toast.error("Error", { description: "Gagal memuat data transaksi" });
    console.error("Error:", error);
  }
};

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Transaksi
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Kelola semua transaksi penjualan Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Transaksi Hari Ini"
            value={stats.transaksiHariIni.toString()}
            change="+8.2%"
            isPositive={true}
            icon={TrendingUp}
            iconBgColor="bg-blue-100 dark:bg-blue-900/20"
            iconColor="text-blue-600 dark:text-blue-400"
          />
          <StatsCard
            title="Penjualan Hari Ini"
            value={`Rp ${stats.penjualanHariIni.toLocaleString("id-ID")}`}
            change="+15.3%"
            isPositive={true}
            icon={DollarSign}
            iconBgColor="bg-green-100 dark:bg-green-900/20"
            iconColor="text-green-600 dark:text-green-400"
          />
          <StatsCard
            title="Rata-rata Transaksi"
            value={`Rp ${stats.rataRataTransaksi.toLocaleString("id-ID")}`}
            change="+5.1%"
            isPositive={true}
            icon={CreditCard}
            iconBgColor="bg-purple-100 dark:bg-purple-900/20"
            iconColor="text-purple-600 dark:text-purple-400"
          />
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