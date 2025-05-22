import { PolyglotEdge, PolyglotNode } from '..';

export type PolyglotFlowInfo = {
  _id: string;
  title: string;
  author?: {
    _id?: string;
    username?: string;
  };
  description: string;
  tags: { name: string; color: string }[];
  learningContext: string;
  duration: string;
  topics: string[];
  publish: boolean;
  executedTimes: string;
  overallGrade: string;
  /* to be discussed: do we want to save in the database the last summarized material of the professor? Or we give the tool to be live usage?
  sourceMaterial?: string;
  levelMaterial?: string;
  generatedMaterial?: string;
  noW?: number;*/
};

export type PolyglotFlow = PolyglotFlowInfo & {
  nodes: PolyglotNode[];
  edges: PolyglotEdge[];
};

export type ProgressInfo = {
  flowId: string;
  userId: string;
};

export type ManualProgressInfo = {
  ctxId: string;
  satisfiedConditions?: string[];
  flowId?: string;
  authorId: string;
};

export type UserBaseInfo = {
  ctx: {
    flowId: string;
    username: string;
    currentNode: string;
    conditions: [{ edgeId: string; conditionKind: string }];
  };
  key: string;
};

export type PolyglotNodeValidation = PolyglotNode & {
  validation: {
    id: string;
    title: string;
    code: string;
    data: any;
    type: string;
  }[];
};
