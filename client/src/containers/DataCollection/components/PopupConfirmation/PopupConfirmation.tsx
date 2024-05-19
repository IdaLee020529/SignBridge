import React from "react";
import "./PopupConfirmation.css";
import { Button } from "../../../../components/Button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import ButtonProcessing from "../../../../components/ButtonProcessing/ButtonProcessing";
import { useTranslation } from "react-i18next";

interface PopupConfirmationProps {
  name: string;
  email: string;
  text: string;
  video: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: any;
}

const PopupConfirmation: React.FC<PopupConfirmationProps> = ({
  name,
  email,
  text,
  video,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <div className={`popup-confirmation ${isOpen ? "open" : ""}`}>
      <div className="popup-confirmation-content-header">
        <h2>Are you sure?</h2>
      </div>
      <div className="popup-confirmation-content">
        <div className="popup-confirmation-details">
          <TableContainer
            component={Paper}
            sx={{
              boxShadow: "none",
            }}
          >
            <Table>
              <TableBody>
                <TableRow
                  sx={{
                    backgroundColor: "#e4e4e4",
                    fontFamily: `"Plus Jakarta Sans", "Plus Jakarta Sans Placeholder", sans-serif`,
                  }}
                >
                  <TableCell
                    sx={{
                      fontSize: "20px",
                      wordBreak: "break-word",
                      width: "20%",
                      borderRight: "1px solid #8a8a8a",
                      fontFamily: `"Plus Jakarta Sans", "Plus Jakarta Sans Placeholder", sans-serif`,
                    }}
                  >
                    <b>Name</b>
                  </TableCell>
                  <TableCell sx={{ fontSize: "16px", wordBreak: "break-word" }}>
                    {name}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{
                    backgroundColor: "#bbbbbb",
                    fontFamily: `"Plus Jakarta Sans", "Plus Jakarta Sans Placeholder", sans-serif`,
                  }}
                >
                  <TableCell
                    sx={{
                      fontSize: "20px",
                      wordBreak: "break-word",
                      width: "20%",
                      borderRight: "1px solid #8a8a8a",
                      fontFamily: `"Plus Jakarta Sans", "Plus Jakarta Sans Placeholder", sans-serif`,
                    }}
                  >
                    <b>Email</b>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "16px",
                      wordBreak: "break-word",
                      fontFamily: `"Plus Jakarta Sans", "Plus Jakarta Sans Placeholder", sans-serif`,
                    }}
                  >
                    {email}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{
                    backgroundColor: "#e4e4e4",
                    fontFamily: `"Plus Jakarta Sans", "Plus Jakarta Sans Placeholder", sans-serif`,
                  }}
                >
                  <TableCell
                    sx={{
                      fontSize: "20px",
                      wordBreak: "break-word",
                      width: "20%",
                      borderRight: "1px solid #8a8a8a",
                      fontFamily: `"Plus Jakarta Sans", "Plus Jakarta Sans Placeholder", sans-serif`,
                    }}
                  >
                    <b>Text</b>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "16px",
                      wordBreak: "break-word",
                      fontFamily: `"Plus Jakarta Sans", "Plus Jakarta Sans Placeholder", sans-serif`,
                    }}
                  >
                    {text}
                  </TableCell>
                </TableRow>
                <TableRow sx={{ backgroundColor: "#bbbbbb" }}>
                  <TableCell
                    sx={{
                      fontSize: "20px",
                      wordBreak: "break-word",
                      width: "20%",
                      borderRight: "1px solid #8a8a8a",
                      fontFamily: `"Plus Jakarta Sans", "Plus Jakarta Sans Placeholder", sans-serif`,
                    }}
                  >
                    <b>Video</b>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "16px",
                      wordBreak: "break-word",
                      fontFamily: `"Plus Jakarta Sans", "Plus Jakarta Sans Placeholder", sans-serif`,
                    }}
                  >
                    {video}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div className="popup-confirmation-content-button">
          <Button
            type="button"
            onClick={onClose}
            buttonStyle="btn--reset"
            buttonSize="btn--large"
          >
            Cancel
          </Button>
          <ButtonProcessing
            onClick={onSubmit}
            buttonStyle="btn-submit"
            buttonSize="btn-large"
          >
            {t("submit_btn")}
          </ButtonProcessing>
        </div>
      </div>
    </div>
  );
};

export default PopupConfirmation;
