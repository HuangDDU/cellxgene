import React from "react";
import { H5, Slider, Card, Switch } from "@blueprintjs/core";

export default class Choice extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      nodeSize: 2.5,
      edgeWidth: 1,
    };
  }

  setNodeSize = (nodeSize) => {
    this.setState({ nodeSize });
  };

  setEdgeWidth = (edgeWidth) => {
    this.setState({ edgeWidth });
  };

  render() {
    const { nodeSize, edgeWidth } = this.state;
    return (
      <div>
        <Card>
          <H5>Trajectory Choice</H5>
          <Switch
            // checked={True}
            label="On/Off"
            // onChange={() => setIsBold(!isBold)}
          />
          <div>
            Node size:
            <Slider
              labelStepSize={10}
              max={10}
              min={0}
              stepSize={0.1}
              onChange={this.setNodeSize}
              value={nodeSize}
            />
          </div>
          <div>
            Edge width:
            <Slider
              labelStepSize={10}
              max={10}
              min={0}
              stepSize={0.1}
              onChange={this.setEdgeWidth}
              value={edgeWidth}
            />
          </div>
        </Card>
      </div>
    );
  }
}
