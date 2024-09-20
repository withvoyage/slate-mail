import { SortableContext } from '@dnd-kit/sortable';
import { Container } from '@react-email/components';

import {
  useActiveDrag,
  useIsEditing,
} from '../App';
import {
  Droppable,
  SortableItem,
} from '../dnd';
import {
  dataNodeId,
  PropsWithNode,
  renderNode,
} from './index';

export function Section({ node, setNode }: PropsWithNode) {
  const editing = useIsEditing();
  const activeDrag = useActiveDrag();

  const children = node.children?.map((child) =>
    renderNode({
      node: child,
      setNode: (val) => {
        setNode({
          ...node,
          children: node.children?.map((child) =>
            child.id === val.id ? val : child
          ),
        });
      },
    })
  );

  if (editing) {
    return (
      <SortableItem id={node.id}>
        <Droppable
          id={node.id}
          style={{
            ...node.styles,
            opacity: activeDrag?.id === node.id ? 0.2 : node.styles.opacity,
          }}
          {...dataNodeId(node.id)}
        >
          <SortableContext items={node.children || []}>
            {children}
            {!node.children?.length && (
              <div className="p-4">Drop elements here</div>
            )}
          </SortableContext>
        </Droppable>
      </SortableItem>
    );
  }

  return (
    <Container style={node.styles} {...dataNodeId(node.id)}>
      {children}
    </Container>
  );
}
