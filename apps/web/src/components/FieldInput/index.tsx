import { inputFieldDefaults } from "./const";
import type { Props } from "./types";
import { StyledCheckbox, StyledInput, StyledRadio } from "./styles";

export function FieldInput(props: Props) {
  const {
    type,
    checked,
    defaultChecked,
    onChange,
    size: _nativeSize,
    ...rest
  } = props;
  if (type === "checkbox") {
    return (
      <StyledCheckbox
        {...rest}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange as never}
      />
    );
  }
  if (type === "radio") {
    return (
      <StyledRadio
        {...rest}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange as never}
      />
    );
  }
  return (
    <StyledInput
      size={inputFieldDefaults.size}
      type={type}
      {...rest}
      onChange={onChange}
    />
  );
}

export type { Props as FieldInputProps } from "./types";
