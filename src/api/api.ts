import axiosCreate, { AxiosResponse } from "axios";

const api = axiosCreate.create({
  baseURL: "https://polyglot-api-staging.polyglot-edu.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const API = {
  getLP: (flowId) => {
    return api.get<{}, AxiosResponse, {}>(`/api/flows/` + flowId);
  },
  loadFlowList: (query) => {
    const queryParams = query ? "?q=" + query : "";
    return api.get(`/api/flows` + queryParams);
  },
};
