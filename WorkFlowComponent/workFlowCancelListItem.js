import _ from "@lodash";
import ConfirmationDialogComponent from "app/main/confirmationDialogComponent";
import React, { useState, Fragment } from "react";
import Chip from "@material-ui/core/Chip";
import Card from "@material-ui/core/Card";
import FuseAnimate from "@fuse/core/FuseAnimate";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  updateStatusType,
  resetStep,
} from "../../../../store/action/workFlowContact.action";

const useStyles = makeStyles((theme) => ({
  // fileUser: {
  // 	backgroundColor: '#61dafb4a',
  // 	height: '2.8rem'
  // },
  // tableIcon: {
  // 	color: '#0000008a',
  // 	'&:hover': {
  // 		backgroundColor: 'rgba(0, 0, 0, 0.04)'
  // 	}
  // },
  // dealWidth: {
  // 	width: 'calc(100% - 142px)',
  // 	display: 'inline-block'
  // },
  // chipColor: {
  // 	backgroundColor: 'gray-500'
  // },
  // dealName: {
  // 	backgroundColor: '#fffff',
  // 	color: '#192d3e',
  // 	borderColor: '#E2E2E2',
  // 	[theme.breakpoints.only('xs')]: {
  // 		width: '82%'
  // 	},
  // 	[theme.breakpoints.between('sm', 'md')]: {
  // 		width: '40%'
  // 	}
  // },
  // chipWidth: {
  // 	right: '-1px',
  // 	bottom: '-1px'
  // },
  actionIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    "&:hover": {
      backgroundColor: "#0000000a",
    },
  },
  chipColor: {
    backgroundColor: "#f2f4f8",
  },
  sqStatus: {
    backgroundColor: "#ec407a",
  },
  seqBg: {
    backgroundColor: "#eef5f9",
  },
}));
function SequenceCampaignCancelListItem(props) {
  const { list, workFlow } = props;
  const classes = useStyles(props);
  function Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const [modelDialog, setModelDialog] = useState({
    resetDialog: false,
    id: "",
  });
  function renderChip(name) {
    return (
      <Chip
        className={`h-24 text-12 font-semibold text-white capitalize ${
          name === "completed" ? `bg-green` : `bg-red`
        }`}
        label={name}
      />
    );
  }
  async function handleOnReset() {
    await props.updateStatusType("running", modelDialog.data, "");
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
  console.log("list", list);
  return (
    <FuseAnimate animation="transition.fadeIn" duration={400} delay={100}>
      <div className="flex w-full flex-wrap">
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
                    {/* <CircularProgressWithLabel value={50} /> */}
                  </div>
                  <div className="flex w-2/12 justify-center items-center flex-col">
                    <Typography
                      className=" sm:px-16 capitalize font-semibold text-gray-600 text-10 truncate"
                      component="div"
                    >
                      {`${data.status} Date`}
                    </Typography>
                    {new Date(
                      workFlowData.dateModified.seconds * 1000 +
                        workFlowData.dateModified.nanoseconds / 1000
                    ).toLocaleDateString()}
                  </div>
                  <div className="flex w-1/12">{renderChip(data.status)}</div>

                  <div className="flex w-1/12 justify-end items-center">
                    <Tooltip placement="top" title="Restart">
                      <Icon
                        className={`cursor-pointer mr-8 text-gray-700 hover:text-green`}
                        id="pause"
                        onClick={() => handleModel(data)}
                      >
                        history
                      </Icon>
                    </Tooltip>
                  </div>
                </Card>
              </Fragment>
              //   <Paper
              //     className={`w-full rounded-8 shadow-none border-1 mt-16 ${classes.seqBg}`}
              //     key={index}
              //   >
              //     <div className="flex sm:items-center items-start justify-between border-b-1 w-full py-4 sm:pb-6 pb-12 px-16 sm:flex-row flex-col">
              //       <div className="flex w-full">
              //         <Typography
              //           className="sm:pl-16 pl-0"
              //           component="h6"
              //           variant="h6"
              //         >
              //           {`${Capitalize(workFlowData.name)} (${
              //             !data.isDelete ? "active" : "inActive"
              //           })`}
              //         </Typography>
              //       </div>
              //       <div className="flex w-full justify-start items-center">
              //         <div className="flex sm:w-auto w-full justify-start">
              //           <Typography
              //             className="sm:px-8 px-0 font-semibold text-gray-600 text-13"
              //             component="div"
              //           >
              //             {`Added Date`}
              //           </Typography>
              //         </div>
              //         <div className="flex sm:w-auto w-full sm:justify-end justify-start mr-6">
              //           <Chip
              //             className={clsx(
              //               "h-24 text-12 font-semibold text-gray-600 bg-white"
              //             )}
              //             label={
              //               data.dateCreated.seconds &&
              //               new Date(
              //                 data.dateCreated.seconds * 1000 +
              //                   data.dateCreated.nanoseconds / 1000
              //               ).toLocaleDateString()
              //             }
              //           />
              //         </div>
              //       </div>
              //       <div className="flex pr-16 pt-4">
              //         {renderChip(data.status)}
              //       </div>
              //     </div>
              //     <div className="w-full flex sm:flex-row flex-col pb-10 pt-6">
              //       <div className="flex sm:w-1/2 w-full flex-col mt-6 sm:mt-0 h-full p-10">
              //         <Paper
              //           className={`w-full rounded-8 shadow pt-8 pb-4`}
              //           key={index}
              //         >
              //           <div className="flex w-full mb-4">
              //             <div className="flex sm:w-1/2 w-full justify-start">
              //               <Typography
              //                 className=" px-8 font-semibold text-gray-600 text-13"
              //                 component="div"
              //               >
              //                 {`${data.status}`}
              //               </Typography>
              //             </div>
              //             <div className="flex sm:w-1/2 w-full justify-end mr-6">
              //               <Chip
              //                 className={clsx(
              //                   "h-24 text-12 font-semibold text-gray-800",
              //                   classes.chipColor
              //                 )}
              //                 label={data.endDate}
              //               />
              //             </div>
              //           </div>
              //           {data.cancelReason && (
              //             <div className="flex w-full mb-4">
              //               <div className="flex w-1/2 justify-start">
              //                 <Typography
              //                   className="px-8 font-semibold text-gray-600 text-13"
              //                   component="div"
              //                 >
              //                   {`${data.status} Reason`}
              //                 </Typography>
              //               </div>
              //               <div className="flex w-1/2 justify-end">
              //                 <Typography
              //                   className=" px-8 font-semibold text-gray-600 text-13 break-all"
              //                   component="div"
              //                 >
              //                   {`${data.cancelReason}`}
              //                 </Typography>
              //               </div>
              //             </div>
              //           )}
              //         </Paper>
              //       </div>
              //       <div className="flex sm:w-1/2 w-full flex-col t-6 sm:mt-0 h-full p-10">
              //         <Paper
              //           className={`w-full rounded-8 shadow pt-8 pb-4`}
              //           key={index}
              //         >
              //           <div className="flex w-full pb-6 w-full justify-between">
              //             <div className="flex sm:w-1/2  w-full justify-start items-center">
              //               <Typography
              //                 className=" px-16 font-semibold text-gray-600 text-13"
              //                 component="div"
              //               >
              //                 Restart
              //               </Typography>
              //             </div>
              //             <div className="flex sm:w-full sm:w-1/2 w-full justify-end items-center mr-6">
              //               <div
              //                 className={`flex justify-center  items-center ${classes.actionIcon}`}
              //               >
              //                 <Tooltip placement="right-end" title="Restart">
              //                   <Icon
              //                     onClick={() => handleModel(data)}
              //                     className="text-18 font-semibold text-gray-500"
              //                   >
              //                     replay_outlined
              //                   </Icon>
              //                 </Tooltip>
              //               </div>
              //             </div>
              //           </div>
              //         </Paper>
              //       </div>
              //     </div>
              //     <div className="flex w-full">
              //       {workFlowData.status === "complete" && (
              //         <div className="flex w-full mb-4">
              //           <Typography
              //             className=" px-16 font-semibold text-gray-600 text-13"
              //             component="div"
              //           >
              //             {`All steps are completed/ customer replied`}
              //           </Typography>
              //         </div>
              //       )}
              //     </div>
              //   </Paper>
            )
          );
        })}
      </div>
    </FuseAnimate>
  );
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateStatusType, resetStep }, dispatch);
}
export default connect(
  null,
  mapDispatchToProps
)(SequenceCampaignCancelListItem);
