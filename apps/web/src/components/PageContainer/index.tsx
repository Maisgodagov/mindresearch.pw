import styled from "styled-components";

/** Shared outer gutter. Embedded content inherits its parent's page spacing. */
export const PageContainer = styled.div<{ $embedded?: boolean }>`
  --page-gutter: 32px;
  width: 100%;
  min-width: 0;
  margin-inline: 0;
  padding-inline: ${({ $embedded }) => $embedded ? "0" : "var(--page-gutter)"};

  @media (max-width: 760px) {
    --page-gutter: 24px;
  }
`;
