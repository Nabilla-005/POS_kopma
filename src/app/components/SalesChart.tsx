import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";

const data = [
  { name: "Sen", penjualan: 4000 },
  { name: "Sel", penjualan: 3000 },
  { name: "Rab", penjualan: 5000 },
  { name: "Kam", penjualan: 2780 },
  { name: "Jum", penjualan: 6890 },
  { name: "Sab", penjualan: 8390 },
  { name: "Min", penjualan: 7490 },
];

export function SalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Penjualan Mingguan</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
            <XAxis
              dataKey="name"
              className="text-xs"
              stroke="currentColor"
            />
            <YAxis
              className="text-xs"
              stroke="currentColor"
            />
            <Tooltip
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
