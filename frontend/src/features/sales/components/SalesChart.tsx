"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartDataItem = {
  date: string;
  total: number;
  count: number;
};

type Props = {
  data: ChartDataItem[];
  title: string;
  showTitle?: boolean;
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-orange-500 font-bold">
          ¥{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export const SalesChart = ({ data, title, showTitle = true }: Props) => {
  const maxTotal = Math.max(...data.map((d) => d.total), 1);
  const totalSum = data.reduce((sum, d) => sum + d.total, 0);
  const totalCount = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div>
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <div className="text-right">
            <p className="text-sm text-gray-400">合計</p>
            <p className="font-bold text-orange-500">
              ¥{totalSum.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">{totalCount}件</p>
          </div>
        </div>
      )}

      {!showTitle && (
        <div className="flex justify-end mb-2">
          <div className="text-right">
            <p className="font-bold text-orange-500">
              ¥{totalSum.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">{totalCount}件</p>
          </div>
        </div>
      )}

      {totalSum === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-400">
          <p className="text-sm">この期間の売上データはありません</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `¥${(v / 1000).toFixed(0)}k`}
              domain={[0, Math.ceil(maxTotal * 1.2)]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="total"
              fill="#f97316"
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      )}

      <div className="mt-4 space-y-1">
        {data.map((item) => (
          <div
            key={item.date}
            className="flex justify-between items-center text-xs py-1 border-b border-gray-50"
          >
            <span className="text-gray-500">{item.date}</span>
            <div className="flex items-center gap-3">
              <span className="text-gray-400">{item.count}件</span>
              <span className="font-medium text-gray-700">
                ¥{item.total.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
