import reducer from "@trenchaant/contact/dist/contact/store/reducer";
import FusePageSimple from "@fuse/core/FusePageSimple";
import withReducer from "app/store/withReducer";
import React, { useEffect, useRef } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DialogContent from "@material-ui/core/DialogContent";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Hidden from "@material-ui/core/Hidden";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import WorkFlowList from "./WorkFlowComponent/workflowList";
import {
  getWorkFlow,
  getWorkFlowList,
} from "../../../store/action/workFlowContact.action";
import AddNewWorkFlow from "./WorkFlowComponent/addNewWorkFlow";

const useStyles = makeStyles((theme) => ({
  setHeight: {
    height: "calc(100vh - 240px - 340px)",
    width: "100%",
  },
  customToolbar: {
    backgroundColor: "#d7dbda5e",
    borderBottom: "1px solid #00000024",
    width: "100%",
    //paddingLeft: "12px",
    // paddingRight: "12px",
  },
}));

function WorkFlow(props) {
  const classes = useStyles(props);
  const pageLayout = useRef(null);
  const { getWorkFlow, getWorkFlowList } = props;
  useEffect(() => {
    getWorkFlow();
    getWorkFlowList();
  }, [getWorkFlow, getWorkFlowList, props.match.params.moduleSubType]);
  return (
    <FusePageSimple
      classes={{
        wrapper: "h-full overflow-hidden",
        contentWrapper: "h-full overflow-hidden",
        content: "flex min-h-full h-full",
        toolbar: `${classes.customToolbar}`,
        header: "h-72 min-h-72 lg:h-0 lg:min-h-0",
      }}
      header={
        <Hidden lgUp>
          <IconButton
            onClick={() => pageLayout.current.toggleLeftSidebar()}
            aria-label="open left sidebar"
          >
            <Icon>menu</Icon>
            <Typography className="text-20 ml-10">Category</Typography>
          </IconButton>
        </Hidden>
      }
      content={
        <div className="flex flex-col w-full h-full items-center bg-white p-8">
          <WorkFlowList />
          <AddNewWorkFlow />
        </div>
      }
      sidebarInner
      ref={pageLayout}
      innerScroll
    />
  );
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getWorkFlow, getWorkFlowList }, dispatch);
}
export default connect(
  null,
  mapDispatchToProps
)(withReducer("contactApp", reducer)(WorkFlow));
