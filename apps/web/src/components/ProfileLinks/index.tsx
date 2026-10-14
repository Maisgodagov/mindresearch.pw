import {
  ExternalLink,
  Instagram,
  Send,
  Youtube,
  AtSign,
  Link as LinkIcon,
} from "lucide-react";
import styled from "styled-components";
import {
  safeHref,
  socialNetworks,
  type ProfileLinks as Links,
} from "../../profileLinks";
const LinksList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
  a {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 42px;
    padding: 9px 13px;
    border: 1px solid #d9e4d6;
    border-radius: 10px;
    color: #36583d;
    background: #f4f8f1;
    text-decoration: none;
    font-size: 14px;
    line-height: 1.35;
    overflow-wrap: anywhere;
    max-width: 100%;
  }
  a:hover {
    background: #e8f0e3;
    border-color: #9bb595;
  }
  a:focus-visible {
    outline: 2px solid #52764b;
    outline-offset: 3px;
  }
  svg {
    flex: none;
  }
`;
export function ProfileLinks({ value }: { value?: Links }) {
  if (!value) return null;
  const icons = {
    instagram: Instagram,
    telegram: Send,
    youtube: Youtube,
    vk: AtSign,
    threads: AtSign,
    twitter: AtSign,
  };
  const entries = [
    ...socialNetworks.flatMap((n) => {
      const href = value[n.key] && safeHref(value[n.key]!);
      return href ? [{ label: n.label, href, Icon: icons[n.key] }] : [];
    }),
    ...(value.links ?? []).flatMap((link) => {
      const href = safeHref(link.url);
      return href ? [{ label: link.label, href, Icon: LinkIcon }] : [];
    }),
  ];
  if (!entries.length) return null;
  return (
    <LinksList aria-label="Ссылки автора">
      {entries.map((e, i) => (
        <a key={i} href={e.href} target="_blank" rel="noopener noreferrer">
          <e.Icon size={16} />
          {e.label}
          <ExternalLink size={12} />
        </a>
      ))}
    </LinksList>
  );
}
export function LinkedBio({ text }: { text: string }) {
  const pieces = text.split(/(https?:\/\/[^\s<>"«»]+)/gi);
  return (
    <>
      {pieces.map((piece, i) => {
        if (!/^https?:\/\//i.test(piece)) return piece;
        const clean = piece.replace(/[.,;!?)]+$/, "");
        const href = safeHref(clean);
        return href ? (
          <span key={i}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#426c48",
                textDecoration: "underline",
                overflowWrap: "anywhere",
              }}
            >
              {clean}
            </a>
            {piece.slice(clean.length)}
          </span>
        ) : (
          piece
        );
      })}
    </>
  );
}
