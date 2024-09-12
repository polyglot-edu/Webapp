import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
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
import { PolyglotNodeValidation } from '../../types/polyglotElements';
type MultichoiceToolProps = {
  isOpen: boolean;
  actualActivity: PolyglotNodeValidation | undefined;
  unlock: Dispatch<SetStateAction<boolean>>;
  setSatisfiedConditions: Dispatch<SetStateAction<string[]>>;
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
}: MultichoiceToolProps) => {
  const [disable, setDisable] = useState(false);
  const data = actualActivity?.data as MultichoiceQuestionData;
  const [checkBoxValue, setCheckBoxValue] = useState<string>();
  const handleChange = useCallback((value: string) => {
    setCheckBoxValue(value);
    console.log(checkBoxValue);
  }, []);

  useEffect(() => {
    if (!data) return;
    setDisable(false);
    setCheckBoxValue('');
    //to move in validation button
  }, [actualActivity]);

  const toast = useToast();
  if (!isOpen) return <></>;
  console.log('multichoice activity');
  return (
    <Box
      mr="5px"
      width={'80%'}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Heading size={'2xl'}>Multiple choice Question Activity</Heading>
      <Heading size={'md'} paddingTop={'20px'}>
        Answer the question choosing between the given choices
      </Heading>
      <br />
      <Flex paddingTop={'10px'}>{data.question}</Flex>
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
        top={'10px'}
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
                else if (edge.data.conditionKind == 'fail') return edge.id;
                return 'undefined';
              })
              .filter((edge) => edge !== 'undefined') ?? [];

          if (edgesId) setSatisfiedConditions(edgesId);
        }}
      >
        Validate
      </Button>
    </Box>
  );
};

export default MultichoiceTool;
