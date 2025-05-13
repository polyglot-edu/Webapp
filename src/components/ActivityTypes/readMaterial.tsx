import { Box, Flex, Link } from '@chakra-ui/react';
import { flow } from 'fp-ts/lib/function';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { registerAnalyticsAction } from '../../data/AnalyticsFunctions';
import { API } from '../../data/api';
import {
  OpenCloseNodeAction,
  Platform,
  PolyglotNodeValidation,
  ZoneId,
} from '../../types/polyglotElements';
import FlexText from '../CostumTypography/FlexText';
import HeadingSubtitle from '../CostumTypography/HeadingSubtitle';
import HeadingTitle from '../CostumTypography/HeadingTitle';

type ReadMaterialToolProps = {
  isOpen: boolean;
  actualActivity: PolyglotNodeValidation | undefined;
  unlock: Dispatch<SetStateAction<boolean>>;
  setSatisfiedConditions: Dispatch<SetStateAction<string[]>>;
  showNextButton: boolean;
  userId: string;
  flowId: string;
  lastAction: string;
  setLastAction: Dispatch<SetStateAction<string>>;
};

type ReadMaterialData = {
  text: string;
  link: string;
};

const ReadMaterialTool = ({
  isOpen,
  actualActivity,
  unlock,
  setSatisfiedConditions,
  userId,
  flowId,
  lastAction,
  setLastAction,
}: ReadMaterialToolProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const data =
    actualActivity?.data || ({ text: '', link: '' } as ReadMaterialData);

  useEffect(() => {
    if (!isOpen) return;
    const fetchPdf = async () => {
      if (actualActivity?._id) {
        try {
          const response = await API.downloadFile({
            nodeId: actualActivity?._id,
          });
          const pdfBlob = new Blob([response.data], {
            type: 'application/pdf',
          });
          const url = window.URL.createObjectURL(pdfBlob);
          setPdfUrl(url);
        } catch (error) {
          setPdfUrl(null);
        }
      }
    };
    fetchPdf();
    if (!data) return;
    unlock(true);
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

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  if (!isOpen) return <></>;

  return (
    <Box
      width={'80%'}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <HeadingTitle>Read Material Activity</HeadingTitle>
      <HeadingSubtitle>
        Study the text and linked materials to build your understanding.
      </HeadingSubtitle>
      <br />
      <Box width="100%" maxHeight="45vh" overflowY="auto">
        <FlexText>{data.text}</FlexText>
      </Box>
      {pdfUrl && (
        <Box
          position="relative"
          width="100%"
          paddingBottom="56.25%"
          overflow="hidden"
          borderRadius="md"
          boxShadow="md"
          mt={4}
        >
          <Box
            as="iframe"
            src={pdfUrl}
            title="PDF"
            position="absolute"
            width="100%"
            height="100%"
          />
        </Box>
      )}
      <Flex paddingTop={'50px'} hidden={!data.link || data.link == ' '}>
        <Link href={data.link} color="#0890d3" target="_blank">
          Open this link for additional material
        </Link>
      </Flex>
    </Box>
  );
};

export default ReadMaterialTool;
