import React from "react";

const Loader: React.FC<LoaderProps> = ({ size }) => {
  return (
    <>
      <div className="loader" style={{ zoom: size }}></div>
    </>
  );
};

interface LoaderProps {
  size: number;
}

export default Loader;
