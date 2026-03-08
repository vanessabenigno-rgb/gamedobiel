import { useEffect, useCallback, useState } from "react";
import { toast } from "sonner";

export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  );

  const requestPermission = useCallback(async () => {
    if (typeof Notification === "undefined") return "denied";
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  return { permission, requestPermission };
}

export function sendNotification(title: string, body: string) {
  // Always show toast as in-app fallback
  toast(title, { description: body });

  // Also send browser push notification if granted
  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    try {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        vibrate: [200, 100, 200],
        tag: title, // prevents duplicate notifications
        renotify: true,
      });
    } catch {
      // Fallback for environments where Notification constructor fails (some mobile browsers)
      if (navigator.serviceWorker?.ready) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, {
            body,
            icon: "/favicon.ico",
            vibrate: [200, 100, 200],
            tag: title,
            renotify: true,
          });
        });
      }
    }
  }
}
