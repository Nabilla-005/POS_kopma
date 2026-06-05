import { Save, User, Store, Bell, Lock, CreditCard } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export function Pengaturan() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Pengaturan
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Kelola preferensi dan konfigurasi sistem Anda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-5 h-5" />
              Profil Pengguna
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Lengkap
              </label>
              <Input defaultValue="Admin User" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <Input type="email" defaultValue="admin@posystem.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Telepon
              </label>
              <Input defaultValue="08123456789" />
            </div>
            <Button className="w-full gap-2">
              <Save className="w-4 h-4" />
              Simpan Profil
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Store className="w-5 h-5" />
              Informasi Toko
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Toko
              </label>
              <Input defaultValue="Kopma Itenas" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alamat
              </label>
              <Input defaultValue=" Jl. Khp Hasan Mustopa No.23, Bandung" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Telepon Toko
              </label>
              <Input defaultValue="021-12345678" />
            </div>
            <Button className="w-full gap-2">
              <Save className="w-4 h-4" />
              Simpan Toko
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lock className="w-5 h-5" />
              Keamanan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password Lama
              </label>
              <Input type="password" placeholder="Masukkan password lama" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password Baru
              </label>
              <Input type="password" placeholder="Masukkan password baru" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Konfirmasi Password
              </label>
              <Input type="password" placeholder="Konfirmasi password baru" />
            </div>
            <Button className="w-full gap-2">
              <Save className="w-4 h-4" />
              Update Password
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="w-5 h-5" />
              Notifikasi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Notifikasi Transaksi Baru", description: "Terima notifikasi setiap ada transaksi baru" },
              { label: "Notifikasi Stok Menipis", description: "Terima peringatan saat stok produk menipis" },
              { label: "Laporan Harian", description: "Terima laporan penjualan harian via email" },
              { label: "Update Sistem", description: "Terima informasi update dan fitur baru" },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <input
                  type="checkbox"
                  defaultChecked={index < 2}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="w-5 h-5" />
              Metode Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Cash / Tunai", enabled: true },
              { name: "Debit Card", enabled: true },
              { name: "Credit Card", enabled: true },
              { name: "E-Wallet (GoPay, OVO, Dana)", enabled: true },
              { name: "Bank Transfer", enabled: false },
              { name: "QRIS", enabled: true },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked={item.enabled}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {item.name}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  Konfigurasi
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
