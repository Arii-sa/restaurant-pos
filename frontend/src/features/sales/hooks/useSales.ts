import { useState, useEffect, useRef } from "react";
import { DailySales, SalesSummary } from "@/types";
import { getDailySales, getSalesSummary } from "@/lib/api/orders";

export const useSales = () => {
  const [dailySales, setDailySales] = useState<DailySales | null>(null);
  const [weeklySummary, setWeeklySummary] = useState<SalesSummary | null>(null);
  const [monthlySummary, setMonthlySummary] = useState<SalesSummary | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prevDateRef = useRef<string>("");

  useEffect(() => {
    if (prevDateRef.current === selectedDate) return;
    prevDateRef.current = selectedDate;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [daily, weekly, monthly] = await Promise.all([
          getDailySales(selectedDate),
          getSalesSummary("week"),
          getSalesSummary("month"),
        ]);
        setDailySales(daily);
        setWeeklySummary(weekly);
        setMonthlySummary(monthly);
      } catch {
        setError("売上データの取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [selectedDate]);

  return {
    dailySales,
    weeklySummary,
    monthlySummary,
    selectedDate,
    setSelectedDate,
    isLoading,
    error,
  };
};
