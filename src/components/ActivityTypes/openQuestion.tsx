import { Box, Button, Flex, Textarea, useToast } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { PolyglotNodeValidation } from '../../types/polyglotElements';
import HeadingTitle from '../CostumTypography/HeadingTitle';
import HeadingSubtitle from '../CostumTypography/HeadingSubtitle';
import FlexText from '../CostumTypography/FlexText';

type OpenQuestionToolProps = {
  isOpen: boolean;
  actualActivity: PolyglotNodeValidation | undefined;
  unlock: Dispatch<SetStateAction<boolean>>;
  setSatisfiedConditions: Dispatch<SetStateAction<string[]>>;
  showNextButton: boolean;
  setShowNextButton: Dispatch<SetStateAction<boolean>>;
};

type OpenQuestionData = {
  question: string;
  textToFill?: string;
  correctAnswers: string[];
};

const OpenQuestionTool = ({
  isOpen,
  actualActivity,
  unlock,
  setSatisfiedConditions,
  showNextButton,
  setShowNextButton,
}: OpenQuestionToolProps) => {
  const [disable, setDisable] = useState(false);
  const [assessment, setAssessment] = useState<string>();
  const data = actualActivity?.data as OpenQuestionData;

  useEffect(() => {
    if (!data) return;
    setDisable(false);
    setAssessment('');
    //to move in validation button
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
      <HeadingSubtitle>Answer the question with a open answer.</HeadingSubtitle>
      <br />
      <FlexText>{data.question}</FlexText>
      <Flex paddingTop={'20px'} width={"90%"} alignItems={"center"}>
        <Textarea
          placeholder="Write your answer here"
          textAlign="center" 
          size="lg"
          isDisabled={disable}
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
        onClick={ () => {
          console.log(assessment);
          if (!assessment) {
            toast({
              title: 'Validation error',
              description: 'You need to insert an asnwer to validate the assessment',
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
          actualActivity?.validation.map((edge) => {
            if ( edge.data.conditionKind == 'pass' )
              return edge.id;
            else if ( edge.data.conditionKind == 'fail' )
              return edge.id;
            return 'undefined';
          }).filter((edge) => edge !== 'undefined') ?? [];
          if (edgesId) setSatisfiedConditions(edgesId);
          setShowNextButton(true);
        }}
      >
        Validate
      </Button>
    </Box>
  );
};

export default OpenQuestionTool;
