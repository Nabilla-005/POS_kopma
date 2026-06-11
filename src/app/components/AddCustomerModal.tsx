import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { toast } from "sonner";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerAdded: () => void;
  customer?: {
    id: number;
    nama: string;
    email: string;
    telepon: string;
    tier: string;
  } | null;
}

export function AddCustomerModal({ isOpen, onClose, onCustomerAdded, customer }: AddCustomerModalProps) {
  const [formData, setFormData] = useState({
    nama: customer?.nama || "",
    email: customer?.email || "",
    telepon: customer?.telepon || "",
    tier: customer?.tier || "regular",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = customer
        ? `http://localhost:3001/api/customers/${customer.id}`
        : "http://localhost:3001/api/customers";
      
      const method = customer ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: formData.nama,
          email: formData.email,
          telepon: formData.telepon,
          tier: formData.tier,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error("Gagal menyimpan pelanggan", {
          description: error.error || "Terjadi kesalahan pada server",
        });
        return;
      }

      toast.success(customer ? "Pelanggan berhasil diupdate!" : "Pelanggan berhasil ditambahkan!", {
        description: `${formData.nama} telah disimpan ke database.`,
      });
      
      onCustomerAdded();
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
            {customer ? "Edit Pelanggan" : "Tambah Pelanggan Baru"}
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
                Nama Pelanggan <span className="text-red-500">*</span>
              </label>
              <Input
                required
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                placeholder="Masukkan nama pelanggan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Telepon
              </label>
              <Input
                value={formData.telepon}
                onChange={(e) =>
                  setFormData({ ...formData, telepon: e.target.value })
                }
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tier Member
              </label>
              <select
                value={formData.tier}
                onChange={(e) =>
                  setFormData({ ...formData, tier: e.target.value })
                }
                className="flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <option value="regular">Regular</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              {customer ? "Update Pelanggan" : "Simpan Pelanggan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
