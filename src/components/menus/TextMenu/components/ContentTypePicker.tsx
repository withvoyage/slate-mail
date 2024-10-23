import { useMemo } from 'react';

import {
  LucideIcon,
  Pilcrow,
} from 'lucide-react';
import {
  ActionIcon,
  Button,
  cn,
} from 'slate-ui';

import { Surface } from '@/components/ui/Surface';
import * as Dropdown from '@radix-ui/react-dropdown-menu';

export type ContentTypePickerOption = {
  label: string;
  id: string;
  type: "option";
  disabled: () => boolean;
  isActive: () => boolean;
  onClick: () => void;
  icon: LucideIcon;
};

export type ContentTypePickerCategory = {
  label: string;
  id: string;
  type: "category";
};

export type ContentPickerOptions = Array<
  ContentTypePickerOption | ContentTypePickerCategory
>;

export type ContentTypePickerProps = {
  options: ContentPickerOptions;
};

const isOption = (
  option: ContentTypePickerOption | ContentTypePickerCategory
): option is ContentTypePickerOption => option.type === "option";
const isCategory = (
  option: ContentTypePickerOption | ContentTypePickerCategory
): option is ContentTypePickerCategory => option.type === "category";

export const ContentTypePicker = ({ options }: ContentTypePickerProps) => {
  const activeItem = useMemo(
    () =>
      options.find((option) => option.type === "option" && option.isActive()),
    [options]
  );

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <ActionIcon
          variant={"primary"}
          icon={(activeItem?.type === "option" && activeItem.icon) || Pilcrow}
        />
      </Dropdown.Trigger>
      <Dropdown.Content asChild>
        <Surface className="flex flex-col gap-1 p-2">
          {options.map((option) => {
            if (isOption(option)) {
              return (
                <Button
                  key={option.id}
                  onClick={option.onClick}
                  variant={option.isActive() ? "primary" : "subtle"}
                  iconLeft={option.icon}
                  className={cn(!option.isActive() && "hover:bg-muted")}
                >
                  {option.label}
                </Button>
              );
            } else if (isCategory(option)) {
              return (
                <div
                  className="mt-2 first:mt-0 text-xs font-semibold mb-1 uppercase text-muted px-1.5"
                  key={option.id}
                >
                  {option.label}
                </div>
              );
            }
          })}
        </Surface>
      </Dropdown.Content>
    </Dropdown.Root>
  );
};
