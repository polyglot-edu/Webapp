import axiosCreate, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import {
  ManualProgressInfo,
  PolyglotFlow,
  ProgressInfo,
} from '../types/polyglotElements';
import {
  AIExerciseType,
  AnalyseType,
  LOType,
  MaterialType,
  SummarizeType,
  CorrectorType,
} from '../types/polyglotElements/AIGenerativeTypes/AIGenerativeTypes';

export type aiAPIResponse = {
  Date: string;
  Question: string;
  CorrectAnswer: string;
};

const axios = axiosCreate.create({
  baseURL: 'https://polyglot-api-staging.polyglot-edu.com/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

const axiosProgress = axiosCreate.create({
  baseURL: 'https://polyglot-api-staging.polyglot-edu.com',
  headers: {
    'Content-Type': 'application/json',
    withCredentials: true,
    Access: '*',
  },
}); 

export const API = {
  loadFlowElementsAsync: (
    flowId: string
  ): Promise<AxiosResponse<PolyglotFlow>> => {
    return axios.get<PolyglotFlow>(`/api/flows/${flowId}`);
  },
  loadFlowList: (query?: string): Promise<AxiosResponse<PolyglotFlow[]>> => {
    const queryParams = query ? '?q=' + query : '';
    return axios.get(`/api/flows` + queryParams);
  },
  progressInfo: (body: ProgressInfo): Promise<AxiosResponse> => {
    return axiosProgress.post<{}, AxiosResponse, {}>(
      `/api/execution/progressInfo`,
      body
    );
  },

  manualProgress: (body: ManualProgressInfo): Promise<AxiosResponse> => {
    return axiosProgress.post<{}, AxiosResponse, {}>(
      `/api/execution/progressAction`,
      body
    );
  },

  resetProgress: (body: ManualProgressInfo): Promise<AxiosResponse> => {
    return axiosProgress.post<{}, AxiosResponse, {}>(
      `/api/execution/resetProgress`,
      body
    );
  },

  getActualNodeInfo: (body: { ctxId: string }): Promise<AxiosResponse> => {
    return axiosProgress.post<{}, AxiosResponse, {}>(
      `/api/execution/actual`,
      body
    );
  },

  nextNodeProgression: (body: {
    ctxId: string;
    satisfiedConditions: string[];
  }): Promise<AxiosResponse> => {
    return axiosProgress.post<{}, AxiosResponse, {}>(
      `/api/execution/next`,
      body
    );
  },

  analyseMaterial: (body: AnalyseType): Promise<AxiosResponse> => {
    return axios.post<{}, AxiosResponse, {}>(
      `/api/openai/MaterialAnalyser`,
      body
    );
  },

  generateLO: (body: LOType): Promise<AxiosResponse> => {
    return axios.post<{}, AxiosResponse, {}>(
      `/api/openai/LearningObjectiveGenerator`,
      body
    );
  },

  generateMaterial: (body: MaterialType): Promise<AxiosResponse> => {
    return axios.post<{}, AxiosResponse, {}>(
      `/api/openai/MaterialGenerator`,
      body
    );
  },

  summarize: (body: SummarizeType): Promise<AxiosResponse> => {
    return axios.post<{}, AxiosResponse, {}>(`/api/openai/Summarizer`, body);
  },

  generateNewExercise: (body: AIExerciseType): Promise<AxiosResponse> => {
    return axios.post<{}, AxiosResponse, {}>(
      `/api/openai/ActivityGenerator`,
      body
    );
  },
  
  corrector: (body: CorrectorType): Promise<AxiosResponse> => {
    return axiosProgress.post<{}, AxiosResponse, {}>(
      '/api/openai/Corrector',
      body
    );
  },

  downloadFile: (body: { nodeId: string }): Promise<AxiosResponse> => {
    return axiosProgress.get<{}, AxiosResponse, {}>(
      `/api/file/download/${body.nodeId}`,
      {
        responseType: 'blob',
      }
    );
  },
};
