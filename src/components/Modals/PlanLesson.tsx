import {
  Box,
  Button,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { API } from '../../data/api';
import { ActualAbstractDataType } from '../../types/polyglotElements';
import {
  AIExerciseGenerated,
  AIPlanLessonResponse,
  PlanLessonNode,
  QuestionTypeMap,
} from '../../types/polyglotElements/AIGenerativeTypes/AIGenerativeTypes';
import PlanLessonCard from '../Card/PlanLessonCard';
import ProgressBar from '../UtilityComponents/ProgressBar';

export type ModaTemplateProps = {
  isOpen: boolean;
  action?: (i: boolean) => void;
  abstractData: any;
  setUnlockLibrary: (i: true) => void;
  addGeneratedData: (body: { type: string; data: any; topic?: string }) => void;
  generatedLesson: ActualAbstractDataType[];
};

function shuffleArray<T>(array: T[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const dataFactory: Record<string, (values: AIExerciseGenerated) => any> = {
  OpenQuestionNode: (values) => ({
    question: values.assignment,
    material: values.material,
    aiQuestion: false,
    possibleAnswer: values.solutions[0],
  }),
  closeEndedQuestionNode: (values) => ({
    question: values.assignment + ' ' + values.plus,
    correctAnswers: values.solutions,
    isAnswerCorrect: [],
  }),
  TrueFalseNode: (values) => {
    const solutions = values.solutions.map((s) => {
      const splitIndex = s.indexOf('. ');
      return splitIndex !== -1 ? s.slice(splitIndex + 2) : s;
    });
    const answers = [
      ...solutions,
      ...values.distractors,
      ...values.easily_discardable_distractors,
    ].filter((statement) => statement !== 'empty');
    const shuffleAnswers = shuffleArray(answers);

    const isAnswerCorrect = new Array(shuffleAnswers.length).fill(false);
    shuffleAnswers.forEach((value, index) => {
      if (values.solutions.includes(value)) isAnswerCorrect[index] = true;
    });
    return {
      instructions: values.assignment,
      questions: shuffleAnswers,
      isQuestionCorrect: isAnswerCorrect,
    };
  },
  multipleChoiceQuestionNode: (values) => {
    const answers = [
      ...values.solutions,
      ...values.distractors,
      ...values.easily_discardable_distractors,
    ].filter((statement) => statement !== 'empty');
    const shuffleAnswers = shuffleArray(answers);

    const isAnswerCorrect = new Array(shuffleAnswers.length).fill(false);
    shuffleAnswers.forEach((value, index) => {
      if (values.solutions.includes(value)) isAnswerCorrect[index] = true;
    });
    return {
      question: values.assignment,
      choices: shuffleAnswers,
      isChoiceCorrect: isAnswerCorrect,
    };
  },
};

const PlanLesson = ({
  isOpen,
  abstractData,
  addGeneratedData,
  setUnlockLibrary,
  generatedLesson,
}: ModaTemplateProps) => {
  const [generatingLoading, setGeneratingLoading] = useState(true);
  const [AINodes, setAINodes] = useState<AIPlanLessonResponse>();
  const [selectedNodes, setSelectedNodes] = useState<AIPlanLessonResponse>();
  const [selectedNodeIds, setSelectedNodeIds] = useState<number[]>([]);
  const toast = useToast();

  //function for lessonNode handler
  const handleToggleNode = (id: number) => {
    setSelectedNodeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (!isOpen) return;
    API.planLesson({
      topics: abstractData.topicsAI,
      learning_outcome: abstractData.learning_outcome,
      language: abstractData.language,
      macro_subject: abstractData.macro_subject,
      title: abstractData.title,
      education_level: abstractData.education_level,
      context: abstractData?.context || '',
      model: 'Gemini',
    }).then((response) => {
      setAINodes(response.data);
      setAINodes(response.data);
      const data: AIPlanLessonResponse = response.data;
      const updatedNodes: PlanLessonNode[] = data.nodes.map((node) => {
        const isIntegrated = QuestionTypeMap.find(
          (qType) => qType.integrated && qType.key === node.type
        );

        return {
          type: isIntegrated ? node.type : 'open question',
          topic: node.topic,
          details: node.details,
          learning_outcome: node.learning_outcome,
          duration: node.duration,
          data: node.data,
        };
      });

      setSelectedNodes({
        ...data,
        nodes: updatedNodes,
      });
      setGeneratingLoading(false);
    });
  }, [isOpen]);

  useEffect(() => {
    if (generatedLesson.length != 0)
      if (generatedLesson.length == selectedNodeIds.length) {
        toast({
          title: 'Lesson planned',
          description:
            'Lesson generation completed, you will shortly start the execution.',
          status: 'success',
          duration: 3000,
          position: 'bottom-left',
          isClosable: true,
        });
      }
  }, [generatedLesson]);

  const updateNodeAt = async (id: number, updatedNode: PlanLessonNode) => {
    if (!selectedNodes) return;
    const updatedNodes = selectedNodes.nodes.map((node, index) =>
      index === id ? updatedNode : node
    );

    await setSelectedNodes({
      ...selectedNodes,
      nodes: updatedNodes,
    });
  };
  return (
    <Modal
      isOpen={isOpen}
      size={'2xl'}
      isCentered
      onClose={() => console.log('Plan Lesson closed')}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select your custom execution block</ModalHeader>
        <ModalBody>
          <FormControl label="Nodes">
            <Box display="flex" flexDirection="column">
              {AINodes &&
                selectedNodes &&
                selectedNodes?.nodes.map((node, id) => {
                  return (
                    <PlanLessonCard
                      plannedNode={AINodes.nodes[id]}
                      planNode={node}
                      key={id}
                      id={id}
                      setSelectedNode={handleToggleNode}
                      isSelected={selectedNodeIds.includes(id)}
                      updateNodeAt={updateNodeAt}
                    />
                  );
                })}
            </Box>
          </FormControl>
          <ProgressBar
            currentStep={generatedLesson.length}
            totalSteps={selectedNodeIds.length}
            isHidden={!generatingLoading && generatedLesson.length == 0}
            label="Activities generation"
          />
          <Button
            marginTop={'15px'}
            title={
              selectedNodeIds.length == 0
                ? 'Select activities before generation'
                : 'Generate the learning path'
            }
            isDisabled={selectedNodeIds.length == 0}
            onClick={async () => {
              setGeneratingLoading(true);
              try {
                const nodesToGenerate = selectedNodes?.nodes
                  .map((aiNode, index) => {
                    if (selectedNodeIds.includes(index)) return aiNode;
                  })
                  .filter((node) => node != undefined);
                if (!nodesToGenerate || !nodesToGenerate[0]) {
                  toast({
                    title: 'Missing activities',
                    description:
                      'Please, select at least one activity to start generating the learning path.',
                    status: 'error',
                    duration: 3000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                  throw new Error('Missing selectedNodes');
                }
                console.log('Starting node generation');
                for (let i = 0; i < nodesToGenerate.length; i++) {
                  const activity = nodesToGenerate[i];
                  if (!activity) break;
                  try {
                    let response: AxiosResponse | null = null;

                    try {
                      // Primo tentativo
                      response = await API.generateNewExercise({
                        macro_subject: activity?.learning_outcome,
                        topic: activity.topic,
                        education_level: abstractData.education_level,
                        learning_outcome: activity.learning_outcome,
                        material: abstractData.sourceMaterial,
                        solutions_number: activity.data?.solutions_number || 0,
                        distractors_number:
                          activity.data?.distractors_number || 0,
                        easily_discardable_distractors_number:
                          activity.data
                            ?.easily_discardable_distractors_number || 0,
                        type: activity.type,
                        language: abstractData.language,
                        model: 'Gemini',
                      });
                    } catch (err) {
                      console.warn('retry', err);

                      // Retry una volta
                      response = await API.generateNewExercise({
                        macro_subject: activity?.learning_outcome,
                        topic: activity.topic,
                        education_level: abstractData.education_level,
                        learning_outcome: activity.learning_outcome,
                        material: abstractData.sourceMaterial,
                        solutions_number: activity.data?.solutions_number || 0,
                        distractors_number:
                          activity.data?.distractors_number || 0,
                        easily_discardable_distractors_number:
                          activity.data
                            ?.easily_discardable_distractors_number || 0,
                        type: activity.type,
                        language: abstractData.language,
                        model: 'Gemini',
                      });
                    }

                    // Se uno dei due tentativi ha avuto successo
                    if (response) {
                      const exerciseResponse: AIExerciseGenerated =
                        response.data;
                      const typeNode =
                        QuestionTypeMap.find(
                          (type) => type.key == exerciseResponse.type
                        )?.nodeType || 'OpenQuestionNode';
                      const data =
                        dataFactory[typeNode]?.(exerciseResponse) || null;
                      const topicActivity = exerciseResponse.topic;
                      addGeneratedData({
                        type: typeNode,
                        data: data,
                        topic: topicActivity,
                      });
                    }
                  } catch (error) {
                    console.error('Error on generating exercise: ', error);
                  }
                }
                setUnlockLibrary(true);
              } catch (error) {
                console.log((error as Error).message);
              } finally {
                setGeneratingLoading(false);
              }
            }}
            isLoading={generatingLoading}
          >
            Generate Learning Path
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PlanLesson;
