import { Box, Link } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { PolyglotNodeValidation } from '../../types/polyglotElements';
import HeadingTitle from '../CostumTypography/HeadingTitle';
import HeadingSubtitle from '../CostumTypography/HeadingSubtitle';
import { ArrowRightIcon } from '@chakra-ui/icons';
type WatchVideoToolProps = {
  isOpen: boolean;
  actualActivity: PolyglotNodeValidation | undefined;
  unlock: Dispatch<SetStateAction<boolean>>;
  setSatisfiedConditions: Dispatch<SetStateAction<string[]>>;
};

type WatchVideoData = {
  link: string;
};

const WatchVideoTool = ({
  isOpen,
  actualActivity,
  unlock,
  setSatisfiedConditions,
}: WatchVideoToolProps) => {
  if (!isOpen) return <></>;
  console.log('data check ' + actualActivity);
  const data =
    actualActivity?.data || ({ text: '', link: '' } as WatchVideoData);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!data) return;
    unlock(true);
    const edgesId = actualActivity?.validation.map((edge) => edge.id);
    if (edgesId != undefined) setSatisfiedConditions(edgesId);
  }, [actualActivity]);

  return (
    <Box
      width={'80%'}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <HeadingTitle>Watch Video Activity</HeadingTitle>
      <HeadingSubtitle>Watch the video at the following link</HeadingSubtitle>
      <br />
      
      <Link 
        href={data.link} 
        target="_blank"
        color="#0890d3" 
        fontSize="lg" 
        fontWeight="bold"
        width="50%"
        mt={6}
        p={5}
        borderRadius="md"
        bg="gray.100"
        boxShadow="md"
        border="2px solid transparent"
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        gap={2}
        _hover={{ 
          bg: "gray.200",           
          boxShadow: "xl",  
          transition:"all 0.2s ease-in-out",
          textDecoration: "underline", 
          borderColor: "#0890d3",        
        }}
      >
        Watch video <ArrowRightIcon/>
      </Link>    
    </Box>
    
  );
};

export default WatchVideoTool;
