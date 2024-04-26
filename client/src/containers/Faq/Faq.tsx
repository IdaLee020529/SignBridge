import React from "react";
import styles from "./Faq.module.css";
import AccordionDemo from '../../components/FaqBox/FaqBox'; 

export default function Faq() {
    return (
      <div>
        <img src="./images/faq.png" alt="Setting" width="100%" height="10%" />
        <AccordionDemo /> 
      </div>
    )
}
