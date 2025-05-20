import {
  Box,
  Button,
  Flex,
  FormControl,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { registerAnalyticsAction } from '../../data/AnalyticsFunctions';
import { API } from '../../data/api';
import {
  AbstractNodeData,
  ActualAbstractDataType,
  AIExerciseGenerated,
  AIPlanLessonResponse,
  EducationLevel,
  LearningOutcome,
  OpenCloseNodeAction,
  PlanLessonNode,
  Platform,
  PolyglotNode,
  PolyglotNodeValidation,
  QuestionTypeMap,
  Topic,
  ZoneId,
} from '../../types/polyglotElements';
import FlexText from '../CostumTypography/FlexText';
import HeadingSubtitle from '../CostumTypography/HeadingSubtitle';
import HeadingTitle from '../CostumTypography/HeadingTitle';
import PlanLesson from '../Modals/PlanLesson';
import CloseEndedTool from './closeEndedQuestion';
import MultichoiceTool from './multichoiceQuestion';
import OpenQuestionTool from './openQuestion';
import ReadMaterialTool from './readMaterial';
import TrueFalseTool from './trueFalse';
import WatchVideoTool from './watchVideo';

type LibraryToolProps = {
  isOpen: boolean;
  actualActivity: PolyglotNodeValidation | undefined;
  setUnlock: Dispatch<SetStateAction<boolean>>;
  setSatisfiedConditions: Dispatch<SetStateAction<string[]>>;
  showNextButton: boolean;
  setShowNextButton: Dispatch<SetStateAction<boolean>>;
  userId: string;
  flowId: string;
  lastAction: string;
  setLastAction: Dispatch<SetStateAction<string>>;
};

const LibraryTool = ({
  isOpen,
  actualActivity,
  setUnlock,
  setSatisfiedConditions,
  userId,
  flowId,
  lastAction,
  setShowNextButton,
  setLastAction,
}: LibraryToolProps) => {
  const abstractData: AbstractNodeData = actualActivity?.data || {};

  const [actualData, setActualData] = useState<ActualAbstractDataType>(); //manca l'aggiornamento del data
  const [generatedLesson, setGenLesson] = useState<ActualAbstractDataType[]>(
    []
  );
  const [showNextButtonLibrary, setShowNextButtonLibrary] = useState(false);
  const [unlockLibrary, setUnlockLibrary] = useState(false); //per triggerare l'avanzamento
  const [conditionsLibrary, setConditionsLibrary] = useState<string[]>([]); //per la validation

  const {
    isOpen: planLessonOpen,
    onClose: planLessonOnClose,
    onOpen: planLessonOnOpen,
  } = useDisclosure();

  const addGeneratedActivity = (newNode: { type: string; data: any }) => {
    const newActivity: ActualAbstractDataType = {
      type: newNode.type,
      data: {
        _id: 'abstractNodeExecution',
        data: newNode.data,
        flowId: flowId,
        type: newNode.type,
        title: '',
        description: '',
        difficulty: 0,
        runtimeData: '',
        platform: 'WebApp',
        reactFlow: undefined,
        validation: [
          {
            id: 'pass',
            title: '',
            data: {
              conditionKind: 'pass',
            },
            type: 'passfailEdge',
            code: '',
          },
          {
            id: 'fail',
            title: '',
            data: {
              conditionKind: 'fail',
            },
            type: 'passfailEdge',
            code: '',
          },
        ],
      },
    };
    setGenLesson((prev) => [...prev, newActivity]);
  };

  useEffect(() => {
    if (!isOpen) return;

    if (!abstractData) return;
    if (actualActivity?.type != 'abstractNode') return;
    try {
      if (userId && actualActivity?._id) {
        if (lastAction == 'open_node') return;
        setLastAction('open_node');
        console.log('choiceAction');
        registerAnalyticsAction({
          timestamp: new Date(),
          userId: userId,
          actionType: 'open_node',
          zoneId: ZoneId.WebAppZone,
          platform: Platform.WebApp,
          action: {
            flowId: flowId,
            nodeId: actualActivity._id,
            activity: actualActivity.type,
          },
        } as OpenCloseNodeAction);
      }
    } catch (e) {
      console.log(e);
    }
    try {
      if (userId && actualActivity?._id) {
        if (lastAction == 'library_tool') return;
        setLastAction('library_tool');
        registerAnalyticsAction({
          timestamp: new Date(),
          userId: userId,
          actionType: 'library_tool',
          zoneId: ZoneId.WebAppZone,
          platform: Platform.WebApp,
          action: {
            flowId: flowId,
            nodeId: actualActivity._id,
            activity: actualActivity.type,
          },
        } as OpenCloseNodeAction);
      }
    } catch (e) {
      console.log(e);
    }
  }, [actualActivity]);

  if (!isOpen) return <></>;

  if (
    !abstractData.sourceMaterial ||
    abstractData.sourceMaterial == '' ||
    abstractData.topicsAI.length == 0
  ) {
    const id = actualActivity?.validation.find(
      (edge) => edge.data.conditionKind == 'pass'
    )?.id;
    if (id) {
      setSatisfiedConditions([id]);
    }
    return (
      <>
        <Box
          width={'80%'}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <HeadingTitle>Library Tool</HeadingTitle>
          <HeadingSubtitle>
            Missing key elements to generate your custom plan Lesson.
          </HeadingSubtitle>
          <br />
        </Box>
      </>
    );
  }

  return (
    <Box
      width={'80%'}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <HeadingTitle>Library Tool</HeadingTitle>
      <HeadingSubtitle>
        Create your lesson plan to reach the learning objective.
      </HeadingSubtitle>
      <br />
      <PlanLesson
        isOpen={planLessonOpen}
        onClose={planLessonOnClose}
        abstractData={abstractData}
        addGeneratedData={addGeneratedActivity}
        generatedLesson={generatedLesson}
      />
      <Box width="100%">
        <MultichoiceTool
          isOpen={actualData?.type == 'multipleChoiceQuestionNode'}
          actualActivity={actualData && actualData.data}
          setUnlock={setUnlockLibrary}
          setSatisfiedConditions={setConditionsLibrary}
          showNextButton={showNextButtonLibrary}
          setShowNextButton={setShowNextButtonLibrary}
          userId={userId}
          flowId={flowId}
          lastAction={lastAction}
          setLastAction={setLastAction}
        />
        <CloseEndedTool
          isOpen={actualData?.type == 'closeEndedQuestionNode'}
          actualActivity={actualData && actualData.data}
          setUnlock={setUnlockLibrary}
          setSatisfiedConditions={setConditionsLibrary}
          showNextButton={showNextButtonLibrary}
          setShowNextButton={setShowNextButtonLibrary}
          userId={userId}
          flowId={flowId}
          lastAction={lastAction}
          setLastAction={setLastAction}
        />
        <TrueFalseTool
          isOpen={actualData?.type == 'TrueFalseNode'}
          actualActivity={actualData && actualData.data}
          setUnlock={setUnlockLibrary}
          setSatisfiedConditions={setConditionsLibrary}
          showNextButton={showNextButtonLibrary}
          setShowNextButton={setShowNextButtonLibrary}
          userId={userId}
          flowId={flowId}
          lastAction={lastAction}
          setLastAction={setLastAction}
        />
        <OpenQuestionTool
          isOpen={actualData?.type == 'OpenQuestionNode'}
          actualActivity={actualData && actualData.data}
          setUnlock={setUnlockLibrary}
          setSatisfiedConditions={setConditionsLibrary}
          showNextButton={showNextButtonLibrary}
          setShowNextButton={setShowNextButtonLibrary}
          userId={userId}
          flowId={flowId}
          lastAction={lastAction}
          setLastAction={setLastAction}
        />
      </Box>
      <Button
        top={'20px'}
        hidden={showNextButtonLibrary}
        position={'relative'}
        color={'#0890d3'}
        border={'2px solid'}
        borderColor={'#0890d3'}
        borderRadius={'8px'}
        onClick={() => {
          setUnlock(true);
          setShowNextButton(true);
        }}
      >
        Validate
      </Button>
    </Box>
  );
};

export default LibraryTool;
