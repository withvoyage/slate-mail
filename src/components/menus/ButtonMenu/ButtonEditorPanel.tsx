import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  Check,
  Link,
} from 'lucide-react';
import {
  ActionIcon,
  Switch,
  TextInput,
} from 'slate-ui';

import { Surface } from '@/components/ui/Surface';

export type ButtonEditorPanelProps = {
  initialUrl?: string;
  initialOpenInNewTab?: boolean;
  onSetButton: (url: string, openInNewTab?: boolean) => void;
};

export const useButtonEditorState = ({
  initialUrl,
  initialOpenInNewTab,
  onSetButton,
}: ButtonEditorPanelProps) => {
  const [url, setUrl] = useState(initialUrl || "");
  const [openInNewTab, setOpenInNewTab] = useState(
    initialOpenInNewTab || false
  );

  const onChange = useCallback((v: string) => {
    setUrl(v);
  }, []);

  const isValidUrl = useMemo(() => /^(\S+):(\/\/)?\S+$/.test(url), [url]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isValidUrl) {
        onSetButton(url, openInNewTab);
      }
    },
    [url, isValidUrl, openInNewTab, onSetButton]
  );

  return {
    url,
    setUrl,
    openInNewTab,
    setOpenInNewTab,
    onChange,
    handleSubmit,
    isValidUrl,
  };
};

export const ButtonEditorPanel = ({
  onSetButton,
  initialOpenInNewTab,
  initialUrl,
}: ButtonEditorPanelProps) => {
  const state = useButtonEditorState({
    onSetButton,
    initialOpenInNewTab,
    initialUrl,
  });

  return (
    <Surface className="p-2">
      <form onSubmit={state.handleSubmit} className="flex items-center gap-2">
        <TextInput
          type="url"
          iconLeft={Link}
          placeholder="Enter URL"
          value={state.url}
          onChange={state.onChange}
        />
        <ActionIcon
          icon={Check}
          type="submit"
          disabled={!state.isValidUrl}
          tooltip="Save"
        />
      </form>
      <Switch
        label="Open in new tab"
        withBody
        checked={state.openInNewTab}
        onCheckedChange={state.setOpenInNewTab}
        className="mt-1"
      />
    </Surface>
  );
};
