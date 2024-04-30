import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
  Avatar,
  Badge,
  Card,
  CardBody,
  CardFooter,
  HStack,
  Image,
  LinkBox,
  LinkOverlay,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar/SearchBar.js";
import cardImage from "./components/test_card.png";
import PolyglotFlow from "./types/polyglotElements.ts";

function getListAPI(query) {
  const getFlowList = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Make the POST request for the next quiz
  fetch(
    "https://polyglot-api-staging.polyglot-edu.com/api/flows/" +
      (query ? query : ""),
    getFlowList,
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error in the request");
      }
      console.log(response);
      return response.json();
    })
    .then((data) => {
      console.log(data);

      return data;
    })
    .catch((error) => {
      console.error("Error while getting the flows' list:", error.message);
      console.error("Dettagli dell'errore:", error);
      return "";
    });
}

const FlowCard = ({ flow, px, py }) => {
  return (
    <LinkBox px={px} py={py}>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
      >
        <Image
          objectFit="cover"
          maxW={{ base: "100%", sm: "200px" }}
          src={cardImage.src}
          alt="Flow card"
        />

        <Stack w="full">
          <CardBody>
            <Heading size="md">{flow.title}</Heading>
            {flow.tags &&
              flow.tags.map((tag, id) => (
                <Badge key={id} mr={1} colorScheme={tag.color}>
                  {tag.name}
                </Badge>
              ))}
            <Text pt={2} whiteSpace={"pre-wrap"} noOfLines={3}>
              {flow.description}
            </Text>
            <Text pt={2} whiteSpace={"pre-wrap"} noOfLines={3}>
              In this Learning Path there are: {flow.nodes.length} learning
              activities
            </Text>
          </CardBody>

          <CardFooter>
            {
              <>
                <Spacer />
                <HStack pl={5} spacing="2" align="center" h="full">
                  <Text fontSize={"xs"}>{flow.author?.username}</Text>
                  <Avatar name={flow.author?.username} size="sm" />
                </HStack>
              </>
            }
          </CardFooter>
        </Stack>
      </Card>
      <LinkOverlay href={`/flows/${flow._id}`} />
    </LinkBox>
  );
};

const FlowIndexPage = ({ accessToken }) => {
  const [flows, setFlows] = useState < PolyglotFlow > [];
  const [selectedFlowId, setSelectedFlowId] = useState("");
  const [suggestions, setSuggestions] = useState([""]);
  const [searchValue, setSearchValue] = useState("");
  const {
    isOpen: dfOpen,
    onClose: dfOnClose,
    onOpen: dfOnOpen,
  } = useDisclosure();

  // User need to be loaded

  useEffect(() => {
    let queryparams = "";
    if (searchValue) queryparams += "q=" + searchValue;
    getListAPI(queryparams).then((resp) => {
      setFlows(resp.data);
      setSuggestions([...new Set(resp.data.map((flow) => flow.title))]);
    });
  }, [searchValue]);

  useEffect(() => {
    if (!selectedFlowId) return;
    dfOnOpen();
  }, [dfOnOpen, selectedFlowId]);

  return (
    <>
      <Box px="10%">
        <Heading py="5%">Learning Paths</Heading>
        <SearchBar
          inputValue={searchValue}
          setInputValue={setSearchValue}
          items={suggestions}
          placeholder="Search learning paths..."
        />
        <Tabs pt="3%">
          <TabList>
            <Tab>All</Tab>
          </TabList>

          <TabPanels>
            <TabPanel pt="3%">
              {flows.length ? (
                flows.map((flow, id) => (
                  <FlowCard key={id} flow={flow} py={1} />
                ))
              ) : (
                <Heading size={"md"} textAlign="center">
                  You have 0 Learning paths available! <br />
                  Create one with the + button ;)
                </Heading>
              )}
            </TabPanel>
            <TabPanel>
              {flows.length ? (
                flows.map((flow, id) => (
                  <FlowCard key={id} flow={flow} py={1} />
                ))
              ) : (
                <Heading size={"md"} textAlign="center">
                  No flows found! <br />
                  Search something different ;)
                </Heading>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

export default FlowIndexPage;
