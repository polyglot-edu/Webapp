// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../node_modules/@workadventure/iframe-api-typings/iframe_api.d.ts" />
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
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
import Navbar from '../../components/NavBars/NavBar';
import { API } from '../../data/api';
import { PolyglotFlow } from '../../types/polyglotElements';
import HeadingTitle from '../../components/CostumTypography/HeadingTitle';
import HeadingSubtitle from '../../components/CostumTypography/HeadingSubtitle';
import { AtSignIcon, TimeIcon } from '@chakra-ui/icons';

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

const FlowListIndex = () => {
  const [flows, setFlows] = useState<PolyglotFlow[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [currentFlow, setCurrentFlow] = useState<PolyglotFlow | null>(null); 
  const [selectedFlow, setSelectedFlow] = useState<PolyglotFlow | null>(null);

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
    <Box bg='gray.50'>
      <Navbar />
      <Box>
        <Box textAlign='center' mb='20px' mt='20px'>
          <HeadingTitle>
            Learning Paths
          </HeadingTitle>
        </Box>
        <Box mb='20px' ml='40px'>
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
        <Box margin='100px' mt='40px'>
          <SimpleGrid spacing={4} minChildWidth='350px'>
            {flows.map((flow) => {
              //if (!activeFlowList.includes(flow._id)) return; //remove comment if you want to enable flowList
              return (
                <Card 
                  key={flow._id} 
                  border= {flow._id == selectedFlow?._id ? '3px solid' : '1px solid'} 
                  transform={flow._id == selectedFlow?._id ? 'scale(1.03)' : 'scale(1.00)'}
                  borderColor='#0890d3'
                  borderRadius='8px'
                  bg={flow._id == selectedFlow?._id ? '#e5e5e5' : ''}
                  _hover={{
                    transform: 'scale(1.02)',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setCurrentFlow(flow); 
                    WA.player.state.currentFlow = flow;
                    onOpen(); 
                  }}
                >
                  <CardHeader>
                    <Flex>
                      <HeadingSubtitle paddingTop='0px' size='md'>
                        {flow.title}
                      </HeadingSubtitle>
                      <Spacer/>
                      {flow?.duration != '' && flow?.duration != null && (
                        <Text fontSize='xs' minWidth='max-content'>
                          <TimeIcon mr='5px'/>{`${flow?.duration} hours`}
                        </Text>
                      )}
                    </Flex>
                  </CardHeader>
                  <CardBody mt='-30px' mb='-30px' alignContent='center'>
                    {(flow?.learningContext.length > 0 && flow?.learningContext != ' ') && (
                      <Text fontStyle='italic' fontSize='md' mt='2px'>
                        {flow.learningContext}
                      </Text>
                    )}
                  </CardBody>
                  <Spacer/>
                  <CardFooter>
                    <Stack width='100%'>
                      {flow?.author != undefined && flow?.author != null &&
                        <Text fontSize='sm'>
                          <AtSignIcon mr='5px'/>{flow.author?.username}
                        </Text>
                      }
                      <Box overflowY={'auto'}>
                        {flow.tags.map((tag, id) => (
                          <Button key={id} variant={'unstyled'}>
                            <Tag
                              mr={1}
                              colorScheme={tag.color}
                              h={1}
                              fontSize='xs'
                            >
                              <TagLabel>{tag.name}</TagLabel>
                            </Tag>
                          </Button>
                        ))}
                      </Box>
                      <Divider />
                      <Button
                        color='#0890d3'
                        border='2px solid'
                        borderColor='#0890d3'
                        borderRadius='8px'
                        _hover={{
                          transform: 'scale(1.05)',
                          transition: 'all 0.2s ease-in-out',
                        }}
                        width='100%'
                        onClick={() => {
                          setCurrentFlow(flow); 
                          WA.player.state.currentFlow = flow;
                          onOpen(); 
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
          isOpen={isOpen} 
          onClose={() => {
            setCurrentFlow(null); 
            WA.player.state.currentFlow = null;
            onClose();
          }}
          isCentered
          scrollBehavior='inside'
        >
          <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px)'
          />
          <ModalContent>
            <ModalHeader fontSize='2xl' textColor='#0890d3'>{currentFlow?.title || 'More info'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {currentFlow?.description && (
                <p><b>Description: </b>{currentFlow.description}<br/><br/></p>
              )}
              {(currentFlow?.learningContext.length != 0 && currentFlow?.learningContext != ' ')&& (
                <p><b>Learning Context: </b>{currentFlow?.learningContext}<br/><br/></p>
              )}
              {currentFlow?.author != undefined && currentFlow?.author != null &&
                <p><b>Author: </b>{currentFlow.author?.username}<br/><br/></p>
              }
              {currentFlow?.duration != '' && currentFlow?.duration != null && (
                <p><b>Duration: </b>{`${currentFlow?.duration} hours`}<br/><br/></p>
              )}
              <p><b>N° activities: </b>{currentFlow?.nodes.length || 'no activity'}<br/><br/></p>

              {currentFlow?.topics?.length != 0 && (
                <>
                  <p><b>Topics: </b></p>
                  <UnorderedList>
                    {currentFlow?.topics.map((topic, id) => (
                      <ListItem key={id}>{topic}</ListItem>
                    ))}
                  </UnorderedList> <br/>
                </>
              )}
              {currentFlow?.tags?.length != 0 && (
                <>
                  <p><b>Tags: </b></p>
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
                colorScheme='blue' 
                mr={3}
                title="If this button is disabled, you have already selected it."
                onClick={() => {
                  WA.player.state.actualFlow == currentFlow?._id ? WA.player.state.actualFlow = null : WA.player.state.actualFlow = currentFlow?._id ;
                  selectedFlow == currentFlow ? setSelectedFlow(null) : setSelectedFlow(currentFlow);
                }}
                hidden={
                  currentFlow?.nodes[0] == undefined
                }
              >
                { (selectedFlow == currentFlow) ? 'Selected' : 'Select LP' }
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
