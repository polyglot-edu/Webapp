/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-restricted-globals */
import React, { useEffect, useMemo, useState } from 'react';
//import "../FlowShower.css"; // Ensure this CSS file is updated for new styles
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Divider,
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
import { cons } from 'fp-ts/lib/ReadonlyNonEmptyArray';
import { useRouter } from 'next/router';
import { ValueOf } from 'type-fest';
import { API } from '../../../data/api';
import { PolyglotFlow } from '../../../types/polyglotElements';

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

let tags = [{ name: 'No Tag defined', color: 'grey' }];
let nodes = [
  {
    title: 'Empty',
    description: 'This flow has no nodes yet',
    platform: 'Not defined',
    type: 'Not defined',
  },
];

function FlowShower() {
  const router = useRouter();
  const { flowId } = useMemo(
    () => ({
      flowId: router.query?.id?.toString(),
    }),
    [router.query?.id]
  );
  console.log(flowId);
  const [flow, setFlow] = useState<PolyglotFlow>();
  useEffect(() => {
    console.log(flowId);
    if (flowId)
      API.loadFlowElementsAsync(flowId)
        .then((response) => {
          setFlow(response.data);
          try {
            if (!flow) return;
            tags = flow.tags;
            nodes = flow.nodes;
          } catch (e) {
            console.log(e);
          }
          console.log(flow);
        })
        .catch((error) => {
          console.error('There was a problem with the fetch operation:', error);
        });
  }, [flow, flowId]);

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
