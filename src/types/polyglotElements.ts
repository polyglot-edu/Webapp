export type PolyglotFlowInfo = {
  _id?: string;
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
};

export type PolyglotFlow = PolyglotFlowInfo & {
  nodes: any[];
  edges: any[];
};

export default PolyglotFlow;
