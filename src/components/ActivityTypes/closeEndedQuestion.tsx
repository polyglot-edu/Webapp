import { Box, Button, Flex, Input, useToast } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { PolyglotNodeValidation } from '../../types/polyglotElements';
import HeadingTitle from '../CostumTypography/HeadingTitle';
import HeadingSubtitle from '../CostumTypography/HeadingSubtitle';
import FlexText from '../CostumTypography/FlexText';

type CloseEndedToolProps = {
  isOpen: boolean;
  actualActivity: PolyglotNodeValidation | undefined;
  unlock: Dispatch<SetStateAction<boolean>>;
  setSatisfiedConditions: Dispatch<SetStateAction<string[]>>;
  showNextButton: boolean;
  setShowNextButton: Dispatch<SetStateAction<boolean>>;
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
  showNextButton,
  setShowNextButton,
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
      width={'80%'}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <HeadingTitle>Close Ended Activity</HeadingTitle>
      <HeadingSubtitle>Complete then sentence or answer the question with a closed answer.</HeadingSubtitle>
      <br />
      <FlexText>{data.question}</FlexText>
      <Flex paddingTop={'20px'} width={"70%"}>
        <Input
          placeholder="Write your answer here"
          textAlign="center" 
          size="lg"
          isDisabled={disable}
          value={assessment || ''}
          onChange={(event) => setAssessment(event.currentTarget.value)}
          bg="gray.100"
          _hover={{ bg: 'gray.200' }}
          focusBorderColor="blue.400"
        />
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
                )
                  return edge.id;
                else if (
                  !data.correctAnswers.find((value) => value == assessment) &&
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

export default CloseEndedTool;
