import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, Input, useToast } from '@chakra-ui/react';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { PolyglotNodeValidation } from '../../types/polyglotElements';
type CloseEndedToolProps = {
  isOpen: boolean;
  actualActivity: PolyglotNodeValidation | undefined;
  unlock: Dispatch<SetStateAction<boolean>>;
  setSatisfiedConditions: Dispatch<SetStateAction<string[]>>;
};

type CloseEndedData = {
  question: string;
  textToFill?: string;
  correctAnswers: string[];
};

const CloseEndedTool = ({
  isOpen,
  actualActivity,
  unlock,
  setSatisfiedConditions,
}: CloseEndedToolProps) => {
  const [disable, setDisable] = useState(false);
  const [assessment, setAssessment] = useState<string>();
  const data = actualActivity?.data as CloseEndedData;

  useEffect(() => {
    if (!data) return;
    setDisable(false);
    setAssessment('');
    //to move in validation button
  }, [actualActivity]);
  const toast = useToast();
  if (!isOpen) return <></>;
  console.log('close ended activity');
  return (
    <Box
      mr="5px"
      width={'80%'}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Heading size={'2xl'}>Close Ended Activity</Heading>
      <Heading size={'md'} paddingTop={'20px'}>
        Complete then sentence or answer the question with a closed answer.
      </Heading>
      <br />
      <Flex paddingTop={'10px'}>{data.question}</Flex>
      <Flex paddingTop={'20px'}>
        <Input
          isDisabled={disable}
          onChange={async (event) => {
            setAssessment(event.currentTarget.value);
          }}
        ></Input>
      </Flex>
      <Button
        top={'10px'}
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
                )
                  return edge.id;
                else if (
                  !data.correctAnswers.find((value) => value == assessment) && edge.data.conditionKind == 'fail') return edge.id;
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

export default CloseEndedTool;
