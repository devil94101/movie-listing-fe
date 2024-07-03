import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

type props = {
  open: boolean;
  setOpen: () => void;
  children?: React.ReactNode;
  onAgree?: () => void;
  singleBtn?: boolean;
};

export default function ResponsiveDialog({
  open,
  setOpen,
  children,
  onAgree,
  singleBtn,
}: props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => {
    setOpen();
  };

  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{children}</DialogTitle>
        {singleBtn ? (
          <DialogActions className="gap-x-4">
            <button autoFocus onClick={handleClose} className="btn">
              Okay
            </button>
           
          </DialogActions>
        ) : (
          <DialogActions className="gap-x-4">
            <button autoFocus onClick={handleClose} className="btn">
              Cancel
            </button>
            <button onClick={onAgree} autoFocus className="btn btn-primary">
              Agree
            </button>
          </DialogActions>
        )}
      </Dialog>
    </React.Fragment>
  );
}
