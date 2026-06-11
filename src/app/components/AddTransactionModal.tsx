import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { toast } from "sonner";

interface Product {
  id: number;
  nama: string;
  hargaBeli: number;
  hargaJual: number;
  stok: number;
  kategori: string;
}

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded?: () => void;
}

export function AddTransactionModal({ isOpen, onClose, onTransactionAdded }: AddTransactionModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    namaBarang: "",
    jumlah: "",
    hargaBeli: "",
    hargaJual: "",
    diskon: "",
    pajak: "",
    kasir: "",
    metodePembayaran: "",
    namaPelanggan: "",
    emailPelanggan: "",
    catatan: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:3001/api/products")
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch(() => toast.error("Gagal memuat daftar produk"));
    }
  }, [isOpen]);

  const handleProductChange = (nama: string) => {
    const product = products.find((p) => p.nama === nama) || null;
    setSelectedProduct(product);
    setFormData((prev) => ({
      ...prev,
      namaBarang: nama,
      hargaBeli: product ? product.hargaBeli.toString() : "",
      hargaJual: product ? product.hargaJual.toString() : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi jumlah vs stok
    if (selectedProduct && parseInt(formData.jumlah) > selectedProduct.stok) {
      toast.error("Stok tidak cukup", {
        description: `Stok tersedia: ${selectedProduct.stok}`,
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namaBarang: formData.namaBarang,
          jumlah: parseInt(formData.jumlah),
          hargaBeli: parseFloat(formData.hargaBeli),
          hargaJual: parseFloat(formData.hargaJual),
          diskon: formData.diskon ? parseFloat(formData.diskon) : 0,
          pajak: formData.pajak ? parseFloat(formData.pajak) : 0,
          kasir: formData.kasir,
          metodePembayaran: formData.metodePembayaran,
          namaPelanggan: formData.namaPelanggan,
          emailPelanggan: formData.emailPelanggan,
          catatan: formData.catatan,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error("Gagal menambahkan transaksi", { description: error.error });
        return;
      }

      toast.success("Transaksi berhasil ditambahkan!", {
        description: `${formData.namaBarang} telah disimpan.`,
      });

      // Cek apakah stok setelah transaksi menipis
      if (selectedProduct) {
        const sisaStok = selectedProduct.stok - parseInt(formData.jumlah);
        if (sisaStok <= 5 && sisaStok > 0) {
          toast.warning(`⚠️ Stok ${selectedProduct.nama} menipis!`, {
            description: `Sisa stok: ${sisaStok} unit`,
          });
        } else if (sisaStok === 0) {
          toast.error(`🚫 Stok ${selectedProduct.nama} habis!`, {
            description: "Segera lakukan restok.",
          });
        }
      }

      onClose();
      onTransactionAdded?.();
      // Reset form
      setFormData({
        namaBarang: "", jumlah: "", hargaBeli: "", hargaJual: "",
        diskon: "", pajak: "", kasir: "", metodePembayaran: "",
        namaPelanggan: "", emailPelanggan: "", catatan: "",
      });
      setSelectedProduct(null);
    } catch (error) {
      toast.error("Error", { description: "Tidak bisa terhubung ke server." });
    }
  };

  if (!isOpen) return null;

  const jumlahInt = parseInt(formData.jumlah) || 0;
  const stokWarning = selectedProduct && jumlahInt > 0 && selectedProduct.stok - jumlahInt <= 5;
  const stokHabis = selectedProduct && jumlahInt > selectedProduct.stok;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tambah Transaksi Baru</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-2 gap-4">

            {/* Pilih Produk */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Barang <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.namaBarang}
                onChange={(e) => handleProductChange(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <option value="">Pilih produk...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.nama} disabled={p.stok === 0}>
                    {p.nama} — Stok: {p.stok} {p.stok === 0 ? "(Habis)" : ""}
                  </option>
                ))}
              </select>

              {/* Info stok produk terpilih */}
              {selectedProduct && (
                <div className={`mt-2 px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                  stokHabis
                    ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                    : stokWarning
                    ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400"
                    : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                }`}>
                  {(stokHabis || stokWarning) && <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
                  {stokHabis
                    ? `Jumlah melebihi stok! Stok tersedia: ${selectedProduct.stok}`
                    : stokWarning
                    ? `Peringatan: Sisa stok setelah transaksi: ${selectedProduct.stok - jumlahInt}`
                    : `Stok tersedia: ${selectedProduct.stok} unit`}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jumlah <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                required
                min="1"
                max={selectedProduct?.stok || undefined}
                value={formData.jumlah}
                onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
                placeholder="0"
                className={stokHabis ? "border-red-500" : ""}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Harga Beli <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                required
                min="0"
                value={formData.hargaBeli}
                onChange={(e) => setFormData({ ...formData, hargaBeli: e.target.value })}
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Harga Jual <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                required
                min="0"
                value={formData.hargaJual}
                onChange={(e) => setFormData({ ...formData, hargaJual: e.target.value })}
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Diskon (%)</label>
              <Input type="number" min="0" max="100" value={formData.diskon}
                onChange={(e) => setFormData({ ...formData, diskon: e.target.value })} placeholder="0" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pajak (%)</label>
              <Input type="number" min="0" value={formData.pajak}
                onChange={(e) => setFormData({ ...formData, pajak: e.target.value })} placeholder="0" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kasir <span className="text-red-500">*</span>
              </label>
              <select required value={formData.kasir}
                onChange={(e) => setFormData({ ...formData, kasir: e.target.value })}
                className="flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                <option value="">Pilih Kasir</option>
                <option value="Ahmad">Ahmad</option>
                <option value="Siti">Siti</option>
                <option value="Budi">Budi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Metode Pembayaran <span className="text-red-500">*</span>
              </label>
              <select required value={formData.metodePembayaran}
                onChange={(e) => setFormData({ ...formData, metodePembayaran: e.target.value })}
                className="flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                <option value="">Pilih Metode</option>
                <option value="Cash">Cash</option>
                <option value="QRIS">QRIS</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="E-Wallet">E-Wallet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Pelanggan <span className="text-red-500">*</span>
              </label>
              <Input required value={formData.namaPelanggan}
                onChange={(e) => setFormData({ ...formData, namaPelanggan: e.target.value })}
                placeholder="Masukkan nama pelanggan" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Pelanggan</label>
              <Input type="email" value={formData.emailPelanggan}
                onChange={(e) => setFormData({ ...formData, emailPelanggan: e.target.value })}
                placeholder="email@example.com" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Catatan</label>
              <textarea value={formData.catatan}
                onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                placeholder="Tambahkan catatan (opsional)" rows={3}
                className="flex w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 resize-none" />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Batal</Button>
            <Button type="submit" className="flex-1" disabled={!!stokHabis}>
              Simpan Transaksi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}