import React from "react";
import { connect } from "react-redux";
import { H5, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import CytoscapeComponent from "react-cytoscapejs";
import Cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
// import coseBilkent from 'cytoscape-cose-bilkent';
// import klay from 'cytoscape-klay';
import * as dfd from "danfojs";

// TODO: the position will corrupted if rechange the trajectory method, you should reexpand the preview
Cytoscape.use(dagre);
// Cytoscape.use(coseBilkent);
// Cytoscape.use(klay);

@connect((state) => ({
  annoMatrix: state.annoMatrix,
  layoutChoice: state.layoutChoice,
  trajectoryChoice: state.trajectoryChoice,
}))
export default class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: true,
      renderKey: Date.now(), // 用于强制重置
    };
  }

  // 切换轨迹时更新key
  componentDidUpdate(prevProps) {
    const { trajectoryChoice } = this.props;
    if (prevProps.trajectoryChoice.current !== trajectoryChoice.current) {
      this.setState({ renderKey: Date.now() });
    }
  }

  handleExpand = () => {
    const { isExpanded } = this.state;
    this.setState({ isExpanded: !isExpanded });
  };

  render() {
    const { isExpanded } = this.state;
    const { annoMatrix, layoutChoice, trajectoryChoice } = this.props;

    // 从uns中读取danfo dataframe
    const milestonePositionDf =
      annoMatrix.uns.cafe.trajectory_history_dict[trajectoryChoice.current]
        .trajectory_embedding[layoutChoice.current].milestone_positions;
    const milestoneIdList =
      annoMatrix.uns.cafe.trajectory_history_dict[trajectoryChoice.current]
        .milestone_wrapper.id_list;
    const milestoneColorList =
      annoMatrix.uns.cafe.trajectory_history_dict[trajectoryChoice.current]
        .milestone_wrapper.color_list;
    const colorDict = Object.fromEntries(
      milestoneIdList.map((key, i) => [key, milestoneColorList[i]])
    );
    // console.log("colorDict:,", colorDict);

    // milestonePositionDf.print();
    const nodes = [];
    dfd
      .toJSON(milestonePositionDf.groupby(["milestone_id"]).first())
      .forEach((row) => {
        nodes.push({
          data: {
            id: row.milestone_id,
            label: row.milestone_id,
            color: colorDict[row.milestone_id],
          },
        });
      });
    const edges = [];
    dfd
      .toJSON(milestonePositionDf.groupby(["group"]).first())
      .forEach((row) => {
        edges.push({
          data: {
            id: row.group,
            source: row.from,
            target: row.to,
            label: row.group,
          },
        });
      });
    // console.log("nodes", nodes);
    // console.log("edges", edges);
    const elements = CytoscapeComponent.normalizeElements({ nodes, edges });
    const { renderKey } = this.state;

    return (
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <H5
            role="menuitem"
            tabIndex="0"
            data-testclass="trajectory-preview-expand"
            // onKeyPress={this.handleExpand}
            style={{ cursor: "pointer" }}
            onClick={this.handleExpand}
          >
            Trajectory Preview{" "}
            {isExpanded ? (
              <Icon icon={IconNames.CHEVRON_DOWN} />
            ) : (
              <Icon icon={IconNames.CHEVRON_RIGHT} />
            )}
          </H5>
        </div>
        {isExpanded && (
          <div>
            <CytoscapeComponent
              key={`cy-${renderKey}`} // 关键点：key变化时实例会重建
              elements={elements}
              style={{ width: "300px", height: "300px" }}
              layout={
                { name: "dagre" }
                // { name: "cose-bilkent" },
                // { name: "klay" }
              }
              stylesheet={[
                {
                  selector: "node",
                  style: {
                    label: "data(label)", // 显示节点的label属性
                    "background-color": "data(color)", // 显示节点的颜色属性
                    "text-valign": "center", // 文本垂直居中
                    "text-halign": "center", // 文本水平居中
                    color: "black", // 文本颜色
                    "font-size": "12px", // 字体大小
                  },
                },
                {
                  selector: "edge",
                  style: {
                    width: 2,
                    "line-color": "#ccc",
                    "target-arrow-color": "#ccc",
                    "target-arrow-shape": "triangle",
                    "curve-style": "bezier",
                    label: "data(label)", // 显示边的label属性
                    "text-rotation": "autorotate",
                    color: "black",
                    "font-size": "10px",
                  },
                },
              ]}
            />
          </div>
        )}
      </div>
    );
  }
}
