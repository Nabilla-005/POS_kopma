import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { toast } from "sonner";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Transaksi berhasil ditambahkan!", {
      description: `${formData.namaBarang} telah ditambahkan ke daftar transaksi.`,
    });
    onClose();
    setFormData({
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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Tambah Transaksi Baru
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Barang <span className="text-red-500">*</span>
              </label>
              <Input
                required
                value={formData.namaBarang}
                onChange={(e) =>
                  setFormData({ ...formData, namaBarang: e.target.value })
                }
                placeholder="Masukkan nama barang"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jumlah <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                required
                min="1"
                value={formData.jumlah}
                onChange={(e) =>
                  setFormData({ ...formData, jumlah: e.target.value })
                }
                placeholder="0"
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
                onChange={(e) =>
                  setFormData({ ...formData, hargaBeli: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, hargaJual: e.target.value })
                }
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Diskon
              </label>
              <Input
                type="number"
                min="0"
                value={formData.diskon}
                onChange={(e) =>
                  setFormData({ ...formData, diskon: e.target.value })
                }
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pajak
              </label>
              <Input
                type="number"
                min="0"
                value={formData.pajak}
                onChange={(e) =>
                  setFormData({ ...formData, pajak: e.target.value })
                }
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kasir <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.kasir}
                onChange={(e) =>
                  setFormData({ ...formData, kasir: e.target.value })
                }
                className="flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
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
              <select
                required
                value={formData.metodePembayaran}
                onChange={(e) =>
                  setFormData({ ...formData, metodePembayaran: e.target.value })
                }
                className="flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <option value="">Pilih Metode</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="E-Wallet">E-Wallet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Pelanggan <span className="text-red-500">*</span>
              </label>
              <Input
                required
                value={formData.namaPelanggan}
                onChange={(e) =>
                  setFormData({ ...formData, namaPelanggan: e.target.value })
                }
                placeholder="Masukkan nama pelanggan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Pelanggan
              </label>
              <Input
                type="email"
                value={formData.emailPelanggan}
                onChange={(e) =>
                  setFormData({ ...formData, emailPelanggan: e.target.value })
                }
                placeholder="email@example.com"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catatan
              </label>
              <textarea
                value={formData.catatan}
                onChange={(e) =>
                  setFormData({ ...formData, catatan: e.target.value })
                }
                placeholder="Tambahkan catatan transaksi (opsional)"
                rows={3}
                className="flex w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 resize-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              Simpan Transaksi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
