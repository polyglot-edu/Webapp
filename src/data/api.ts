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
} from '../types/polyglotElements/AIGenerativeTypes/AIGenerativeTypes';

export type aiAPIResponse = {
  Date: string;
  Question: string;
  CorrectAnswer: string;
};

const axios = axiosCreate.create({
  baseURL: 'https://polyglot-api-staging.polyglot-edu.com/api/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const axiosProgress = axiosCreate.create({
  baseURL: process.env.BACK_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AIAPIGeneration = axiosCreate.create({
  baseURL: 'https://skapi.polyglot-edu.com',
  headers: {
    'Content-Type': 'application/json',
    withCredentials: true,
    Access: '*',
    ApiKey: process.env.APIKEY,
    SetupModel:
      '{"secretKey": "' +
      process.env.SETUPMODEL +
      '","modelName": "gpt35Turbo","endpoint": "https://ai4edu.openai.azure.com/"}',
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
    return AIAPIGeneration.post<{}, AxiosResponse, {}>(
      `/MaterialAnalyser/analyseMaterial`,
      body
    );
  },

  generateLO: (body: LOType): Promise<AxiosResponse> => {
    return AIAPIGeneration.post<{}, AxiosResponse, {}>(
      `/LearningObjectiveGenerator/generateLearningObjective`,
      body
    );
  },

  generateMaterial: (body: MaterialType): Promise<AxiosResponse> => {
    return AIAPIGeneration.post<{}, AxiosResponse, {}>(
      `/MaterialGenerator/generatematerial`,
      body
    );
  },

  summarize: (body: SummarizeType): Promise<AxiosResponse> => {
    return AIAPIGeneration.post<{}, AxiosResponse, {}>(
      `/Summarizer/summarize`,
      body
    );
  },

  generateNewExercise: (body: AIExerciseType): Promise<AxiosResponse> => {
    return AIAPIGeneration.post<{}, AxiosResponse, {}>(
      `/ActivityGenerator/generateActivity`,
      body
    );
  },
};
