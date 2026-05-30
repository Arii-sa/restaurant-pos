"use client";

import { useKitchen } from "@/features/kitchen/hooks/useKitchen";
import { KitchenOrderCard } from "./KitchenOrderCard";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { ErrorMessage } from "@/shared/components/ErrorMessage";
import { Order } from "@/types";

export const KitchenPage = () => {
  const {
    orders,
    allTodayOrders,
    isLoading,
    error,
    lastUpdated,
    handleUpdateStatus,
    refetch,
  } = useKitchen();

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const cookingOrders = orders.filter((o) => o.status === "cooking");

  // 今日の注文の中での順番を取得
  const getDailyNumber = (order: Order) => {
    const index = allTodayOrders.findIndex((o) => o.id === order.id);
    return index + 1;
  };

  if (isLoading) return <LoadingSpinner message="注文データを取得中..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">🍳 キッチンディスプレイ</h1>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <p className="text-sm text-gray-400">
              最終更新：{lastUpdated.toLocaleTimeString("ja-JP")}
            </p>
          )}
          <button
            onClick={refetch}
            className="px-3 py-1.5 bg-gray-700 text-sm rounded-lg hover:bg-gray-600 transition-colors"
          >
            🔄 更新
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400">5秒ごとに自動更新</span>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-2 gap-6 h-[calc(100vh-72px)]">
        <div className="flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-yellow-400">受付中</h2>
            <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full">
              {pendingOrders.length}件
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {pendingOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-3xl mb-2">✨</p>
                <p className="text-sm">受付中の注文はありません</p>
              </div>
            ) : (
              pendingOrders.map((order: Order) => (
                <KitchenOrderCard
                  key={order.id}
                  order={order}
                  dailyNumber={getDailyNumber(order)}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-blue-400">調理中</h2>
            <span className="bg-blue-400 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full">
              {cookingOrders.length}件
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {cookingOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-3xl mb-2">👨‍🍳</p>
                <p className="text-sm">調理中の注文はありません</p>
              </div>
            ) : (
              cookingOrders.map((order: Order) => (
                <KitchenOrderCard
                  key={order.id}
                  order={order}
                  dailyNumber={getDailyNumber(order)}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
