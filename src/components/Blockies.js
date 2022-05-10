import React from "react";
import Blockiess from "react-blockies";

export const Blockies = ({ address }) => {
  return (
    <div class="rounded-full h-11 w-11 overflow-hidden mr-3">
      <Blockiess
        seed={address} // the only required prop; determines how the image is generated
        size={10} // number of squares wide/tall the image will be; default = 15
        scale={5} // width/height of each square in pixels; default = 4
        color={"#D08770"} // normal color; random by default
        bgColor={"#EBCB8B"} // background color; random by default
        spotColor={"#A3BE8C"} // color of the more notable features; random by default
        className="identicon" // optional class name for the canvas element; "identicon" by default
      />
    </div>
  );
};
