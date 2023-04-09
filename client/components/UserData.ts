export default class UserData {
  static getData(item: string) {
    //Local Storage
    return JSON.parse(localStorage.getItem("base") || "")[item];
  }
}
