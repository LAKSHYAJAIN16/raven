import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendURL } from "../settings";
import Loader from "../components/Loader";
import moment from "moment";

export default function HomeIsland() {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const fn = async () => {
      // backend call
      const dat = await axios.get(backendURL + "/get/posts");
      const actPosts = dat.data.data;
      setFeed(actPosts);
      console.log(actPosts);
    };
    fn();
  }, []);

  const TextPost = ({ object }) => {
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
            <p className="font-ez ml-2 font-bold text-sm">
              <span>{object.user} </span>
              <span className="text-xs text-gray-500">
                {moment(object.createdAt).fromNow()}
              </span>
            </p>
            <span className="z-10 font-ez ml-2 font-bold text-[9px] text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-700">
              text post
            </span>
            <p
              className="font-ez ml-2 text-lg"
              dangerouslySetInnerHTML={{ __html: object.text }}
            ></p>
            <div className="ml-2 flex items-center mt-1">
              <img
                src={"/heart-red.png"}
                className="w-5 h-5 cursor-pointer hover:scale-110 mr-1"
              />
              <img
                src={"/fire.png"}
                className="w-5 h-5 cursor-pointer hover:scale-110 mr-1 -mt-1"
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

  const ImgPost = ({ object }) => {
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
              <p className="font-ez ml-2 font-bold text-sm">
                <span>{object.user} </span>
                <span className="text-xs text-gray-500">
                  {moment(object.createdAt).fromNow()}
                </span>
              </p>
              <span className="z-10 font-ez ml-2 font-bold text-[9px] text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-700">
                img post
              </span>
              <p
                className="font-ez ml-2 text-lg"
                dangerouslySetInnerHTML={{ __html: object.text }}
              ></p>
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
                />
                <img
                  src={"/fire.png"}
                  className="w-7 h-7 cursor-pointer hover:scale-110 mr-1 -mt-1"
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
              <p className="font-ez ml-2 font-bold text-sm">
                <span>{object.user} </span>
                <span className="text-xs text-gray-500">
                  {moment(object.createdAt).fromNow()}
                </span>
              </p>
              <p
                className="font-ez ml-2 text-2xl"
                dangerouslySetInnerHTML={{ __html: object.text }}
              ></p>
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
                />
                <img
                  src={"/fire.png"}
                  className="w-5 h-5 cursor-pointer hover:scale-110 mr-1 -mt-1"
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

  return (
    <div>
      {feed.length === 0 ? (
        <div className="flex justify-center items-center mt-3">
          <Loader size={1} />
        </div>
      ) : (
        <div className="flex justify-center mt-10 ">
          {/* Render all of our posts */}
          <div>
            {feed.map((e) => (
              <>
                {e.type === 0 && <TextPost object={e} />}
                {e.type === 1 && <ImgPost object={e} />}
              </>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
