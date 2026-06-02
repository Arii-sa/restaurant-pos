import { useState, useEffect, useRef } from "react";
import { getWeeklyChartData, getMonthlyChartData } from "@/lib/api/orders";

type ChartDataItem = {
  date: string;
  total: number;
  count: number;
};

export const useChartData = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [weeklyData, setWeeklyData] = useState<ChartDataItem[]>([]);
  const [monthlyData, setMonthlyData] = useState<ChartDataItem[]>([]);
  const [isWeeklyLoading, setIsWeeklyLoading] = useState(true);
  const [isMonthlyLoading, setIsMonthlyLoading] = useState(true);
  const hasFetched = useRef(false);

  // 週次データ取得
  useEffect(() => {
    const load = async () => {
      try {
        setIsWeeklyLoading(true);
        const data = await getWeeklyChartData(weekOffset);
        setWeeklyData(data);
      } catch {
        console.error("週次データの取得に失敗しました");
      } finally {
        setIsWeeklyLoading(false);
      }
    };
    void load();
  }, [weekOffset]);

  // 月次データ取得
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
    }
    const load = async () => {
      try {
        setIsMonthlyLoading(true);
        const data = await getMonthlyChartData(selectedYear, selectedMonth);
        setMonthlyData(data);
      } catch {
        console.error("月次データの取得に失敗しました");
      } finally {
        setIsMonthlyLoading(false);
      }
    };
    void load();
  }, [selectedYear, selectedMonth]);

  // 週のラベル
  const weekLabel =
    weekOffset === 0
      ? "今週"
      : weekOffset === -1
        ? "先週"
        : `${Math.abs(weekOffset)}週前`;

  // 月のラベル
  const monthLabel = `${selectedYear}年${selectedMonth}月`;

  // 前後の月
  const goPrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedYear((y) => y - 1);
      setSelectedMonth(12);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    const now = new Date();
    if (
      selectedYear === now.getFullYear() &&
      selectedMonth === now.getMonth() + 1
    )
      return;
    if (selectedMonth === 12) {
      setSelectedYear((y) => y + 1);
      setSelectedMonth(1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const isCurrentMonth =
    selectedYear === new Date().getFullYear() &&
    selectedMonth === new Date().getMonth() + 1;

  return {
    weeklyData,
    monthlyData,
    isWeeklyLoading,
    isMonthlyLoading,
    weekOffset,
    weekLabel,
    monthLabel,
    isCurrentMonth,
    goNextWeek: () => setWeekOffset((o) => Math.min(o + 1, 0)),
    goPrevWeek: () => setWeekOffset((o) => o - 1),
    goPrevMonth,
    goNextMonth,
  };
};
