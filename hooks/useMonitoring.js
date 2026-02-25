import { useMonitoringStore, useSystemStore } from "@/store";
import { useEffect, useRef } from "react";

export const useMonitoring = () => {
  const { systems } = useSystemStore(); // لیست کل سیستم‌ها
  const { isMonitoring, setStatus, stopMonitoring } = useMonitoringStore();

  const timerRef = useRef(null);

  useEffect(() => {
    if (isMonitoring && systems.length > 0) {
      runMonitoringLoop();
    } else {
      stopLoop();
    }

    return () => stopLoop();
  }, [isMonitoring, systems]);

  const stopLoop = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const runMonitoringLoop = async () => {
    // حلقه بی‌پایان تا زمانی که isMonitoring true باشد
    // اما برای جلوگیری از فریز شدن، از تابع بازگشتی با setTimeout استفاده می‌کنیم

    await checkAllSystems();

    // زمان صبر بین هر دور چک کردن (مثلاً 5 ثانیه)
    if (useMonitoringStore.getState().isMonitoring) {
      timerRef.current = setTimeout(runMonitoringLoop, 5000);
    }
  };

  const checkAllSystems = async () => {
    // برای سرعت بیشتر، سیستم‌ها را گروه‌بندی می‌کنیم (مثلاً 5 تا 5 تا موازی)
    // اما چون ping ویندوز خودش delay دارد، بهتر است یکی‌یکی یا با Promise.all محدود برویم.

    const batchSize = 5;
    for (let i = 0; i < systems.length; i += batchSize) {
      if (!useMonitoringStore.getState().isMonitoring) break;

      const batch = systems.slice(i, i + batchSize);

      // اجرای موازی پینگ برای این بچ
      await Promise.all(
        batch.map(async (sys) => {
          // وضعیت را به "در حال چک" تغییر می‌دهیم (اختیاری، شاید باعث پرش UI شود)
          // setStatus(sys.id, 'checking');

          const isOnline = await pingSystem(sys.ip);

          // اگر مانیتورینگ متوقف نشده بود، وضعیت را آپدیت کن
          if (useMonitoringStore.getState().isMonitoring) {
            setStatus(sys.id, isOnline ? "online" : "offline");
          }
        }),
      );
    }
  };

  const pingSystem = async (ip) => {
    if (!window.electron) {
      // Mock
      return Math.random() > 0.2;
    }

    try {
      // -n 1: یک بار پینگ کن
      // -w 1000: حداکثر 1 ثانیه صبر کن
      const res = await window.electron.exec(`ping -n 1 -w 1000 ${ip}`);
      return (
        res.success &&
        !res.output.includes("Unreachable") &&
        !res.output.includes("timed out")
      );
    } catch (e) {
      return false;
    }
  };

  return { isMonitoring };
};
