import { afterEach, describe, expect, it } from 'vitest'

import {
  $mobileLayoutPreset,
  isMobileFocusLayout,
  panesFlippedForViewport,
  paneSidesForViewport,
  setMobileLayoutPreset
} from './mobile-layout'

describe('mobile layout preset', () => {
  afterEach(() => setMobileLayoutPreset('default'))

  it('enables Focus only at the mobile breakpoint', () => {
    expect(isMobileFocusLayout(true, 'focus')).toBe(true)
    expect(isMobileFocusLayout(false, 'focus')).toBe(false)
    expect(isMobileFocusLayout(true, 'default')).toBe(false)
  })

  it('updates the reactive preset', () => {
    setMobileLayoutPreset('focus')

    expect($mobileLayoutPreset.get()).toBe('focus')
  })

  it('keeps Sessions and Bots on the left on mobile without changing the desktop flip', () => {
    expect(paneSidesForViewport(true, true)).toEqual({ railSide: 'right', sidebarSide: 'left' })
    expect(paneSidesForViewport(false, true)).toEqual({ railSide: 'left', sidebarSide: 'right' })
    expect(panesFlippedForViewport(true, true)).toBe(false)
    expect(panesFlippedForViewport(false, true)).toBe(true)
  })
})
