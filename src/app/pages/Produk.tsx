import { useState, useEffect } from "react";
import { Search, Filter, Plus, Edit, Trash2, Package, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { StatsCard } from "../components/StatsCard";
import { AddProductModal } from "../components/AddProductModal";
import { toast } from "sonner";

interface Product {
  id: number;
  nama: string;
  kategori: string;
  hargaBeli: number;
  hargaJual: number;
  stok: number;
  status: "tersedia" | "habis" | "preorder";
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export function Produk() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error("Error", {
        description: "Gagal memuat produk dari server",
      });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;

    try {
      const response = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      toast.success("Produk berhasil dihapus!");
      fetchProducts();
    } catch (error) {
      toast.error("Error", {
        description: "Gagal menghapus produk",
      });
      console.error("Error:", error);
    }
  };

  const filteredProducts = products.filter((product) =>
    Object.values(product).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getStatusBadge = (status: Product["status"]) => {
    switch (status) {
      case "tersedia":
        return <Badge variant="success">Tersedia</Badge>;
      case "habis":
        return <Badge variant="destructive">Habis</Badge>;
      case "preorder":
        return <Badge variant="warning">Pre-order</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Produk
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Kelola data produk dan inventori Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <StatsCard
    title="Total Produk"
    value={products.length.toString()}
    change="+12"
    isPositive={true}
    icon={Package}
    iconBgColor="bg-blue-100 dark:bg-blue-900/20"
    iconColor="text-blue-600 dark:text-blue-400"
  />
  <StatsCard
    title="Produk Tersedia"
    value={products.filter(p => p.status === "tersedia").length.toString()}
    change="+5"
    isPositive={true}
    icon={Package}
    iconBgColor="bg-green-100 dark:bg-green-900/20"
    iconColor="text-green-600 dark:text-green-400"
  />
  <StatsCard
    title="Stok Habis"
    value={products.filter(p => p.status === "habis").length.toString()}
    change="+3"
    isPositive={false}
    icon={Package}
    iconBgColor="bg-red-100 dark:bg-red-900/20"
    iconColor="text-red-600 dark:text-red-400"
  />
  <StatsCard
    title="Stok Menipis"
    value={products.filter(p => p.stok > 0 && p.stok <= 5).length.toString()}
    change=""
    isPositive={false}
    icon={AlertTriangle}
    iconBgColor="bg-orange-100 dark:bg-orange-900/20"
    iconColor="text-orange-600 dark:text-orange-400"
  />
</div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Produk</CardTitle>
            <Button onClick={handleAddProduct} className="gap-2">
              <Plus className="w-4 h-4" />
              Tambah Produk
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Nama Produk
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Kategori
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Harga Beli
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Harga Jual
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Stok
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {filteredProducts.map((product) => (
                      <tr
                          key={product.id}
                          className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                            product.stok === 0
                              ? "bg-red-50/50 dark:bg-red-900/10"
                              : product.stok <= 5
                              ? "bg-orange-50/50 dark:bg-orange-900/10"
                              : ""
                          }`}
                        >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                          {product.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                          {product.nama}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                          {product.kategori}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                          {formatCurrency(product.hargaBeli)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                          {formatCurrency(product.hargaJual)}
                        </td>
                       <td className="px-4 py-3 text-sm font-semibold">
                        <div className="flex items-center gap-2">
                          <span className={
                            product.stok === 0
                              ? "text-red-600 dark:text-red-400"
                              : product.stok <= 5
                              ? "text-orange-600 dark:text-orange-400"
                              : "text-gray-900 dark:text-white"
                          }>
                            {product.stok}
                          </span>
                          {product.stok <= 5 && product.stok > 0 && (
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                          )}
                          {product.stok === 0 && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </td>
                        <td className="px-4 py-3 text-sm">
                          {getStatusBadge(product.status)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleEditProduct(product)}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteProduct(product.id)}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Tidak ada produk ditemukan
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onProductAdded={fetchProducts}
        product={editingProduct}
      />
    </div>
  );
}
