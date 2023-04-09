import React, { useState } from "react";
import CreateIsland from "../../islands/CreateIsland";
import DiscoverIsland from "../../islands/DiscoverIsland";
import DebateIsland from "../../islands/DebateIsland";
import PrivacyIsland from "../../islands/PrivacyIsland";
import HomeIsland from "../../islands/HomeIsland";

const Home: React.FC = () => {
  const [isHome, setIsHome] = useState<boolean>(true);
  const [isDiscover, setIsDiscover] = useState<boolean>(false);
  const [isDebate, setIsDebate] = useState<boolean>(false);
  const [isPrivacy, setIsPrivacy] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);

  function setState(func: any) {
    setIsHome(false);
    setIsDebate(false);
    setIsDiscover(false);
    setIsPrivacy(false);
    func(true);
  }

  function islandCallback(type: string) {
    switch (type) {
      case "create":
        setIsCreate(false);
        break;
      default:
        break;
    }
  }

  return (
    <>
      <div className="h-screen absolute w-screen z-20">
        {isCreate && <CreateIsland callback={islandCallback} />}
        <div className="w-screen">
          {/* Actual thing */}
          <div className="sticky m-auto w-screen">
            <div className="flex justify-center mt-3 font-ez">
              <button>
                <img
                  onClick={() => setState(setIsHome)}
                  src="/home.png"
                  className={`${
                    isHome === false && "grayscale"
                  } h-10 w-10 mr-2 ml-2 `}
                ></img>
              </button>
              <button>
                <img
                  onClick={() => setState(setIsDiscover)}
                  src="/discover.png"
                  className={`${
                    isDiscover === false && "grayscale"
                  } h-10 w-10 mr-2 ml-2 `}
                ></img>
              </button>
              <button>
                <img
                  onClick={() => setIsCreate(true)}
                  src="/plus.png"
                  className={`${
                    isCreate === false && "grayscale"
                  } h-7 w-7 mr-2 ml-2 `}
                ></img>
              </button>
              <button>
                <img
                  onClick={() => setState(setIsDebate)}
                  src="/debate.png"
                  className={`${
                    isDebate === false && "grayscale"
                  } h-10 w-10 mr-2 ml-2 `}
                ></img>
              </button>
              <button>
                <img
                  onClick={() => setState(setIsPrivacy)}
                  src="/privacy.png"
                  className={`${
                    isPrivacy === false && "grayscale"
                  } h-10 w-10 mr-2 ml-2 `}
                ></img>
              </button>
            </div>
          </div>

          <div className="mt-4 text-center ">
            {/* Titles */}
            {isHome && (
              <span className="font-extrabold text-transparent text-6xl bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 font-ez">
                home
              </span>
            )}

            {isDiscover && (
              <span className="font-extrabold text-transparent text-6xl bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 font-ez">
                discover
              </span>
            )}

            {isDebate && (
              <span className="font-extrabold text-transparent text-6xl bg-clip-text bg-gradient-to-r from-lime-400 to-green-600 font-ez">
                debate
              </span>
            )}

            {isPrivacy && (
              <span className="font-extrabold text-transparent text-6xl bg-clip-text bg-gradient-to-r from-gray-400 to-black font-ez">
                privacy
              </span>
            )}
          </div>
        </div>
        <div>
          {isDebate && <DebateIsland />}
          {isDiscover && <DiscoverIsland />}
          {isPrivacy && <PrivacyIsland />}
          {isHome && <HomeIsland />}
        </div>
      </div>
      <div className="h-screen absolute w-screen z-1  background"></div>
    </>
  );
};

export default Home;
