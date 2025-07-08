// TODO: 节点颜色、点击事件添加
import React from "react";
import { connect } from "react-redux";
import CytoscapeComponent from "react-cytoscapejs";
import * as dfd from "danfojs";

@connect((state) => ({
  annoMatrix: state.annoMatrix,
  layoutChoice: state.layoutChoice,
  trajectoryChoice: state.trajectoryChoice,
  showTrajectory: state.trajectory.showTrajectory,
  trajectoryType: state.trajectory.trajectoryType,
  milestoneNodeSize: state.trajectory.milestoneNodeSize,
  milestoneEdgeWidth: state.trajectory.milestoneEdgeWidth,
}))
export default class TrajectoryCytoscape extends React.PureComponent {
  render() {
    const {
      // father props
      width,
      height,
      transformPointForCytoscape,
      // redux props
      annoMatrix,
      layoutChoice,
      trajectoryChoice,
      showTrajectory,
      trajectoryType,
      milestoneNodeSize,
      milestoneEdgeWidth,
    } = this.props;

    if (!showTrajectory || !trajectoryChoice.current === "None") return null;

    // choose milestone lint plot or waypoint curve plot
    if (trajectoryType === "milestone") {
      return (
        <MilestoneTrajectory
          width={width}
          height={height}
          transformPointForCytoscape={transformPointForCytoscape}
          annoMatrix={annoMatrix}
          layoutChoice={layoutChoice}
          trajectoryChoice={trajectoryChoice}
          milestoneNodeSize={milestoneNodeSize}
          milestoneEdgeWidth={milestoneEdgeWidth}
        />
      );
    } 
      return <WaypointTrajectory />;
    
  }
}

const MilestoneTrajectory = ({
  width,
  height,
  transformPointForCytoscape,
  annoMatrix,
  layoutChoice,
  trajectoryChoice,
  milestoneNodeSize,
  milestoneEdgeWidth,
}) => {
  const milestonePositionDf =
    annoMatrix.uns.cfe.trajectory_history_dict[trajectoryChoice.current]
      .trajectory_embedding[layoutChoice.current].milestone_positions;
  // milestonePositionDf.print();
  const milestoneIdList =
    annoMatrix.uns.cfe.trajectory_history_dict[trajectoryChoice.current]
      .milestone_wrapper.id_list;
  const milestoneColorList =
    annoMatrix.uns.cfe.trajectory_history_dict[trajectoryChoice.current]
      .milestone_wrapper.color_list;
  const colorDict = Object.fromEntries(
    milestoneIdList.map((key, i) => [key, milestoneColorList[i]])
  );
  console.log("colorDict:,", colorDict);

  const nodes = [];
  dfd
    .toJSON(milestonePositionDf.groupby(["milestone_id"]).first())
    .forEach((row) => {
      const newpoint = transformPointForCytoscape([row.comp_1, row.comp_2]); // 坐标转化
      nodes.push({
        data: {
          id: row.milestone_id,
          label: row.milestone_id,
          color: colorDict[row.milestone_id],
        },
        position: {
          x: Math.floor(newpoint[0]),
          y: Math.floor(newpoint[1]),
        },
      });
    });
  const edges = [];
  dfd.toJSON(milestonePositionDf.groupby(["group"]).first()).forEach((row) => {
    edges.push({
      data: {
        id: row.group,
        source: row.from,
        target: row.to,
        label: row.group,
      },
    });
  });
  // console.log("nodes", nodes);
  // console.log("edges", edges);

  const elements = CytoscapeComponent.normalizeElements({ nodes, edges });

  return (
    <div>
      <CytoscapeComponent
        elements={elements}
        style={{ width, height }}
        // layout={{ name: "random" }}
        stylesheet={[
          {
            selector: "node",
            style: {
              label: "data(label)",
              "background-color": "data(color)",
              "text-valign": "center",
              "text-halign": "center",
              width: 10 * milestoneNodeSize,
              height: 10 * milestoneNodeSize,
            },
          },
          {
            selector: "edge",
            style: {
              width: milestoneEdgeWidth,
              "line-color": "#ccc",
              "target-arrow-color": "#ccc",
              "target-arrow-shape": "triangle",
              "curve-style": "bezier",
            },
          },
        ]}
      />
    </div>
  );
};

const WaypointTrajectory = () => <div>WaypointTrajectory</div>;
