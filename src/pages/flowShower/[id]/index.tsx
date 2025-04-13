/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-restricted-globals */
import React, { useEffect, useMemo, useState } from 'react';
//import "../FlowShower.css"; // Ensure this CSS file is updated for new styles
import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Flex,
  Heading,
  ListItem,
  SimpleGrid,
  Stack,
  Tag,
  TagLabel,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { registerAnalyticsAction } from '../../../data/AnalyticsFunctions';
import { API } from '../../../data/api';
import {
  OpenLPInfoAction,
  Platform,
  PolyglotFlow,
  ZoneId,
} from '../../../types/polyglotElements';

enum list {
  'multipleChoiceQuestionNode' = 'Multichoice Question',
  'closeEndedQuestionNode' = 'Close Ended Question',
  'ReadMaterialNode' = 'Read Material Activity',
  'lessonTextNode' = 'Read Material Activity',
  'OpenQuestionNode' = 'Open Qeestion',
  'TrueFalseNode' = 'True False Question',
  'WatchVideoNode' = 'Watch Video Activity',
  'SummaryNode' = 'Summary Activity',
  'codingQuestionNode' = 'Coding Exercise',
}

function FlowShower() {
  const router = useRouter();
  const { flowId } = useMemo(
    () => ({
      flowId: router.query?.id?.toString() || 'info',
    }),
    [router.query?.id]
  );
  const [tags, setTags] = useState([{ name: 'No Tag defined', color: 'grey' }]);
  const [nodes, setNodes] = useState([
    {
      title: 'Empty',
      description: 'This flow has no nodes yet',
      platform: 'Not defined',
      type: 'Not defined',
    },
  ]);
  const [flow, setFlow] = useState<PolyglotFlow>();
  const [scriptCheck, setScriptCheck] = useState(false);
  const [userId, setUserId] = useState('guest');

  useEffect(() => {
    const script = document.createElement('script');

    script.src = 'https://play.workadventu.re/iframe_api.js';
    script.async = true;

    script.onload = () => {      
      setScriptCheck(true);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!scriptCheck) return;
    try {
      setUserId(WA.player.playerId.toString());
    }catch(e){setUserId('guest');}
      const action: OpenLPInfoAction = {
        timestamp: new Date(),
        userId: userId,
        actionType: 'open_LP_info',
        platform: Platform.WorkAdventure,
        zoneId: ZoneId.InstructionWebpageZone,
        action: { flowId: flowId },
      };

      registerAnalyticsAction(action);

      const handleBeforeUnload = () => {
        const action: OpenLPInfoAction = {
          timestamp: new Date(),
          userId: userId,
          actionType: 'close_LP_info',
          platform: Platform.WorkAdventure,
          zoneId: ZoneId.InstructionWebpageZone,
          action: { flowId: flowId },
        };

        registerAnalyticsAction(action);
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
  }, [scriptCheck]);

  useEffect(() => {
    if (flowId != 'null' && flowId != 'info')
      API.loadFlowElementsAsync(flowId)
        .then((response) => {
          setFlow(response.data);
        })
        .catch((error) => {
          console.error(
            'There was a problem with the fetch operation:',
            error
          );
        });
  }, [flowId]);

  useEffect(() => {
    if (!flow) return;

    try {
      setTags(
        flow.tags?.length
          ? flow.tags
          : [{ name: 'No Tag defined', color: 'grey' }]
      );

      setNodes(
        flow.nodes?.length
          ? flow.nodes
          : [
              {
                title: 'Empty',
                description: 'This flow has no nodes yet',
                platform: 'Not defined',
                type: 'Not defined',
              },
            ]
      );
    } catch (e) {
      console.error('Error:', e);
    }
  }, [flow]);

  if (flow == undefined) {
    return (
      <Center>
        <Box marginTop={'20px'}>
          <Heading as="h1">Welcome in our little educational space</Heading>
          <Box>This world is divided in 5 areas:</Box>
          <UnorderedList>
            <ListItem>
              <Text color={'#5db048'}>"outside"</Text>: where you can rest in
              our quiet zone and the flows menu where you can choose which
              learning path you want to do;
            </ListItem>
            <ListItem>
              <Text color={'#434fbf'}>"webapp"</Text>: from the single laptop on
              the left, there you can access to our webapp to execute some
              lessons;
            </ListItem>
            <ListItem>
              <Text color={'#878686'}>"Computer Lab"</Text>: in the multiple
              computer area, you will be able to do coding exercise;
            </ListItem>
            <ListItem>
              <Text color={'#e68c17'}>"White Board"</Text>: on the top right
              area you can do collaborative assigment;
            </ListItem>
            <ListItem>
              <Text color={'#b322e3'}>"Room Meeting"</Text>: inside the private
              room, it's possible to have private meeting with the educator or
              expert that can help you with your doubts;
            </ListItem>
          </UnorderedList>
          <Box>
            These are the information of the learning path you have selected, if
            you want to change learning path you can do it from the joystick
            area outside.
          </Box>
        </Box>
      </Center>
    );
  }

  return (
    <Center>
      <Box marginTop={'20px'}>
        <Heading as="h1">Welcome in our little educational space</Heading>
        <Box>This world is divided in 5 areas:</Box>
        <UnorderedList>
          <ListItem>
            <Text as="span" color={'#5db048'}>
              "outside"
            </Text>
            : where you can rest in our quiet zone and the flows menu where you
            can choose which learning path you want to do;
          </ListItem>
          <ListItem>
            <Text as="span" color={'#434fbf'}>
              "webapp"
            </Text>
            : from the single laptop on the left, there you can access to our
            webapp to execute some lessons;
          </ListItem>
          <ListItem>
            <Text as="span" color={'#878686'}>
              "Computer Lab"
            </Text>
            : in the multiple computer area, you will be able to do coding
            exercise;
          </ListItem>
          <ListItem>
            <Text as="span" color={'#e68c17'}>
              "White Board"
            </Text>
            : on the top right area you can do collaborative assigment;
          </ListItem>
          <ListItem>
            <Text as="span" color={'#b322e3'}>
              "Room Meeting"
            </Text>
            : inside the private room, it's possible to have private meeting
            with the educator or expert that can help you with your doubts;
          </ListItem>
        </UnorderedList>
        <Box>
          These are the information of the learning path you have selected, if
          you want to change learning path you can do it from the joystick area
          outside.
        </Box>
        <Box key={flow._id}>
          <Heading as="h3">{flow.title}</Heading>
          <Box>{flow.description}</Box>
          {tags.map((tag, index) => (
            <Button key={index} variant={'unstyled'}>
              <Tag mr={1} colorScheme={tag.color} fontWeight="bold" h={2}>
                <TagLabel>{tag.name}</TagLabel>
              </Tag>
            </Button>
          ))}
          <Heading as="h3">
            These are the activities of this learning path.{' '}
          </Heading>
          <Flex>(Disclaimer: they are not in order)</Flex>
          <Box>
            <SimpleGrid spacing={4} columns={[2, null, 3]}>
              {nodes.map((node, index) => (
                <Card maxW="sm" key={index}>
                  <CardBody>
                    <Heading as="h2" size="lg">
                      {node.title}
                    </Heading>
                    <Stack mt="6" spacing="3">
                      <Heading as="h2" size="md">
                        {list[node.type as keyof typeof list]}
                      </Heading>
                      <Text size="md" overflowY={'auto'} height={'100px'}>
                        <Heading as="span" size="md">
                          description:
                        </Heading>{' '}
                        {node.description}
                      </Text>
                      <Text size="sm">
                        <Heading as="span" size="sm">
                          platform:
                        </Heading>{' '}
                        {node.platform}
                      </Text>
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>
        </Box>
      </Box>
    </Center>
  );
}

export default FlowShower;
