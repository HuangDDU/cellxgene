import React from "react";
import { connect, shallowEqual } from "react-redux";
import Async from "react-async";
import * as dfd from "danfojs";

@connect((state) => ({
  annoMatrix: state.annoMatrix,
  layoutChoice: state.layoutChoice,
  trajectoryChoice: state.trajectoryChoice,
  showTrajectory: state.trajectory.showTrajectory,
  milestoneNodeSize: state.trajectory.milestoneNodeSize,
  milestoneEdgeWidth: state.trajectory.milestoneEdgeWidth,
})) // redux的数据定义部分
export default class Trajectory extends React.PureComponent {
  static watchAsync(props, prevProps) {
    // 浅比较数据, 发生变换时重新请求, 执行promiseFn.
    return !shallowEqual(props.watchProps, prevProps.watchProps);
  }

  fetchAsyncProps = async (props) => {
    // 从后端读取trajectory数据
    const { annoMatrix, layoutChoice, trajectoryChoice } = props.watchProps;
    console.log("Trajectory--fetchAsyncProps props", props);
    // TODO:  从uns中提取Milestone，Waypoint等DataFrame数据用作后续绘制
    // 从uns中读取danfo dataframe
    const milestonePositionDf =
      annoMatrix.uns.cfe.trajectory_history_dict[trajectoryChoice.current]
        .trajectory_embedding[layoutChoice.current].milestone_positions;
    // milestonePositionDf.setIndex({ column: "waypoint_id", inplace: true });
    // console.log("milestonePositionDf.shape: ", milestonePositionDf.shape);
    // milestonePositionDf.print();

    // group后apply内部保存到列表里，后续集中构造danfo.DataFrame
    const applyResults = [];
    milestonePositionDf.groupby(["group"]).apply((groupDf) => {
      const from = groupDf.loc({ rows: groupDf.percentage.eq(0) });
      const to = groupDf.loc({ rows: groupDf.percentage.eq(1) });
      applyResults.push({
        group: groupDf.group.values[0],
        from_comp_1: from.comp_1.values[0],
        from_comp_2: from.comp_2.values[0],
        to_comp_1: to.comp_1.values[0],
        to_comp_2: to.comp_2.values[0],
      });
      return groupDf; // Danfo.js 需要这个返回值，但不会真正使用它
    });
    const milestonePathDf = new dfd.DataFrame(applyResults); // 手动创建新 DataFrame
    // milestonePathDf.setIndex({ column: "group", inplace: true });
    // console.log("milestonePathDf.shape: ", milestonePathDf.shape);
    // milestonePathDf.print();

    return { milestonePositionDf, milestonePathDf };
  };

  render() {
    const {
      inverseTransform,
      annoMatrix,
      trajectoryChoice,
      layoutChoice,
      showTrajectory,
      milestoneNodeSize,
      milestoneEdgeWidth,
    } = this.props;

    return (
      <Async
        watchFn={Trajectory.watchAsync}
        promiseFn={this.fetchAsyncProps}
        watchProps={{
          annoMatrix,
          trajectoryChoice,
          layoutChoice,
        }}
      >
        <Async.Fulfilled>
          {(asyncProps) => {
            // console.log("Trajectory--Async asyncProps", asyncProps);
            if (!showTrajectory || !trajectoryChoice.current === "None")
              return null; // 这里与centroidLabels略有不同

            const { milestonePositionDf, milestonePathDf } = asyncProps;

            milestonePathDf.print();
            const trajectorySVGS = [];
            // Dataframe的apply不支持列名索引，有点麻烦
            // milestonePathDf.apply((row) => {
            //   <MilestonePath
            //     path={[
            //       [row[1], row[2]], // from_comp_1, from_comp_2
            //       [row[3], row[4]], // to_comp_1, to_comp_2
            //     ]}
            //     key={row[0]}
            //   />
            // });

            // 这种行名索引有bug，用序号索引吧
            // console.log(milestonePathDf.loc({ rows: ["sA -> sB---sB -> sBmid"] }));
            // const waypointIds = milestonePositionDf["waypoint_id"].values;
            // const milestonePathIds = milestonePathDf["group"].values;
            // milestonePathIds.map(idx => {
            //   trajectorySVGS.push(
            //     <MilestonePath
            //       path={
            //         milestonePathDf.loc({
            //           rows: [idx],
            //           columns: ["from_comp_1", "from_comp_2", "to_comp_1", "to_comp_2"]
            //         })
            //       }
            //       key={key}
            //     />
            //   );
            // });

            // 转化为JSON对象后使用
            // 边
            dfd.toJSON(milestonePathDf).forEach((row) => {
              trajectorySVGS.push(
                <MilestonePath
                  path={[
                    [row.from_comp_1, row.from_comp_2],
                    [row.to_comp_1, row.to_comp_2],
                  ]}
                  milestoneEdgeWidth={milestoneEdgeWidth}
                  key={row.group}
                />
              );
            });
            // 节点
            // 过滤掉重复的节点
            dfd
              .toJSON(milestonePositionDf.groupby(["milestone_id"]).first())
              .forEach((row) => {
                trajectorySVGS.push(
                  <Milestone
                    position={[row.comp_1, row.comp_2]}
                    milestoneNodeSize={milestoneNodeSize}
                    key={row.milestone_id}
                  />
                );
                trajectorySVGS.push(
                  <MilestoneLabel
                    position={[row.comp_1, row.comp_2]}
                    label={row.milestone_id}
                    inverseTransform={inverseTransform}
                    key={`${row.milestone_id}-label`}
                  />
                );
              });
            return trajectorySVGS;
          }}
        </Async.Fulfilled>
      </Async>
    );
  }
}

// 函数式组件
// TODO: 不仅仅绘制直线，而且绘制Milestone, Waypoint和轨迹曲线
// 边
const MilestonePath = ({ path, milestoneEdgeWidth }) => (
  <g>
    <line
      x1={path[0][0]}
      y1={path[0][1]}
      x2={path[1][0]}
      y2={path[1][1]}
      fill="none"
      stroke="green"
      strokeWidth={milestoneEdgeWidth * 0.01}
    />
  </g>
);

// 节点
const Milestone = ({ position, milestoneNodeSize }) => (
  <g>
    {/* 暂时矩形位置能够绘制正确，圆圈绘制不正确，可能是由于底部gl绘制散点的干扰 */}
    <rect
      x={position[0]}
      y={position[1]}
      width={milestoneNodeSize * 0.01}
      height={milestoneNodeSize * 0.01}
      fill="red"
    />
  </g>
);

// 节点上标签
const MilestoneLabel = ({ position, label, inverseTransform }) => (
  <g transform={`translate(${position[0]}, ${position[1]})`}>
    <text
      transform={inverseTransform}
      x={position[0]}
      y={position[1]}
      fill="blue"
      fontWeight="bold"
    >
      {label}
    </text>
    {/* <circle
      transform={inverseTransform}
      x={position[0]}
      y={position[1]}
      r={0.05}
      fill="red"  
      stroke="blue"  
      strokeWidth={0.01}
    /> */}
  </g>
);
