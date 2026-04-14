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
  nodeSize: state.trajectory.nodeSize,
  edgeWidth: state.trajectory.edgeWidth,
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
      nodeSize,
      edgeWidth,
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
          nodeSize={nodeSize}
          edgeWidth={edgeWidth}
        />
      );
    }
    return (
      <WaypointTrajectory
        width={width}
        height={height}
        transformPointForCytoscape={transformPointForCytoscape}
        annoMatrix={annoMatrix}
        layoutChoice={layoutChoice}
        trajectoryChoice={trajectoryChoice}
        nodeSize={nodeSize}
        edgeWidth={edgeWidth}
      />
    );
  }
}

const MilestoneTrajectory = ({
  width,
  height,
  transformPointForCytoscape,
  annoMatrix,
  layoutChoice,
  trajectoryChoice,
  nodeSize,
  edgeWidth,
}) => {
  const milestonePositionDf =
    annoMatrix.uns.cafe.trajectory_history_dict[trajectoryChoice.current]
      .trajectory_embedding[layoutChoice.current].milestone_positions;
  // milestonePositionDf.print();
  const milestoneIdList =
    annoMatrix.uns.cafe.trajectory_history_dict[trajectoryChoice.current]
      .milestone_wrapper.id_list;
  const milestoneColorList =
    annoMatrix.uns.cafe.trajectory_history_dict[trajectoryChoice.current]
      .milestone_wrapper.color_list;
  const colorDict = Object.fromEntries(
    milestoneIdList.map((key, i) => [key, milestoneColorList[i]])
  );
  // console.log("colorDict:,", colorDict);

  const nodes = [];
  dfd
    .toJSON(milestonePositionDf.groupby(["milestone_id"]).first())
    .forEach((row) => {
      const newPoint = transformPointForCytoscape([row.comp_1, row.comp_2]); // 坐标转化
      nodes.push({
        data: {
          id: row.milestone_id,
          label: row.milestone_id,
          color: colorDict[row.milestone_id],
        },
        position: {
          x: Math.floor(newPoint[0]),
          y: Math.floor(newPoint[1]),
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
              width: 10 * nodeSize,
              height: 10 * nodeSize,
            },
          },
          {
            selector: "edge",
            style: {
              width: edgeWidth,
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

const WaypointTrajectory = ({
  width,
  height,
  transformPointForCytoscape,
  annoMatrix,
  layoutChoice,
  trajectoryChoice,
  nodeSize,
  edgeWidth,
}) => {
  const milestonePositionDf =
    annoMatrix.uns.cafe.trajectory_history_dict[trajectoryChoice.current]
      .trajectory_embedding[layoutChoice.current].milestone_positions;
  const wpSegmentDf =
    annoMatrix.uns.cafe.trajectory_history_dict[trajectoryChoice.current]
      .trajectory_embedding[layoutChoice.current].wp_segments;

  const markerScale = 0.8;
  const trajectorySVGs = [
    // 定义轨迹线上的箭头（可复用）
    <defs key="defs-marker">
      <marker
        id="arrowhead"
        markerWidth={6 * markerScale}
        markerHeight={4 * markerScale}
        refX={6 * markerScale}
        refY={2 * markerScale}
        orient="auto"
      >
        {/*  箭头形状（三角形路径） */}
        <path
          d={`M0,0 L${6 * markerScale},${2 * markerScale} L0,${
            4 * markerScale
          } Z`}
          fill="#333"
        />
      </marker>
      这里的箭头小一点
    </defs>,
  ];
  // 先添加里程碑
  dfd
    .toJSON(milestonePositionDf.groupby(["milestone_id"]).first())
    .forEach((row) => {
      const newPoint = transformPointForCytoscape([row.comp_1, row.comp_2]); // 坐标转化
      trajectorySVGs.push(
        <circle
          cx={newPoint[0]}
          cy={newPoint[1]}
          r={nodeSize}
          style={{ fill: "black" }}
          key={row.milestone_id}
        />
      );
    });

  // 在添加轨迹线
  wpSegmentDf.groupby(["group"]).apply((groupDf) => {
    // 后端已经排好序了，group内percentage从高到低
    const groupPaths = [];
    dfd.toJSON(groupDf).forEach((row) => {
      const newPoint = transformPointForCytoscape([row.comp_1, row.comp_2]);
      // // 符合polyline多边形的路径
      // groupPaths.push(newPoint[0]);
      // groupPaths.push(newPoint[1]);
      // 符合path路径
      groupPaths.push(`${newPoint[0]} ${newPoint[1]}`);
    });

    trajectorySVGs.push(
      // <polyline
      //   points={groupPaths.join(", ")}
      //   fill="none"
      //   strokeWidth={edgeWidth}
      //   stroke="black"
      //   key={groupDf.group.values[0]}
      // />
      <path
        d={`M ${groupPaths.join(" L ")}`}
        fill="none"
        strokeWidth={edgeWidth}
        stroke="black"
        key={groupDf.group.values[0]}
      />
    );
    // arrow
    const arrowStartIndex = Math.floor(groupPaths.length / 2);
    const arrowEndIndex = arrowStartIndex + 1;
    // console.log(arrowStartIndex, arrowEndIndex);
    trajectorySVGs.push(
      <path
        d={`M ${groupPaths[arrowStartIndex]} L ${groupPaths[arrowEndIndex]}}`}
        fill="none"
        strokeWidth={edgeWidth}
        stroke="black"
        key={`${groupDf.group.values[0]}-arrow`}
        markerEnd="url(#arrowhead)"
      />
    );
    return groupDf;
  });

  return (
    <svg style={{ width, height }}>
      <div>WaypointTrajectory</div>
      {trajectorySVGs}
    </svg>
  );
};
