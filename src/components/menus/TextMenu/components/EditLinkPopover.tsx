import { Link } from "lucide-react";
import { ActionIcon, Popover } from "slate-ui";

import { LinkEditorPanel } from "@/components/menus/LinkMenu/LinkEditorPanel";

export type EditLinkPopoverProps = {
  onSetLink: (link: string, openInNewTab?: boolean) => void;
};

export const EditLinkPopover = ({ onSetLink }: EditLinkPopoverProps) => {
  return (
    <Popover content={<LinkEditorPanel onSetLink={onSetLink} />} side="top">
      <ActionIcon icon={Link} tooltip="Set Link" variant="subtle" />
    </Popover>
  );
};
