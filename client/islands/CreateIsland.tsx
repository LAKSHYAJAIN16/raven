import React from "react";
import UserData from "../components/UserData";

const CreateIsland: React.FC<IslandProps> = ({ callback }) => {
  const pfpic = UserData.getData("profilePic");

  return (
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
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full sm:max-w-lg sm:my-0 fade-modal-in">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex">
                  <img
                    className="hidden sm:flex mx-auto h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10"
                    src={pfpic}
                  ></img>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <div className="mt-2 w-full">
                      <p>
                        <span
                          className="font-ez text-sm text-gray-700 outline-none focus:outline-gray-400 rounded-2xl pl-3 pr-3 pt-1 pb-1 block resize-none sm:w-[90%] w-full overflow-hidden box"
                          placeholder="wassup?"
                          role="textbox"
                          contentEditable
                        ></span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white px-4 py-3 sm:flex sm:flex-row-reverse flex flex-col items-center justify-center sm:px-6 scale-90 ml-0 sm:ml-[70%]">
                <button className="relative inline-block text-lg group w-full sm:w-40 font-ez scale-75">
                  <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                    <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                    <span className="absolute left-0  w-[100vw] sm:w-52 h-52 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                    <span className="relative">post</span>
                  </span>
                </button>
                <button className="relative inline-block text-lg group w-full sm:w-40 font-ez scale-75">
                  <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-red-800 transition-colors duration-300 ease-out border-2 border-red-500 rounded-lg group-hover:text-white">
                    <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                    <span className="absolute left-0  w-[100vw] sm:w-52 h-52 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-red-500 group-hover:-rotate-180 ease"></span>
                    <span className="relative">exit</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateIsland;

export interface IslandProps {
  callback: (type: string) => void;
}
