import React from "react";
import { connect } from "react-redux";
import GeneExpression from "../geneExpression";
import TrajectoryWindow from "../trajectoryWindow";
import * as globals from "../../globals";

@connect((state) => ({
  scatterplotXXaccessor: state.controls.scatterplotXXaccessor,
  scatterplotYYaccessor: state.controls.scatterplotYYaccessor,
}))
class RightSidebar extends React.Component {
  render() {
    return (
      <div
        style={{
          /* x y blur spread color */
          borderLeft: `1px solid ${globals.lightGrey}`,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflowY: "inherit",
          height: "inherit",
          width: "inherit",
          padding: globals.leftSidebarSectionPadding,
        }}
      >
        <GeneExpression />
        {/* TODO: Trajectory Windows */}
        <br />
        <TrajectoryWindow />
      </div>
    );
  }
}

export default RightSidebar;
