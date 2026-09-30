import styled from "styled-components";
import { Input } from "antd";

export const StyledPassword = styled(Input.Password)`
  && {
    box-sizing: border-box;
    height: 53px;
    min-height: 53px;
    padding: 0 12px;
    border-radius: 12px;
    box-shadow: none;
  }

  && input.ant-input {
    box-sizing: border-box;
    height: auto !important;
    min-height: 0 !important;
    padding: 0 !important;
    border: 0 !important;
    box-shadow: none !important;
  }
`;
