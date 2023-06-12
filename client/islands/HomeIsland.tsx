import React, { useEffect, useState, FC, useRef } from "react";
import axios from "axios";
import { backendURL, mlURL } from "../settings";
import Loader from "../components/Loader";
import moment from "moment";
import UserData from "../components/UserData";
import { createHelia } from "helia";
import { Strings, strings } from "@helia/strings";
import { buffer } from "stream/consumers";
import ReccomendationManager from "../components/ReccomendationManager";
import gradients from "../lib/gradients";

const HomeIsland: FC<HomeIslandProps> = ({ buffers, removeBuffer }) => {
  const [feed, setFeed] = useState<any[]>([]);

  useEffect(() => {
    const fn = async () => {
      // backend call
      const dat = await axios.get(backendURL + "/get/posts");
      const actPosts = dat.data.data;
      actPosts.length = 200
      console.log(actPosts);
      setFeed(actPosts);

      // Set Up reccomendation engine!
      // ReccomendationManager.init();
      // await ReccomendationManager.chroma_predict();
    };
    fn();
  }, []);

  const TextPost = ({ object, heartOrFireCallback, isBuffer }) => {
    const mlRef = useRef(false);

    useEffect(() => {
      const buff = async () => {
        console.log("Sending request");
        // Send request to our ML point
        const payload = {
          id: object._id,
          t: object.text,
        };
        const url = `${mlURL}/embed?t=${payload.t}&id=${payload.id}`;
        const res = await axios.get(url);

        // Get the embeddings
        const embeddings = res.data.embeddings[0];
        // console.log(embeddings);

        // Now, send request to our server (TODO : just do it in python man wtf)
        const new_payload = {
          id: object._id,
          embeddings: embeddings,
        };
        const res2 = await axios.post(
          `${backendURL}/create/embedding`,
          new_payload
        );
        console.log(res2);
        isBuffer = false;
        removeBuffer(payload.id);
      };

      if (isBuffer === true) {
        if (mlRef.current) return;
        mlRef.current = true;
        buff();
      }
    }, []);

    return (
      <div className={`flex flex-col border-2 border-black rounded-xl`}>
        <div className="pl-3 pr-3 pt-2 pb-2 flex">
          <div>
            <img
              src={object.userPfpic}
              className="cursor-pointer flex mx-auto h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
            />
          </div>
          <div className="flex flex-col max-w-xl">
            {isBuffer ? (
              <>
                <p className="font-ez ml-2 font-bold text-sm">
                  <span className="text-red-500">{object.user} </span>
                  <span className="text-xs text-black">
                    {moment(object.createdAt).fromNow()}
                  </span>
                </p>
              </>
            ) : (
              <p className="font-ez ml-2 font-bold text-sm">
                <span>{object.user} </span>
                <span className="text-xs text-gray-500">
                  {moment(object.createdAt).fromNow()}
                </span>
              </p>
            )}

            <span className="z-10 font-ez ml-2 font-bold text-[9px] text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-700">
              text post
            </span>

            {isBuffer ? (
              <>
                <p
                  className="font-ez ml-2 text-lg text-red-500"
                  dangerouslySetInnerHTML={{ __html: object.text }}
                ></p>
                <p className="text-black text-sm font-ez pl-2 blink">
                  processing post...
                </p>
              </>
            ) : (
              <>
                <p
                  className="font-ez ml-2 text-lg"
                  dangerouslySetInnerHTML={{ __html: object.text }}
                ></p>
              </>
            )}

            <div className="ml-2 flex items-center mt-1">
              <img
                src={"/heart-red.png"}
                className="w-5 h-5 cursor-pointer hover:scale-110 mr-1"
                onClick={() => heartOrFireCallback(object, 0)}
              />
              <img
                src={"/fire.png"}
                className="w-5 h-5 cursor-pointer hover:scale-110 mr-1 -mt-1"
                onClick={() => heartOrFireCallback(object, 1)}
              />
              <img
                src={"/comment.png"}
                className="w-5 h-5 cursor-pointer hover:scale-110 "
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ImgPost = ({ object, heartOrFireCallback, isBuffer }) => {
    function findGridSize(n: number) {
      const factors: number[] = [];
      for (let i = 2; i <= n; i++) {
        if (n % i === 0) {
          factors.push(i);
        }
      }
      console.log(factors);
      return factors[0];
    }

    const ImageStandardPost = ({ object }) => {
      return (
        <div className="flex flex-col border-2 border-black rounded-xl">
          <div className="pl-3 pr-3 pt-2 pb-2 flex">
            <div>
              <img
                src={object.userPfpic}
                className="cursor-pointer flex mx-auto h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
              />
            </div>
            <div className="flex flex-col max-w-xl">
              {isBuffer ? (
                <>
                  <p className="font-ez ml-2 font-bold text-sm">
                    <span className="text-red-500">{object.user} </span>
                    <span className="text-xs text-black">
                      {moment(object.createdAt).fromNow()}
                    </span>
                  </p>
                </>
              ) : (
                <p className="font-ez ml-2 font-bold text-sm">
                  <span>{object.user} </span>
                  <span className="text-xs text-gray-500">
                    {moment(object.createdAt).fromNow()}
                  </span>
                </p>
              )}
              <span className="z-10 font-ez ml-2 font-bold text-[9px] text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-700">
                img post
              </span>
              {isBuffer ? (
                <>
                  <p
                    className="font-ez ml-2 text-lg text-red-500"
                    dangerouslySetInnerHTML={{ __html: object.text }}
                  ></p>
                  <p className="text-black text-sm font-ez pl-2 blink">
                    processing post...
                  </p>
                </>
              ) : (
                <>
                  <p
                    className="font-ez ml-2 text-lg"
                    dangerouslySetInnerHTML={{ __html: object.text }}
                  ></p>
                </>
              )}
              <div className="grid">
                {object.images.map((f, idx) => (
                  <img
                    src={f}
                    className={`${idx === 0 ? "mt-0" : "mt-1"} rounded-xl`}
                  />
                ))}
              </div>
              <div className="ml-2 flex items-center mt-2 ">
                <img
                  src={"/heart-red.png"}
                  className="w-7 h-7 cursor-pointer hover:scale-110 mr-1"
                  onClick={() => heartOrFireCallback(object, 0)}
                />
                <img
                  src={"/fire.png"}
                  className="w-7 h-7 cursor-pointer hover:scale-110 mr-1 -mt-1"
                  onClick={() => heartOrFireCallback(object, 1)}
                />
                <img
                  src={"/comment.png"}
                  className="w-7 h-7 cursor-pointer hover:scale-110 "
                />
              </div>
            </div>
          </div>
        </div>
      );
    };

    const ImageCollection = ({ object }) => {
      return (
        <div className="flex flex-col border-2 border-black rounded-xl">
          <div className="pl-3 pr-3 pt-2 pb-2 flex">
            <div>
              <img
                src={object.userPfpic}
                className="cursor-pointer flex mx-auto h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
              />
            </div>
            <div className="flex flex-col max-w-xl">
              {isBuffer ? (
                <>
                  <p className="font-ez ml-2 font-bold text-sm">
                    <span className="text-red-500">{object.user} </span>
                    <span className="text-xs text-black">
                      {moment(object.createdAt).fromNow()}
                    </span>
                  </p>
                </>
              ) : (
                <p className="font-ez ml-2 font-bold text-sm">
                  <span>{object.user} </span>
                  <span className="text-xs text-gray-500">
                    {moment(object.createdAt).fromNow()}
                  </span>
                </p>
              )}
              {isBuffer ? (
                <>
                  <p
                    className="font-ez ml-2 text-lg text-red-500"
                    dangerouslySetInnerHTML={{ __html: object.text }}
                  ></p>
                  <p className="text-black text-sm font-ez pl-2 blink">
                    processing post...
                  </p>
                </>
              ) : (
                <>
                  <p
                    className="font-ez ml-2 text-lg"
                    dangerouslySetInnerHTML={{ __html: object.text }}
                  ></p>
                </>
              )}
              <span className="z-10 font-ez ml-2 font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-700">
                image collection
              </span>

              <div
                className={`grid img-grid`}
                style={{
                  gridTemplateColumns: `repeat(${findGridSize(
                    object.images.length
                  )},1fr)`,
                }}
              >
                {object.images.map((f, idx) => (
                  <img src={f} className={`rounded-xl`} />
                ))}
              </div>

              <div className="ml-2 flex items-center mt-1">
                <img
                  src={"/heart-red.png"}
                  className="w-5 h-5 cursor-pointer hover:scale-110 mr-1"
                  onClick={() => heartOrFireCallback(object, 0)}
                />
                <img
                  src={"/fire.png"}
                  className="w-5 h-5 cursor-pointer hover:scale-110 mr-1 -mt-1"
                  onClick={() => heartOrFireCallback(object, 1)}
                />
                <img
                  src={"/comment.png"}
                  className="w-5 h-5 cursor-pointer hover:scale-110 "
                />
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <>
        {object.images.length > 3 ? (
          <ImageCollection object={object} />
        ) : (
          <ImageStandardPost object={object} />
        )}
      </>
    );
  };

  const VidPost = ({ object, heartOrFireCallback, isBuffer }) => {
    return (
      <div className="flex flex-col border-2 border-black rounded-xl">
        <div className="pl-3 pr-3 pt-2 pb-2 flex">
          <div>
            <img
              src={object.userPfpic}
              className="cursor-pointer flex mx-auto h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
            />
          </div>
          <div className="flex flex-col max-w-xl">
            {isBuffer ? (
              <>
                <p className="font-ez ml-2 font-bold text-sm">
                  <span className="text-red-500">{object.user} </span>
                  <span className="text-xs text-black">
                    {moment(object.createdAt).fromNow()}
                  </span>
                </p>
              </>
            ) : (
              <p className="font-ez ml-2 font-bold text-sm">
                <span>{object.user} </span>
                <span className="text-xs text-gray-500">
                  {moment(object.createdAt).fromNow()}
                </span>
              </p>
            )}
            <span className="z-10 font-ez ml-2 font-bold text-[9px] text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-green-700">
              video post
            </span>

            <video className="-z-10" controls>
              <source src={object.videos[0]} type="video/mp4" />
            </video>
            {isBuffer ? (
              <>
                <p
                  className="font-ez ml-2 text-lg text-red-500"
                  dangerouslySetInnerHTML={{ __html: object.text }}
                ></p>
                <p className="text-black text-sm font-ez pl-2 blink">
                  processing post...
                </p>
              </>
            ) : (
              <>
                <p
                  className="font-ez ml-2 text-lg"
                  dangerouslySetInnerHTML={{ __html: object.text }}
                ></p>
              </>
            )}
            <div className="ml-2 flex items-center mt-1">
              <img
                src={"/heart-red.png"}
                className="w-5 h-5 cursor-pointer hover:scale-110 mr-1"
                onClick={() => heartOrFireCallback(object, 0)}
              />
              <img
                src={"/fire.png"}
                className="w-5 h-5 cursor-pointer hover:scale-110 mr-1 -mt-1"
                onClick={() => heartOrFireCallback(object, 1)}
              />
              <img
                src={"/comment.png"}
                className="w-5 h-5 cursor-pointer hover:scale-110 "
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const heartOrFirePost = async (post, action: number) => {
    // Register backend (simply as a number, not actual data)
    const obj = {
      id: post["_id"],
      toc: new Date(Date.now()).toISOString(),
      type: action,
    };

    const res = await axios.post(backendURL + "/create/heart-fire", obj);
    console.log(res.data);

    // Get Embeddings so we can register it on graph
    const graphPayload = {
      id: post["_id"],
    };

    const res2 = await axios.post(backendURL + "/get/embeddings", graphPayload);
    console.log(res2.data);

    const n_payload = {
      embeddings : res2.data.data.embeddings,
      text : post["text"],
      toc : Date.now(),
      popularity : res.data.data.hearts.length + res.data.data.images.length
    }

    // Send that payload to our reccomendation manager
    ReccomendationManager.init();
    ReccomendationManager.add_embeddings(n_payload);
    await ReccomendationManager.chroma_predict();
  };

  return (
    <div>
      {/* Topic Headers */}
      <div className="sticky top-0 flex justify-center mb-0">
        <div className={`cursor-pointer ml-1 w-auto pl-5 pr-5 mt-1 mb-0 shadow-lg rounded-2xl bg-white ${gradients[0][1]} border-2 hover:scale-105 transition-all`}>
          <p className={`text-transparent font-ez bg-clip-text text-lg z-[10000] bg-gradient-to-r ${gradients[0][0]}`}>taylor swift</p>
        </div>
        <div className={`cursor-pointer ml-1 w-auto pl-5 pr-5 mt-1 mb-0 shadow-lg rounded-2xl bg-white ${gradients[0][1]} border-2 hover:scale-105 transition-all`}>
          <p className={`text-transparent font-ez bg-clip-text text-lg z-[10000] bg-gradient-to-r ${gradients[0][0]}`}>lol</p>
        </div>
      </div>
      {/* Feed */}
      {feed.length === 0 && buffers.length === 0? (
        <div className="flex justify-center items-center mt-3">
          <Loader size={1} />
        </div>
      ) : (
        <div className="flex justify-center mt-1 ">
          {/* Render all of our posts */}
          <div>
            {buffers.map((e) => (
              // <a href={`/h/post/${e._id}`}>
              <div className="mt-5">
                {e.type === 0 && (
                  <TextPost
                    object={e}
                    heartOrFireCallback={heartOrFirePost}
                    isBuffer={!e.isProcessed}
                  />
                )}
                {e.type === 1 && (
                  <ImgPost
                    object={e}
                    heartOrFireCallback={heartOrFirePost}
                    isBuffer={!e.isProcessed}
                  />
                )}
                {e.type === 2 && (
                  <VidPost
                    object={e}
                    heartOrFireCallback={heartOrFirePost}
                    isBuffer={!e.isProcessed}
                  />
                )}
              </div>
              // </a>
            ))}
            {feed.map((e) => (
              // <a href={`/h/post/${e._id}`}>
              <div className="mt-5">
                {e.type === 0 && (
                  <TextPost
                    object={e}
                    heartOrFireCallback={heartOrFirePost}
                    isBuffer={false}
                  />
                )}
                {e.type === 1 && (
                  <ImgPost
                    object={e}
                    heartOrFireCallback={heartOrFirePost}
                    isBuffer={false}
                  />
                )}
                {e.type === 2 && (
                  <VidPost
                    object={e}
                    heartOrFireCallback={heartOrFirePost}
                    isBuffer={false}
                  />
                )}
              </div>
              // </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export interface HomeIslandProps {
  buffers: any[];
  removeBuffer: Function;
}

export default HomeIsland;
