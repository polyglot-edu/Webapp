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
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { registerAnalyticsAction } from '../../data/AnalyticsFunctions';
import {
  OpenCloseNodeAction,
  Platform,
  PolyglotNodeValidation,
  ZoneId,
} from '../../types/polyglotElements';
import FlexText from '../CostumTypography/FlexText';
import HeadingSubtitle from '../CostumTypography/HeadingSubtitle';
import HeadingTitle from '../CostumTypography/HeadingTitle';
type MultichoiceToolProps = {
  isOpen: boolean;
  actualActivity: PolyglotNodeValidation | undefined;
  unlock: Dispatch<SetStateAction<boolean>>;
  setSatisfiedConditions: Dispatch<SetStateAction<string[]>>;
  showNextButton: boolean;
  setShowNextButton: Dispatch<SetStateAction<boolean>>;
  userId: string;
  flowId: string;
};

type MultichoiceQuestionData = {
  question: string;
  choices: string[];
  isChoiceCorrect: boolean[];
};

const MultichoiceTool = ({
  isOpen,
  actualActivity,
  unlock,
  setSatisfiedConditions,
  showNextButton,
  setShowNextButton,
  userId,
  flowId,
}: MultichoiceToolProps) => {
  const [disable, setDisable] = useState(false);
  const [execute, setExecute] = useState(true);
  const data = actualActivity?.data as MultichoiceQuestionData;
  const [checkBoxValue, setCheckBoxValue] = useState<string>();
  const handleChange = useCallback((value: string) => {
    setCheckBoxValue(value);
    console.log(checkBoxValue);
  }, []);

  useEffect(() => {
    if (actualActivity?.type != 'multipleChoiceQuestionNode') return;
    if (!data) return;
    setDisable(false);
    setCheckBoxValue('');

    try {
      if (!isOpen) return;
      if (userId && actualActivity?._id) {
        if (!execute) return;
        setExecute(false); //debug to run only one time
        registerAnalyticsAction({
          timestamp: new Date(),
          userId: userId,
          actionType: 'open_node',
          zoneId: ZoneId.WebAppZone,
          platform: Platform.WebApp,
          action: {
            flowId: flowId,
            nodeId: actualActivity?._id,
            activity: 'ReadMaterial',
          },
        } as OpenCloseNodeAction);
        return () => {
          registerAnalyticsAction({
            timestamp: new Date(),
            userId: userId,
            actionType: 'close_node',
            zoneId: ZoneId.WebAppZone,
            platform: Platform.WebApp,
            action: {
              flowId: flowId,
              nodeId: actualActivity?._id,
              activity: 'ReadMaterial',
            },
          } as OpenCloseNodeAction);
        };
      }
    } catch (e) {
      console.log(e);
    }
  }, [actualActivity]);

  const toast = useToast();
  if (!isOpen) return <></>;
  console.log('multichoice activity');
  return (
    <Box
      width={'80%'}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <HeadingTitle>Multiple choice Question Activity</HeadingTitle>
      <HeadingSubtitle>
        Answer the question choosing between the given choices
      </HeadingSubtitle>
      <br />
      <FlexText>{data.question}</FlexText>
      <Flex paddingTop={'20px'}>
        <RadioGroup onChange={handleChange} isDisabled={disable}>
          <Stack>
            {data.choices.map((choice, index) => {
              return (
                <>
                  <Radio value={choice}>
                    {' '}
                    {choice}
                    <Box paddingLeft="10px" float="right" hidden={!disable}>
                      <Icon
                        as={data.isChoiceCorrect[index] ? CheckIcon : CloseIcon}
                        color={data.isChoiceCorrect[index] ? 'green' : 'red'}
                      />
                    </Box>
                  </Radio>
                </>
              );
            })}
          </Stack>
        </RadioGroup>
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
          if (!checkBoxValue) {
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
          const edgesId =
            actualActivity?.validation
              .map((edge) => {
                if (
                  data.isChoiceCorrect[
                    data.choices.findIndex((choice) => choice == checkBoxValue)
                  ] &&
                  edge.data.conditionKind == 'pass'
                )
                  return edge.id;
                else if (
                  !data.isChoiceCorrect[
                    data.choices.findIndex((choice) => choice == checkBoxValue)
                  ] &&
                  edge.data.conditionKind == 'fail'
                )
                  return edge.id;
                return 'undefined';
              })
              .filter((edge) => edge !== 'undefined') ?? [];
          console.log(edgesId);
          if (edgesId) setSatisfiedConditions(edgesId);
          setShowNextButton(true);
        }}
      >
        Validate
      </Button>
    </Box>
  );
};

export default MultichoiceTool;
