function bestDefaultTrajectory(trajectory) {
  console.log("trajectory", trajectory);
  return "ref@@@umap";
}

function setToDefaultTrajectory(schema) {
  const available = schema.trajectory.obs.map((v) => v.name).sort();
  const current = bestDefaultTrajectory(available);
  const currentDimNames = schema.trajectory.obsByName[current].dims;
  return { available, current, currentDimNames };
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
        ...setToDefaultTrajectory(annoMatrix.schema),
      };
    }

    case "set trajectory choice": {
      const { schema } = nextSharedState.annoMatrix;
      const current = action.trajectoryChoice;
      const currentDimNames = schema.trajectory.obsByName[current].dims;
      return { ...state, current, currentDimNames };
    }

    default: {
      return state;
    }
  }
};

export default TrajectoryChoice;
