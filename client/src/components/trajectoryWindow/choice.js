import React from "react";
import { connect } from "react-redux";
import { H5, Slider, Icon, Switch, Radio, RadioGroup } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

@connect((state) => ({
  showTrajectory: state.trajectory.showTrajectory,
  anchorTrajectory: state.trajectory.anchorTrajectory,
  trajectoryType: state.trajectory.trajectoryType,
  nodeSize: state.trajectory.nodeSize,
  edgeWidth: state.trajectory.edgeWidth,
  trajectoryChoice: state.trajectoryChoice,
}))
export default class Choice extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: true,
      isMethodExpanded: false,
      isPlotExpanded: false,
    };
  }

  handleExpand = () => {
    const { isExpanded } = this.state;
    this.setState({ isExpanded: !isExpanded });
  };

  handleMethodExpand = () => {
    const { isMethodExpanded } = this.state;
    this.setState({ isMethodExpanded: !isMethodExpanded });
  };

  handlePlotExpand = () => {
    const { isPlotExpanded } = this.state;
    this.setState({ isPlotExpanded: !isPlotExpanded });
  };

  handleIfShowTrajectory = () => {
    const { dispatch, showTrajectory } = this.props;
    dispatch({
      type: "trajectory: show trajectory",
      showTrajectory: !showTrajectory,
    });
  };

  handleIfAnchorTrajectory = () => {
    const { dispatch, anchorTrajectory } = this.props;
    dispatch({
      type: "trajectory: anchor trajectory",
      anchorTrajectory: !anchorTrajectory,
    });
  };

  // 这里没有直接dispatch
  setTrajectoryChoice = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: "set trajectory choice",
      trajectoryChoice: e.target.value,
    });
  };

  setTrajectoryType = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: "trajectory: set trajectory type",
      trajectoryType: e.target.value,
    });
  };

  setMilestoneNodeSize = (nodeSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: "trajectory: set node size",
      nodeSize,
    });
  };

  setMilestoneEdgeWidth = (edgeWidth) => {
    const { dispatch } = this.props;
    dispatch({
      type: "trajectory: set edge width",
      edgeWidth,
    });
  };

  render() {
    const { isExpanded, isMethodExpanded, isPlotExpanded } = this.state;
    const {
      showTrajectory,
      anchorTrajectory,
      trajectoryType,
      trajectoryChoice,
      nodeSize,
      edgeWidth,
    } = this.props;
    // const methodList = trajectoryChoice?.available || [];
    return (
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <H5
            role="menuitem"
            tabIndex="0"
            data-testclass="trajectory-choice-expand"
            onKeyPress={this.handleExpand}
            style={{ cursor: "pointer" }}
            onClick={this.handleExpand}
          >
            Trajectory Choice{" "}
            {isExpanded ? (
              <Icon icon={IconNames.CHEVRON_DOWN} />
            ) : (
              <Icon icon={IconNames.CHEVRON_RIGHT} />
            )}
          </H5>
        </div>
        {isExpanded && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "top",
                gap: "20px",
                whiteSpace: "nowrap",
              }}
            >
              <div
                role="menuitem"
                tabIndex="0"
                onKeyPress={this.handleMethodExpand}
                style={{ cursor: "pointer" }}
                onClick={this.handleMethodExpand}
              >
                Method: ref
                {isMethodExpanded ? (
                  <Icon icon={IconNames.CHEVRON_DOWN} />
                ) : (
                  <Icon icon={IconNames.CHEVRON_RIGHT} />
                )}
              </div>
              <Switch
                checked={showTrajectory}
                style={{ marginLeft: "auto" }}
                label="Show"
                onChange={this.handleIfShowTrajectory}
              />
              <Switch
                checked={anchorTrajectory}
                style={{ marginLeft: "auto" }}
                label="Anchor"
                onChange={this.handleIfAnchorTrajectory}
              />
            </div>
            {isMethodExpanded && (
              <TrajectoryChoices
                onChange={this.setTrajectoryChoice}
                trajectoryChoice={trajectoryChoice}
              />
              // <div>
              //   {methodList.map((item) => (
              //     <MethodItem methodName={item} key={item} />
              //   ))}
              // </div>
            )}
            {/* Trajectory type radio group */}
            <div
              style={{
                display: "flex",
                alignItems: "top",
                gap: "20px",
                whiteSpace: "nowrap",
              }}
            >
              Trajectory type:
              <RadioGroup
                onChange={this.setTrajectoryType}
                selectedValue={trajectoryType}
                style={{ whiteSpace: "nowrap" }}
              >
                <Radio
                  label="milestone"
                  value="milestone"
                  key="milestone"
                  style={{ display: "inline-block", marginRight: "16px" }}
                />
                <Radio
                  label="waypoint"
                  value="waypoint"
                  key="waypoint"
                  style={{ display: "inline-block", marginRight: "16px" }}
                />
              </RadioGroup>
            </div>
            <div
              role="menuitem"
              tabIndex="0"
              onKeyPress={this.handlePlotExpand}
              style={{ cursor: "pointer" }}
              onClick={this.handlePlotExpand}
            >
              Trajectory Plot:
              {isPlotExpanded ? (
                <Icon icon={IconNames.CHEVRON_DOWN} />
              ) : (
                <Icon icon={IconNames.CHEVRON_RIGHT} />
              )}
            </div>
            {isPlotExpanded && (
              <div>
                {/* Node size slider */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "top",
                    gap: "20px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Milestone node size:
                  <Slider
                    labelStepSize={10}
                    max={10}
                    min={0}
                    stepSize={0.1}
                    onChange={this.setMilestoneNodeSize}
                    value={nodeSize}
                  />
                </div>
                {/* Edge width slider */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "top",
                    gap: "20px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Milestone dge width:
                  <Slider
                    labelStepSize={10}
                    max={10}
                    min={0}
                    stepSize={0.1}
                    onChange={this.setMilestoneEdgeWidth}
                    value={edgeWidth}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

const TrajectoryChoices = ({ onChange, trajectoryChoice }) => {
  const { available } = trajectoryChoice;
  return (
    <RadioGroup onChange={onChange} selectedValue={trajectoryChoice.current}>
      {available.map((item) => (
        <Radio
          label={item}
          value={item}
          key={item}
          style={{
            marginLeft: "10px",
            whiteSpace: "nowrap" /* 禁止换行 */,
            overflow: "hidden" /* 隐藏溢出内容 */,
            // textOverflow: "ellipsis",  /* 显示省略号 */
          }}
        />
      ))}
    </RadioGroup>
  );
};

// TODO: show method like category in leftSlidebar
// const MethodItem = ({ methodName }) => {
//   return (
//     <div>
//       {/* TODO: update the Method Item like Categories Component*/}
//       {methodName}
//     </div>
//   );
// }
