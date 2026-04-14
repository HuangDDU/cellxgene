// 参考embedding中的定义
// export async function _switchTrajectory(
//     prevAnnoMatrix,
//     prevCrossfilter,
//     newTrajectoryName
// ) {
//     /*
//     DRY helper used by embedding action creators
//     */
//     const base = prevAnnoMatrix.base();
//     const embeddingDf = await base.fetch("trajectory", newTrajectoryName);
//     const annoMatrix = _setEmbeddingSubset(prevAnnoMatrix, embeddingDf);
//     const obsCrossfilter = await new AnnoMatrixObsCrossfilter(
//         annoMatrix,
//         prevCrossfilter.obsCrossfilter
//     ).select("emb", newEmbeddingName, {
//         mode: "all",
//     });
//     return [annoMatrix, obsCrossfilter];
// }
export const trajectoryChoiceAction =
  (newTrajectoryChoice) => async (dispatch, getState) => {
    /*
      On trajectory choice, make sure we have selected all on the previous trajectory, AND the new
      trajectory.
      */
    // const { annoMatrix: prevAnnoMatrix, obsCrossfilter: prevCrossfilter } =
    //     getState();
    // const [annoMatrix, obsCrossfilter] = await _switchTrajectory(
    //     prevAnnoMatrix,
    //     prevCrossfilter,
    //     newTrajectoryChoice
    // );
    getState();
    dispatch({
      type: "set trajectory choice",
      trajectoryChoice: newTrajectoryChoice,
      // obsCrossfilter,
      // annoMatrix,
    });
  };
