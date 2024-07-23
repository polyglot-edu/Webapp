
export type ChallengeSetup = {};
export type ChallengeContent = {
  type: string;
  content: string;
  priority?: number;
};

export type PolyglotNode = {
  _id: string;
  type: string;
  title: string;
  description: string;
  difficulty: number;
  runtimeData: any;
  platform: string;
  data: any;
  reactFlow: any;
};
