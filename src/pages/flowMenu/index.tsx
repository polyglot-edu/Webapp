// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../node_modules/@workadventure/iframe-api-typings/iframe_api.d.ts" />
import { AtSignIcon, TimeIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  IconButton,
  Image,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  SimpleGrid,
  Spacer,
  Stack,
  Tag,
  TagLabel,
  Text,
  UnorderedList,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { flowLearningExecutionOrder } from '../../algorithms/flowAlgo';
import HeadingSubtitle from '../../components/CostumTypography/HeadingSubtitle';
import HeadingTitle from '../../components/CostumTypography/HeadingTitle';
import Navbar from '../../components/NavBars/NavBar';
import { API } from '../../data/api';
import iconRead from '../../public/lesson_icon.png';
import defaultIcon from '../../public/summary_CasesEvaluation_icon.png';
import {
  nodeIconsMapping,
  PolyglotFlow,
  PolyglotNode,
} from '../../types/polyglotElements';
/*const activeFlowList = [
  'd775f1fa-a014-4d2a-9677-a1aa7c45f2af', //UML chronicles mission1
  '3af50eec-74fa-4441-9d02-435bebe02575', //UML chronicles mission2
  'e272d0b2-33d8-471e-b336-19745d993eed', //matematica-derivate
  '',
  '',
  '',
  '',
  '',
];*/

const getNodeIcon = (nodeType: string): any => {
  return nodeIconsMapping[nodeType] ?? defaultIcon;
};

const FlowListIndex = () => {
  const [flows, setFlows] = useState<PolyglotFlow[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentFlow, setCurrentFlow] = useState<PolyglotFlow | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<PolyglotFlow | null>(null);
  const [orderedNodes, setOrderedNodes] = useState<PolyglotNode[]>([]);
  const [nodes, setNodes] = useState<PolyglotNode[]>([]);

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
  let activeFlow = 'null';
  try {
    if (WA.player.state.actualFlow)
      activeFlow = WA.player.state.actualFlow as string;
  } catch (error: any) {
    console.log(error);
  }

  const handleLoadFlowElements = (flow: PolyglotFlow) => {
      API.loadFlowElementsAsync(flow._id)
        .then((response) => {
          const { nodes, edges } = response.data;
          const result = flowLearningExecutionOrder(
            nodes,
            edges
          );
          setNodes(nodes);
          setOrderedNodes(nodes);
          console.log(nodes);
          console.log(edges);
          console.log(result.orderedNodes);

          if (result.error != 200) {
            console.error(result.message);
          } else {
            setOrderedNodes(result.orderedNodes);
          }
          onOpen();
        })
        .catch((error) => {
          console.error(
            'Error fetching flow elements:',
            error
          );
        });
  };

  return (
    <Box bg="gray.50">
      <Navbar />
      <Box>
        <Box textAlign="center" mb="20px" mt="20px">
          <HeadingTitle>Learning Paths</HeadingTitle>
        </Box>
        <Box mb="20px" ml="40px">
          {/*selectedFlow != null ?
            <Box>
              Selected flow: <b>{selectedFlow.title}</b>
              <Button
                ml='20px'
                onClick={() => {
                  WA.player.state.actualFlow = null;
                  setSelectedFlow(null);
                }}
              >
                Remove selection
              </Button>
            </Box> :
            <Box>
              No selected flow 
            </Box>
          */}
        </Box>
        <Box margin="100px" mt="40px">
          <SimpleGrid spacing={4} minChildWidth="350px">
            {flows.map((flow) => {
              //if (!activeFlowList.includes(flow._id)) return; //remove comment if you want to enable flowList
              return (
                <Card
                  key={flow._id}
                  border={
                    flow._id == selectedFlow?._id ? '3px solid' : '1px solid'
                  }
                  transform={
                    flow._id == selectedFlow?._id
                      ? 'scale(1.03)'
                      : 'scale(1.00)'
                  }
                  borderColor="#0890d3"
                  borderRadius="8px"
                  bg={flow._id == selectedFlow?._id ? '#e5e5e5' : ''}
                  _hover={{
                    transform: 'scale(1.02)',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setCurrentFlow(flow);
                    WA.player.state.currentFlow = flow;
                    handleLoadFlowElements(flow);
                  }}
                >
                  <CardHeader>
                    <Flex>
                      <HeadingSubtitle paddingTop="0px" size="md">
                        {flow.title}
                      </HeadingSubtitle>
                      <Spacer />
                      {flow?.duration != '' && flow?.duration != null && (
                        <Text fontSize="xs" minWidth="max-content">
                          <TimeIcon mr="5px" />
                          {`${flow?.duration} hours`}
                        </Text>
                      )}
                    </Flex>
                  </CardHeader>
                  <CardBody mt="-30px" mb="-30px" alignContent="center">
                    {flow?.learningContext.length > 0 &&
                      flow?.learningContext != ' ' && (
                        <Text fontStyle="italic" fontSize="md" mt="2px">
                          {flow.learningContext}
                        </Text>
                      )}
                  </CardBody>
                  <Spacer />
                  <CardFooter>
                    <Stack width="100%">
                      {flow?.author != undefined && flow?.author != null && (
                        <Text fontSize="sm">
                          <AtSignIcon mr="5px" />
                          {flow.author?.username}
                        </Text>
                      )}
                      <Box overflowY={'auto'}>
                        {flow.tags.map((tag, id) => (
                          <Button key={id} variant={'unstyled'}>
                            <Tag
                              mr={1}
                              colorScheme={tag.color}
                              h={1}
                              fontSize="xs"
                            >
                              <TagLabel>{tag.name}</TagLabel>
                            </Tag>
                          </Button>
                        ))}
                      </Box>
                      <Divider />
                      <Button
                        color="#0890d3"
                        border="2px solid"
                        borderColor="#0890d3"
                        borderRadius="8px"
                        _hover={{
                          transform: 'scale(1.05)',
                          transition: 'all 0.2s ease-in-out',
                        }}
                        width="100%"
                        onClick={() => {
                          setCurrentFlow(flow);
                          WA.player.state.currentFlow = flow;
                          handleLoadFlowElements(flow);
                        }}
                      >
                        More info
                      </Button>
                    </Stack>
                  </CardFooter>
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
                        try {
                          WA.player.state.actualFlow = flow._id;
                        } catch (error: any) {
                          console.log(error);
                        }
                      }}
                      hidden={activeFlow == flow._id}
                      title="If this button is disabled, you have already selected it."
                    >
                      Select LP
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </SimpleGrid>
        </Box>
        <Modal
          closeOnOverlayClick={false}
          isOpen={isOpen}
          onClose={() => {
            setCurrentFlow(null);
            WA.player.state.currentFlow = null;
            onClose();
          }}
          isCentered
          scrollBehavior="inside"
        >
          <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
          <ModalContent>
            <ModalHeader fontSize="2xl" textColor="#0890d3">
              {currentFlow?.title || 'More info'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {currentFlow?.description && (
                <p>
                  <b>Description: </b>
                  {currentFlow.description}
                  <br />
                  <br />
                </p>
              )}
              {currentFlow?.learningContext.length != 0 &&
                currentFlow?.learningContext != ' ' && (
                  <p>
                    <b>Learning Context: </b>
                    {currentFlow?.learningContext}
                    <br />
                    <br />
                  </p>
                )}
              {currentFlow?.author != undefined &&
                currentFlow?.author != null && (
                  <p>
                    <b>Author: </b>
                    {currentFlow.author?.username}
                    <br />
                    <br />
                  </p>
                )}
              {currentFlow?.duration != '' && currentFlow?.duration != null && (
                <p>
                  <b>Duration: </b>
                  {`${currentFlow?.duration} hours`}
                  <br />
                  <br />
                </p>
              )}
              <p>
                <b>N° activities: </b>
                {orderedNodes?.length || 'no activity'}
                {orderedNodes?.length ? (
                  <Box width="100%" display="flex" flexDirection="column" alignItems="center">
                    <Box width='95%'>
                      <Accordion variant={{}}>
                        {orderedNodes.map((node, id) => (
                          <AccordionItem key={id}>
                            <AccordionButton _expanded={{ bg: '#efefef', color: 'black' }}>
                              <Box width="50px" display="flex"  flexDirection="column" alignItems="center">
                                <Image
                                  alt="icon"
                                  src={getNodeIcon(node.type).src}
                                  style={{ float: 'left' }}
                                  height="25px"
                                  width="fit-content"
                                />
                              </Box>
                              <Text textAlign='left'>{node.title}</Text>
                            </AccordionButton>
                            {node.description.length > 1 ? (
                              <AccordionPanel>{node.description}</AccordionPanel>
                            ) : (
                              <></>
                            )}
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </Box>
                  </Box>
                ) : (
                  <></>
                )}
                <br />
              </p>

              {currentFlow?.topics?.length != 0 && (
                <>
                  <p>
                    <b>Topics: </b>
                  </p>
                  <UnorderedList>
                    {currentFlow?.topics.map((topic, id) => (
                      <ListItem key={id}>{topic}</ListItem>
                    ))}
                  </UnorderedList>{' '}
                  <br />
                </>
              )}
              {currentFlow?.tags?.length != 0 && (
                <>
                  <p>
                    <b>Tags: </b>
                  </p>
                  <Box>
                    {currentFlow?.tags.map((tag, index) => (
                      <Tag
                        key={index}
                        mr={1}
                        colorScheme={tag.color}
                        fontWeight="bold"
                        h={2}
                      >
                        <TagLabel>{tag.name}</TagLabel>
                      </Tag>
                    ))}
                  </Box>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                title={
                  currentFlow?.nodes[0] == undefined
                    ? 'No activities available'
                    : selectedFlow == currentFlow
                    ? 'Click to deselect this flow'
                    : 'Click to select this flow'
                }
                onClick={() => {
                  WA.player.state.actualFlow == currentFlow?._id
                    ? (WA.player.state.actualFlow = null)
                    : (WA.player.state.actualFlow = currentFlow?._id);
                  selectedFlow == currentFlow
                    ? setSelectedFlow(null)
                    : setSelectedFlow(currentFlow);
                }}
                isDisabled={currentFlow?.nodes.length == 0}
                _disabled={{
                  cursor: 'not-allowed',
                  bg: 'gray.300',
                  color: 'gray.500',
                  _hover: { bg: 'gray.300' },
                }}
              >
                {selectedFlow == currentFlow ? 'Selected' : 'Select LP'}
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default FlowListIndex;
