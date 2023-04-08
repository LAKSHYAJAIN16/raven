import { NotificationRaven } from "./NotificationManager";

class Notif {
  notifications: NotificationRaven[];

  constructor(){
    this.notifications = [];
  }

  add(notification: NotificationRaven) {
    this.notifications.push(notification);
  }
}

export default new Notif();