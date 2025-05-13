import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Icon,
  Radio,
  RadioGroup,
  Stack,
  useToast,
} from '@chakra-ui/react';
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

type TrueFalseToolProps = {
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

type TrueFalseData = {
  instructions: string;
  questions: string[];
  isQuestionCorrect: boolean[];
  negativePoints?: number;
  positvePoints?: number;
};

const TrueFalseTool = ({
  isOpen,
  actualActivity,
  setUnlock: unlock,
  setSatisfiedConditions,
  showNextButton,
  setShowNextButton,
  userId,
  lastAction,
  setLastAction,
  flowId,
}: TrueFalseToolProps) => {
  const [disable, setDisable] = useState(false);
  const data = actualActivity?.data as TrueFalseData;
  const [radioValue, setRadioValue] = useState<(string | null)[]>([]);

  useEffect(() => {
    if (actualActivity?.type != 'TrueFalseNode') return;
    console.log('open this shit');
    if (!data) return;
    setDisable(false);
    const max = data.questions?.length;
    const setup: string[] = [];
    for (let i = 0; i < max; i++) setup.push('true');
    setRadioValue(setup);
    //to move in validation button

    try {
      if (!isOpen) return;
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
  console.log('truefalse activity');
  return (
    <Box
      width={'80%'}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <HeadingTitle>True False Questions Activity</HeadingTitle>
      <HeadingSubtitle>
        Decide whether each statement is true or false.
      </HeadingSubtitle>
      <br />
      <FlexText>{data.instructions}</FlexText>
      <Flex paddingTop={'20px'} width="100%">
        <Stack width="100%">
          {data.questions.map((question, index) => {
            return (
              <Box key={index} padding="10px" borderBottom="1px solid #eee">
                <Flex alignItems="center" justifyContent="space-between">
                  <Box mr={'20px'} textAlign="left" width="100%">
                    {question}
                  </Box>
                  <RadioGroup
                    value={radioValue[index] ?? ''}
                    onChange={(value) => {
                      const updatedAnswers = [...radioValue];
                      updatedAnswers[index] = value;
                      setRadioValue(updatedAnswers);
                    }}
                    isDisabled={disable}
                    minWidth="max-content"
                  >
                    <Stack direction="row">
                      <Radio
                        value="true"
                        sx={{
                          _checked: { backgroundColor: '#0890d3' },
                          _hover: { backgroundColor: '#73c0f9' },
                        }}
                      >
                        True
                      </Radio>
                      <Radio
                        value="false"
                        sx={{
                          _checked: { backgroundColor: '#ffa700' },
                          _hover: { backgroundColor: '#ffcc70' },
                        }}
                      >
                        False
                      </Radio>
                    </Stack>
                  </RadioGroup>
                  {disable && (
                    <Box paddingLeft="10px" float="right">
                      <Icon
                        as={
                          (data.isQuestionCorrect[index] == true &&
                            radioValue[index] == 'true') ||
                          (data.isQuestionCorrect[index] == false &&
                            radioValue[index] == 'false')
                            ? CheckIcon
                            : CloseIcon
                        }
                        color={
                          (data.isQuestionCorrect[index] == true &&
                            radioValue[index] == 'true') ||
                          (data.isQuestionCorrect[index] == false &&
                            radioValue[index] == 'false')
                            ? 'green'
                            : 'red'
                        }
                      />
                    </Box>
                  )}
                </Flex>
              </Box>
            );
          })}
        </Stack>
      </Flex>
      <Button
        top={'20px'}
        hidden={showNextButton}
        position={'relative'}
        color={'#0890d3'}
        border={'2px solid'}
        borderColor={'#0890d3'}
        borderRadius={'8px'}
        onClick={() => {
          console.log(radioValue);
          if (radioValue.includes(null)) {
            toast({
              title: 'Validation error',
              description:
                'You need to select one choice to validate the assessment',
              status: 'error',
              duration: 3000,
              position: 'bottom-left',
              isClosable: true,
            });
            return;
          }
          unlock(true);
          setDisable(true);
          let total = 0.0;
          radioValue.forEach((answer, index) => {
            if (answer == (data.isQuestionCorrect[index] ? 'true' : 'false'))
              total++;
          });
          const edgesId =
            actualActivity?.validation
              .map((edge) => {
                if (
                  radioValue.length / 2 < total &&
                  edge.data.conditionKind == 'pass'
                )
                  return edge.id;
                else if (
                  radioValue.length / 2 >= total &&
                  edge.data.conditionKind == 'fail'
                )
                  return edge.id;
                return 'undefined';
              })
              .filter((edge) => edge !== 'undefined') ?? [];

          if (edgesId) {
            setSatisfiedConditions(edgesId);
            /*       
            const result = actualActivity?.validation.find((edge)=> edgesId.includes(edge.id))?.data.conditionKind as string;
            const answer = radioValue
            .map((str, index) => `${str}: ${booleans[index]}`)
            .join(", ");
            console.log(result);
          registerAnalyticsAction({
            timestamp: new Date(),
            userId: userId,
            actionType: 'submit_answer',
            zoneId: ZoneId.WebAppZone,
            platform: Platform.WebApp,
            action: {
            flowId: flowId,
            nodeId: actualActivity?._id,
            exerciseType:actualActivity?.type,
            answer: checkBoxValue,
            result: result,
        }} as SubmitAction)*/
          }
          setShowNextButton(true);
        }}
      >
        Validate
      </Button>
    </Box>
  );
};

export default TrueFalseTool;
