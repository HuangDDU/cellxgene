const initialState = {
  showTrajectory: false,
  anchorTrajectory: false,
  trajectoryType: "milestone",
  nodeSize: 2.5,
  edgeWidth: 1,
};

// 参考centroidLabels
const trajectory = (state = initialState, action) => {
  switch (action.type) {
    case "trajectory: show trajectory": {
      const showTrajectory = action.showTrajectory ?? state.showTrajectory;
      return {
        ...state,
        showTrajectory,
      };
    }
    case "trajectory: anchor trajectory": {
      const anchorTrajectory =
        action.anchorTrajectory ?? state.anchorTrajectory;
      return {
        ...state,
        anchorTrajectory,
      };
    }

    case "trajectory: set trajectory type": {
      const trajectoryType = action.trajectoryType ?? state.trajectoryType;
      return {
        ...state,
        trajectoryType,
      };
    }

    case "trajectory: set node size": {
      const nodeSize = action.nodeSize ?? state.nodeSize;
      return {
        ...state,
        nodeSize,
      };
    }

    case "trajectory: set edge width": {
      const edgeWidth = action.edgeWidth ?? state.edgeWidth;
      return {
        ...state,
        edgeWidth,
      };
    }

    default:
      return state;
  }
};

export default trajectory;
