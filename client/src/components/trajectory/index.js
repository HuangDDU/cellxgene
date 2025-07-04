// TODO: 不是简单按钮，而是里程碑网络的轨迹预览框
import React from "react";
import { connect } from "react-redux";
import {
  Button,
  ButtonGroup,
  H4,
  Popover,
  Position,
  Radio,
  RadioGroup,
  Tooltip,
} from "@blueprintjs/core";
import * as globals from "../../globals";
import actions from "../../actions";

// 轨迹选择按钮,参考降维选择按钮
@connect((state) => ({
  trajectoryChoice: state.trajectoryChoice,
}))
class Trajectory extends React.PureComponent {
  handleTrajectoryChoice = (e) => {
    const { dispatch } = this.props;
    dispatch(actions.trajectoryChoiceAction(e.currentTarget.value));
  };

  render() {
    const { trajectoryChoice } = this.props;
    // console.log("Trajectory render trajectoryChoice", trajectoryChoice)
    return (
      <ButtonGroup
        style={{
          position: "absolute",
          display: "inherit",
          left: 258,
          bottom: 8,
          zIndex: 9999,
        }}
      >
        <Popover
          target={
            <Tooltip
              content="Select embedding for visualization"
              position="top"
              hoverOpenDelay={globals.tooltipHoverOpenDelay}
            >
              <Button
                type="button"
                data-testid="layout-choice"
                icon="layout"
                // minimal
                id="embedding"
                style={{
                  cursor: "pointer",
                }}
              >
                Trajectory: {trajectoryChoice?.current}
              </Button>
            </Tooltip>
          }
          // minimal /* removes arrow */
          position={Position.TOP_LEFT}
          content={
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                flexDirection: "column",
                padding: 10,
                width: 400,
              }}
            >
              <H4>Trajectory Choice</H4>
              <p style={{ fontStyle: "italic" }}>
                There are available trajectories.
              </p>
              <TrajectoryChoices
                onChange={this.handleTrajectoryChoice}
                trajectoryChoice={trajectoryChoice}
              />
            </div>
          }
        />
      </ButtonGroup>
    );
  }
}

export default Trajectory;

const TrajectoryChoices = ({ onChange, trajectoryChoice }) => {
  const { available } = trajectoryChoice;
  return (
    <RadioGroup onChange={onChange} selectedValue={trajectoryChoice.current}>
      {available.map((item) => (
        <Radio label={item} value={item} key={item} />
      ))}
      {/* 不展示轨迹 */}
      <Radio label="None" value="None" key="None" />
    </RadioGroup>
  );
};
