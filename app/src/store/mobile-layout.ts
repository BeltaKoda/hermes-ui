import type { Codec } from '@/lib/persisted'
import { persistentAtom } from '@/lib/persisted'

export type MobileLayoutPreset = 'default' | 'focus'
export type MobilePaneSide = 'left' | 'right'

export const MOBILE_LAYOUT_STORAGE_KEY = 'hermes.web.mobileLayout.v1'

const mobileLayoutCodec: Codec<MobileLayoutPreset> = {
  decode: raw => (raw === 'focus' ? 'focus' : 'default'),
  encode: value => value
}

/**
 * Device-local on purpose: a phone can stay in Focus while the same account's
 * desktop browser keeps its normal multi-pane arrangement.
 */
export const $mobileLayoutPreset = persistentAtom<MobileLayoutPreset>(
  MOBILE_LAYOUT_STORAGE_KEY,
  'default',
  mobileLayoutCodec
)

export function setMobileLayoutPreset(preset: MobileLayoutPreset): void {
  $mobileLayoutPreset.set(preset)
}

export function isMobileFocusLayout(narrowViewport: boolean, preset: MobileLayoutPreset): boolean {
  return narrowViewport && preset === 'focus'
}

/**
 * Phones always keep Sessions/Bots on the left and workspace tools on the
 * right. The persisted desktop flip remains untouched and resumes when wide.
 */
export function paneSidesForViewport(
  narrowViewport: boolean,
  panesFlipped: boolean
): { railSide: MobilePaneSide; sidebarSide: MobilePaneSide } {
  const effectiveFlip = panesFlippedForViewport(narrowViewport, panesFlipped)

  return {
    railSide: effectiveFlip ? 'left' : 'right',
    sidebarSide: effectiveFlip ? 'right' : 'left'
  }
}

export function panesFlippedForViewport(narrowViewport: boolean, panesFlipped: boolean): boolean {
  return panesFlipped && !narrowViewport
}
