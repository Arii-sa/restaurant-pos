import { useState, useEffect } from "react";

export const useElapsedTime = (orderedAt: string) => {
  const [elapsed, setElapsed] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const update = () => {
      const diff = Math.floor(
        (Date.now() - new Date(orderedAt).getTime()) / 1000,
      );
      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;

      if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        setElapsed(`${hours}時間${minutes % 60}分`);
      } else if (minutes > 0) {
        setElapsed(`${minutes}分${seconds}秒`);
      } else {
        setElapsed(`${seconds}秒`);
      }

      // 10分以上で警告
      setIsUrgent(minutes >= 10);
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [orderedAt]);

  return { elapsed, isUrgent };
};
