import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";

interface Transaction {
  total: number;
  createdAt: string;
}

const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

export function SalesChart() {
  const [data, setData] = useState<{ name: string; penjualan: number }[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/transactions")
      .then((res) => res.json())
      .then((transactions: Transaction[]) => {
        // Filter 7 hari terakhir
        const now = new Date();
        const last7Days: { name: string; penjualan: number; date: Date }[] = [];

        for (let i = 6; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(now.getDate() - i);
          last7Days.push({
            name: HARI[d.getDay()],
            penjualan: 0,
            date: d,
          });
        }

        // Akumulasi total per hari
        transactions.forEach((t) => {
          const tDate = new Date(t.createdAt.replace(" ", "T"));
          const entry = last7Days.find(
            (d) => d.date.toDateString() === tDate.toDateString()
          );
          if (entry) entry.penjualan += t.total;
        });

        setData(last7Days.map(({ name, penjualan }) => ({ name, penjualan })));
      })
      .catch((err) => console.error("Gagal memuat data penjualan:", err));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Penjualan 7 Hari Terakhir</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-gray-200 dark:stroke-gray-800"
            />
            <XAxis dataKey="name" className="text-xs" stroke="currentColor" />
            <YAxis
              className="text-xs"
              stroke="currentColor"
              tickFormatter={(v) =>
                v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v === 0 ? "0" : `${(v / 1000).toFixed(0)}K`
              }
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), "Penjualan"]}
              contentStyle={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="penjualan"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}