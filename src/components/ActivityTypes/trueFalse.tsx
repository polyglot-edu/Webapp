import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  Heading,
  Icon,
  Input,
  Radio,
  RadioGroup,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { PolyglotNodeValidation } from '../../types/polyglotElements';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
type TrueFalseToolProps = {
  isOpen: boolean;
  actualActivity: PolyglotNodeValidation | undefined;
  unlock: Dispatch<SetStateAction<boolean>>;
  setSatisfiedConditions: Dispatch<SetStateAction<string[]>>;
};

type TrueFalseData = { 
  instructions: string;
  questions: string[];
  isQuestionCorrect: boolean[];
  negativePoints: number;
  positvePoints: number;
};

const TrueFalseTool = ({
  isOpen,
  actualActivity,
  unlock,
  setSatisfiedConditions
}: TrueFalseToolProps) => {
  const [disable, setDisable] = useState(false);
  const [assessment, setAssessment] = useState<string>();
  const data = actualActivity?.data as TrueFalseData;
  const [radioValue, setRadioValue]= useState<string[]>();
  const handleChange = useCallback(
      (value: string[]) => {
        setRadioValue(value);
          console.log(radioValue)
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
    <Heading size={'2xl'}>True False Activity</Heading>
    <Heading size={'md'} paddingTop={'20px'}>Define if the statement is true or false.</Heading><br/>
    <Flex paddingTop={'10px'}>
      {data.instructions}
    </Flex>
    <Flex paddingTop={'20px'}>        
      {data.questions.map(
        (question, index)=>{return (
        <>
        <RadioGroup isDisabled={disable}>
          <Radio value={'true'}>T</Radio>
          <Radio value={'false'}/> 
        </RadioGroup>
        {question} 
        <Box paddingLeft='10px' float='right' hidden={!disable}> 
          <Icon as={(data.isQuestionCorrect[index]) ? CheckIcon : CloseIcon} color={(data.isQuestionCorrect[index]) ? 'green' : 'red'}/>
        </Box>
        </>)})
      }
    </Flex>
    <Button top={'10px'}
    onClick={()=>{
        if(!radioValue) {
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

export default TrueFalseTool;
