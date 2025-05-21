export type Topic = { topic: string; explanation: string };

export enum EducationLevel {
  ElementarySchool = 'elementary school',
  MiddleSchool = 'middle school',
  HighSchool = 'high school',
  College = 'college',
  Graduate = 'graduate',
  Professional = 'professional',
}

export enum LearningOutcome {
  RecallRecognize = 'the ability to recall or recognize simple facts and definitions',
  ExplainRelate = 'the ability to explain concepts and principles, and recognize how different ideas are related',
  ApplyKnowledge = 'the ability to apply knowledge and perform operations in practical contexts',
  SelfAssess = 'the ability to assess your own understanding, identify gaps in knowledge, and strategize ways to close those gaps',
  SynthesizeOrganize = 'the ability to synthesize and organize concepts into a framework that allows for advanced problem-solving and prediction',
  GenerateContribute = 'the ability to generate new knowledge, challenge existing paradigms, and make significant contributions to the field',
}

export const QuestionTypeMap = [
  {
    key: 'open question',
    text: 'Open Question',
    nodeType: 'OpenQuestionNode',
    integrated: true,
  },
  {
    key: 'short answer question',
    text: 'Short Answer Question',
    nodeType: 'closeEndedQuestionNode',
    integrated: true,
  },
  {
    key: 'true or false',
    text: 'True or False',
    nodeType: 'TrueFalseNode',
    integrated: true,
  },
  {
    key: 'fill in the blanks',
    text: 'Fill in the Blanks',
    nodeType: 'activity',
    integrated: false,
  },
  {
    key: 'matching',
    text: 'Matching',
    nodeType: 'activity',
    integrated: false,
  },
  {
    key: 'ordering',
    text: 'Ordering',
    nodeType: 'activity',
    integrated: false,
  },
  {
    key: 'multiple choice',
    text: 'Multiple Choice',
    nodeType: 'multipleChoiceQuestionNode',
    integrated: true,
  },
  {
    key: 'multiple select',
    text: 'Multiple Select',
    nodeType: 'activity',
    integrated: false,
  },
  { key: 'coding', text: 'Coding', nodeType: 'activity', integrated: false },
  { key: 'essay', text: 'Essay', nodeType: 'activity', integrated: false },
  {
    key: 'knowledge exposition',
    text: 'Knowledge Exposition',
    nodeType: 'discussion',
    integrated: false,
  },
  { key: 'debate', text: 'Debate', nodeType: 'discussion', integrated: false },
  {
    key: 'brainstorming',
    text: 'Brainstorming',
    nodeType: 'discussion',
    integrated: false,
  },
  {
    key: 'group discussion',
    text: 'Group Discussion',
    nodeType: 'discussion',
    integrated: false,
  },
  {
    key: 'simulation',
    text: 'Simulation',
    nodeType: 'experiential',
    integrated: false,
  },
  {
    key: 'inquiry based learning',
    text: 'Inquiry-Based Learning',
    nodeType: 'experiential',
    integrated: false,
  },
  {
    key: 'non written material analysis',
    text: 'Non-Written Material Analysis',
    nodeType: 'experiential',
    integrated: false,
  },
  {
    key: 'non written material production',
    text: 'Non-Written Material Production',
    nodeType: 'experiential',
    integrated: false,
  },
  {
    key: 'case study analysis',
    text: 'Case Study Analysis',
    nodeType: 'project',
    integrated: false,
  },
  {
    key: 'project based learning',
    text: 'Project-Based Learning',
    nodeType: 'project',
    integrated: false,
  },
  {
    key: 'problem solving activity',
    text: 'Problem Solving Activity',
    nodeType: 'project',
    integrated: false,
  },
];

export enum TypeOfExercise {
  fill_in_the_blanks,
  question,
  choice,
  conceptual,
  practical,
}

export type AnalyseType = { material: string };

export type LOType = {
  Topic: string;
  Level: number;
  Context: string;
};

export type MaterialType = {
  topic: string;
  numberOfWords: number;
  level: number;
  learningObjective: string;
};

export type SummarizeType = {
  material: string;
  numberOfWords: number;
  level: number;
};

export type SummarizerBody = { lesson: string; noW: string; level: string };

export type CorrectorType = {
  //to be updated
  question: string;
  expectedAnswer: string;
  answer: string;
  temperature: number;
};

export type AIExerciseType = {
  //updated to new api
  macro_subject: string;
  topic: string;
  education_level: EducationLevel;
  learning_outcome: LearningOutcome;
  material: string;
  solutions_number: number;
  distractors_number: number;
  easily_discardable_distractors_number: number;
  type: string;
  language: string;
  model: string;
};

export type AIExerciseGenerated = {
  macro_subject: string;
  topic: string;
  education_level: EducationLevel;
  learning_outcome: LearningOutcome;
  material: string;
  assignment: string;
  plus: string;
  solutions: string[];
  distractors: string[];
  easily_discardable_distractors: string[];
  type: string;
  language: string;
};

export type AIPlanLesson = {
  topics: Topic[];
  learning_outcome: LearningOutcome;
  language: string;
  macro_subject: string;
  title: string;
  education_level: EducationLevel;
  context: string;
  model: string;
};

export type PlanLessonNode = {
  type: string;
  topic: string;
  details: string;
  learning_outcome: LearningOutcome;
  duration: number;
  data: any;
};

export type AIPlanLessonResponse = {
  title: string;
  macro_subject: string;
  education_level: EducationLevel;
  learning_outcome: LearningOutcome;
  prerequisites: string[];
  nodes: PlanLessonNode[];
  context: string;
  language: string;
};
