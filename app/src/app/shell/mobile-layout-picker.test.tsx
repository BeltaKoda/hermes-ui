import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { $mobileLayoutPreset, setMobileLayoutPreset } from '@/store/mobile-layout'

import { MobileLayoutPicker } from './mobile-layout-picker'

describe('MobileLayoutPicker', () => {
  afterEach(() => {
    cleanup()
    setMobileLayoutPreset('default')
  })

  it('selects Focus and exposes the active choice', () => {
    const rendered = render(<MobileLayoutPicker onOpenChange={vi.fn()} open />)
    const focus = rendered.getByRole('radio', { name: /Focus/ })

    expect(focus.getAttribute('aria-checked')).toBe('false')

    fireEvent.click(focus)

    expect($mobileLayoutPreset.get()).toBe('focus')
    expect(focus.getAttribute('aria-checked')).toBe('true')
  })

  it('closes from Done without changing the selected preset', () => {
    const onOpenChange = vi.fn()

    setMobileLayoutPreset('focus')
    const rendered = render(<MobileLayoutPicker onOpenChange={onOpenChange} open />)
    fireEvent.click(rendered.getByRole('button', { name: 'Done' }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect($mobileLayoutPreset.get()).toBe('focus')
  })
})
