// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../node_modules/@workadventure/iframe-api-typings/iframe_api.d.ts" />
import { AtSignIcon, CloseIcon, Search2Icon, TimeIcon } from '@chakra-ui/icons';
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
  Checkbox,
  Divider,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
import { TbFilter } from "react-icons/tb";
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
  const [isFilterOpen, setisFilterOpen] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<PolyglotFlow | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<PolyglotFlow | null>(null);
  const [orderedNodes, setOrderedNodes] = useState<PolyglotNode[]>([]);
  const [nodes, setNodes] = useState<PolyglotNode[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [allTags, setTags] = useState<{ name: string; color: string; }[]>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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

  const filteredFlows = flows.filter((flow) => {
    const searchWords = searchTerm.toLowerCase().split(' ').filter(Boolean); 
    const titleWords = flow.title.toLowerCase(); 
    const descWords = flow.description.toLowerCase(); 
    const filterSearch = searchWords.every((word) => (titleWords || descWords).includes(word));   

    const filterTags = selectedTags.length === 0 || flow.tags.some((tag) => selectedTags.includes(tag.name));
    return filterSearch && filterTags
  });
  
  const handleTagSelection = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((tag) => tag !== tagName) : [...prev, tagName]
    );
  };

  return (
    <Box bg="gray.50" minHeight="100vh">
      <Navbar />
      <Box>
        <Box textAlign="center" mb="20px" mt="20px">
          <HeadingTitle>Learning Paths</HeadingTitle>
        </Box>
        <Box margin="100px" mt="40px">
          <Box 
            display="flex" 
            flexDirection="row" 
            width="100%" 
            alignContent="center"
            justifyContent="space-between"
            padding="20px"
          >
            <Box display="flex" flexDirection="row" width="40%">
              <InputGroup height="40px">
                <InputLeftElement pointerEvents='none'>
                  <Search2Icon color='gray.600' />
                </InputLeftElement>
                <Input
                  placeholder="Search for a Learning Path"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg="white"
                  border="1px solid #ccc"
                  borderRadius="8px"
                />
              </InputGroup>
              <Button
                border="1px solid #ccc"
                onClick={() => {
                  setisFilterOpen(true);
                  const extractedTags = flows.flatMap((flow) => flow.tags);
                  const uniqueTags = Array.from(new Map(extractedTags.map(tag => [tag.name, tag])).values());                  
                  setTags(uniqueTags);
                }}
              >
                <TbFilter />
              </Button>
            </Box>
            <Box 
              mb="20px" 
              textAlign="right" 
              width="fit-content" 
              height="40px" 
              //border="1px solid"  
              //borderColor="gray.300" 
              //borderRadius="8px"
              color="gray.700"
              display="flex"  
              alignItems="center" 
              padding="0 20px"
            >
              {selectedFlow != null ?
                <Box>
                  <b>{selectedFlow.title}</b>
                  <Button
                    ml='10px'
                    height="30px"
                    width="20px"
                    onClick={() => {
                      WA.player.state.actualFlow = null;
                      setSelectedFlow(null);
                    }}
                  >
                    <CloseIcon/>
                  </Button>
                </Box> :
                <Box fontStyle="italic">
                  No selected flow 
                </Box>
              }
            </Box>
          </Box>
          <SimpleGrid spacing={4} minChildWidth="350px">
            {filteredFlows.map((flow) => {
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
                </Card>
              );
            })}
          </SimpleGrid>
        </Box>
        <Modal
          closeOnOverlayClick={false}
          isOpen={isFilterOpen}
          onClose={() => {
            setisFilterOpen(false);
          }}
          isCentered
          scrollBehavior="inside"
        >
          <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
          <ModalContent>
            <ModalHeader fontSize="2xl" textColor="#0890d3">
              {'Filter Learning Paths'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
            <Text fontSize="lg" fontWeight="bold" mb="10px">
              Select Tags:
            </Text>
            <Stack spacing={2}>
              {allTags?.map((tag, index) => (
                <Checkbox
                  key={index}
                  isChecked={selectedTags.includes(tag.name)}
                  onChange={() => handleTagSelection(tag.name)}
                >
                  <Tag mr={1} colorScheme={tag.color} fontWeight="bold">
                    <TagLabel>{tag.name}</TagLabel>
                  </Tag>
                </Checkbox>
              ))}
            </Stack>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  //setisFilterOpen(false);
                  setSelectedTags([]);
                }}
              > 
                Clean filters
              </Button>
              <Button onClick={() => {setisFilterOpen(false)}}>Apply</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        
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
