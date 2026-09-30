import { Avatar as DiceAvatar, Style } from "@dicebear/core";
import lorelei from "@dicebear/styles/lorelei.json";
import { avatarBackgroundColors, avatarSeeds, defaultAvatarSeed } from "./const";
import { AvatarImage } from "./styles";
import type { StockAvatarProps } from "./types";

const style = new Style(lorelei);
const avatarCache = new Map<string, string>();

export function avatarUri(seed = defaultAvatarSeed) {
  if (!avatarCache.has(seed)) {
    avatarCache.set(seed, new DiceAvatar(style, { seed, backgroundColor: avatarBackgroundColors }).toDataUri());
  }
  return avatarCache.get(seed)!;
}

export function StockAvatar({ seed = defaultAvatarSeed, alt = "", className }: StockAvatarProps) {
  return <AvatarImage className={className} src={avatarUri(seed || defaultAvatarSeed)} alt={alt} />;
}

export { avatarSeeds } from "./const";
export type { StockAvatarProps } from "./types";
