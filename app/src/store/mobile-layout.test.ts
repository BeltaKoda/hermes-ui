import { afterEach, describe, expect, it } from 'vitest'

import { $mobileLayoutPreset, isMobileFocusLayout, setMobileLayoutPreset } from './mobile-layout'

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
})
