const initialState = {
  showTrajectory: false,
  anchorTrajectory: false,
  trajectoryType: "milestone",
  milestoneNodeSize: 2.5,
  milestoneEdgeWidth: 1,
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

    case "trajectory: set milestone node size": {
      const milestoneNodeSize =
        action.milestoneNodeSize ?? state.milestoneNodeSize;
      return {
        ...state,
        milestoneNodeSize,
      };
    }

    case "trajectory: set milestone edge width": {
      const milestoneEdgeWidth =
        action.milestoneEdgeWidth ?? state.milestoneEdgeWidth;
      return {
        ...state,
        milestoneEdgeWidth,
      };
    }

    default:
      return state;
  }
};

export default trajectory;
