import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { toast } from "sonner";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
  product?: {
    id: number;
    nama: string;
    kategori: string;
    hargaBeli: number;
    hargaJual: number;
    stok: number;
  } | null;
}

export function AddProductModal({ isOpen, onClose, onProductAdded, product }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    nama: product?.nama || "",
    kategori: product?.kategori || "",
    hargaBeli: product?.hargaBeli.toString() || "",
    hargaJual: product?.hargaJual.toString() || "",
    stok: product?.stok.toString() || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = product
        ? `http://localhost:3001/api/products/${product.id}`
        : "http://localhost:3001/api/products";
      
      const method = product ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: formData.nama,
          kategori: formData.kategori,
          hargaBeli: parseFloat(formData.hargaBeli),
          hargaJual: parseFloat(formData.hargaJual),
          stok: parseInt(formData.stok) || 0,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error("Gagal menyimpan produk", {
          description: error.error || "Terjadi kesalahan pada server",
        });
        return;
      }

      toast.success(product ? "Produk berhasil diupdate!" : "Produk berhasil ditambahkan!", {
        description: `${formData.nama} telah disimpan ke database.`,
      });
      
      onProductAdded();
      onClose();
    } catch (error) {
      toast.error("Error", {
        description: "Tidak bisa terhubung ke server. Pastikan backend sudah berjalan di http://localhost:3001",
      });
      console.error("Error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {product ? "Edit Produk" : "Tambah Produk Baru"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Produk <span className="text-red-500">*</span>
              </label>
              <Input
                required
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                placeholder="Masukkan nama produk"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <Input
                required
                value={formData.kategori}
                onChange={(e) =>
                  setFormData({ ...formData, kategori: e.target.value })
                }
                placeholder="Contoh: Elektronik, Aksesoris"
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
                Stok <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                required
                min="0"
                value={formData.stok}
                onChange={(e) =>
                  setFormData({ ...formData, stok: e.target.value })
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              {product ? "Update Produk" : "Simpan Produk"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
