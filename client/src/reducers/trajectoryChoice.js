function bestDefaultTrajectory(trajectory) {
  console.log("trajectory", trajectory);
  return "None";
}

function setToDefaultTrajectory(annoMatrix) {
  const available = Object.keys(annoMatrix.uns.cfe.trajectory_history_dict);
  const current = bestDefaultTrajectory(available);
  return { available, current };
}

const TrajectoryChoice = (
  state = {
    available: [], // all available choices
    current: undefined, // name of the current layout, eg, 'ref'
    currentDimNames: [], // dimension name
  },
  action,
  nextSharedState
) => {
  switch (action.type) {
    case "initial data load complete": {
      // set default to default
      const { annoMatrix } = nextSharedState;
      console.log("TrajectoryChoice action: initial data load complete");
      return {
        ...state,
        ...setToDefaultTrajectory(annoMatrix),
      };
    }

    case "set trajectory choice": {
      const current = action.trajectoryChoice;
      return { ...state, current };
    }

    default: {
      return state;
    }
  }
};

export default TrajectoryChoice;
