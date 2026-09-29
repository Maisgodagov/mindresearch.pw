import { useState, type InputHTMLAttributes } from "react";
import styled from "styled-components";
import { Eye, EyeOff } from "lucide-react";

const Wrap = styled.span`
  position: relative;
  display: block;
  width: 100%;

  input { padding-right: 52px !important; }
  .password-toggle {
    position: absolute;
    top: 50%;
    right: 8px;
    display: grid;
    width: 34px;
    height: 34px;
    place-items: center;
    margin: 0 !important;
    padding: 0;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: #718278;
    cursor: pointer;
    transform: translateY(-50%);
    transition: color .15s ease, background .15s ease;
  }
  .password-toggle:hover { background: #edf3ea; color: #3f6049; }
  .password-toggle svg { width: 17px; height: 17px; stroke-width: 1.8; }
`;

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function PasswordInput(props: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <Wrap>
      <input {...props} type={visible ? "text" : "password"} />
      <button
        className="password-toggle"
        type="button"
        aria-label={visible ? "Скрыть пароль" : "Показать пароль"}
        aria-pressed={visible}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? <Eye aria-hidden="true" /> : <EyeOff aria-hidden="true" />}
      </button>
    </Wrap>
  );
}
