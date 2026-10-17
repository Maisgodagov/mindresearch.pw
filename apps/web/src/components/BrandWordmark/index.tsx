import styled from "styled-components";
import "./font.css";

const Wordmark = styled.span<{ $inline: boolean }>`
  display: ${p => p.$inline ? "inline-flex" : "inline-block"};
  align-items: baseline;
  gap: 6px;
  vertical-align: middle;
  line-height: 1.15;
  white-space: nowrap;
  text-align: left;

  > b { display: block; font: inherit; }
  > small {
    display: block;
    margin-top: ${p => p.$inline ? "0" : "2px"};
    font-family: "Caveat", cursive;
    font-size: ${p => p.$inline ? "1em" : "max(16px, .85em)"};
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: 0;
  }
  ${p => p.$inline && `
    .brand-author { font-size: 1.125em; }
    @media (max-width: 380px) { font-size: 14px; }
  `}
`;

export function BrandWordmark({ inline = false, showAuthor = true }: { inline?: boolean; showAuthor?: boolean }) {
  return <Wordmark $inline={inline} className="brand-wordmark"><b>mindresearch</b>{showAuthor&&<small>by <span className="brand-author" style={{ display: "inline" }}>Евгения Годагова</span></small>}</Wordmark>;
}
