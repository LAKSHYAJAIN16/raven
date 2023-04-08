import React, { useEffect, useState } from "react";
import NotificationManager, {
  NotificationManagerProps,
  NotificationRaven,
} from "./NotificationManager";
import Notif from "./Notif";

const MINUTE_MS = 100;
const NotificationParent: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationRaven[]>([]);
  useEffect(() => {
    console.log("j!");
    setNotifications(Notif.notifications);
    return () => clearInterval(MINUTE_MS);
  }, [notifications]);

  return (
    <>
      <NotificationManager notifications={notifications} />
    </>
  );
};

export default NotificationParent;
