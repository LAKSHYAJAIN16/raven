import React, { useEffect, useState } from "react";

const NotificationManager: React.FC<NotificationManagerProps> = ({
  notifications,
}) => {
  return (
    <div className="z-10 fixed w-screen h-screen bg-transparent font-ez">
      <div className="absolute bottom-3 left-3 bg-transparent">
        {notifications.map((e) => (
          <>
            <div
              className={`${e.bg} border-t-4 ${e.border} rounded-b ${e.text} px-4 py-3 shadow-md mb-5 transition-all invisible lg:visible`}
              role="alert"
            >
              <div className="flex">
                <div className="py-1">
                  <img
                    className={`fill-curren${e.fill} mr-4 h-9 w-9`}
                    src={typeToSVG(e.type)}
                  ></img>
                </div>
                <div>
                  <p className="font-bold">{e.head}</p>
                  <p className="text-sm">{e.content}</p>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export interface NotificationManagerProps {
  notifications: NotificationRaven[];
}

export interface NotificationRaven {
  color: string;
  bg: string;
  fill: string;
  border: string;
  text: string;
  type: NotificationType;
  duration: number;
  content: string;
  head: string;
}

export enum NotificationType {
  alert,
  information,
  update,
}

function typeToSVG(type: NotificationType) {
  switch (type) {
    case NotificationType.alert:
      return "/warning.png";
    case NotificationType.information:
      return "/information.png";
    case NotificationType.update:
      return "/notification.png";
      break;
    default:
      break;
  }
}
export default NotificationManager;
