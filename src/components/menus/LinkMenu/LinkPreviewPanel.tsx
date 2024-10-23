import {
  Pencil,
  Trash2,
} from 'lucide-react';
import { ActionIcon } from 'slate-ui';

import { Surface } from '@/components/ui/Surface';
import { Toolbar } from '@/components/ui/Toolbar';

export type LinkPreviewPanelProps = {
  url: string;
  onEdit: () => void;
  onClear: () => void;
};

export const LinkPreviewPanel = ({
  onClear,
  onEdit,
  url,
}: LinkPreviewPanelProps) => {
  return (
    <Surface className="flex items-center gap-2 p-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm underline break-all"
      >
        {url}
      </a>
      <Toolbar.Divider />
      <ActionIcon icon={Pencil} onClick={onEdit} tooltip="Edit link" />
      <ActionIcon icon={Trash2} onClick={onClear} tooltip="Remove link" />
    </Surface>
  );
};
