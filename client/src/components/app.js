import { H2 } from "@blueprintjs/core";
import React from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";

import Container from "./framework/container";
import Layout from "./framework/layout";
import LeftSideBar from "./leftSidebar";
import RightSideBar from "./rightSidebar";
import Legend from "./continuousLegend";
import Graph from "./graph/graph";
import MenuBar from "./menubar";
import Autosave from "./autosave";
import Embedding from "./embedding";
import Trajectory from "./trajectory";

import actions from "../actions";

// redux管理页面加载状态
// 在类式组件之前使用@修饰符定义redux状态变量，可以在组件内部通过this.props访问
// 不在这里定义处理状态的方法，而是直接使用的action.method
@connect((state) => ({
  loading: state.controls.loading,
  error: state.controls.error,
  graphRenderCounter: state.controls.graphRenderCounter,
}))
// 页面主组件
class App extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;

    /* listen for url changes, fire one when we start the app up */
    // 监听url变化，在启动app时触发一次
    window.addEventListener("popstate", this._onURLChanged);
    this._onURLChanged();

    // 启动时加载初始数据, 加载好了annoMatrix(核心)和colors等数据
    dispatch(actions.doInitialDataLoad(window.location.search));
    this.forceUpdate();
  }

  _onURLChanged() {
    const { dispatch } = this.props;

    dispatch({ type: "url changed", url: document.location.href });
  }

  render() {
    const { loading, error, graphRenderCounter } = this.props;
    return (
      // 使用Container组件包裹整个应用, 提供全局样式和布局
      <Container>
        <Helmet title="CELL&times;GENE | Annotate" />
        {loading ? (
          <div
            style={{
              position: "fixed",
              fontWeight: 500,
              top: window.innerHeight / 2,
              left: window.innerWidth / 2 - 50,
            }}
          >
            loading cellxgene
          </div>
        ) : null}
        {error ? (
          <div
            style={{
              position: "fixed",
              fontWeight: 500,
              top: window.innerHeight / 2,
              left: window.innerWidth / 2 - 50,
            }}
          >
            error loading cellxgene
          </div>
        ) : null}
        {loading || error ? null : (
          <Layout>
            <LeftSideBar />
            {(viewportRef) => (
              // 空白标签用于包裹下面的组件，下面的组件仍然是子组件
              <>
                {/* 这里不同h2标签的位置由上层Layout组件决定 */}
                <H2>Hello cellxgene 1!</H2>
                {/* 菜单栏，多个按钮包括了差异表达、选择、前后跳转等功能 */}
                <MenuBar />
                {/* 降维选择按钮 */}
                <Embedding />
                <Trajectory />
                {/* 自动保存状态组件 */}
                <Autosave />
                {/* 图例组件，当着色模式为连续值时才显示 */}
                <Legend viewportRef={viewportRef} />
                <H2>Hello cellxgene 2!</H2>
                {/* TODO: 主面板绘制的降维图+轨迹绘制的区域 */}
                <Graph key={graphRenderCounter} viewportRef={viewportRef} />
              </>
            )}
            <RightSideBar />
          </Layout>
        )}
      </Container>
    );
  }
}

export default App;
