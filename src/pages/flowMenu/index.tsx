// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../node_modules/@workadventure/iframe-api-typings/iframe_api.d.ts" />
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Divider,
  Heading,
  SimpleGrid,
  Stack,
  Tag,
  TagLabel,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/NavBars/NavBar';
import { API } from '../../data/api';
import { PolyglotFlow } from '../../types/polyglotElements';

const activeFlowList = [
  'd775f1fa-a014-4d2a-9677-a1aa7c45f2af', //UML chronicles mission1
  '3af50eec-74fa-4441-9d02-435bebe02575', //UML chronicles mission2
  'e272d0b2-33d8-471e-b336-19745d993eed', //matematica-derivate
  '',
  '',
  '',
  '',
  '',
];

const FlowListIndex = () => {
  const [flows, setFlows] = useState<PolyglotFlow[]>([]);

  useEffect(() => {
    API.loadFlowList()
      .then((response) => {
        setFlows(response.data);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
    const script = document.createElement('script');

    script.src = 'https://play.workadventu.re/iframe_api.js';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Navbar />
      <Box>
        <Center>
          <Heading as="h2" size="2xl">
            Learning Paths
          </Heading>
        </Center>
        <Button
          left={'10px'}
          onClick={() => (WA.player.state.actualFlow = 'null')}
        >
          Remove selection
        </Button>
        <Center top={'10px'}>
          <SimpleGrid spacing={4} columns={[2, 3]}>
            {flows.map((flow) => {
              if (!activeFlowList.includes(flow._id)) return;
              return (
                <Card maxW="sm" key={flow._id} width={['400px', '600px']}>
                  <CardHeader>
                    <Heading as="h2" size="lg">
                      {flow.title}
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <Stack mt="6" spacing="3">
                      <Heading
                        as="h2"
                        size="md"
                        overflowY={'auto'}
                        height={'100px'}
                      >
                        {flow.description}
                      </Heading>
                      <Heading as="h2" size="md">
                        N° activities: {flow.nodes.length}
                      </Heading>
                      <Heading as="h2" size="sm">
                        Author: {flow.author?.username}
                      </Heading>
                      <Box overflowY={'auto'}>
                        {flow.tags.map((tag, id) => (
                          <Button key={id} variant={'unstyled'}>
                            <Tag
                              mr={1}
                              colorScheme={tag.color}
                              fontWeight="bold"
                              h={2}
                            >
                              <TagLabel>{tag.name}</TagLabel>
                            </Tag>
                          </Button>
                        ))}
                      </Box>
                    </Stack>
                  </CardBody>
                  <Divider />
                  <CardFooter>
                    <Button
                      backgroundColor={'lightgrey'}
                      variant="ghost"
                      colorScheme="blue"
                      onClick={() => {
                        if (flow.nodes[0] == undefined) {
                          alert(
                            'This learning path does not have any activities yet, you cannot do it'
                          );
                          return;
                        }
                        WA.player.state.actualFlow = flow._id;
                      }}
                      hidden={WA.player.state.actualFlow == flow._id}
                      title="If this button is disabled, you have already selected it."
                    >
                      Select LP
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </SimpleGrid>
        </Center>
      </Box>
    </>
  );
};

export default FlowListIndex;
