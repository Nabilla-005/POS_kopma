import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ThemeProvider";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./pages/Dashboard";
import { Transaksi } from "./pages/Transaksi";
import { Produk } from "./pages/Produk";
import { Pelanggan } from "./pages/Pelanggan";
import { Laporan } from "./pages/Laporan";
import { Pengaturan } from "./pages/Pengaturan";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="flex h-screen bg-gray-50 dark:bg-black overflow-hidden">
          <Sidebar />

          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />

            <main className="flex-1 overflow-y-auto p-6">
              <div className="max-w-[1600px] mx-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/transaksi" element={<Transaksi />} />
                  <Route path="/produk" element={<Produk />} />
                  <Route path="/pelanggan" element={<Pelanggan />} />
                  <Route path="/laporan" element={<Laporan />} />
                  <Route path="/pengaturan" element={<Pengaturan />} />
                </Routes>
              </div>
            </main>
          </div>

          <Toaster position="top-right" richColors />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}