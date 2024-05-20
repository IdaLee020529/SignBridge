import React, { useEffect, useRef } from "react";
import styles from "./InstructionPopup.module.css";
import InstructionImage from "/images/InfoPopup.png";

interface InstructionPopupProps {
    showInstructionPopup: boolean;
    onClose: () => void;
}

const InstructionPopup: React.FC<InstructionPopupProps> = ({
    showInstructionPopup,
    onClose,
}) => {
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (showInstructionPopup) {
            document.addEventListener("mousedown", handleClickOutside);
            document.body.classList.add(styles.noScroll);
        } else {
            document.body.classList.remove(styles.noScroll);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.classList.remove(styles.noScroll);
        };
    }, [showInstructionPopup, onClose]);

    return (
        <div
            className={`${styles["instruction-popup"]} ${
                showInstructionPopup ? styles["shown"] : ""
            }`}
            ref={popupRef}
        >
            <div className={styles.instruction_popup_header}>
                <h1 className={styles.instruction_title}>Instructions</h1>
                <i className={`${styles.fa} fa fa-close`} onClick={onClose}></i>
            </div>
            <div className={styles.instruction_popup_details}>
                <div className={styles.instruction_popup_details_section1}>
                    <p>
                        <strong>1.</strong> Login a user account
                    </p>
                    <p>
                        <strong>2.</strong> Fill up the details - Name, Email,
                        Text/ Sentence
                    </p>
                    <p>
                        <strong>3.</strong> Upload a demonstration video of the
                        text/sentence
                    </p>
                    <p>
                        <strong>4.</strong> Press the reset button to reset the
                        form or the submit button to submit the form
                    </p>
                </div>
                <hr className={styles.line_separator} />
                <div className={styles.instruction_popup_details_section2}>
                    <p>Note:</p>
                    <div className={styles.instruction_popup_content}>
                        <ul>
                            <li>The video submitted must be in mp4 format</li>
                            <li>
                                The video should include either half or entire
                                body of the presenter
                            </li>
                            <li>
                                The video will only be used for avatar
                                preparation purpose only
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={styles.instruction_popup_details_section3}>
                    <p>You can refer to the image below:</p>
                    <div className={styles.instruction_popup_details_image}>
                        <img
                            src={InstructionImage}
                            alt="instruction-image"
                            className={styles.instruction_image}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructionPopup;
