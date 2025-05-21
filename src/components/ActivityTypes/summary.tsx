import { Box, Button, Flex, Link, useClipboard } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
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
import TextField from '../Forms/TextField';

type SummaryToolProps = {
  isOpen: boolean;
  actualActivity: PolyglotNodeValidation | undefined;
  setUnlock: Dispatch<SetStateAction<boolean>>;
  setSatisfiedConditions: Dispatch<SetStateAction<string[]>>;
  userId: string;
  flowId: string;
  lastAction: string;
  setLastAction: Dispatch<SetStateAction<string>>;
};

type SummaryData = {
  text: string;
  link: string;
};

const SummaryTool = ({
  isOpen,
  actualActivity,
  setUnlock,
  setSatisfiedConditions,
  userId,
  lastAction,
  setLastAction,
  flowId,
}: SummaryToolProps) => {
  const [summary, setSummary] = useState<string | null>('');
  const { onCopy } = useClipboard(summary || '');
  const formMethods = useForm();

  const data = actualActivity?.data || ({ text: '', link: '' } as SummaryData);

  useEffect(() => {
    if (!isOpen) return;
    if (!data) return;
    setUnlock(true);
    const edgesId = actualActivity?.validation.map((edge) => edge.id);
    if (edgesId != undefined) setSatisfiedConditions(edgesId);

    try {
      if (userId && actualActivity?._id) {
        if (lastAction == 'open_node') return;
        setLastAction('open_node');

        registerAnalyticsAction({
          timestamp: new Date(),
          userId: userId,
          actionType: 'open_node',
          zoneId: ZoneId.WebAppZone,
          platform: Platform.WebApp,
          action: {
            flowId: flowId,
            nodeId: actualActivity._id,
            activity: actualActivity.type,
          },
        } as OpenCloseNodeAction);
      }
    } catch (e) {
      console.log(e);
    }
  }, [actualActivity]);

  if (!isOpen) return <></>;

  return (
    <FormProvider {...formMethods}>
      <Box
        width={'80%'}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <HeadingTitle>Summary Activity</HeadingTitle>
        <HeadingSubtitle>
          Summarize the text to capture its key ideas.
        </HeadingSubtitle>
        <br />
        <FlexText>{data.text}</FlexText>
        <Flex paddingTop={'50px'} hidden={!data.link || data.link == ' '}>
          <Link href={data.link} color="#0890d3" target="_blank">
            Open this link for additional material
          </Link>
        </Flex>
        <TextField
          label="Write your summary here"
          name="summary"
          updateState={setSummary}
          placeholder="Write..."
          width="100%"
          isTextArea
          isRequired
        />
        <Button
          mt={4}
          color={'#0890d3'}
          border={'2px solid'}
          borderColor={'#0890d3'}
          borderRadius={'8px'}
          _hover={{
            transform: 'scale(1.05)',
            transition: 'all 0.2s ease-in-out',
          }}
          onClick={onCopy}
        >
          Copy Summary
        </Button>
      </Box>
    </FormProvider>
  );
};

export default SummaryTool;
