import React from "react";
import { connect } from "react-redux";
import { H5, HTMLTable, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
// import { Table, Column, Cell } from "@blueprintjs/table";
import * as dfd from "danfojs";

@connect((state) => ({
  annoMatrix: state.annoMatrix,
}))
export default class Benchmark extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: true,
      metricNameList: ["edge_flip", "him"],
    };
  }

  handleExpand = () => {
    const { isExpanded } = this.state;
    this.setState({ isExpanded: !isExpanded });
  };

  render() {
    const { isExpanded, metricNameList } = this.state;
    const { annoMatrix } = this.props;

    // read benchmark metrics
    const benchmark = [];
    console.log(
      "annoMatrix.uns.cfe.trajectory_history_dict",
      annoMatrix.uns.cfe.trajectory_history_dict
    );
    for (const [trajectoryName, trajectory] of Object.entries(
      annoMatrix.uns.cfe.trajectory_history_dict
    )) {
      benchmark.push({
        id: trajectoryName,
        name: trajectoryName,
        ...trajectory.metric_dict,
      });
    }
    console.log("benchmark", benchmark);

    const benchmarkDf = new dfd.DataFrame(benchmark);
    // benchmarkDf.print();

    const trs = [];
    dfd.toJSON(benchmarkDf).forEach((row) => {
      trs.push(
        <tr key={row.name}>
          <td
            style={{
              width: "50px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {row.name}
          </td>
          {/* <td>{row.edge_flip}</td>
          <td>{row.him}</td> */}
          {metricNameList.map((item) => (
            <td key={item}>{row[item].toFixed(3)}</td>
          ))}
        </tr>
      );
    });
    return (
      <div>
        {/* TODO: trajectory preview by cytoscape*/}
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
            Trajectory Benchmark{" "}
            {isExpanded ? (
              <Icon icon={IconNames.CHEVRON_DOWN} />
            ) : (
              <Icon icon={IconNames.CHEVRON_RIGHT} />
            )}
          </H5>
        </div>

        {isExpanded && (
          // 使用原生表格展示
          <HTMLTable
            style={{
              tableLayout: "fixed",
              width: "100%",
            }}
            border="1"
          >
            <thead>
              <tr>
                <th>ID</th>
                {/* <th>edge flip</th>
                <th>him</th> */}
                {metricNameList.map((item) => (
                  <th key={item}>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>{trs}</tbody>
          </HTMLTable>
          // 使用Blueprint的Table组件展示会有乱码
          // <Table
          //   // style={{ height: "400px", width: "100%" }}
          //   enableRowHeader={false}
          //   numRows={benchmarkDf.shape[0]}>
          //   {/* <Column
          //     name="ID"
          //     width={50}
          //     cellRenderer={(rowIndex) => <Cell>{rowIndex + 1}</Cell>} /> */}
          //   {/* <Column
          //     name="ID"
          //     width={50}
          //     cellRenderer={(rowIndex) => <Cell>{benchmarkDf.loc({ rows: [rowIndex], columns: ["id"] }).values[0][0]}</Cell>} />
          //   <Column
          //     name="edge flip"
          //     width={20}
          //     cellRenderer={(rowIndex) => <Cell>{benchmarkDf.loc({ rows: [rowIndex], columns: ["edgeFlip"] }).values[0][0]}</Cell>} />
          //   <Column
          //     name="cluster mapping"
          //     width={100}
          //     cellRenderer={(rowIndex) => <Cell>{benchmarkDf.loc({ rows: [rowIndex], columns: ["clusterMapping"] }).values[0][0]}</Cell>} /> */}
          // </Table>
          // TODO: 修改Blueprint的Table组件在此处的显示
          // TODO: 使用React-table实现表格的处理
        )}
      </div>
    );
  }
}
