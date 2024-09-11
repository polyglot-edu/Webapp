/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
//import "../FlowShower.css"; // Ensure this CSS file is updated for new styles
import {
  Box,
  Center,
  Heading,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';

function FlowShower() {
  return (
    <Center>
      <Box marginTop={'20px'}>
        <Heading as="h1">Welcome in our little educational space</Heading>
        <Box>This world is divided in 5 areas:</Box>
        <UnorderedList>
          <ListItem>
            <Text color={'#5db048'}>"outside"</Text>: where you can rest in our
            quiet zone and the flows menu where you can choose which learning
            path you want to do;
          </ListItem>
          <ListItem>
            <Text color={'#434fbf'}>"Library of Knowledge"</Text>: the reading
            hub where learners can study modules of wisdom and test their
            understanding of the material. Each knowledge has its basis here;
          </ListItem>
          <ListItem>
            <Text color={'#878686'}>"Coding plaza"</Text>: learners go there to
            complete basic and intermediate coding tasks. It focuses on personal
            effort and commitment.
          </ListItem>
          <ListItem>
            <Text color={'#e68c17'}>"Central Workshop"</Text>: where learners
            engage in advanced modeling and design more complex class diagrams.
            This room is required for UML missions.
          </ListItem>
          <ListItem>
            <Text color={'#b322e3'}>"Room Meeting"</Text>: inside this private
            room, it's possible to interact safely with experts or tutors
            receiving the necessary support;
          </ListItem>
        </UnorderedList>
        <Box>
          These are the information of the learning path you have selected, if
          you want to change learning path you can do it from the joystick area
          outside.
        </Box>
      </Box>
    </Center>
  );
}

export default FlowShower;
