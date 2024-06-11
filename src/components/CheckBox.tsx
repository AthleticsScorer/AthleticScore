import React from "react";

interface CheckboxProps {
  id?: number;
  handleCheckChildElement?(event: React.FormEvent<HTMLInputElement>): void;
  isChecked?: boolean;
  value?: String;
}

const Checkbox = (props: CheckboxProps) => {
  return (
    <li>
      <input
        key={props.id}
        onChange={props.handleCheckChildElement}
        type="checkbox"
        checked={props.isChecked}
        value={String(props.value)}
      />
      {props.value}
    </li>
  );
};
//
export default Checkbox;
