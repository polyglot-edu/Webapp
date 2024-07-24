import {
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    Flex,
    Heading,
    Icon,
    Input,
    Stack,
    useToast,
  } from '@chakra-ui/react';
  import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
  import { PolyglotNodeValidation } from '../../types/polyglotElements';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
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
    setSatisfiedConditions
  }: CloseEndedToolProps) => {
    const [disable, setDisable] = useState(false);
    const [assessment, setAssessment] = useState<string>();
    const data = actualActivity?.data as CloseEndedData;
    const [checkBoxValue, setCheckBoxValue]= useState<string[]>();
    const handleChange = useCallback(
        (value: string[]) => {
          setCheckBoxValue(value);
            console.log(checkBoxValue)
        },
        []
      )
    
    useEffect(() => {
      if (!data) return;
      //to move in validation button
    }, [actualActivity]);
    const toast = useToast();
    if(!isOpen)
      return (<></>);
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
          <Heading size={'md'} paddingTop={'20px'}>Complete then sentence or answer the question with a closed answer.</Heading><br/><Flex paddingTop={'10px'}>
            {data.question}
        </Flex>
        <Flex paddingTop={'20px'}>
            <Input isDisabled={disable} onChange={(event) => {
          setAssessment(event.currentTarget.value);
            console.log(checkBoxValue)
        }}></Input>
        </Flex>
        <Button top={'10px'}
        onClick={()=>{
            if(!checkBoxValue) {
                toast({
                title: 'Validation error',
                description: 'You need to select at least one choice to validate the assessment',
                status: 'error',
                duration: 3000,
                position: 'bottom-left',
                isClosable: true,
                }); 

                return;
            }
            unlock(true);
            setDisable(true);
            const edgesId = actualActivity?.validation.map((edge)=>{
                if(data.correctAnswers.map((answer)=> answer == assessment ? true : false).includes(true) && edge.data.conditionKind=='pass' )
                  return edge.id;
                else if(edge.data.conditionKind=='fail')
                    return edge.id;}
            ).filter((edge)=>edge!=undefined);

            if(edgesId!=undefined)
                setSatisfiedConditions(edgesId);
            }}>Validate</Button>
      </Box>
  );
  };
  
  export default CloseEndedTool;
  