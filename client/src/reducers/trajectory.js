const initialState = {
  showTrajectory: false,
};

// 参考centroidLabels
const trajectory = (state = initialState, action) => {
  const showTrajectory = action.showTrajectory ?? state.showTrajectory;

  switch (action.type) {
    case "show trajectory":
      return {
        ...state,
        showTrajectory,
      };

    default:
      return state;
  }
};

export default trajectory;
