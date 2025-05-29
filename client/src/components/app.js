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

import actions from "../actions";

// redux管理页面加载状态
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
                {/* 这里不同h2标签的位置由上层Container组件决定 */}
                <H2>Hello cellxgene! This is HuangJoya1</H2>
                <MenuBar />
                <Embedding />
                <Autosave />
                <Legend viewportRef={viewportRef} />
                <H2>Hello cellxgene! This is HuangJoya2</H2>
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
