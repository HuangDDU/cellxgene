import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Async from "react-async";

export default
@connect((state) => ({
  showTrajectory: state.trajectory.showTrajectory,
}))
class Trajectory extends PureComponent {
  static watchAsync(props, prevProps) {
    // TODO:
    console.log("Trajectory--watchAsync props", props, "prevProps", prevProps);
  }

  fetchAsyncProps = async (props) => {
    // TODO:
    console.log("Trajectory--fetchAsyncProps props", props);
  };

  async fetchData() {
    // TODO: 从后端获取trajectory数据
    console.log("Trajectory--fetchData", this);
  }

  render() {
    const { inverseTransform, showTrajectory } = this.props;
    const fontSize = "20px";
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
            const trajectorySVG = (
              <g
                key="trajectory"
                className="trajectory"
                transform="translate(0.5, 0.5)"
              >
                <text
                  transform={inverseTransform}
                  textAnchor="middle"
                  style={{
                    fontSize,
                  }}
                >
                  Trajectory
                </text>
              </g>
            );
            console.log("Trajectory--Async trajectorySVG", trajectorySVG);
            return trajectorySVG;
          }}
        </Async.Fulfilled>
      </Async>
    );
  }
}
