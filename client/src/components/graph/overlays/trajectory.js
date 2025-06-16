import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Async from "react-async";
import * as d3 from "d3";

@connect((state) => ({
  showTrajectory: state.trajectory.showTrajectory,
})) // redux的数据定义部分
class Trajectory extends PureComponent {
  static watchAsync(props, prevProps) {
    // TODO:
    console.log("Trajectory--watchAsync props", props, "prevProps", prevProps);
  }

  fetchAsyncProps = async (props) => {
    // TODO: 从后端读取trajectory数据
    console.log("Trajectory--fetchAsyncProps props", props);
    const paths = [
      [
        [0.885396, 0.712374],
        [0.606292, 0.615681],
      ],
      [
        [0.606292, 0.615681],
        [0.388862, 0.467243],
      ],
      [
        [0.606292, 0.615681],
        [0.422312, 0.526304],
      ],
      [
        [0.388862, 0.467243],
        [0.171954, 0.284832],
      ],
      [
        [0.422312, 0.526304],
        [0.224744, 0.548779],
      ],
    ];
    return { paths };
  };

  async fetchData() {
    // TODO: 从后端获取trajectory数据
    console.log("Trajectory--fetchData", this);
  }

  render() {
    const {
      showTrajectory, // redux数据提取在组件中用props
    } = this.props;
    return (
      <Async
        watchFn={Trajectory.watchAsync}
        promiseFn={this.fetchAsyncProps}
        watchProps={{}}
      >
        <Async.Fulfilled>
          {(asyncProps) => {
            console.log("Trajectory--Async asyncProps", asyncProps);
            if (!showTrajectory) return null;

            const trajectoryPathSVGS = [];
            const { paths } = asyncProps;

            paths.forEach((path) => {
              trajectoryPathSVGS.push(<TrajectoryPath path={path} />);
            });

            console.log(trajectoryPathSVGS);
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
