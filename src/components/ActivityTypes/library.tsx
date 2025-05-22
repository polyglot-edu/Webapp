import { Box, Button, Center, Flex } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { registerAnalyticsAction } from '../../data/AnalyticsFunctions';
import {
  AbstractNodeData,
  ActualAbstractDataType,
  OpenCloseNodeAction,
  Platform,
  PolyglotNodeValidation,
  ZoneId,
} from '../../types/polyglotElements';
import HeadingSubtitle from '../CostumTypography/HeadingSubtitle';
import HeadingTitle from '../CostumTypography/HeadingTitle';
import PlanLesson from '../Modals/PlanLesson';
import CloseEndedTool from './closeEndedQuestion';
import MultichoiceTool from './multichoiceQuestion';
import OpenQuestionTool from './openQuestion';
import TrueFalseTool from './trueFalse';

type LibraryToolProps = {
  isOpen: boolean;
  actualActivity: PolyglotNodeValidation | undefined;
  setUnlock: Dispatch<SetStateAction<boolean>>;
  setSatisfiedConditions: Dispatch<SetStateAction<string[]>>;
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
  const nextNodeId = actualActivity?.validation[0]
    ? actualActivity?.validation[0].id
    : '';
  const [actualData, setActualData] = useState<ActualAbstractDataType>();
  const [generatedLesson, setGenLesson] = useState<ActualAbstractDataType[]>(
    []
  );
  const [showNextButtonLibrary, setShowNextButtonLibrary] = useState(false);
  const [unlockLibrary, setUnlockLibrary] = useState(false);
  const [completedExecution, setCompletedExecution] = useState(false);
  const [conditionsLibrary, setConditionsLibrary] = useState<string[]>([]);
  const [planLessonOpen, setPlanLessonOpen] = useState(false);
  const [counter, setCounter] = useState(0);
  const [counterPos, setCounterPos] = useState(0);

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
        platform: 'Library',
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
    if (!unlockLibrary) return;
    setPlanLessonOpen(false);
    if (counter == 0 && generatedLesson.length != 0 && !actualData) {
      //first set Data
      setActualData(generatedLesson[counter]);
    }
  }, [unlockLibrary]);

  useEffect(() => {
    if (planLessonOpen) return;

    if (!actualData) {
      setActualData(generatedLesson[0]);
    }
  }, [planLessonOpen]);

  useEffect(() => {
    if (counter == 0) return;
    console.log(counter + ' points: ' + counterPos);
    if (counter >= generatedLesson.length) {
      setShowNextButtonLibrary(false);
      setUnlockLibrary(false);
      setCompletedExecution(true);
      return;
    }
    setActualData(generatedLesson[counter]);
    setUnlockLibrary(false);
  }, [counter]);

  useEffect(() => {
    setGenLesson([]);
    setActualData(undefined);
    if (!isOpen) return;

    if (!abstractData) return;
    if (actualActivity?.type != 'abstractNode') return;
    try {
      if (userId && actualActivity?._id) {
        if (lastAction == 'open_node') return;
        setLastAction('open_node');
        registerAnalyticsAction({
          timestamp: new Date(),
          userId: userId,
          actionType: 'open_node',
          zoneId: ZoneId.FreeZone,
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
          zoneId: ZoneId.FreeZone,
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
    setPlanLessonOpen(true);
  }, [actualActivity]);

  if (
    !actualActivity?.data.sourceMaterial ||
    actualActivity?.data.sourceMaterial == '' ||
    actualActivity?.data.topicsAI.length == 0
  ) {
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
          <Button
            title={'Click to skip the activity'}
            left={'45%'}
            top={'20px'}
            position={'relative'}
            color={'#0890d3'}
            border={'2px solid'}
            borderColor={'#0890d3'}
            borderRadius={'8px'}
            _hover={{
              transform: 'scale(1.05)',
              transition: 'all 0.2s ease-in-out',
            }}
            _disabled={{
              cursor: 'not-allowed',
              opacity: 0.4,
            }}
            onClick={() => {
              setUnlock(true);
              setShowNextButton(true);
              if (actualActivity) setSatisfiedConditions([nextNodeId]);
            }}
          >
            Skip Activity
          </Button>
        </Box>
      </>
    );
  }

  return (
    <Box width={'90%'}>
      <HeadingTitle>Library Tool</HeadingTitle>
      <HeadingSubtitle>
        {!generatedLesson
          ? 'Create your lesson plan to reach the learning objective.'
          : 'Execute your custom lesson plan.'}
      </HeadingSubtitle>
      <br />
      <PlanLesson
        isOpen={planLessonOpen}
        abstractData={abstractData}
        addGeneratedData={addGeneratedActivity}
        generatedLesson={generatedLesson}
        setUnlockLibrary={setUnlockLibrary}
      />
      <Box width="100%">
        <Center>
          <MultichoiceTool
            isOpen={
              actualData != undefined &&
              actualData?.type == 'multipleChoiceQuestionNode'
            }
            actualActivity={actualData && actualData.data}
            setUnlock={setUnlockLibrary}
            setSatisfiedConditions={setConditionsLibrary}
            setShowNextButton={setShowNextButtonLibrary}
            userId={userId}
            flowId={flowId}
            lastAction={lastAction}
            setLastAction={setLastAction}
          />
          <CloseEndedTool
            isOpen={
              actualData != undefined &&
              actualData?.type == 'closeEndedQuestionNode'
            }
            actualActivity={actualData && actualData.data}
            setUnlock={setUnlockLibrary}
            setSatisfiedConditions={setConditionsLibrary}
            setShowNextButton={setShowNextButtonLibrary}
            userId={userId}
            flowId={flowId}
            lastAction={lastAction}
            setLastAction={setLastAction}
          />
          <TrueFalseTool
            isOpen={
              actualData != undefined && actualData?.type == 'TrueFalseNode'
            }
            actualActivity={actualData && actualData.data}
            setUnlock={setUnlockLibrary}
            setSatisfiedConditions={setConditionsLibrary}
            setShowNextButton={setShowNextButtonLibrary}
            userId={userId}
            flowId={flowId}
            lastAction={lastAction}
            setLastAction={setLastAction}
          />
          <OpenQuestionTool
            isOpen={
              actualData != undefined && actualData?.type == 'OpenQuestionNode'
            }
            actualActivity={actualData && actualData.data}
            setUnlock={setUnlockLibrary}
            setSatisfiedConditions={setConditionsLibrary}
            setShowNextButton={setShowNextButtonLibrary}
            userId={userId}
            flowId={flowId}
            lastAction={lastAction}
            setLastAction={setLastAction}
          />
        </Center>
      </Box>
      <Button
        isDisabled={!unlockLibrary}
        hidden={!showNextButtonLibrary || generatedLesson.length == 0}
        title={unlockLibrary ? 'Click to continue' : 'Complete the assessment'}
        position={'relative'}
        color={'#0890d3'}
        border={'2px solid'}
        borderColor={'#0890d3'}
        borderRadius={'8px'}
        _hover={{
          transform: 'scale(1.05)',
          transition: 'all 0.2s ease-in-out',
        }}
        _disabled={{
          cursor: 'not-allowed',
          opacity: 0.4,
        }}
        onClick={() => {
          if (conditionsLibrary[0] == 'pass') {
            setCounterPos(counterPos + 1);
          }
          setCounter(counter + 1);
        }}
      >
        Next
      </Button>
      <Button
        top={'20px'}
        hidden={generatedLesson.length != 0 && !completedExecution}
        position={'relative'}
        color={'#0890d3'}
        border={'2px solid'}
        borderColor={'#0890d3'}
        borderRadius={'8px'}
        onClick={() => {
          setUnlock(true);
          setShowNextButton(true);
          if (actualActivity) setSatisfiedConditions([nextNodeId]);
        }}
      >
        Complete Execution
      </Button>
    </Box>
  );
};

export default LibraryTool;
