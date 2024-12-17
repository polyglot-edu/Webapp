import multipleChoiceQuestionIcon from '../../../public/mult_choice_icon.png';
import closeEndedQuestionIcon from '../../../public/closeQuestion_icon.png';
import OpenQuestionIcon from '../../../public/openQuestionNode_icon.png';
import TrueFalseIcon from '../../../public/trueFalse_icon.png';
import ReadMaterialIcon from '../../../public/readMaterial_icon.png';
import WatchVideoIcon from '../../../public/watchVideo_icon.png';
import SummaryIcon from '../../../public/summary_CasesEvaluation_icon.png';
import CodingQuestionIcon from '../../../public/coding_icon.png'
import CollaborativeModellingIcon from '../../../public/collaborative_icon.png'
import UMLModellingIcon from '../../../public/papyrusWebIcon.png'
import iconRead from '../../../public/lesson_icon.png';

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

export const nodeIconsMapping: { [key: string]: any } = {
  ReadMaterialNode: ReadMaterialIcon,
  closeEndedQuestionNode: closeEndedQuestionIcon,
  multipleChoiceQuestionNode: multipleChoiceQuestionIcon,
  WatchVideoNode: WatchVideoIcon,
  TrueFalseNode: TrueFalseIcon,
  OpenQuestionNode: OpenQuestionIcon,
  SummaryNode: SummaryIcon,
  lessonTextNode: iconRead,
  codingQuestionNode: CodingQuestionIcon,
  CollaborativeModelingNode: CollaborativeModellingIcon,
  UMLModelingNode: UMLModellingIcon,
};
