import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import axios from "axios";
import { backendURL } from "../../settings";
import NotificationManager, {
  NotificationRaven,
  NotificationType,
} from "../../components/NotificationManager";
import { createHelia } from "helia";
import { strings } from "@helia/strings";
import { createCipher, createDecipher } from "crypto";

const Verify: React.FC = () => {
  const [uiState, setUiState] = useState<number>(0);
  const [id, setId] = useState<string>("");
  const [uID, setUID] = useState<string>("");
  const [userIdentification, setUserIdentification] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationRaven[]>([]);

  useEffect(() => {
    const searchParams: URLSearchParams = new URL(window.location.href)
      .searchParams;
    const act_id: string = searchParams.get("id") || "";
    const act_UID: string = searchParams.get("uID") || "";
    const act_email: string = searchParams.get("e") || "";
    setId(act_id);
    setUID(act_UID);
    setEmail(act_email);
  }, []);

  useEffect(() => {}, [notifications]);

  function onOTPType(str: string, val: string) {
    if (val === "") return;

    //Get the next
    const next: number = Math.min(
      Math.max(parseInt(str.split(":")[1]) + 1, 1),
      6
    );

    //Focus on the next one
    document.getElementById(`S:${next}`)?.focus();
  }

  async function copyCutCallback(e: React.ClipboardEvent<HTMLDivElement>) {
    e.preventDefault();

    //Get Text
    const text: string = await navigator.clipboard.readText();
    console.log(text);

    if (text.length === 6) {
      //Assign the text to all of the inputs
      for (let i = 1; i <= 6; i++) {
        const element = document.getElementById(`S:${i}`);
        if (element) {
          element.value = text[i - 1];

          if (i === 6) {
            element.focus();
          }
        }
      }
    }

    await register();
  }

  async function register() {
    setLoading(true);
    let otp: string = "";
    for (let i = 1; i <= 6; i++) {
      otp += document.getElementById(`S:${i}`).value;
    }

    //Compile Payload
    const payload = {
      id: id,
      uID: uID,
      toc: Date.now(),
      email: email,
      otp: otp,
    };
    console.log(payload);

    //Send to axios backend
    const res = await axios.post(backendURL + "/create/user", payload);
    console.log(res);

    //Check response and send notification accordingly
    if (res.data.code === 1) {
      //Wrong OTP
      sendNotification("Error : Wrong OTP", "Try Retyping the OTP.");
    } else if (res.data.code === 4) {
      //Wrong OTP
      sendNotification("Error : OTP Expired", "Try generating a new OTP.");
    } else if (res.data.code === 3) {
      //Wrong OTP
      sendNotification("Error : Wrong URL", "Try Signing up again.");
    } else if (res.data.code === 2) {
      //We're logged in boiz!
      localStorage.setItem("base", JSON.stringify(res.data.data));
      setUserIdentification(res.data.data._id);
      setUiState(1);
      setLoading(false);
    }
  }

  async function ipfs() {
    // get password
    const password: string = document.getElementById("password").value;

    // encrypt it
    const algorithm = "aes256";
    const cipher1 = createCipher(algorithm, password);
    const password_encrypted =
      cipher1.update(password, "utf8", "hex") + cipher1.final("hex");
    // var decipher = createDecipher(algorithm, password);
    // var decrypted =
    //   decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");

    // now, create the object for ipfs
    const ipfs_object = {
      userID: uID,
      email: email,
      data: [],
      toc: new Date(Date.now()).toISOString(),
    };
    const str_obj = JSON.stringify(ipfs_object);

    // now, encrypt our str_obj :L
    const cipher2 = createCipher(algorithm, password_encrypted);
    const ipfs_data_encrypted =
      cipher2.update(str_obj, "utf8", "hex") + cipher2.final("hex");

    // now send req to helia?
    const helia = await createHelia();
    const s = strings(helia);

    const myImmutableAddress = await s.add(ipfs_data_encrypted);
    const helia_id: string = myImmutableAddress.toString();

    // send axios req (2 times because of a bug XD)
    const res_2 = await axios.post(backendURL + "/create/helia", {
      id: userIdentification,
      helia: helia_id,
    });
    localStorage.setItem("___", helia_id);
    localStorage.setItem("dat", ipfs_data_encrypted);
    window.location.replace("/h/home");
  }

  function sendNotification(head: string, content: string) {
    const notif: NotificationRaven = {
      color: "red",
      bg: "bg-red-100",
      border: "border-red-500",
      text: "text-red-900",
      fill: "text-red-500",
      type: NotificationType.alert,
      duration: 5000,
      head: head,
      content: content,
    };
    let notifs = notifications.slice();
    notifs.push(notif);
    setNotifications(notifs);
    setLoading(false);

    //Wipe all of the text from the inputs
    for (let i = 1; i <= 6; i++) {
      const element: HTMLElement = document.getElementById(`S:${i}`);
      if (element) {
        element.value = "";
      }
    }
  }

  async function resendOTP() {
    const act_id: number = Math.floor(Math.random() * 999999999);
    const newUID: string = uID.split(":")[0] + ":" + act_id;
    setLoading(true);
    const res = await axios.post(backendURL + "/email/verify-email", {
      username: newUID,
      email: email,
    });
    const n_id: string = res.data.otp_object._id;
    console.log(n_id);
    setUID(newUID);
    setId(n_id);
    setLoading(false);

    //Wipe all of the text from the inputs
    for (let i = 1; i <= 6; i++) {
      const element: HTMLElement = document.getElementById(`S:${i}`);
      if (element) {
        element.value = "";
      }
    }
  }

  return (
    <>
      <div className="h-screen absolute w-screen z-20">
        <div className="flex h-screen w-screen">
          {/* Actual thing */}
          {uiState === 0 ? (
            <div className="m-auto flex flex-col items-center">
              <h1 className="font-ez text-center text-7xl font-bold">verify</h1>
              <h1 className="font-ez text-center text-2xl font-light">
                we have sent a verification code to your email address
              </h1>

              <div
                id="otp"
                onPaste={(e) => copyCutCallback(e)}
                className="flex flex-row justify-center text-center px-2 mt-5 font-ez scale-125"
              >
                <input
                  className="m-2 border h-10 w-10 text-center form-control rounded"
                  type="text"
                  id="S:1"
                  maxLength={1}
                  onChange={(e) => onOTPType(e.target.id, e.target.value)}
                />
                <input
                  className="m-2 border h-10 w-10 text-center form-control rounded"
                  type="text"
                  id="S:2"
                  maxLength={1}
                  onChange={(e) => onOTPType(e.target.id, e.target.value)}
                />
                <input
                  className="m-2 border h-10 w-10 text-center form-control rounded"
                  type="text"
                  id="S:3"
                  maxLength={1}
                  onChange={(e) => onOTPType(e.target.id, e.target.value)}
                />
                <input
                  className="m-2 border h-10 w-10 text-center form-control rounded"
                  type="text"
                  id="S:4"
                  maxLength={1}
                  onChange={(e) => onOTPType(e.target.id, e.target.value)}
                />
                <input
                  className="m-2 border h-10 w-10 text-center form-control rounded"
                  type="text"
                  id="S:5"
                  maxLength={1}
                  onChange={(e) => onOTPType(e.target.id, e.target.value)}
                />
                <input
                  className="m-2 border h-10 w-10 text-center form-control rounded"
                  type="text"
                  id="S:6"
                  maxLength={1}
                  onChange={(e) => onOTPType(e.target.id, e.target.value)}
                />
              </div>
              <span
                className="font-ez cursor-pointer mt-1 mb-3"
                onClick={() => resendOTP()}
              >
                resend otp
              </span>
              {loading ? (
                <Loader size={0.6} />
              ) : (
                <button
                  onClick={() => register()}
                  className="relative inline-block text-lg group w-40 font-ez scale-90"
                >
                  <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                    <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                    <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                    <span className="relative">
                      <span>next</span>
                    </span>
                  </span>
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="m-auto flex flex-col items-center">
                <h1 className="font-ez text-center text-7xl font-bold">
                  password
                </h1>
                <h1 className="font-ez text-center text-2xl font-light">
                  this will be used to encrypt and decrypt your personal data.
                  this will stay on your local machine.
                </h1>
                <input
                  className="mt-10 text-center font-ez px-3 py-2 border border-gray-300 rounded-md outline-none focus:outline-none focus:border-black transition-all text-sm w-5/12"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="jimin@123"
                />

                {loading ? (
                  <Loader size={0.6} />
                ) : (
                  <button
                    onClick={() => ipfs()}
                    className="mt-5 relative inline-block text-lg group w-40 font-ez scale-90"
                  >
                    <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                      <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                      <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                      <span className="relative">
                        <span>next</span>
                      </span>
                    </span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="h-screen absolute w-screen z-1  background"></div>
      <NotificationManager notifications={notifications} />
    </>
  );
};

export default Verify;
