import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  Box,
  Button,
  Flex,
  Icon,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { API } from '../../data/api';
import {
  OpenCloseNodeAction,
  Platform,
  PolyglotNodeValidation,
  SubmitAction,
  ZoneId,
} from '../../types/polyglotElements';

import { registerAnalyticsAction } from '../../data/AnalyticsFunctions';
import FlexText from '../CostumTypography/FlexText';
import HeadingSubtitle from '../CostumTypography/HeadingSubtitle';
import HeadingTitle from '../CostumTypography/HeadingTitle';

type OpenQuestionToolProps = {
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

type OpenQuestionData = {
  possibleAnswer: string;
  question: string;
  textToFill?: string;
  correctAnswers: string[];
  isAnswerCorrect: boolean;
};

const OpenQuestionTool = ({
  isOpen,
  actualActivity,
  setUnlock,
  setSatisfiedConditions,
  setShowNextButton,
  userId,
  flowId,
  lastAction,
  setLastAction,
}: OpenQuestionToolProps) => {
  const [isDisable, setDisable] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<string>();
  const data = actualActivity?.data as OpenQuestionData;
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (!data) return;
    setDisable(false);
    setAssessment('');
    //to move in validation button

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
            nodeId: actualActivity._id,
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
  console.log('open question activity');
  return (
    <Box
      width={'80%'}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <HeadingTitle>Open Question Activity</HeadingTitle>
      <HeadingSubtitle>
        Write a detailed answer in your own words.
      </HeadingSubtitle>
      <br />
      <FlexText>{data.question}</FlexText>
      <Flex paddingTop={'20px'} width={'90%'} alignItems={'center'}>
        <Textarea
          placeholder="Write your answer here"
          textAlign="center"
          size="lg"
          isDisabled={isDisable}
          //value={(disable && !data.isAnswerCorrect) ? inputValue : (assessment || '')}
          onChange={(event) => setAssessment(event.currentTarget.value)}
          bg="gray.100"
          _hover={{ bg: 'gray.200' }}
          focusBorderColor="blue.400"
        />
        {isDisable && (
          <Box ml={'10px'}>
            <Icon
              mr="10px"
              as={data.isAnswerCorrect ? CheckIcon : CloseIcon}
              color={data.isAnswerCorrect ? 'green' : 'red'}
            />
          </Box>
        )}
      </Flex>
      {isDisable && (
        <Flex hidden={data.isAnswerCorrect} paddingTop={'10px'} width={'90%'}>
          <Alert status="error" borderRadius={'8px'}>
            <AlertDescription>{inputValue}</AlertDescription>
          </Alert>
        </Flex>
      )}
      <Button
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
        onClick={async () => {
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
          setLoading(true);
          try {
            const evaluate: AxiosResponse = await API.corrector({
              question: data.question,
              expectedAnswer: data.possibleAnswer,
              answer: assessment,
              temperature: 0,
            });
            const edgesId: string[] =
              actualActivity?.validation
                .map((edge) => {
                  if (
                    evaluate.data.Correction == 'null' &&
                    edge.data.conditionKind == 'pass'
                  ) {
                    data.isAnswerCorrect = true;
                    return edge.id;
                  } else if (
                    evaluate.data.Correction != 'null' &&
                    edge.data.conditionKind == 'fail'
                  ) {
                    data.isAnswerCorrect = false;
                    setInputValue(evaluate.data.Correction);
                    return edge.id;
                  }
                  return 'undefined';
                })
                .filter((edge) => edge !== 'undefined') ?? [];
            setUnlock(true);
            setDisable(true);
            if (edgesId) {
              setSatisfiedConditions(edgesId);
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
                  result: data.isAnswerCorrect.toString(),
                },
              } as SubmitAction);
            }
            setLoading(false);
            setShowNextButton(true);
          } catch (err) {
            console.log(err);
            setDisable(true);
          }
        }}
        isLoading={isLoading}
        isDisabled={isDisable}
      >
        Validate
      </Button>
    </Box>
  );
};

export default OpenQuestionTool;
