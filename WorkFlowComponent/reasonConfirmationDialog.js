import React, { Fragment, useState } from "react";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  openCloseDialog,
  addNewWorkFlow,
  updateWorkFlow,
} from "../../../../store/action/workFlowContact.action";

function ConfirmationDialog(props) {
  const [reason, setReason] = useState("");
  return (
    <Fragment>
      <Dialog open={props.dialog} fullWidth maxWidth="xs">
        <DialogContent className="p-16 sm:p-8 w-full h-full" dividers>
          <div className="flex w-full items-center justify-center flex-wrap ">
            <div className="flex w-full pl-8 pr-8 items-center pb-24">
              <TextField
                label="Reason"
                onChange={(event) => setReason(event.target.value)}
                name="reason"
                fullWidth
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions className="flex w-full justify-center">
          <Button
            disabled={reason === ""}
            onClick={() => props.handleReasonSubmit(reason)}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
          <Button
            onClick={() => props.closeCancelDialog()}
            variant="contained"
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { openCloseDialog, addNewWorkFlow, addNewWorkFlow },
    dispatch
  );
}
export default connect(null, mapDispatchToProps)(ConfirmationDialog);
