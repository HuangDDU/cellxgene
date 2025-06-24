import React, { PureComponent } from "react";
import { connect, shallowEqual } from "react-redux";
import Async from "react-async";
import * as d3 from "d3";
import * as dfd from "danfojs";

@connect((state) => ({
  annoMatrix: state.annoMatrix,
  layoutChoice: state.layoutChoice,
  trajectoryChoice: state.trajectoryChoice,
  showTrajectory: state.trajectory.showTrajectory,
})) // redux的数据定义部分
class Trajectory extends PureComponent {
  static watchAsync(props, prevProps) {
    // 浅比较数据, 发生变换时重新请求, 执行promiseFn.
    return !shallowEqual(props.watchProps, prevProps.watchProps);
  }

  fetchAsyncProps = async (props) => {
    // 从后端读取trajectory数据
    const { annoMatrix, layoutChoice, trajectoryChoice } = props.watchProps;

    // 从uns中读取danfo dataframe
    const milestonePositions =
      annoMatrix.uns.cfe.trajectory_history_dict[trajectoryChoice.current]
        .trajectory_embedding[layoutChoice.current].milestone_positions;
    milestonePositions.print();
    // group后apply内部构造新的DataFrame
    // const milestonePositionsNew = milestonePositions.groupby(["group"]).apply((groupDf) => {
    //   const from = groupDf.loc({ rows: groupDf["percentage"].eq(0) });
    //   const to = groupDf.loc({ rows: groupDf["percentage"].eq(1) });
    //   return {
    //     group: groupDf["group"].values[0],
    //     from_comp_1: from["comp_1"].values[0],
    //     from_comp_2: from["comp_2"].values[0],
    //     to_comp_1: to["comp_1"].values[0],
    //     to_comp_2: to["comp_2"].values[0]
    //   };
    // })
    // group后apply内部保存到列表里，后续集中构造danfo.DataFrame
    const applyResults = [];
    milestonePositions.groupby(["group"]).apply((groupDf) => {
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
    const milestonePositionsNew = new dfd.DataFrame(applyResults); // 手动创建新 DataFrame
    milestonePositionsNew.print();
    // const [milestonePositionsNew] = await this.fetchData(annoMatrix, trajectoryChoice);

    // 提取path
    const {columns} = milestonePositionsNew;
    const groupIndex = columns.indexOf("group");
    const fc1Index = columns.indexOf("from_comp_1");
    const fc2Index = columns.indexOf("from_comp_2");
    const tc1Index = columns.indexOf("to_comp_1");
    const tc2Index = columns.indexOf("to_comp_2");
    const milestonePaths = {};
    milestonePositionsNew.apply(
      (row) => {
        // console.log("milestonePositionsNew row", row);
        milestonePaths[row[groupIndex]] = [
          [row[fc1Index], row[fc2Index]],
          [row[tc1Index], row[tc2Index]],
        ];
        return row;
      },
      { axis: 1 }
    );
    console.log("Trajectory--fetchAsyncProps milestonePaths:", milestonePaths);

    return { milestonePaths };
  };

  // async fetchData(annoMatrix, trajectoryChoice) {
  //   // fetch all trajectory data need

  // }

  render() {
    const {
      annoMatrix,
      trajectoryChoice,
      layoutChoice,
      showTrajectory, // redux数据提取在组件中用props
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
            const { milestonePaths } = asyncProps;
            if (!showTrajectory || !trajectoryChoice.current === "None")
              return null; // 这里与centroidLabels略有不同
            const trajectoryPathSVGS = [];
            Object.entries(milestonePaths).forEach(([key, path]) => {
              trajectoryPathSVGS.push(<TrajectoryPath path={path} key={key} />);
            });
            // 参考整体里程碑绘制
            // 暂时只有里程碑网络,里程碑结点还没有绘制
            // console.log(trajectoryPathSVGS);
            return trajectoryPathSVGS;
          }}
        </Async.Fulfilled>
      </Async>
    );
  }
}

// 从路径坐标转化为线条
const transPath = (path) => {
  const lineGenerator = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1])
    .curve(d3.curveLinear);
  const trajectoryPath = lineGenerator(path);

  return trajectoryPath;
};

// 函数式组件
const TrajectoryPath = ({ path }) => (
  // TODO: 不仅仅绘制直线，而且绘制Waypoint和轨迹曲线
  <g>
    <path
      d={transPath(path)}
      fill="none"
      stroke="green"
      strokeWidth={0.02}
      pointerEvents="none"
    />
  </g>
);

export default Trajectory;
