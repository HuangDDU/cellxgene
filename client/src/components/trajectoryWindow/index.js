import React from "react";
// import { connect } from "react-redux";
// import * as globals from "../../globals";
import { H4, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import Choice from "./choice";
import Preview from "./preview";
import Benchmark from "./benchmark";

class TrajectoryWindow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { isExpanded: true };
  }

  handleExpand = () => {
    const { isExpanded } = this.state;
    this.setState({ isExpanded: !isExpanded });
  };

  render() {
    // expand写法参考：client/src/components/geneExpression/quickGene.js
    const { isExpanded } = this.state;
    return (
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <H4
            role="menuitem"
            tabIndex="0"
            data-testclass="trajectory-window-expand"
            // onKeyPress={this.handleExpand}
            style={{ cursor: "pointer" }}
            onClick={this.handleExpand}
          >
            Trajectory Window{" "}
            {isExpanded ? (
              <Icon icon={IconNames.CHEVRON_DOWN} />
            ) : (
              <Icon icon={IconNames.CHEVRON_RIGHT} />
            )}
          </H4>
        </div>
        {isExpanded && (
          <div>
            <Choice />
            <Preview />
            <Benchmark />
          </div>
        )}
      </div>
    );
  }
}

export default TrajectoryWindow;
