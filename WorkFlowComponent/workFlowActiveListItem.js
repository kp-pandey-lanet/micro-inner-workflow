import _ from "@lodash";
import Chip from "@material-ui/core/Chip";
import FuseAnimate from "@fuse/core/FuseAnimate";
import Typography from "@material-ui/core/Typography";
import React, { useState, Fragment } from "react";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import { bindActionCreators } from "redux";
import {
  updateStatusType,
  resetStep,
  openCloseDialog,
} from "../../../../store/action/workFlowContact.action";
import ConfirmationDialogComponent from "app/main/confirmationDialogComponent";
import ConfirmationDialog from "./reasonConfirmationDialog";
const useStyles = makeStyles((theme) => ({
  seqBg: {
    backgroundColor: "#eef5f9",
  },
  chipColor: {
    backgroundColor: "#f2f4f8",
  },
  actionSymbol: {
    height: "28px",
    width: "28px",
    "&:hover": {
      backgroundColor: "#f5f5f5",
      borderRadius: "50%",
    },
  },
  stepIcon: {
    borderRadius: "50%",
    backgroundColor: "#61dafb",
    color: "#fff",
    boxShadow: "0 2px 4px  #0000007a",
  },
}));
function WorkFlowActiveListItem(props) {
  const { list, openCloseDialog, workFlow } = props;
  const [modelDialog, setModelDialog] = useState({
    resetDialog: false,
    id: "",
    cancelDialog: false,
    data: "",
  });
  const classes = useStyles(props);
  function handleEditClick(data) {
    openCloseDialog(data);
  }
  console.log("workflow", list);
  console.log("work", workFlow);
  function renderChip(name) {
    return (
      <Chip
        className={`h-24 text-12 font-semibold text-white capitalize ${
          name === "pause" ? `bg-orange` : `bg-green`
        }`}
        label={name}
      />
    );
  }
  function Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  async function handleReasonSubmit(reason) {
    await props.updateStatusType("cancelled", modelDialog.data, reason);
    setModelDialog((prevState) => ({
      ...prevState,
      cancelDialog: !modelDialog.cancelDialog,
    }));
  }
  function openCancelDialog(data) {
    setModelDialog((prevState) => ({
      ...prevState,
      data: data,
      cancelDialog: !modelDialog.cancelDialog,
    }));
  }
  function closeCancelDialog() {
    setModelDialog((prevState) => ({
      ...prevState,
      cancelDialog: !modelDialog.cancelDialog,
    }));
  }
  async function handleOnReset() {
    await props.resetStep(modelDialog.data);
    setModelDialog((prevState) => ({
      ...prevState,
      resetDialog: !modelDialog.resetDialog,
    }));
  }
  function handleModel(data) {
    setModelDialog((prevState) => ({
      ...prevState,
      data: data,
      resetDialog: !modelDialog.resetDialog,
    }));
  }
  // function showCompleted(flow, prev) {
  //   if (prev === "") {
  //     return 0;
  //   } else {
  //     var count = flow.findIndex((obj) => obj.id === prev);
  //     return count + 1;
  //   }
  // }
  function CircularProgressWithLabel(props) {
    return (
      <Box position="relative" display="inline-flex">
        <CircularProgress color="secondary" variant="determinate" {...props} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="caption"
            component="div"
            color="textSecondary"
          >{`${Math.round(props.value)}%`}</Typography>
        </Box>
      </Box>
    );
  }
  async function updateStatus(status, data) {
    await props.updateStatusType(status, data);
  }
  return (
    <FuseAnimate animation="transition.fadeIn" duration={400} delay={100}>
      <div className="flex w-full flex-wrap ">
        {modelDialog.cancelDialog && (
          <ConfirmationDialog
            dialog={modelDialog.cancelDialog}
            closeCancelDialog={closeCancelDialog}
            openCancelDialog={openCancelDialog}
            handleReasonSubmit={handleReasonSubmit}
          />
        )}
        {modelDialog.resetDialog && (
          <ConfirmationDialogComponent
            description={"Are you sure to reset this list ?"}
            cancelButtonTitle={"No"}
            cancelButtonAction={handleModel}
            submitButtonAction={handleOnReset}
            submitButtonTitle={"Yes"}
          />
        )}
        {list.map((data, index) => {
          const workFlowData = _.find(workFlow, { id: data.workFlowId });
          console.log("data", workFlowData);
          return (
            workFlowData && (
              <Fragment>
                <Card
                  variant="outlined"
                  className="flex w-full p-12 mt-8 mr-8 items-center"
                  key={workFlowData.id}
                >
                  <div className="flex w-7/12 items-center">
                    <Typography
                      className="font-semibold mr-24 ml-6 capitalize text-16"
                      color="textSecondary"
                      variant="subtitle1"
                      noWrap
                    >
                      {workFlowData.name}
                    </Typography>
                    <Typography
                      className={`font-semibold ml-6 capitalize text-12 ${
                        workFlowData.isActive ? `text-green` : `text-red`
                      }`}
                      color="textSecondary"
                      variant="subtitle1"
                      noWrap
                    >
                      {`${workFlowData.isActive ? `(Active)` : `(InActive)`}`}
                    </Typography>
                  </div>
                  <div className="flex w-1/12 justify-end items-center ">
                    <CircularProgressWithLabel value={50} />
                  </div>
                  <div className="flex w-2/12 justify-center items-center flex-col">
                    <Typography
                      className=" sm:px-16 px-0 font-semibold text-gray-600 text-10 truncate"
                      component="div"
                    >
                      {`Added Date`}
                    </Typography>
                    {new Date(
                      workFlowData.dateModified.seconds * 1000 +
                        workFlowData.dateModified.nanoseconds / 1000
                    ).toLocaleDateString()}
                  </div>
                  <div className="flex w-1/12">{renderChip(data.status)}</div>

                  <div className="flex w-1/12 justify-end items-center">
                    {data.status === "pause" ? (
                      <Tooltip placement="top" title="Resume">
                        <Icon
                          className={`cursor-pointer mr-8 text-gray-700 hover:text-green`}
                          id="pause"
                          onClick={() => updateStatus("running", data)}
                        >
                          play_circle_outline
                        </Icon>
                      </Tooltip>
                    ) : (
                      <Tooltip placement="top" title="Pause">
                        <Icon
                          className={`cursor-pointer mr-8 text-gray-700 hover:text-orange`}
                          id="pause"
                          onClick={() => updateStatus("pause", data)}
                        >
                          pause_circle_outline
                        </Icon>
                      </Tooltip>
                    )}
                    <Tooltip placement="top" title="Remove">
                      <Icon
                        className={`cursor-pointer text-28 text-gray-700 hover:text-red`}
                        id="cancel"
                        onClick={() => openCancelDialog(data)}
                      >
                        delete_forever
                      </Icon>
                    </Tooltip>
                  </div>
                </Card>
              </Fragment>
              // <Paper
              //   className={`w-full rounded-8 shadow-md border-1 mt-16 h-full ${classes.seqBg}`}
              //   key={index}
              // >
              //   <div className="flex sm:items-center items-start justify-between border-b-1 w-full py-4 px-16 sm:flex-row flex-col sm:pb-6 pb-10">
              //     <div className="flex w-full">
              //       <Typography className="text-18" component="h6" variant="h6">
              //         {`${Capitalize(workFlowData.name)} (${
              //           workFlowData.isActive ? "active" : "inActive"
              //         })`}
              //       </Typography>
              //     </div>
              //     <div className="flex w-full sm:flex-col flex-row sm:mt-0 mt-6">
              //       <div className="flex sm:w-full w-1/2">
              //         <Typography
              //           className="sm:px-16 px-0 font-semibold text-gray-600 text-13"
              //           component="div"
              //         >
              //           {`Total step : ${workFlowData.flow.length}`}
              //         </Typography>
              //       </div>
              //       <div className="flex sm:w-full w-1/2">
              //         <Typography
              //           className=" sm:px-16 px-0 font-semibold text-gray-600 sm:6 text-13"
              //           component="div"
              //         >
              //           {/* {`Complete : ${workFlowData.flow.findIndex(item => item.id === data.step)}`} */}
              //           {"Complete :"}
              //           {showCompleted(workFlowData.flow, sequence[0].lastStep)}
              //         </Typography>
              //       </div>
              //     </div>
              //     <div className="flex w-full items-center">
              //       <div className="flex sm:w-auto w-1/2">
              //         <Typography
              //           className=" sm:px-16 px-0 font-semibold text-gray-600 text-13 truncate"
              //           component="div"
              //         >
              //           {`Added Date`}
              //         </Typography>
              //       </div>
              //       <div className="flex sm:pt-0 pt-4 w-1/2">
              //         <Chip
              //           className={clsx(
              //             "h-24 text-12 font-semibold text-gray-600 bg-white truncate"
              //           )}
              //           label={
              //             workFlowData.dateModified.seconds &&
              //             new Date(
              //               workFlowData.dateModified.seconds * 1000 +
              //                 workFlowData.dateModified.nanoseconds / 1000
              //             ).toLocaleDateString()
              //           }
              //         />
              //       </div>
              //     </div>
              //     <div className="flex">{renderChip(data.status)}</div>
              //   </div>
              //   <div className="w-full h-full flex sm:flex-row flex-col items-center">
              //     <div className="flex sm:flex-row flex-col sm:w-1/2 w-full h-full items-center p-12">
              //       <Paper
              //         className={`w-full rounded-6 shadow p-6`}
              //         key={index}
              //       >
              //         <div className="flex items-center border-b-1 pb-6 w-full justify-between">
              //           <Typography
              //             noWrap
              //             className="font-semibold text-gray-600 text-16 ml-6"
              //             component="div"
              //           >
              //             Step Details
              //           </Typography>
              //           <div
              //             className={`flex justify-center items-center mr-6 w-28 h-28 ${classes.stepIcon}`}
              //           >
              //             <Icon className="text-16 font-semibold cursor-pointer">
              //               navigate_next
              //             </Icon>
              //           </div>
              //         </div>
              //         <div className="flex w-full flex-col p-8 pb-0">
              //           <div className="flex w-full">
              //             <div className="flex w-auto justify-start">
              //               <Typography
              //                 noWrap
              //                 className="font-semibold text-gray-600 text-13"
              //                 component="div"
              //               >
              //                 Last step
              //               </Typography>
              //             </div>
              //             <div className="flex sm:w-full sm:w-7/12 w-full justify-end pb-4 pl-10">
              //               <Chip
              //                 className={clsx(
              //                   "h-24 text-12 font-semibold text-gray-800 truncate",
              //                   classes.chipColor
              //                 )}
              //                 label={
              //                   workFlowData.flow &&
              //                   workFlowData.flow.length !== 0 &&
              //                   !data.isReset &&
              //                   Capitalize(workFlowData.flow[0].type)
              //                 }
              //               />
              //             </div>
              //           </div>
              //           <div className="flex w-full">
              //             <div className="flex w-auto justify-start">
              //               <Typography
              //                 noWrap
              //                 className="font-semibold text-gray-600 text-13"
              //                 component="div"
              //               >
              //                 Last time
              //               </Typography>
              //             </div>
              //             <div className="flex w-full justify-end pb-4 pl-10">
              //               <Chip
              //                 className={clsx(
              //                   "h-24 text-12 font-semibold text-gray-800 truncate",
              //                   classes.chipColor
              //                 )}
              //                 label={
              //                   workFlowData.flow &&
              //                   workFlowData.flow.length !== 0 &&
              //                   !data.isReset &&
              //                   workFlowData.flow[0].duration.timeAmount
              //                 }
              //               />
              //             </div>
              //           </div>
              //           <div className="flex w-full">
              //             <div className="flex w-auto justify-start">
              //               <Typography
              //                 noWrap
              //                 className="font-semibold text-gray-600 text-13"
              //                 component="div"
              //               >
              //                 Next step
              //               </Typography>
              //             </div>
              //             <div className="flex w-full justify-end pb-4 pl-10">
              //               <Chip
              //                 className={clsx(
              //                   "h-24 text-12 font-semibold text-gray-800 truncate",
              //                   classes.chipColor
              //                 )}
              //                 label={
              //                   workFlowData.flow &&
              //                   workFlowData.flow[1] &&
              //                   !data.isReset
              //                     ? Capitalize(workFlowData.flow[1].type)
              //                     : workFlowData.flow &&
              //                       workFlowData.flow[0] &&
              //                       data.isReset &&
              //                       Capitalize(workFlowData.flow[0].type)
              //                 }
              //               />
              //             </div>
              //           </div>
              //           <div className="flex w-full">
              //             <div className="flex w-auto justify-start">
              //               <Typography
              //                 noWrap
              //                 className="font-semibold text-gray-600 text-13"
              //                 component="div"
              //               >
              //                 Next time
              //               </Typography>
              //             </div>
              //             <div className="flex w-full justify-end pb-4 pl-10">
              //               {/* <Chip
              //                 className={clsx(
              //                   "h-24 text-12 font-semibold text-gray-800 truncate",
              //                   classes.chipColor
              //                 )}
              //                 label={
              //                   workFlowData.flow &&
              //                   workFlowData.flow[1] &&
              //                   !data.isReset
              //                     ? workFlowData.flow[1].duration.timeAmount
              //                     : workFlowData.flow &&
              //                       workFlowData.flow[0] &&
              //                       data.isReset &&
              //                       workFlowData.flow[0].duration.timeAmount
              //                 }
              //               /> */}
              //             </div>
              //           </div>
              //         </div>
              //       </Paper>
              //     </div>
              //     <div className="flex  sm:flex-row flex-col sm:w-1/2 w-full mt-6 sm:mt-0 h-full p-12">
              //       <Paper
              //         className={`w-full rounded-8 shadow p-6`}
              //         key={index}
              //       >
              //         <div className="flex items-center border-b-1 pb-6 w-full justify-between">
              //           <Typography
              //             noWrap
              //             className="font-semibold text-gray-600 text-16 ml-6"
              //             component="div"
              //           >
              //             Actions
              //           </Typography>
              //           <div
              //             className={`flex justify-center items-center mr-6 w-28 h-28 ${classes.stepIcon}`}
              //           >
              //             <Icon className="text-16 font-semibold cursor-pointer">
              //               call_to_action
              //             </Icon>
              //           </div>
              //         </div>
              //         <div className="flex w-full flex-col items-center  flex-col p-10 pb-0">
              //           {data.status === "running" && (
              //             <div className="flex  w-full items-center">
              //               <div className="flex sm:w-1/2 w-1/5 justify-start ">
              //                 <Typography
              //                   className="font-semibold text-gray-600 text-13"
              //                   component="div"
              //                 >
              //                   Pause
              //                 </Typography>
              //               </div>
              //               <div className="sm:w-1/2 w-full flex justify-end">
              //                 <div
              //                   className={`flex justify-center items-center -mr-6 ${classes.actionSymbol}`}
              //                 >
              //                   <Tooltip placement="right-end" title="Pause">
              //                     <Icon
              //                       onClick={() => updateStatus("pause", data)}
              //                       className="text-18 font-semibold text-gray-500 cursor-pointer"
              //                     >
              //                       pause_icon
              //                     </Icon>
              //                   </Tooltip>
              //                 </div>
              //               </div>
              //             </div>
              //           )}
              //           {data.status === "pause" && (
              //             <div className="flex  w-full items-center pb-0">
              //               <div className="flex sm:w-1/2 w-1/5  justify-start">
              //                 <Typography
              //                   className="font-semibold text-gray-600 text-13"
              //                   component="div"
              //                 >
              //                   Play
              //                 </Typography>
              //               </div>
              //               <div className="flex justify-end sm:w-1/2 w-full">
              //                 <div
              //                   className={`flex items-center justify-center -mr-6 ${classes.actionSymbol}`}
              //                 >
              //                   <Tooltip placement="right-end" title="Play">
              //                     <Icon
              //                       onClick={() =>
              //                         updateStatus("running", data)
              //                       }
              //                       className="text-18 font-semibold text-gray-500 cursor-pointer"
              //                     >
              //                       play_arrow_outlined
              //                     </Icon>
              //                   </Tooltip>
              //                 </div>
              //               </div>
              //             </div>
              //           )}
              //           <div className="flex w-full items-center">
              //             <div className="flex sm:w-1/2 w-1/5 justify-start">
              //               <Typography
              //                 className="font-semibold text-gray-600 text-13"
              //                 component="div"
              //               >
              //                 Cancel
              //               </Typography>
              //             </div>
              //             <div className="flex justify-end sm:w-1/2 w-full">
              //               <div
              //                 className={`flex justify-center items-center -mr-6 ${classes.actionSymbol}`}
              //               >
              //                 <Tooltip placement="right-end" title="Cancel">
              //                   <Icon
              //                     onClick={() => openCancelDialog(data)}
              //                     className="text-18 font-semibold text-gray-500 cursor-pointer"
              //                   >
              //                     close
              //                   </Icon>
              //                 </Tooltip>
              //               </div>
              //             </div>
              //           </div>
              //           <div className="flex w-full items-center">
              //             <div className="flex sm:w-1/2 w-1/5  justify-start ">
              //               <Typography
              //                 className="font-semibold text-gray-600 text-13"
              //                 component="div"
              //               >
              //                 Restart
              //               </Typography>
              //             </div>
              //             <div className="flex justify-end sm:w-1/2 w-full">
              //               <div
              //                 className={`flex justify-center items-center -mr-6 ${classes.actionSymbol}`}
              //               >
              //                 <Tooltip placement="right-end" title="Restart">
              //                   <Icon
              //                     onClick={() => handleModel(data)}
              //                     className="text-18 font-semibold text-gray-500 cursor-pointer"
              //                   >
              //                     replay_outlined
              //                   </Icon>
              //                 </Tooltip>
              //               </div>
              //             </div>
              //           </div>
              //           <div className="flex w-full items-center">
              //             <div className="flex sm:w-1/2 w-1/5  justify-start">
              //               <Typography
              //                 className="font-semibold text-gray-600 text-13"
              //                 component="div"
              //               >
              //                 Edit
              //               </Typography>
              //             </div>
              //             <div className="flex justify-end sm:w-1/2 w-full">
              //               <div
              //                 className={` flex justify-center items-center -mr-6 ${classes.actionSymbol}`}
              //               >
              //                 <Tooltip placement="right-end" title="Edit">
              //                   <Icon
              //                     onClick={() => handleEditClick(data)}
              //                     className="text-18 font-semibold text-gray-500 cursor-pointer"
              //                   >
              //                     edit
              //                   </Icon>
              //                 </Tooltip>
              //               </div>
              //             </div>
              //           </div>
              //         </div>
              //       </Paper>
              //     </div>
              //   </div>
              // </Paper>
            )
          );
        })}
      </div>
    </FuseAnimate>
  );
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { updateStatusType, resetStep, openCloseDialog },
    dispatch
  );
}
export default connect(
  null,
  mapDispatchToProps
)(WorkFlowActiveListItem);
