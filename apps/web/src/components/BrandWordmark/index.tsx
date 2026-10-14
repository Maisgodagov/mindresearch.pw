import styled from "styled-components";
import "./font.css";

const Wordmark = styled.span`
  display: inline-block;
  vertical-align: middle;
  line-height: 1.15;
  white-space: nowrap;
  text-align: left;

  > b { display: block; font: inherit; }
  > small {
    display: block;
    margin-top: 2px;
    font-family: "Caveat", cursive;
    font-size: max(16px, .85em);
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: 0;
  }
`;

export function BrandWordmark() {
  return <Wordmark className="brand-wordmark"><b>mindresearch</b><small>by <span className="brand-author" style={{ display: "inline" }}>Евгения Годагова</span></small></Wordmark>;
}
