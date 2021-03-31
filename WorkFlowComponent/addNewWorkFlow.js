import _ from "@lodash";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DialogTitle from "@material-ui/core/DialogTitle";
import React, { Fragment, useState } from "react";
// import makeStyles from '@material-ui/core/styles/makeStyles';
import DialogContent from "@material-ui/core/DialogContent";
import Icon from "@material-ui/core/Icon";
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

function AddNewWorkFlow(props) {
  const {
    workFlow,
    addNewWorkFlow,
    contact,
    openCloseDialog,
    workFlowList,
    editData,
    updateWorkFlow,
  } = props;
  const [formData, setFormData] = useState({
    id: "",
    contactId: contact.id,
  });
  if (editData && formData.id === "") {
    setFormData({
      ...formData,
      id: editData.workFlowId,
      data: editData,
    });
  }
  function checkWorkFlow() {
    let filterList = [];
    workFlow.forEach((obj) => {
      let list = workFlowList?.filter((item) => item?.workFlowId === obj?.id);
      if (list && list.length === 0 && obj.isActive) {
        filterList.push(obj);
      } else if (
        list &&
        list.length &&
        obj.isMultiple &&
        obj.isActive &&
        list[0].isCompleted
      ) {
        filterList.push(obj);
      }
      if (
        editData &&
        list &&
        list.length !== 0 &&
        list[0].sequenceId === editData.sequenceId
      )
        filterList.push(obj);
    });
    return filterList;
  }
  // function getFilterStepList() {
  //   let data = workFlow;
  //   data = _.find(data, { id: formData.id });
  //   if (editData && formData.date === "") {
  //     setFormData((prevState) => ({
  //       ...prevState,
  //       date: data.flow[0].id,
  //     }));
  //   }
  //   return data.flow;
  // }
  function handleClose() {
    props.openCloseDialog();
    setFormData((prevState) => ({ ...prevState, id: "", date: "" }));
  }
  async function handleSubmit() {
    if (editData) await updateWorkFlow(formData.data, formData.id);
    else await addNewWorkFlow(formData);
    openCloseDialog();
    setFormData((prevState) => ({ ...prevState, id: "", date: "" }));
  }
  return (
    <Fragment>
      <Dialog open={props.dialog} fullWidth maxWidth="xs">
        <DialogTitle component="div" className="p-0">
          <div className="flex w-full px-8 sm:px-16">
            <div className="flex items-center w-1/2 justify-start">
              <Typography>{editData ? "Edit" : "Add"} Sequence</Typography>
            </div>
            <div className="flex ml-auto flex-wrap mb-4">
              <IconButton onClick={handleClose} color="inherit">
                <Icon>close</Icon>
              </IconButton>
            </div>
          </div>
        </DialogTitle>
        <DialogContent className="p-16 sm:p-8 w-full h-full" dividers>
          <form>
            <div className="flex w-full items-center justify-center flex-wrap ">
              <div className="flex w-full pl-8 pr-8 items-center pb-24">
                <TextField
                  select
                  label="WorkFlow"
                  name="WorkFlow"
                  value={formData.id}
                  onChange={(event) => {
                    setFormData((prevState) => ({
                      ...prevState,
                      id: event?.target?.value,
                    }));
                  }}
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option key={0} disabled />
                  {workFlow &&
                    checkWorkFlow().map((option, index) => (
                      <option key={index} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                </TextField>
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions className="flex w-full justify-center">
          <Button
            disabled={formData.id === ""}
            onClick={handleSubmit}
            variant="contained"
            color="primary"
          >
            {editData ? "EDIT" : "ADD"}
          </Button>
          <Button onClick={handleClose} variant="contained" color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
function mapStateToProps(state) {
  const { contactApp } = state;
  return {
    dialog: contactApp.workFlow.dialog,
    contact: contactApp.selectedContact,
    workFlow: contactApp.workFlow.workFlow,
    editData: contactApp.workFlow.editData,
    workFlowList: contactApp.workFlow.workFlowList,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { openCloseDialog, addNewWorkFlow, updateWorkFlow },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(AddNewWorkFlow);
