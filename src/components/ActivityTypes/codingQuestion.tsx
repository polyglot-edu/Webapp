import * as BabelParser from '@babel/parser';
import {
  Badge,
  Box,
  Button,
  Flex,
  Select,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import DOMpurify from 'dompurify';
import * as parse5 from 'parse5';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { API } from '../../data/api';
import { PolyglotNodeValidation } from '../../types/polyglotElements';
import HeadingSubtitle from '../CostumTypography/HeadingSubtitle';
import HeadingTitle from '../CostumTypography/HeadingTitle';

type codingQuestionToolProps = {
  isOpen: boolean;
  actualActivity: PolyglotNodeValidation | undefined;
  unlock: Dispatch<SetStateAction<boolean>>;
  setSatisfiedConditions: Dispatch<SetStateAction<string[]>>;
  setShowNextButton: Dispatch<SetStateAction<boolean>>;
};

type codingQuestionData = {
  question: string;
  codeTemplate: string;
  language: string;
};

const CodingQuestionTool = ({
  isOpen,
  actualActivity,
  unlock,
  setSatisfiedConditions,
  setShowNextButton,
}: codingQuestionToolProps) => {
  const data = actualActivity?.data as codingQuestionData;
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(data?.language || 'html');
  const [feedback, setFeedback] = useState<string[]>([]);

  const parseCode = async (code: string, language: string) => {
    try {
      let ast;
      if (language === 'javascript') {
        ast = BabelParser.parse(code, {
          sourceType: 'module',
          plugins: ['jsx'],
        });
        setFeedback(validateJsAst(ast));
      } else if (language === 'html') {
        ast = parse5.parse(code);
        setFeedback(validateHtmlAst(ast));
      } else {
        setFeedback(['AST parsing not supported for this language.']);
      }
      console.log('AST:', ast);
    } catch (error) {
      console.error('Error parsing code:', error);
      setFeedback([`Parsing Error: ${error}`]);
    }
  };

  const validateJsAst = (ast: any) => {
    const messages: string[] = [];
    ast.program.body.forEach((node: any) => {
      if (node.type === 'FunctionDeclaration' && node.id.name === 'foo') {
        messages.push('Avoid using generic function names like "foo".');
      }
    });
    return messages.length > 0 ? messages : ['No issues found.'];
  };

  const validateHtmlAst = (ast: any) => {
    const messages: string[] = [];
    const checkAltAttribute = (node: any) => {
      if (
        node.nodeName === 'img' &&
        !node.attrs.some((attr: any) => attr.name === 'alt')
      ) {
        messages.push(
          'Ensure all <img> elements have an alt attribute for accessibility.'
        );
      }
      if (node.childNodes) {
        node.childNodes.forEach(checkAltAttribute);
      }
    };
    if (ast.childNodes) {
      ast.childNodes.forEach(checkAltAttribute);
    }
    return messages.length > 0 ? messages : ['No issues found.'];
  };

  useEffect(() => {
    if (!data) return;
    unlock(true);
    setCode(
      data.codeTemplate ||
        '<!DOCTYPE html>\n<html>\n<body>\n<h1>My First Heading</h1>\n<p>My first paragraph.</p>\n</body>\n</html>'
    );
    setLanguage(data.language || 'html');

    const edgesId = actualActivity?.validation.map((edge) => edge.id);
    if (edgesId) setSatisfiedConditions(edgesId);
  }, [actualActivity]);

  if (!isOpen || !data) return <></>;

  return (
    <Box width={'80%'}>
      <HeadingTitle>Coding Question Activity</HeadingTitle>
      <HeadingSubtitle>Complete the following coding exercise</HeadingSubtitle>
      <br />
      <VStack spacing={4}>
        <Box>
          <Text>{data.question}</Text>
        </Box>

        <Flex w="100%" align="center">
          <Select
            width="200px"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            bg="white"
            shadow="sm"
          >
            <option value="other">Other</option>
            <option value="html">HTML</option>
            <option value="javascript">JavaScript</option>
          </Select>
          <Spacer />
          <Button
            colorScheme="teal"
            onClick={() => {
              parseCode(code, language);
              setShowNextButton(true);
            }}
          >
            Submit
          </Button>
        </Flex>

        <Box
          w="100%"
          border="1px"
          borderColor="gray.200"
          rounded="md"
          overflow="hidden"
        >
          <Editor
            height="25vh"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
          />
        </Box>

        {language === 'html' && (
          <Box
            as="iframe"
            title="Preview"
            sandbox="allow-same-origin"
            srcDoc={DOMpurify.sanitize(code)}
            w="100%"
            h="40vh"
            border="1px"
            borderColor="gray.300"
            rounded="md"
          />
        )}

        {feedback.length > 0 && (
          <Box w="100%" p={4}>
            <Text fontWeight="bold" mb={2}>
              Feedback:
            </Text>
            <VStack align="center" spacing={1}>
              {feedback.map((msg, i) => (
                <Badge
                  key={i}
                  colorScheme={msg.includes('No issues') ? 'green' : 'red'}
                  variant="subtle"
                  px={2}
                  py={1}
                  rounded="md"
                >
                  {msg}
                </Badge>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default CodingQuestionTool;
