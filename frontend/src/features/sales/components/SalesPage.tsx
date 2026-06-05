"use client";

import Link from "next/link";
import { useSales } from "@/features/sales/hooks/useSales";
import { useChartData } from "@/features/sales/hooks/useChartData";
import { SalesChart } from "./SalesChart";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { ErrorMessage } from "@/shared/components/ErrorMessage";

const PAYMENT_LABELS: Record<string, string> = {
  cash: "💴 現金",
  card: "💳 カード",
  qr: "📱 QRコード",
};

export const SalesPage = () => {
  const {
    dailySales,
    weeklySummary,
    monthlySummary,
    selectedDate,
    setSelectedDate,
    isLoading,
    error,
  } = useSales();

  const {
    weeklyData,
    monthlyData,
    isWeeklyLoading,
    isMonthlyLoading,
    weekLabel,
    monthLabel,
    isCurrentMonth,
    goNextWeek,
    goPrevWeek,
    goPrevMonth,
    goNextMonth,
  } = useChartData();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <Link
          href="/"
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← レジへ戻る
        </Link>
        <h1 className="text-xl font-bold text-gray-800">📊 売上管理</h1>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* サマリーカード */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-400 mb-1">今週の売上</p>
            <p className="text-2xl font-bold text-gray-800">
              ¥{weeklySummary?.total.toLocaleString() ?? 0}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {weeklySummary?.count ?? 0}件 / 平均¥
              {weeklySummary?.average.toLocaleString() ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-400 mb-1">今月の売上</p>
            <p className="text-2xl font-bold text-gray-800">
              ¥{monthlySummary?.total.toLocaleString() ?? 0}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {monthlySummary?.count ?? 0}件 / 平均¥
              {monthlySummary?.average.toLocaleString() ?? 0}
            </p>
          </div>
        </div>

        {/* 週次グラフ */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">日別売上</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={goPrevWeek}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
              >
                ←
              </button>
              <span className="text-sm font-medium text-gray-700 min-w-15 text-center">
                {weekLabel}
              </span>
              <button
                onClick={goNextWeek}
                disabled={weekLabel === "今週"}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </div>
          {isWeeklyLoading ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              読み込み中...
            </div>
          ) : (
            <SalesChart data={weeklyData} title="" showTitle={false} />
          )}
        </div>

        {/* 月次グラフ */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">週別売上</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={goPrevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
              >
                ←
              </button>
              <span className="text-sm font-medium text-gray-700 min-w-20 text-center">
                {monthLabel}
              </span>
              <button
                onClick={goNextMonth}
                disabled={isCurrentMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </div>
          {isMonthlyLoading ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              読み込み中...
            </div>
          ) : (
            <SalesChart data={monthlyData} title="" showTitle={false} />
          )}
        </div>

        {/* 日次売上 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">日次売上</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>

          <div className="text-center py-4 border-b border-gray-100 mb-4">
            <p className="text-sm text-gray-400 mb-1">売上合計</p>
            <p className="text-4xl font-bold text-orange-500">
              ¥{dailySales?.total.toLocaleString() ?? 0}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {dailySales?.count ?? 0}件の注文
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              支払い方法別
            </p>
            {dailySales?.by_payment &&
            Object.keys(dailySales.by_payment).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(dailySales.by_payment).map(
                  ([method, amount]) => (
                    <div
                      key={method}
                      className="flex justify-between items-center py-2 border-b border-gray-50"
                    >
                      <span className="text-sm text-gray-600">
                        {PAYMENT_LABELS[method] ?? method}
                      </span>
                      <span className="font-medium text-gray-800">
                        ¥{Number(amount).toLocaleString()}
                      </span>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">
                この日の売上データはありません
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
