import React from "react";
// import { connect } from "react-redux";
// import * as globals from "../../globals";
import { Card, H4 } from "@blueprintjs/core";
import Choice from "./choice";
import Preview from "./preview";
import Benchmark from "./benchmark";

class TrajectoryWindow extends React.PureComponent {
  render() {
    return (
      <Card>
        <H4>Trajectory Window</H4>
        <Choice />
        <Preview />
        <Benchmark />
      </Card>
    );
  }
}

export default TrajectoryWindow;
