import {
  Font,
  Head,
  Html,
} from '@react-email/components';

import { useIsEditing } from '../App';
import {
  PropsWithNode,
  renderNode,
} from './';

export function Background({ node, setNode, ...rest }: PropsWithNode) {
  const isEditing = useIsEditing();
  const children = node.children?.map((n) =>
    renderNode({
      node: n,
      setNode: (newNode) =>
        setNode({
          ...node,
          children: node.children?.map((child) =>
            child === n ? newNode : child
          ),
        }),
    })
  );

  if (isEditing) {
    return (
      <div className="w-full h-full" style={node.styles} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      {children}
    </Html>
  );
}
