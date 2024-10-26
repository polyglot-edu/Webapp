import { Box, Flex, Heading } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { PolyglotNodeValidation } from '../../types/polyglotElements';
import HeadingTitle from '../CostumTypography/HeadingTitle';
import HeadingSubtitle from '../CostumTypography/HeadingSubtitle';
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
      <Flex paddingTop={'50px'} hidden={!data.link}>
        {data.link}
      </Flex>
    </Box>
  );
};

export default WatchVideoTool;
