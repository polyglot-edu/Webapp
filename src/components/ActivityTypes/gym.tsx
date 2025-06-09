import {
  Box,
  Button,
  Center,
  Checkbox,
  Collapse,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { registerAnalyticsAction } from '../../data/AnalyticsFunctions';
import { API } from '../../data/api';
import {
  AbstractNodeData,
  ActualAbstractDataType,
  AnalyticsActionBody,
  AnalyzedMaterial,
  EducationLevel,
  LearningOutcome,
  OpenCloseNodeAction,
  OpenCloseTool,
  Platform,
  PolyglotNodeValidation,
  Topic,
  ZoneId,
} from '../../types/polyglotElements';
import HeadingSubtitle from '../CostumTypography/HeadingSubtitle';
import HeadingTitle from '../CostumTypography/HeadingTitle';
import PlanLesson from '../Modals/PlanLesson';
import CloseEndedTool from './closeEndedQuestion';
import MultichoiceTool from './multichoiceQuestion';
import OpenQuestionTool from './openQuestion';
import TrueFalseTool from './trueFalse';

type GymToolProps = {
  setUnlock: Dispatch<SetStateAction<boolean>>;
  setSatisfiedConditions: Dispatch<SetStateAction<string[]>>;
  setShowNextButton: Dispatch<SetStateAction<boolean>>;
  userId: string;
  flowId: string;
  lastAction: string;
  setLastAction: Dispatch<SetStateAction<string>>;
};
type GymDataType = {
  title: string;
  macro_subject: string;
  education_level: EducationLevel;
  learning_outcome: LearningOutcome;
  language: string;
  keywords: string[];
  prerequisites: string[];
  estimated_duration: number;
  context: string;
  topicsAI: Topic[];
  sourceMaterial: string;
};

const GymTool = ({
  setUnlock,
  userId,
  flowId,
  lastAction,
  setLastAction,
}: GymToolProps) => {
  const [gymData, setGymData] = useState<GymDataType>();
  const [actualData, setActualData] = useState<ActualAbstractDataType>();
  const [generatedLesson, setGenLesson] = useState<ActualAbstractDataType[]>(
    []
  );
  const [showNextButtonLibrary, setShowNextButtonLibrary] = useState(false);
  const [unlockGym, setUnlockGym] = useState(false);
  const [completedExecution, setCompletedExecution] = useState(false);
  const [conditionsLibrary, setConditionsLibrary] = useState<string[]>([]);
  const [analyseMaterialOpen, setAnalyseMaterialOpen] = useState(false);
  const [generatingLoading, setGeneratingLoading] = useState(false);
  const [sourceMaterial, setSourceMaterial] = useState('');
  const [context, setContext] = useState('');
  const [planLessonOpen, setPlanLessonOpen] = useState(false);
  const [counter, setCounter] = useState(0);
  const [counterPos, setCounterPos] = useState(0);

  const toast = useToast();

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
    setAnalyseMaterialOpen(true);
  }, []);

  useEffect(() => {
    console.log('unlock gym');
    if (!unlockGym) return;
    setPlanLessonOpen(false);
    if (counter == 0 && generatedLesson.length != 0 && !actualData) {
      console.log(generatedLesson);
      //first set Data
      setActualData(generatedLesson[counter]);
    }
  }, [unlockGym]);

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
      setUnlockGym(false);
      setCompletedExecution(true);
      return;
    }
    setActualData(generatedLesson[counter]);
    setUnlockGym(false);
  }, [counter]);

  useEffect(() => {
    setGenLesson([]);
    setActualData(undefined);

    if (!gymData) return;
    try {
      if (userId) {
        setLastAction('gym_tool');
        registerAnalyticsAction({
          timestamp: new Date(),
          userId: userId,
          actionType: 'gym_tool',
          zoneId: ZoneId.FreeZone,
          platform: Platform.WebApp,
          action: undefined,
        } as AnalyticsActionBody);
      }
    } catch (e) {
      console.log(e);
    }
    setAnalyseMaterialOpen(false);
    setPlanLessonOpen(true);
  }, [gymData]);

  return (
    <Box width={'90%'}>
      <HeadingTitle>Gym Tool</HeadingTitle>
      <HeadingSubtitle>
        {!generatedLesson
          ? 'Create your custom lesson plan to study your personal material.'
          : 'Execute your custom lesson plan.'}
      </HeadingSubtitle>
      <br />
      <Box hidden={!analyseMaterialOpen}>
        Do you want to generate your learning path?
        <Text>Submit your material in this box to use our analyser.</Text>
        <FormLabel mb={2} fontWeight={'bold'}>
          Your material:
        </FormLabel>
        <Textarea
          minHeight={'150px'}
          maxHeight={'350px'}
          placeholder="Insert your material here, you can put your plain text."
          value={sourceMaterial}
          overflowY={'auto'}
          onChange={(e) => {
            setGeneratingLoading(false);
            setSourceMaterial(e.currentTarget.value);
          }}
        />
        <FormLabel mb={2} fontWeight={'bold'}>
          Context (optional):
        </FormLabel>
        <Textarea
          maxHeight={'200px'}
          placeholder="Here, you can define the context of the learning path's application."
          value={context}
          overflowY={'auto'}
          onChange={(e) => {
            setGeneratingLoading(false);
            setContext(e.currentTarget.value);
          }}
        />
        <Button
          marginTop={'15px'}
          onClick={async () => {
            try {
              setGeneratingLoading(true);
              if (!sourceMaterial) {
                toast({
                  title: 'Material missing',
                  description:
                    'Please, insert your material before pressing analyse button.',
                  status: 'error',
                  duration: 3000,
                  position: 'bottom-left',
                  isClosable: true,
                });
                throw new Error('Missing sourceMaterial');
              }
              const response: AxiosResponse = await API.analyseMaterial({
                text: sourceMaterial,
              });
              const analysedMaterial = response.data as AnalyzedMaterial;
              setGymData({
                sourceMaterial: sourceMaterial,
                title: analysedMaterial.title,
                macro_subject: analysedMaterial.macro_subject,
                education_level: analysedMaterial.education_level,
                learning_outcome: analysedMaterial.learning_outcome,
                language: analysedMaterial.language,
                keywords: analysedMaterial.keywords,
                prerequisites: analysedMaterial.prerequisites,
                estimated_duration: analysedMaterial.estimated_duration,
                context: context,
                topicsAI: analysedMaterial.topics,
              });
            } catch (error: any) {
              console.log(error);
              if ((error as Error).name === 'SyntaxError') {
                toast({
                  title: 'Invalid syntax',
                  description: (error as Error).toString(),
                  status: 'error',
                  duration: 3000,
                  position: 'bottom-left',
                  isClosable: true,
                });
                return;
              }
              if (error.response)
                if (error.response.status) {
                  if (error.response.status == 500)
                    toast({
                      title: 'Material Error',
                      description:
                        'We are sorry, the resource is not analyzable, try with different material. Do not provide pages that are too long (e.g. Wikipedia pages) or too short, as they can not be analyzed correctly',
                      status: 'error',
                      duration: 5000,
                      position: 'bottom-left',
                      isClosable: true,
                    });
                  else if (error.response.status != 200)
                    toast({
                      title: 'AI API Error',
                      description:
                        'Internal Server error, try again. If the error persists try change material.',
                      status: 'error',
                      duration: 5000,
                      position: 'bottom-left',
                      isClosable: true,
                    });
                } else
                  toast({
                    title: 'Generic Error',
                    description: 'Try later ' + (error as Error),
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
            } finally {
              setGeneratingLoading(false);
            }
          }}
          isLoading={generatingLoading}
        >
          Analyse Material
        </Button>
      </Box>
      <PlanLesson
        isOpen={planLessonOpen}
        abstractData={gymData}
        addGeneratedData={addGeneratedActivity}
        generatedLesson={generatedLesson}
        setUnlockLibrary={setUnlockGym}
      />
      <Box width="100%">
        <Center>
          <MultichoiceTool
            isOpen={
              actualData != undefined &&
              actualData?.type == 'multipleChoiceQuestionNode'
            }
            actualActivity={actualData && actualData.data}
            setUnlock={setUnlockGym}
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
            setUnlock={setUnlockGym}
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
            setUnlock={setUnlockGym}
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
            setUnlock={setUnlockGym}
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
        isDisabled={!unlockGym}
        hidden={!showNextButtonLibrary || generatedLesson.length == 0}
        title={unlockGym ? 'Click to continue' : 'Complete the assessment'}
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
          console.log('complete execution');
        }}
      >
        Complete Execution
      </Button>
    </Box>
  );
};

export default GymTool;
