import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React, { useEffect, useState, useRef, useCallback } from "react";
import WorkFlowActiveListItem from "./workFlowActiveListItem";
import WorkFlowCancelListItem from "./workFlowCancelListItem";
import MessageComponent from "app/main/messageComponent";
import { connect } from "react-redux";
import FuseScrollbars from "@fuse/core/FuseScrollbars";
import FuseLoading from "@fuse/core/FuseLoading";

function WorkFlowList(props) {
  const [workFlowData, setFilteredData] = useState({
    filteredData: null,
    loading: true,
  });
  const { filteredData, loading } = workFlowData;
  const [tabValue, setTabValue] = useState(0);
  const { workFlowList, workFlow } = props;
  const workFlowRef = useRef(workFlowList);
  const updateFilterData = useCallback(() => {
    console.log("list",workFlowList)
    if (workFlowList) {
      let data = workFlowList;
      let active = [],
        cancel = [];
      data &&
        data.length !== 0 &&
        data.forEach((obj) => {
          if (obj.status === "running" || obj.status === "pause") {
            active.push(obj);
          } else {
            cancel.push(obj);
          }
        });
      return [active, cancel];
    } else {
      setFilteredData((prevState) => ({ ...prevState, loading: false }));
    }
  }, [workFlowList]);
  useEffect(() => {
    console.log("list",workFlowList)
    if (workFlowList) {
      if (filteredData === null || workFlowRef.current !== workFlowList) {
        workFlowRef.current = workFlowList;
        setFilteredData({ filteredData: updateFilterData(), loading: true });
      }
    } else {
      setFilteredData((prevState) => ({ ...prevState, loading: false }));
    }
  }, [workFlowList, filteredData, updateFilterData]);
  function handleChangeTab(event, value) {
    setTabValue(value);
  }
  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <Tabs
        value={tabValue}
        onChange={handleChangeTab}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="off"
        className="w-full border-b-1"
      >
        <Tab
          className="sm:text-14 text-12 font-600 normal-case"
          label="Active/InActive workflow"
        />
        <Tab
          className="sm:text-14 text-12 font-600 normal-case"
          label="Cancelled/Completed workflow"
        />
      </Tabs>

      <div className={`flex flex-wrap w-full h-full overflow-hidden relative`}>
        {tabValue === 0 && (
          <div className="flex w-full h-full overflow-hidden relative">
            {!loading ? (
              <FuseLoading />
            ) : !filteredData ||
              (filteredData[0].length === 0 && filteredData[0]) ? (
              <div className="flex w-full h-full items-center justify-center">
                <MessageComponent
                  message={`There are no Active/InActive WorkFlow!`}
                />
              </div>
            ) : (
              <FuseScrollbars className="overflow-y-auto flex w-full">
                <div className="pb-8 relative w-full">
                  <WorkFlowActiveListItem
                    list={filteredData[0]}
                    workFlow={workFlow}
                    className="w-full rounded-8 shadow-none border-1 mb-16 "
                  />
                </div>
              </FuseScrollbars>
            )}
          </div>
        )}
        {tabValue === 1 && (
          <div className="pb-8 relative w-full h-full flex overflow-hidden">
            {!loading ? (
              <FuseLoading />
            ) : !filteredData ||
              (filteredData[1].length === 0 && filteredData[1]) ? (
              <div className="flex w-full h-full items-center justify-center">
                <MessageComponent
                  message={`There are no Cancelled/Completed WorkFlow!`}
                />
              </div>
            ) : (
              <FuseScrollbars className="overflow-y-auto flex w-full">
                <div className="pb-8 relative w-full h-full">
                  <WorkFlowCancelListItem
                    list={filteredData[1]}
                    workFlow={workFlow}
                    className="w-full rounded-8 shadow-none border-1 mb-16 "
                  />
                </div>
              </FuseScrollbars>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  const { contactApp } = state;
  debugger
  return {
    workFlowList: contactApp.workFlow.workFlowList,
    contactId: contactApp.selectedContact && contactApp.selectedContact.id,
    workFlow: contactApp.workFlow.workFlow,
  };
}
export default connect(mapStateToProps, null)(WorkFlowList);
