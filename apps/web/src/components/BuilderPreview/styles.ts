import styled from "styled-components";
import { Button, Card, Page, Shell } from "../../ui";
import { FieldInput } from "../FieldInput";

export const Layer = styled.div`
  position: fixed; inset: 0; z-index: 100; overflow: auto; background: #f3f6f0;
`;
export const PreviewPage = styled(Page)`min-height: 100dvh;`;
export const PreviewShell = styled(Shell)`padding-bottom: 60px;`;
export const Toolbar = styled.div`
  position: sticky; top: 0; z-index: 5; margin: 0 calc(50% - 50vw);
  padding: 10px max(16px, calc((100vw - 720px) / 2)); display: flex;
  align-items: center; justify-content: space-between; gap: 14px;
  background: rgba(246, 248, 244, .94); border-bottom: 1px solid #dce5da;
  backdrop-filter: blur(14px);
  .context { display: flex; align-items: center; gap: 9px; color: #526f5b; font-size: 12px; }
  .context b { display: block; color: #344d3b; font-size: 13px; }
  .close { display: inline-flex; align-items: center; gap: 7px; padding: 10px 13px; border: 1px solid #cbd8cb; border-radius: 11px; background: #fff; color: #405b48; font-weight: 750; }
`;
export const Brand = styled.header`
  padding: 24px 0 10px; display: flex; align-items: center; gap: 10px; color: #526f5b; font-weight: 750;
`;
export const Welcome = styled(Card)`
  margin: 6vh auto 0; padding: clamp(28px, 7vw, 56px);
  h1 { font: 500 clamp(34px, 7vw, 54px) / 1.08 var(--font-heading), serif; margin: 18px 0; color: #2f4938; }
  p { font-size: 17px; line-height: 1.65; color: #5d6b61; white-space: pre-line; }
  .meta { display: flex; gap: 18px; color: #728077; font-size: 14px; margin: 26px 0; flex-wrap: wrap; }
  .empty { padding: 12px 14px; border-radius: 12px; background: #f4efe3; color: #766847; font-size: 13px; }
`;
export const Progress = styled.div`
  position: sticky; top: 61px; padding: 10px 0; background: rgba(243, 246, 240, .9); backdrop-filter: blur(12px); z-index: 2;
  .line { height: 5px; background: #dfe7dc; border-radius: 9px; overflow: hidden; }
  .line i { display: block; height: 100%; background: #6e8e76; transition: width .25s; }
  .caption { display: flex; justify-content: space-between; margin-bottom: 7px; color: #748178; font-size: 11px; }
`;
export const QuestionCard = styled(Card)`
  margin: 4vh auto 24px; padding: clamp(24px, 6vw, 48px); min-height: 440px; display: flex; flex-direction: column;
  .eyebrow { color: #738278; font-size: 13px; }
  .question { font: 500 clamp(25px, 5vw, 36px) / 1.25 var(--font-heading), serif; color: #293c30; margin: 18px 0 28px; }
  .hint { margin: -16px 0 24px; color: #6e7f73; font-size: 14px; }
`;
export const Options = styled.div`display: grid; gap: 10px; margin: auto 0;`;
export const Choice = styled(Button)<{ $active: boolean }>`
  text-align: left; display: flex; align-items: center; gap: 13px; width: 100%; padding: 15px 16px;
  border-radius: 16px; border: 1px solid ${p => p.$active ? "#78977f" : "#dbe3da"};
  background: ${p => p.$active ? "#e5eee3" : "#fff"}; color: #304036; min-height: 54px;
  .dot { width: 22px; height: 22px; border-radius: 50%; border: 1px solid #9bab9e; display: grid; place-items: center; flex: none; background: ${p => p.$active ? "#65836d" : "transparent"}; color: white; }
`;
export const AnswerInput = styled(FieldInput)`
  width: 100%; border: 0; border-bottom: 2px solid #b8c7ba; background: transparent;
  padding: 14px 4px; font-size: 20px; color: #293c30; outline: none;
  &:focus { border-color: #607f68; }
`;
export const Navigation = styled.div`
  display: flex; align-items: center; justify-content: space-between; margin-top: 30px; gap: 10px;
  .back { background: transparent; color: #526f5b; padding: 12px; }
  .preview-note { color: #839087; font-size: 11px; text-align: center; }
`;
export const Done = styled(Card)`
  margin: 6vh auto 0; padding: clamp(28px, 7vw, 56px); background: #fff;
  .badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 999px; background: #e4eee1; color: #55755e; font-size: 12px; }
  h1 { font: 500 clamp(34px, 7vw, 52px) / 1.1 var(--font-heading), serif; color: #304a38; margin: 20px 0 10px; }
  p { color: #65736a; font-size: 16px; line-height: 1.6; white-space: pre-line; }
  .scores { margin-top: 24px; padding: 15px; border: 1px dashed #b8c9b7; border-radius: 14px; color: #718078; font-size: 13px; }
`;
