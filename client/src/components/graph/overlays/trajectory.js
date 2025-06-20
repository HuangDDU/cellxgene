import React, { PureComponent } from "react";
import { connect, shallowEqual } from "react-redux";
import Async from "react-async";
import * as d3 from "d3";

@connect((state) => ({
  annoMatrix: state.annoMatrix,
  // layoutChoice: state.layoutChoice,
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
    const { annoMatrix, trajectoryChoice } = props.watchProps;
    console.log(
      "Trajectory--fetchAsyncProps fetchData: trajectoryChoice:",
      trajectoryChoice
    );
    // TODO: trajectoryChoice改变前后的轨迹边个数不一样, 导致更新错误, 需要改善
    const [pathsDf] = await this.fetchData(annoMatrix, trajectoryChoice);
    console.log("Trajectory--fetchAsyncProps fetchData: pathsDf:", pathsDf);
    const cds = trajectoryChoice.currentDimNames;
    const pathsFrom0 = pathsDf.col(cds[0]).asArray();
    const pathsFrom1 = pathsDf.col(cds[1]).asArray();
    const toFrom0 = pathsDf.col(cds[2]).asArray();
    const toFrom1 = pathsDf.col(cds[3]).asArray();
    const paths = [];
    for (let i = 0; i < pathsFrom0.length; i += 1) {
      paths.push([
        [pathsFrom0[i], pathsFrom1[i]],
        [toFrom0[i], toFrom1[i]],
      ]);
    }
    // TODO: 更加简化的写法探索
    // const paths = pathsDf.col([`from_${layoutChoice}_0`, `from_${layoutChoice}_1`, `to_${layoutChoice}_0`, `to_${layoutChoice}_1`]).asArray();
    console.log("Trajectory--fetchAsyncProps paths:", paths);
    return { paths };
  };

  async fetchData(annoMatrix, trajectoryChoice) {
    // fetch all trajectory data need
    console.log("Trajectory--fetchData", this);
    const promises = [];
    // only milestone network temporarily
    promises.push(annoMatrix.fetch("trajectory", trajectoryChoice.current));
    return Promise.all(promises);
  }

  render() {
    const {
      annoMatrix,
      trajectoryChoice,
      showTrajectory, // redux数据提取在组件中用props
    } = this.props;
    return (
      <Async
        watchFn={Trajectory.watchAsync}
        promiseFn={this.fetchAsyncProps}
        watchProps={{
          annoMatrix,
          trajectoryChoice,
        }}
      >
        <Async.Fulfilled>
          {(asyncProps) => {
            // console.log("Trajectory--Async asyncProps", asyncProps);
            if (!showTrajectory) return null; // 这里与centroidLabels略有不同
            const trajectoryPathSVGS = [];
            const { paths } = asyncProps;
            const keyList = Array.from(
              { length: paths.length },
              (_, i) => `path${i + 1}`
            ); // commit eslint检查需要
            paths.forEach((path, index) => {
              trajectoryPathSVGS.push(
                <TrajectoryPath path={path} key={keyList[index]} />
              );
            });
            // console.log(trajectoryPathSVGS);
            // 参考整体里程碑绘制
            // 暂时只有里程碑网络,里程碑结点还没有绘制
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
