import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { Box, Button, Checkbox, CheckboxGroup, Flex, Icon, Stack, useToast } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { PolyglotNodeValidation } from '../../types/polyglotElements';
import HeadingTitle from '../CostumTypography/HeadingTitle';
import HeadingSubtitle from '../CostumTypography/HeadingSubtitle';
import FlexText from '../CostumTypography/FlexText';
type TrueFalseToolProps = {
  isOpen: boolean;
  actualActivity: PolyglotNodeValidation | undefined;
  unlock: Dispatch<SetStateAction<boolean>>;
  setSatisfiedConditions: Dispatch<SetStateAction<string[]>>;
  showNextButton: boolean;
  setShowNextButton: Dispatch<SetStateAction<boolean>>;
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
  unlock,
  setSatisfiedConditions,
  showNextButton,
  setShowNextButton,
}: TrueFalseToolProps) => {
  const [disable, setDisable] = useState(false);
  const data = actualActivity?.data as TrueFalseData;
  const [checkBoxValue, setCheckBoxValue] = useState<boolean[]>([]);

  useEffect(() => {
    if (!data) return;
    setDisable(false);
    const max = data.questions?.length;
    const setup: boolean[] = [];
    for (let i = 0; i < max; i++) setup.push(false);
    setCheckBoxValue(setup);
    //to move in validation button
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
      <HeadingSubtitle>Answer each question choosing between true or false</HeadingSubtitle>
      <br />
      <FlexText>{data.instructions}</FlexText>
      <Flex paddingTop={'20px'}>
        <CheckboxGroup isDisabled={disable}>
          <Stack>
            {data.questions.map((question, index) => {
              return (
                <>
                  <Checkbox
                    value={question}
                    icon={
                      checkBoxValue[index] ? (
                        <CheckIcon
                          scale={'2'}
                          backgroundColor={'green'}
                          borderRadius={'3px'}
                        />
                      ) : (
                        <>
                          <CloseIcon
                            backgroundColor={'red'}
                            borderRadius={'3px'}
                          />
                        </>
                      )
                    }
                    onChange={(event) => {
                      if (event.target.checked) {
                        const setup = checkBoxValue.map((c, i) => {
                          if (i == index) return true;
                          return c;
                        });
                        setCheckBoxValue(setup);
                      } else {
                        const setup = checkBoxValue.map((c, i) => {
                          if (i == index) return false;
                          return c;
                        });
                        setCheckBoxValue(setup);
                      }
                    }}
                  >
                    {' '}
                    {question}
                    <Box paddingLeft="10px" float="right" hidden={!disable}>
                      <Icon
                        as={
                          data.isQuestionCorrect[index] ? CheckIcon : CloseIcon
                        }
                        color={data.isQuestionCorrect[index] ? 'green' : 'red'}
                      />
                    </Box>
                  </Checkbox>
                </>
              );
            })}
          </Stack>
        </CheckboxGroup>
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
          console.log(checkBoxValue);
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
          let total = 0.0;
          checkBoxValue.map((value, index) => {
            if (value == data.isQuestionCorrect[index]) total++;
          });
          const edgesId =
            actualActivity?.validation
              .map((edge) => {
                if (
                  checkBoxValue.length / 2 < total &&
                  edge.data.conditionKind == 'pass'
                )
                  return edge.id;
                else if (
                  checkBoxValue.length / 2 > total &&
                  edge.data.conditionKind == 'fail'
                )
                  return edge.id;
                return 'undefined';
              })
              .filter((edge) => edge !== 'undefined') ?? [];

          if (edgesId) setSatisfiedConditions(edgesId);
          setShowNextButton(true);
        }}
      >
        Validate
      </Button>
    </Box>
  );
};

export default TrueFalseTool;
