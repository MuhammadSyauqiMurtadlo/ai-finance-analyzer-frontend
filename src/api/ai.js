import api from "./client";

export const analyzeFinances = () =>
  api
    .post("/ai/analyze", null, { timeout: 60000 })
    .then((res) => res.data.data);
