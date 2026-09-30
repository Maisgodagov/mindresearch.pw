import styled from "styled-components";
import { Button, Card } from "../../ui";

export const Wrap = styled.div<{ $embedded: boolean }>`
  width: ${(p) => (p.$embedded ? "100%" : "min(100% - 32px,1400px)")};
  margin: auto;
  padding-bottom: 60px;
`;
export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 26px 0;
  .brand {
    display: flex;
    gap: 10px;
    align-items: center;
    font-weight: 800;
    color: #496452;
  }
  button {
    border: 0;
    background: none;
    color: #68776d;
  }
`;
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;
export const Stat = styled(Card)`
  padding: 22px;
  display: flex;
  gap: 15px;
  align-items: center;
  b {
    display: block;
    font-size: 28px;
    color: #31493a;
  }
  span {
    color: #758178;
    font-size: 13px;
  }
`;
export const Panel = styled(Card)`
  padding: 24px;
  margin-top: 18px;
  overflow: hidden;
  h2 {
    font:
      500 24px var(--font-heading),
      serif;
    margin: 0 0 20px;
  }
  .toolbar {
    display: flex;
    gap: 12px;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  .link {
    padding: 10px 13px;
    background: #edf2eb;
    border-radius: 12px;
    color: #496452;
    font-size: 13px;
  }
  .copy-link {
    min-height: 38px;
    padding: 8px 13px;
    border-radius: 11px;
    font-size: 13px;
  }
`;
export const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 110;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(28, 40, 31, 0.48);
  backdrop-filter: blur(4px);
`;
export const ConfirmModal = styled(Card)`
  width: min(100%, 470px);
  padding: 26px;
  border-radius: 22px;
  position: relative;
  .close {
    position: absolute;
    right: 16px;
    top: 16px;
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 10px;
    background: #edf2eb;
    color: #53665a;
  }
  h2 {
    font:
      600 25px var(--font-heading),
      serif;
    color: #344d3b;
    margin: 0 42px 11px 0;
  }
  p {
    color: #69776e;
    line-height: 1.6;
    font-size: 14px;
  }
  .warning {
    padding: 12px 13px;
    border-radius: 12px;
    background: #f7f1e8;
    color: #716548;
    font-size: 12px;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 22px;
  }
  .cancel {
    border: 1px solid #cfdbce;
    background: #fff;
    color: #52675a;
    border-radius: 12px;
    padding: 11px 15px;
    font-weight: 700;
  }
  .confirm {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 0;
    background: #9a5752;
    color: #fff;
    border-radius: 12px;
    padding: 11px 15px;
    font-weight: 750;
  }
  .confirm:hover {
    background: #874844;
  }
  .confirm:disabled {
    opacity: 0.6;
  }
`;
