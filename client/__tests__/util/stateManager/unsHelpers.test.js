import { smartConvertToDataframe } from "../../../src/util/stateManager/unsHelpers";

describe("uns helpers transfer test", () => {
  const uns = {
    cafe: {
      model_name: {},
      prior_information: {},
      trajectory_history_dict: {
        ref: {
          trajectory_embedding: {
            emb: {
              milestone_positions: [
                { comp_1: 0, comp_2: 1, milestone_id: "M1" },
                { comp_1: 1, comp_2: 0, milestone_id: "M2" },
              ],
              wp_segments: [
                { comp_1: 0, comp_2: 1, milestone_id: "W1" },
                { comp_1: 0.5, comp_2: 0.5, milestone_id: "W2" },
                { comp_1: 1, comp_2: 0, milestone_id: "W3" },
              ],
            },
            umap: {
              milestone_positions: [
                { comp_1: 1, comp_2: 1, milestone_id: "M1" },
                { comp_1: 2, comp_2: 2, milestone_id: "M2" },
                { comp_1: 3, comp_2: 3, milestone_id: "M3" },
              ],
              wp_segments: [
                { comp_1: 1, comp_2: 1, milestone_id: "W1" },
                { comp_1: 1.5, comp_2: 1.5, milestone_id: "W2" },
                { comp_1: 2, comp_2: 2, milestone_id: "W3" },
                { comp_1: 2.5, comp_2: 2.5, milestone_id: "W4" },
                { comp_1: 3, comp_2: 3, milestone_id: "W5" },
              ],
            },
          },
        },
        paga: {
          trajectory_embedding: {
            emb: {
              milestone_positions: [
                { comp_1: 0, comp_2: 1, milestone_id: "M1" },
                { comp_1: 1, comp_2: 0, milestone_id: "M2" },
              ],
              wp_segments: [
                { comp_1: 0, comp_2: 1, milestone_id: "W1" },
                { comp_1: 0.25, comp_2: 0.75, milestone_id: "W2" },
                { comp_1: 0.5, comp_2: 0.5, milestone_id: "W3" },
                { comp_1: 0.75, comp_2: 0.25, milestone_id: "W4" },
                { comp_1: 1, comp_2: 0, milestone_id: "W5" },
              ],
            },
          },
        },
      },
    },
  };
  test("cafe transfer without danfo", () => {
    const convertedUns = smartConvertToDataframe(uns);
    const df =
      convertedUns.cafe.trajectory_history_dict.ref.trajectory_embedding.emb
        .milestone_positions;
    expect(df).toBeDefined();
    expect(df.dims).toEqual([2, 3]);
    expect(df.at(0, "milestone_id")).toEqual("M1"); // 索引从0开始， 与DataFrame保持一致
  });
});
