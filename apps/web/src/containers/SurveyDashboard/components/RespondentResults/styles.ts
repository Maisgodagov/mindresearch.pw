import styled from "styled-components";
import { Button } from "../../../../ui";

export const TableWrap = styled.div`
  overflow: auto;
  max-width: 100%;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  margin: 0 -24px -24px;
  padding: 0 24px 24px;
`;
export const Table = styled.table`
  width: 100%;
  min-width: 1090px;
  border-collapse: collapse;
  margin-top: 10px;
  th,
  td {
    text-align: left;
    padding: 13px 10px;
    border-bottom: 1px solid #edf0eb;
    font-size: 13px;
    vertical-align: top;
  }
  th {
    color: #78837b;
    font-weight: 650;
    white-space: nowrap;
  }
  .select {
    width: 28px;
  }
  .select input {
    width: 17px;
    height: 17px;
    accent-color: #5f8269;
    cursor: pointer;
  }
  .person {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    font-size: 14px;
  }
  .expand {
    border: 0;
    background: #edf2eb;
    color: #526f5b;
    width: 28px;
    height: 28px;
    border-radius: 9px;
    display: grid;
    place-items: center;
  }
  .pill {
    display: inline-block;
    padding: 5px 9px;
    border-radius: 20px;
    background: #e7efe5;
    color: #4e6b56;
    font-size: 12px;
  }
  .pending {
    display: block;
    color: #879188;
    font-size: 12px;
    max-width: 120px;
  }
  .score {
    font-weight: 700;
    color: #3e6049;
  }
`;
export const TrashToggle = styled(Button)`
  margin: 12px 0 0 auto;
  border: 0;
  background: transparent;
  color: #89938c;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  cursor: pointer;
  &:hover {
    color: #526f5b;
  }
`;
export const TrashBox = styled.div`
  margin-top: 10px;
  border: 1px dashed #d8ded8;
  border-radius: 13px;
  padding: 14px;
  background: #fafbf9;
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
  }
  .title {
    font-weight: 700;
    color: #657269;
  }
  .items {
    display: grid;
    gap: 2px;
  }
  .item {
    display: grid;
    grid-template-columns: 25px minmax(150px, 1fr) 130px 120px;
    gap: 10px;
    align-items: center;
    padding: 9px 4px;
    border-top: 1px solid #edf0eb;
    font-size: 12px;
    color: #748078;
  }
  .item b {
    color: #45584b;
  }
  .item input {
    width: 16px;
    height: 16px;
    accent-color: #5f8269;
  }
  @media (max-width: 650px) {
    .item {
      grid-template-columns: 25px 1fr;
    }
    .meta {
      display: none;
    }
  }
`;
