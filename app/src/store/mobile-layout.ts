import type { Codec } from '@/lib/persisted'
import { persistentAtom } from '@/lib/persisted'

export type MobileLayoutPreset = 'default' | 'focus'

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
