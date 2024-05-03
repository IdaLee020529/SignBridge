import React from "react";
import { BiSolidInfoSquare } from "react-icons/bi";
import { IconContext } from "react-icons";
import "./InfoIcon.css";

const InfoIcon = () => {
  return (
    <IconContext.Provider value={{ color: "#000" }}>
      <BiSolidInfoSquare className="dataForm-info" />
    </IconContext.Provider>
  );
};

export default InfoIcon;
