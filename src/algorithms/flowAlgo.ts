import { PolyglotEdge, PolyglotNode } from '../types/polyglotElements';
export type FlowOrderFunction = {
  orderedNodes: PolyglotNode[];
  message: string;
  error: number;
};
export function flowLearningExecutionOrder(
  nodes: PolyglotNode[],
  edges: PolyglotEdge[]
): FlowOrderFunction {
  //this algorithm returns an array of nodes in the correct order of execution
  const orderedNodes: PolyglotNode[] = [];

  //search for first nodes
  const firstNode = nodes.find((node) => {
    if (edges.find((edge) => edge.reactFlow.target == node._id)) return false;
    return true;
  });

  if (!firstNode)
    return {
      orderedNodes: orderedNodes,
      message: 'This flow has no starting point.',
      error: 404,
    };

  orderedNodes.push(firstNode);
  let check;
  do {
    const missingNodes = nodes.filter((node) =>
      orderedNodes.find((index) => index._id == node._id)
    );
    nodes.forEach((node) => {
      if (orderedNodes.find((index) => index._id == node._id)) return;
      if (
        edges.find((edge) => {
          if (
            orderedNodes.findIndex(
              (index) =>
                edge.reactFlow.source == index._id &&
                edge.reactFlow.target == node._id
            )
          )
            return true;
        })
      )
        orderedNodes.push(node);
    });
    check = missingNodes.length > 1;
  } while (check);

  return {
    orderedNodes: orderedNodes,
    message: 'This flow is complete.',
    error: 200,
  };
}
