import { Select } from 'slate-ui';
import { SelectItem } from 'slate-ui/dist/cjs/components/Select/Select.types';

const FONT_SIZES: SelectItem<string>[] = [
  { name: "Smaller", id: "12px" },
  { name: "Small", id: "14px" },
  { name: "Medium", id: "" },
  { name: "Large", id: "18px" },
  { name: "Extra Large", id: "24px" },
];

export type FontSizePickerProps = {
  onChange: (value: string) => void; // eslint-disable-line no-unused-vars
  value: string;
};

export const FontSizePicker = ({ onChange, value }: FontSizePickerProps) => {
  const currentValue = FONT_SIZES.find((size) => size.id === value);

  return (
    <Select
      value={currentValue?.id ?? null}
      items={FONT_SIZES}
      onChange={(id) => onChange(id ?? "")}
    />
  );
};
