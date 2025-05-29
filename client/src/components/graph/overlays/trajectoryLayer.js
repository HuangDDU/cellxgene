import React, { Component } from "react";
import * as d3 from "d3";
import styles from "../graph.css";

// 会在public目录下读取轨迹数据文件
// d3.csv("test.csv", (data) => {
//   // 处理数据
//   console.log(data);
// });
// 由于上述public文件目前找不到

// 直接只读取Milestone数据，目前一条路径上只有两个点，实际上应该有多个
const pathArray = [
  [
    [10.1, 10.86],
    [4.76, 9.01],
  ],
  [
    [4.76, 9.01],
    [0.6, 6.17],
  ],
  [
    [4.76, 9.01],
    [1.24, 7.3],
  ],
  [
    [0.6, 6.17],
    [-3.55, 2.68],
  ],
  [
    [1.24, 7.3],
    [-2.54, 7.73],
  ],
];

function getTrajectoryPath() {
  // 生成 SVG path 字符串
  const trajectoryPoints = [
    [100, 100],
    [200, 200],
    [300, 200],
  ]; // 暂时直接线性轨迹点
  // TODO: 从后台获取轨迹点
  // TODO: 对于轨迹点投影变换

  // TODO: 实现对于带箭头的，图结构的轨迹曲线绘制
  // 使用 d3.line 生成路径字符串
  // SVG路径字符串：https://www.runoob.com/svg/svg-path.html，有点类似于Python的turtle绘图
  const lineGenerator = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1])
    .curve(d3.curveLinear);
  const trajectoryPath = lineGenerator(trajectoryPoints);
  console.log(trajectoryPath);

  return trajectoryPath;
}

function transPath(path) {
  const lineGenerator = d3
    .line()
    .x((d) => d[0] * 10)
    .y((d) => d[1] * 10)
    .curve(d3.curveLinear);
  const trajectoryPath = lineGenerator(path);
  console.log(trajectoryPath);

  return trajectoryPath;
}

export default class TrajectoryLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "OK",
    };
  }

  render() {
    const {status} = this.state;
    console.log(status);

    const { width, height } = this.props;
    return (
      <div>
        <div>Trajectory</div>
        <svg
          className={styles.graphSVG}
          width={width}
          height={height}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 3, // 确保轨迹层在其他图层之上
          }}
        >
          {/* 简单的单条多段直线路径尝试 */}
          <path
            d={getTrajectoryPath()}
            fill="none"
            stroke="red"
            strokeWidth={2}
            pointerEvents="none"
          />
          {/* 真实的多条路径 */}
          {pathArray.map((path) => (
              <path
                d={transPath(path)}
                fill="none"
                stroke="green"
                strokeWidth={2}
                pointerEvents="none"
              />
            ))}
        </svg>
      </div>
    );
  }
}
