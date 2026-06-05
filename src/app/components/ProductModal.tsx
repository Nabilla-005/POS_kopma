import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { toast } from "sonner";

interface Product {
  id: string;
  nama: string;
  kategori: string;
  hargaBeli: number;
  hargaJual: number;
  stok: number;
  status: "tersedia" | "habis" | "preorder";
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, "id"> & { id?: string }) => void;
  product?: Product | null;
}

export function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const [formData, setFormData] = useState({
    nama: "",
    kategori: "",
    hargaBeli: "",
    hargaJual: "",
    stok: "",
    status: "tersedia" as Product["status"],
  });

  useEffect(() => {
    if (product) {
      setFormData({
        nama: product.nama,
        kategori: product.kategori,
        hargaBeli: product.hargaBeli.toString(),
        hargaJual: product.hargaJual.toString(),
        stok: product.stok.toString(),
        status: product.status,
      });
    } else {
      setFormData({
        nama: "",
        kategori: "",
        hargaBeli: "",
        hargaJual: "",
        stok: "",
        status: "tersedia",
      });
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      ...(product && { id: product.id }),
      nama: formData.nama,
      kategori: formData.kategori,
      hargaBeli: parseInt(formData.hargaBeli),
      hargaJual: parseInt(formData.hargaJual),
      stok: parseInt(formData.stok),
      status: formData.status,
    };

    onSave(productData);

    toast.success(
      product ? "Produk berhasil diupdate!" : "Produk berhasil ditambahkan!",
      {
        description: `${formData.nama} telah ${product ? "diperbarui" : "ditambahkan"} ke daftar produk.`,
      }
    );

    onClose();
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
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
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
              <select
                required
                value={formData.kategori}
                onChange={(e) =>
                  setFormData({ ...formData, kategori: e.target.value })
                }
                className="flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <option value="">Pilih Kategori</option>
                <option value="Elektronik">Elektronik</option>
                <option value="Aksesoris">Aksesoris</option>
                <option value="Fashion">Fashion</option>
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as Product["status"] })
                }
                className="flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <option value="tersedia">Tersedia</option>
                <option value="habis">Habis</option>
                <option value="preorder">Pre-order</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Harga Beli <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  Rp
                </span>
                <Input
                  type="number"
                  required
                  min="0"
                  value={formData.hargaBeli}
                  onChange={(e) =>
                    setFormData({ ...formData, hargaBeli: e.target.value })
                  }
                  placeholder="0"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Harga Jual <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  Rp
                </span>
                <Input
                  type="number"
                  required
                  min="0"
                  value={formData.hargaJual}
                  onChange={(e) =>
                    setFormData({ ...formData, hargaJual: e.target.value })
                  }
                  placeholder="0"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="col-span-2">
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

            {formData.hargaBeli && formData.hargaJual && parseInt(formData.hargaJual) > 0 && (
              <div className="col-span-2 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">Profit per Unit:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    Rp {(parseInt(formData.hargaJual) - parseInt(formData.hargaBeli)).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-700 dark:text-gray-300">Margin:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {(((parseInt(formData.hargaJual) - parseInt(formData.hargaBeli)) / parseInt(formData.hargaJual)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
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
