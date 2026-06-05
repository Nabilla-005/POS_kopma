import { useState, useEffect } from "react";
import { TransactionTable } from "../components/TransactionTable";
import { AddTransactionModal } from "../components/AddTransactionModal";
import { TrendingUp, DollarSign, CreditCard } from "lucide-react";
import { StatsCard } from "../components/StatsCard";

export function Transaksi() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [transaksi, setTransaksi] = useState({
  transaksiHariIni: 0,
  penjualanHariIni: 0,
  rataRataTransaksi: 0,
});
useEffect(() => {
  fetch("http://localhost:5000/transaksi/stats")
    .then((res) => res.json())
    .then((data) => setTransaksi(data))
    .catch((err) => console.log(err));
}, []);

  useEffect(() => {
    // Simulate fetching transaction data
    const fetchTransaksi = async () => {
      // Replace this with your actual API call
      setTimeout(() => {
        setTransaksi({
          transaksiHariIni: 127,
          penjualanHariIni: 12500000,
          rataRataTransaksi: 98425,
        });
      }, 1000);
    };

    fetchTransaksi();
  }, []);

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
  value={transaksi.transaksiHariIni.toString()}
  change="+8.2%"
  isPositive={true}
  icon={TrendingUp}
  iconBgColor="bg-blue-100 dark:bg-blue-900/20"
  iconColor="text-blue-600 dark:text-blue-400"
/>
<StatsCard
  title="Penjualan Hari Ini"
  value={`Rp ${transaksi.penjualanHariIni.toLocaleString("id-ID")}`}
  change="+15.3%"
  isPositive={true}
  icon={DollarSign}
  iconBgColor="bg-green-100 dark:bg-green-900/20"
  iconColor="text-green-600 dark:text-green-400"
/>
<StatsCard
  title="Rata-rata Transaksi"
  value={`Rp ${transaksi.rataRataTransaksi.toLocaleString("id-ID")}`}
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
