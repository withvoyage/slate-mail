import { CSSProperties } from 'react';

import {
  BoxSelect,
  Heading1,
  LucideIcon,
} from 'lucide-react';

import { arrayMove } from '@dnd-kit/sortable';

import { Heading } from './Heading';
import { Section } from './Section';

export type Node = {
  id: string;
  type: "section" | "heading";
  content?: string;
  children?: Node[];
  styles: CSSProperties;
};

export type PropsWithNode = {
  node: Node;
  setNode: (node: Node) => void;
};

export function dataNodeId(id: string) {
  return { "data-node-id": id };
}

export const renderNode = (props: PropsWithNode) => {
  switch (props.node.type) {
    case "section":
      return <Section {...props} key={props.node.id} />;
    case "heading":
      return <Heading {...props} key={props.node.id} />;
    default:
      console.error(`Unknown node type: ${props.node.type}`);
      return null;
  }
};

function depthFirstTransformation(
  node: Node,
  operation: (node: Node) => Node
): Node {
  return operation({
    ...node,
    children: (node.children || []).map((child) =>
      depthFirstTransformation(child, operation)
    ),
  });
}

function depthFirstSearch(
  node: Node,
  predicate: (node: Node) => boolean
): Node | null {
  if (predicate(node)) {
    return node;
  }

  for (const child of node.children || []) {
    const found = depthFirstSearch(child, predicate);
    if (found) {
      return found;
    }
  }

  return null;
}

export function removeNode(tree: Node, nodeId: string): Node {
  return depthFirstTransformation(tree, (node) => ({
    ...node,
    children: (node.children || []).filter((child) => child.id !== nodeId),
  }));
}

export function insertNode(tree: Node, parentId: string, newNode: Node): Node {
  return depthFirstTransformation(tree, (node) => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children || []), newNode],
      };
    }

    return node;
  });
}

export function findNode(tree: Node, nodeId: string): Node | null {
  return depthFirstSearch(tree, (node) => node.id === nodeId);
}

export function findParent(tree: Node, nodeId: string): Node | null {
  return depthFirstSearch(tree, (node) =>
    (node.children || []).some((child) => child.id === nodeId)
  );
}

export function insertNodeAfterChild(
  tree: Node,
  newNode: Node,
  insertAfterId: string
): Node {
  return depthFirstTransformation(tree, (node) => {
    const childNodeIndex = (node.children || []).findIndex(
      (child) => child.id === insertAfterId
    );
    if (childNodeIndex !== -1) {
      const newChildren = [...(node.children || [])];
      return {
        ...node,
        children: [
          ...newChildren.slice(0, childNodeIndex + 1),
          newNode,
          ...newChildren.slice(childNodeIndex + 1),
        ],
      };
    }
    return node;
  });
}

export function insertNodeBeforeChild(
  tree: Node,
  newNode: Node,
  insertBeforeId: string
): Node {
  return depthFirstTransformation(tree, (node) => {
    const childNodeIndex = (node.children || []).findIndex(
      (child) => child.id === insertBeforeId
    );
    if (childNodeIndex !== -1) {
      const newChildren = [...(node.children || [])];
      return {
        ...node,
        children: [
          ...newChildren.slice(0, childNodeIndex),
          newNode,
          ...newChildren.slice(childNodeIndex),
        ],
      };
    }
    return node;
  });
}

export function insertNodeAsFirstChild(
  tree: Node,
  parentId: string,
  newNode: Node
): Node {
  return depthFirstTransformation(tree, (node) => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [newNode, ...(node.children || [])],
      };
    }

    return node;
  });
}

export function isChildOf(node: Node, childId: string): boolean {
  return (node.children || []).some((child) => child.id === childId);
}

export function doArrayMove(
  node: Node,
  targetId: string,
  a: number,
  b: number
) {
  return depthFirstTransformation(node, (node) => {
    if (node.id === targetId) {
      return {
        ...node,
        children: arrayMove(node.children || [], a, b),
      };
    }
    return node;
  });
}

/**
 * Get closest container or the node itself if it is a container.
 */
export function findClosestContainer(
  node: Node,
  targetId: string,
  allowSelf = true
): Node | null {
  // Construct array to target node. This is wildly inefficient, but it's
  // good enough for this example.
  const path: Node[] = [];
  let current: Node | null = findNode(node, targetId);
  while (current) {
    path.push(current);
    current = findParent(node, current.id);
  }

  // Find the first container in the path.
  if (!allowSelf) {
    path.shift();
  }
  for (const node of path) {
    if (node.type === "section") {
      return node;
    }
  }

  return null;
}

export const NODE_DEFAULTS: Record<
  Node["type"],
  {
    name: string;
    icon: LucideIcon;
    default: Omit<Node, "type" | "id">;
    component: React.FC<PropsWithNode>;
  }
> = {
  section: {
    component: Section,
    name: "Section",
    icon: BoxSelect,
    default: {
      styles: {
        border: "1px solid #c0c0c0",
        borderRadius: "5px",
        padding: "12px",
      },
      children: [],
    },
  },
  heading: {
    component: Heading,
    name: "Heading",
    icon: Heading1,
    default: {
      content: "Hello, World!",
      styles: {
        outline: "none",
        fontSize: "24px",
      },
    },
  },
};
