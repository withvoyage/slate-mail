import { Text } from '@react-email/components';

import {
  useActiveDrag,
  useIsEditing,
} from '../App';
import { SortableItem } from '../dnd';
import {
  dataNodeId,
  PropsWithNode,
} from './index';

export function Heading({ node, setNode }: PropsWithNode) {
  const editing = useIsEditing();
  const activeDrag = useActiveDrag();

  if (editing) {
    return (
      <SortableItem id={node.id}>
        <p
          {...dataNodeId(node.id)}
          style={{
            ...node.styles,
            opacity: activeDrag?.id === node.id ? 0.2 : node.styles.opacity,
          }}
        >
          {node.content}
        </p>
      </SortableItem>
    );
  }

  return (
    <Text style={node.styles} key={node.id} {...dataNodeId(node.id)}>
      {node.content?.toString()}
    </Text>
  );
}
