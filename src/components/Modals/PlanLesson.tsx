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

export type ModaTemplateProps = {
  isOpen: boolean;
  action?: (i: boolean) => void;
  abstractData: any;
  setUnlockLibrary: (i: true) => void;
  addGeneratedData: (body: { type: string; data: any }) => void;
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

  const updateNodeAt = (id: number, updatedNode: PlanLessonNode) => {
    if (!AINodes) return;

    const updatedNodes = AINodes.nodes.map((node, index) =>
      index === id ? updatedNode : node
    );

    setAINodes({
      ...AINodes,
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
              {AINodes?.nodes.map((node, id) => {
                const suggestedType = node.type;
                return (
                  <PlanLessonCard
                    planNode={node}
                    key={id}
                    id={id}
                    setSelectedNode={handleToggleNode}
                    isSelected={selectedNodeIds.includes(id)}
                    updateNodeAt={updateNodeAt}
                    suggestedType={suggestedType}
                  />
                );
              })}
            </Box>
          </FormControl>
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
                const selectedNodes = AINodes?.nodes
                  .map((aiNode, index) => {
                    if (selectedNodeIds.includes(index)) return aiNode;
                  })
                  .filter((node) => node != undefined);
                if (!selectedNodes || !selectedNodes[0]) {
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
                let counter = 0;
                do {
                  try {
                    counter = counter + 1;
                    const activity = selectedNodes.shift();
                    if (!activity) break;
                    await API.generateNewExercise({
                      macro_subject: activity?.learning_outcome,
                      topic: activity.topic,
                      education_level: abstractData.education_level,
                      learning_outcome: activity.learning_outcome,
                      material: abstractData.sourceMaterial,
                      solutions_number: activity.data?.solutions_number || 0,
                      distractors_number:
                        activity.data?.distractors_number || 0,
                      easily_discardable_distractors_number:
                        activity.data?.easily_discardable_distractors_number ||
                        0,
                      type: activity.type,
                      language: abstractData.language,
                      model: 'Gemini',
                    }).then((response) => {
                      const exerciseResponse: AIExerciseGenerated =
                        response.data;
                      const typeNode =
                        QuestionTypeMap.find(
                          (type) => type.key == exerciseResponse.type
                        )?.nodeType || 'OpenQuestionNode';
                      const data =
                        dataFactory[typeNode]?.(exerciseResponse) || null;

                      addGeneratedData({
                        type: typeNode,
                        data: data,
                      });
                    });
                  } catch (error) {
                    console.log(error);
                  }
                } while (counter < selectedNodeIds.length);
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
