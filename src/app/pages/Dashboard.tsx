import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, Receipt, Users } from "lucide-react";
import { StatsCard } from "../components/StatsCard";
import { SalesChart } from "../components/SalesChart";
import { PaymentMethodChart } from "../components/PaymentMethodChart";
import { TransactionTable } from "../components/TransactionTable";
import { AddTransactionModal } from "../components/AddTransactionModal";
import { toast } from "sonner";

interface Transaction {
  id: number;
  total: number;
  createdAt: string;
}

interface Customer {
  id: number;
}

export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState({
    totalPenjualan: 0,
    totalProfit: 0,
    totalTransaksi: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch transactions
      const transResponse = await fetch("http://localhost:3001/api/transactions");
      const transData: Transaction[] = transResponse.ok
        ? await transResponse.json()
        : [];

      // Fetch customers
      const custResponse = await fetch("http://localhost:3001/api/customers");
      const custData: Customer[] = custResponse.ok
        ? await custResponse.json()
        : [];

      // Fetch products untuk calculate profit
      const prodResponse = await fetch("http://localhost:3001/api/products");
      const prodData = prodResponse.ok ? await prodResponse.json() : [];

      setTransactions(transData);
      setCustomers(custData);

      // Calculate stats
      const totalPenjualan = transData.reduce((sum, t) => sum + t.total, 0);
      
      // Simplified profit calculation
      const totalProfit = Math.floor(totalPenjualan * 0.32); // ~32% markup average
      
      setStats({
        totalPenjualan,
        totalProfit,
        totalTransaksi: transData.length,
        totalCustomers: custData.length,
      });
    } catch (error) {
      toast.error("Error", {
        description: "Gagal memuat data dashboard",
      });
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Selamat datang di sistem POS modern Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Penjualan"
            value={`Rp ${(stats.totalPenjualan / 1000000).toFixed(1)} Juta`}
            change="+12.5%"
            isPositive={true}
            icon={DollarSign}
            iconBgColor="bg-blue-100 dark:bg-blue-900/20"
            iconColor="text-blue-600 dark:text-blue-400"
          />
          <StatsCard
            title="Total Keuntungan"
            value={`Rp ${(stats.totalProfit / 1000000).toFixed(1)} Juta`}
            change="+8.3%"
            isPositive={true}
            icon={TrendingUp}
            iconBgColor="bg-green-100 dark:bg-green-900/20"
            iconColor="text-green-600 dark:text-green-400"
          />
          <StatsCard
            title="Jumlah Transaksi"
            value={stats.totalTransaksi.toString()}
            change="+15.2%"
            isPositive={true}
            icon={Receipt}
            iconBgColor="bg-purple-100 dark:bg-purple-900/20"
            iconColor="text-purple-600 dark:text-purple-400"
          />
          <StatsCard
            title="Jumlah Pelanggan"
            value={stats.totalCustomers.toString()}
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