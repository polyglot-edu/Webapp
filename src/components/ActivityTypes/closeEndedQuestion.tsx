import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Icon, Textarea, useToast } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { registerAnalyticsAction } from '../../data/AnalyticsFunctions';
import { API } from '../../data/api';
import {
  OpenCloseNodeAction,
  Platform,
  PolyglotNodeValidation,
  SubmitAction,
  ZoneId,
} from '../../types/polyglotElements';
import FlexText from '../CostumTypography/FlexText';
import HeadingSubtitle from '../CostumTypography/HeadingSubtitle';
import HeadingTitle from '../CostumTypography/HeadingTitle';

type CloseEndedToolProps = {
  isOpen: boolean;
  actualActivity: PolyglotNodeValidation | undefined;
  unlock: Dispatch<SetStateAction<boolean>>;
  setSatisfiedConditions: Dispatch<SetStateAction<string[]>>;
  showNextButton: boolean;
  setShowNextButton: Dispatch<SetStateAction<boolean>>;
  userId: string;
  flowId: string;
  lastAction: string;
  setLastAction: Dispatch<SetStateAction<string>>;
};

type CloseEndedData = {
  question: string;
  textToFill?: string;
  correctAnswers: string[];
  isAnswerCorrect: boolean;
};

const CloseEndedTool = ({
  isOpen,
  actualActivity,
  unlock,
  setSatisfiedConditions,
  showNextButton,
  setShowNextButton,
  userId,
  lastAction,
  setLastAction,
  flowId,
}: CloseEndedToolProps) => {
  const [disable, setDisable] = useState(false);
  const [assessment, setAssessment] = useState<string>();
  const data = actualActivity?.data as CloseEndedData;
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (actualActivity?.type != 'closeEndedQuestionNode') return;
    if (!data) return;
    setDisable(false);
    setAssessment('');
    //to move in validation button

    if (!isOpen) return;
    try {
      if (userId && actualActivity?._id) {
        if (lastAction == 'open_node') return;
        setLastAction('open_node');

        registerAnalyticsAction({
          timestamp: new Date(),
          userId: userId,
          actionType: 'open_node',
          zoneId: ZoneId.WebAppZone,
          platform: Platform.WebApp,
          action: {
            flowId: flowId,
            nodeId: actualActivity?._id,
            activity: actualActivity.type,
          },
        } as OpenCloseNodeAction);
      }
    } catch (e) {
      console.log(e);
    }
  }, [actualActivity]);

  const toast = useToast();
  if (!isOpen) return <></>;

  return (
    <Box
      width={'80%'}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <HeadingTitle>Close Ended Activity</HeadingTitle>
      <HeadingSubtitle>
        Complete then sentence or answer the question with a closed answer.
      </HeadingSubtitle>
      <br />
      <FlexText>{data.question}</FlexText>
      <Flex paddingTop={'20px'} width={'90%'} alignItems={'center'}>
        <Textarea
          placeholder="Write your answer here"
          textAlign="center"
          size="lg"
          isDisabled={disable}
          value={
            disable && !data.isAnswerCorrect ? inputValue : assessment || ''
          }
          onChange={(event) => setAssessment(event.currentTarget.value)}
          bg="gray.100"
          _hover={{ bg: 'gray.200' }}
          focusBorderColor="blue.400"
        />
        {disable && (
          <Box ml={'10px'}>
            <Icon
              mr="10px"
              as={data.isAnswerCorrect ? CheckIcon : CloseIcon}
              color={data.isAnswerCorrect ? 'green' : 'red'}
            />
          </Box>
        )}
      </Flex>
      <Button
        top={'20px'}
        hidden={showNextButton}
        position={'relative'}
        color={'#0890d3'}
        border={'2px solid'}
        borderColor={'#0890d3'}
        borderRadius={'8px'}
        _hover={{
          transform: 'scale(1.05)',
          transition: 'all 0.2s ease-in-out',
        }}
        onClick={() => {
          console.log(assessment);
          if (!assessment) {
            toast({
              title: 'Validation error',
              description:
                'You need to insert an asnwer to validate the assessment',
              status: 'error',
              duration: 3000,
              position: 'bottom-left',
              isClosable: true,
            });

            return;
          }
          unlock(true);
          setDisable(true);
          const edgesId: string[] =
            actualActivity?.validation
              .map((edge) => {
                if (
                  data.correctAnswers.find((value) => value == assessment) &&
                  edge.data.conditionKind == 'pass'
                ) {
                  data.isAnswerCorrect = true;
                  return edge.id;
                } else if (
                  !data.correctAnswers.find((value) => value == assessment) &&
                  edge.data.conditionKind == 'fail'
                ) {
                  data.isAnswerCorrect = false;
                  setInputValue('Correct answer: ' + data.correctAnswers[0]);
                  return edge.id;
                }
                return 'undefined';
              })
              .filter((edge) => edge !== 'undefined') ?? [];
          if (edgesId) {
            setSatisfiedConditions(edgesId);
            const result = actualActivity?.validation.find((edge) =>
              edgesId.includes(edge.id)
            )?.data.conditionKind as string;
            console.log(result);
            registerAnalyticsAction({
              timestamp: new Date(),
              userId: userId,
              actionType: 'submit_answer',
              zoneId: ZoneId.WebAppZone,
              platform: Platform.WebApp,
              action: {
                //miss other values
                flowId: flowId,
                nodeId: actualActivity?._id,
                exerciseType: actualActivity?.type,
                answer: assessment,
                result: result,
              },
            } as SubmitAction);
          }
          setShowNextButton(true);
        }}
      >
        Validate
      </Button>
    </Box>
  );
};

export default CloseEndedTool;
