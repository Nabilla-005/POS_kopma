import { useState, useEffect, useRef } from "react";
import { Search, Bell, Moon, Sun, AlertTriangle } from "lucide-react";
import { useTheme } from "next-themes";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface LowStockProduct {
  id: number;
  nama: string;
  kategori: string;
  stok: number;
}

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchLowStock();
    // Refresh setiap 30 detik
    const interval = setInterval(fetchLowStock, 30000);
    return () => clearInterval(interval);
  }, []);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchLowStock = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/products/low-stock");
      if (res.ok) setLowStockProducts(await res.json());
    } catch {}
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search transactions, products, customers..."
            className="pl-10 bg-gray-50 dark:bg-gray-800 border-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        {/* Notifikasi Stok */}
        <div className="relative" ref={notifRef}>
          <Button variant="ghost" size="icon" onClick={() => setShowNotif(!showNotif)}>
            <Bell className="w-5 h-5" />
          </Button>
          {lowStockProducts.length > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
              {lowStockProducts.length > 9 ? "9+" : lowStockProducts.length}
            </span>
          )}

          {/* Dropdown notifikasi */}
          {showNotif && (
            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Notifikasi Stok</h3>
                {lowStockProducts.length > 0 && (
                  <span className="text-xs bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">
                    {lowStockProducts.length} produk
                  </span>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto">
                {lowStockProducts.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Semua stok aman ✓
                  </div>
                ) : (
                  lowStockProducts.map((p) => (
                    <div key={p.id} className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <div className={`p-1.5 rounded-lg ${p.stok === 0 ? "bg-red-100 dark:bg-red-900/30" : "bg-orange-100 dark:bg-orange-900/30"}`}>
                        <AlertTriangle className={`w-4 h-4 ${p.stok === 0 ? "text-red-500" : "text-orange-500"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{p.nama}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{p.kategori}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        p.stok === 0
                          ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                      }`}>
                        {p.stok === 0 ? "Habis" : `Sisa ${p.stok}`}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-400 text-center">
                Update otomatis setiap 30 detik
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-800">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            AU
          </div>
        </div>
      </div>
    </header>
  );
}