import React, { useRef, useState, useEffect } from "react";
import UserData from "../components/UserData";
import axios from "axios";
import dynamic from "next/dynamic";
import { backendURL } from "../settings";
import NotificationManager, {
  NotificationRaven,
  NotificationType,
} from "../components/NotificationManager";
import { EditorProps } from "react-draft-wysiwyg";
import { RTEditor } from "../components/RTEditor";

const Editor = dynamic<EditorProps>(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

const CreateIsland: React.FC<IslandProps> = ({ callback }) => {
  const pfpic = UserData.getData("profilePic");
  const pictureInput = useRef(null);
  const videoInput = useRef(null);
  const mdInput = useRef(null);
  const [images, setImages] = useState<string[][]>([]);
  const [video, setVideo] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NotificationRaven[]>([]);
  const [newsMD, setNewsMD] = useState<string>();
  const [newsRT, setNewsRT] = useState<string>();
  const [blogRT, setBlogRT] = useState<string>();
  const [mode, setMode] = useState<string>("nan");

  useEffect(() => {
    if (typeof window !== "undefined") {
      return;
    }
  }, []);

  async function uploadImage(files: FileList) {
    const f: File = files[0];

    //Generate temporary URL
    const temp_url: string = URL.createObjectURL(f);
    const r_images: string[][] = images.slice();
    r_images.push(["", temp_url]);
    setImages(r_images);

    //We have to upload the image on the frontend, sadly :(
    const formData: FormData = new FormData();
    formData.append("file", f);
    formData.append("upload_preset", "cdkq7wce");
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/everything-limited/auto/upload",
      formData
    );

    const url: string = res.data.url;

    //Now, Loop Through and update our raw thingy
    for (let r = 0; r < r_images.length; r++) {
      if (r_images[r][1] === temp_url) {
        r_images[r][0] = url;
      }
    }
    setImages(r_images);
    // Preproccess Image in the backend
  }

  async function uploadVideo(files: FileList) {
    // If there's already a video, send notification :L
    if (video.length == 0) {
      const f: File = files[0];

      //Generate temporary URL
      const temp_url: string = URL.createObjectURL(f);
      setVideo(["", temp_url]);

      //We have to upload the image on the frontend, sadly :(
      const formData: FormData = new FormData();
      formData.append("file", f);
      formData.append("upload_preset", "cdkq7wce");
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/everything-limited/auto/upload",
        formData
      );

      //Now, Loop Through and update our raw thingy
      const url: string = res.data.url;
      setVideo([url, temp_url]);
    } else {
      const notif: NotificationRaven = {
        color: "red",
        bg: "bg-red-100",
        border: "border-red-500",
        text: "text-red-900",
        fill: "text-red-500",
        type: NotificationType.alert,
        duration: 5000,
        head: "You can only upload one video!",
        content:
          "If you want to make a designated video, go to our video section",
      };
      let notifs = notifications.slice();
      notifs.push(notif);
      setNotifications(notifs);
    }
  }

  function handleMarkdown(files: FileList) {
    try {
      console.log("potato");
      const fr: FileReader = new FileReader();
      const f: File = files[0];
      console.log(f.name);

      // Read f
      fr.onload = function () {
        const str: string = fr.result?.toString() || "";
        setNewsMD(str);
        setMode("news-2");
        console.log(str);
      };
      fr.readAsText(f);
    } catch (err) {
      //Sowwy!
    }
  }

  function removeImage(index: number) {
    console.log(index);
    let shallowImages: string[][] = images.slice();
    shallowImages.splice(index, 1);
    console.log(shallowImages);
    setImages(shallowImages);
  }

  function removeVideo() {
    setVideo([]);
  }

  async function sendData() {
    console.log("hi!");
    const text: string = document.getElementById("text")?.innerHTML || "";

    // Some formatting $#!7 :\
    if(images.length > 0){
      setVideo([]);
    }
    if(video.length > 0){
      setImages([[]]);
    }

    //First, find out type
    const type = returnType();
    let newImages = [];
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      newImages.push(image[0]);
    }

    const payload = {
      user: {
        name: UserData.getData("username"),
        id: UserData.getData("_id"),
        pfpic: pfpic,
      },
      text: text,
      type: type,
      images: newImages,
      videos: video[0],
      richText: blogRT,
      md: "",
      news: {
        topic: "nan",
        desc: "nan",
      },
    };

    //Send to axios backend
    const res = await axios.post(backendURL + "/create/post", payload);
    console.log(res);
  }

  function returnType() {
    if (images.length !== 0) return 1;
    if (video.length !== 0) return 2;
    if (newsMD) return 3;
    return 0;
  }

  return (
    <>
      <div className="absolute w-screen h-screen z-50 font-ez">
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4 text-center">
              <div
                className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:max-w-lg sm:my-0 fade-modal-in ${
                  mode === "blog" || mode === "news" ? "min-w-[70%]" : "w-full"
                }`}
              >
                <div className={"bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 "}>
                  <div className="flex">
                    <img
                      className="hidden sm:flex mx-auto h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10"
                      src={pfpic}
                    ></img>

                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                      <div className="mt-2 w-full">
                        <div
                          className={`grid grid-cols-4`}
                          style={{
                            gridTemplateColumns: `repeat(${Math.min(
                              images.length,
                              4
                            )}, minmax(0, 1fr))`,
                          }}
                        >
                          {mode == "image" && (
                            <>
                              {images.map((i, index) => (
                                <div className="flex flex-col">
                                  <p
                                    className="font-ez cursor-pointer"
                                    onClick={() => removeImage(index)}
                                  >
                                    x
                                  </p>
                                  <img
                                    src={i[1]}
                                    className="mb-2 w-[90%] rounded-lg"
                                  />
                                </div>
                              ))}
                            </>
                          )}
                        </div>

                        {mode === "video" && (
                          <div className={`flex flex-col`} style={{}}>
                            {video.length !== 0 && (
                              <div className="flex flex-col">
                                <p
                                  className="font-ez cursor-pointer"
                                  onClick={() => removeVideo()}
                                >
                                  x
                                </p>
                                <video
                                  src={video[1]}
                                  autoPlay
                                  className="mb-2 w-[100%] rounded-lg"
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Text Input */}
                        {mode !== "news-2" && (
                          <p>
                            <span
                              className="mt-0 font-ez text-sm text-gray-700 outline-none focus:outline-gray-400 rounded-2xl pl-3 pr-3 pt-1 pb-1 block resize-none sm:w-[90%] w-full overflow-hidden box"
                              placeholder="wassup?"
                              role="textbox"
                              contentEditable
                              id="text"
                            ></span>
                          </p>
                        )}

                        {mode === "blog" && (
                          <>
                            <br />
                            <RTEditor />
                          </>
                        )}

                        {mode === "news" && (
                          <>
                            <br />
                            <RTEditor />

                            <p className="text-center text-lg">or</p>
                            <button
                              onClick={() => mdInput.current.click()}
                              className="relative inline-block text-lg group w-full sm:w-50 font-ez scale-75"
                            >
                              <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-emerald-800 transition-colors duration-300 ease-out border-2 border-emerald-500 rounded-lg group-hover:text-white">
                                <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-emerald-50"></span>
                                <span className="absolute left-0  w-[100vw] sm:[100vw] h-52 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-emerald-500 group-hover:-rotate-180 ease"></span>
                                <span className="relative">
                                  upload markdown
                                </span>
                              </span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex mt-2 justify-center">
                    <p className="text-sm">
                      or make an{" "}
                      <span onClick={() => setMode("image")}>
                        <span
                          className={`cursor-pointer font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-700 font-ez ${
                            mode === "image" ? "text-black" : ""
                          }`}
                        >
                          image
                        </span>
                      </span>
                      ,{" "}
                      {/* <span onClick={() => setMode("blog")}>
                        <span
                          className={`cursor-pointer font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-700 font-ez ${
                            mode === "blog" ? "text-black" : ""
                          }`}
                        >
                          blog
                        </span>
                      </span>
                      ,{" "} */}
                      <span onClick={() => setMode("video")}>
                        <span
                          className={`cursor-pointer font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-green-700 font-ez ${
                            mode === "video" ? "text-black" : ""
                          }`}
                        >
                          video
                        </span>
                      </span>
                      {/* <span onClick={() => setMode("news")}>
                        <span
                          className={`cursor-pointer font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-700 font-ez ${
                            mode === "news" ? "text-black" : ""
                          }`}
                        >
                          news article
                        </span>
                      </span>
                      ,{" "}
                      <span onClick={() => setMode("debate")}>
                        <span
                          className={`cursor-pointer font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-700 font-ez ${
                            mode === "debate" ? "text-black" : ""
                          }`}
                        >
                          debate
                        </span>
                      </span> */}
                    </p>
                  </div>

                  {/* Image, and all of that $#!7 */}
                  <div className="flex mt-2 justify-center">
                    {mode === "image" && (
                      <button onClick={() => pictureInput.current.click()}>
                        <img src="/image.png" className="w-6 h-6 mr-2" />
                      </button>
                    )}
                    {mode === "video" && (
                      <button onClick={() => videoInput.current.click()}>
                        <img src="/play.png" className="w-6 h-6 mr-2" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="px-4 -mt-2 sm:flex sm:flex-row-reverse flex flex-col items-center justify-center sm:px-6 scale-90 ml-0 sm:ml-[70%]">
                  {mode == "news" ? (
                    <>
                      <button
                        onClick={() => setMode("news-2")}
                        className="relative inline-block text-lg group w-full sm:w-40 font-ez scale-75"
                      >
                        <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight transition-colors duration-300 ease-out border-2 border-teal-500 text-teal-800 rounded-lg group-hover:text-white">
                          <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-teal-50"></span>
                          <span className="absolute left-0  w-[100vw] sm:w-52 h-52 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-teal-500  group-hover:-rotate-180 ease"></span>
                          <span className="relative">continue</span>
                        </span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => sendData()}
                        className="relative inline-block text-lg group w-full sm:w-40 font-ez scale-75"
                      >
                        <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                          <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                          <span className="absolute left-0  w-[100vw] sm:w-52 h-52 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                          <span className="relative">post</span>
                        </span>
                      </button>
                      <button
                        onClick={() => callback("create")}
                        className="relative inline-block text-lg group w-full sm:w-40 font-ez scale-75"
                      >
                        <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-red-800 transition-colors duration-300 ease-out border-2 border-red-500 rounded-lg group-hover:text-white">
                          <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                          <span className="absolute left-0  w-[100vw] sm:w-52 h-52 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-red-500 group-hover:-rotate-180 ease"></span>
                          <span className="relative">exit</span>
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <input
            type="file"
            className="hidden"
            ref={pictureInput}
            accept="image/*"
            onChange={(e) => uploadImage(e.target.files)}
          />
          <input
            type="file"
            className="hidden"
            ref={videoInput}
            accept="video/*"
            onChange={(e) => uploadVideo(e.target.files)}
          />
          <input
            type="file"
            className="hidden"
            ref={mdInput}
            accept=".md"
            onChange={(e) => handleMarkdown(e.target.files)}
          />
        </div>
      </div>
      <NotificationManager notifications={notifications} />
    </>
  );
};

export interface IslandProps {
  callback: (type: string) => void;
}

export default CreateIsland;
