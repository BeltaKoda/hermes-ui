import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { PANES_AREA } from '@/app/contrib/pane-host'
import { registry } from '@/contrib/registry'
import { CHAT_SIDEBAR_PANE_ID, FILE_BROWSER_PANE_ID } from '@/store/layout'
import { $mobileLayoutPreset, setMobileLayoutPreset } from '@/store/mobile-layout'
import { $paneStates, setPaneOpen } from '@/store/panes'

import { LayoutPicker } from './layout-picker'

const disposers: Array<() => void> = []

describe('LayoutPicker', () => {
  afterEach(() => {
    cleanup()
    setMobileLayoutPreset('default')
    setPaneOpen(CHAT_SIDEBAR_PANE_ID, true)
    setPaneOpen(FILE_BROWSER_PANE_ID, false)
    disposers.splice(0).forEach(dispose => dispose())
  })

  it('selects mobile Focus and exposes the active choice', () => {
    const rendered = render(<LayoutPicker mobile onOpenChange={vi.fn()} open />)
    const focus = rendered.getByRole('radio', { name: /Focus/ })

    expect(focus.getAttribute('aria-checked')).toBe('false')

    fireEvent.click(focus)

    expect($mobileLayoutPreset.get()).toBe('focus')
    expect(focus.getAttribute('aria-checked')).toBe('true')
  })

  it('closes from Done without changing the selected preset', () => {
    const onOpenChange = vi.fn()

    setMobileLayoutPreset('focus')
    const rendered = render(<LayoutPicker mobile onOpenChange={onOpenChange} open />)
    fireEvent.click(rendered.getByRole('button', { name: 'Done' }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect($mobileLayoutPreset.get()).toBe('focus')
  })

  it('toggles contributed desktop panes so a closed pane can be restored', () => {
    const paneId = 'test:routines'
    const storeId = `contrib:${paneId}`

    disposers.push(
      registry.register({
        area: PANES_AREA,
        data: { dock: { pane: 'workspace', pos: 'right' } },
        id: paneId,
        title: 'Cronjobs'
      })
    )
    setPaneOpen(storeId, true)

    const rendered = render(<LayoutPicker mobile={false} onOpenChange={vi.fn()} open />)
    const cronjobs = rendered.getByRole('switch', { name: 'Cronjobs' })

    expect(cronjobs.getAttribute('data-state')).toBe('checked')
    fireEvent.click(cronjobs)
    expect($paneStates.get()[storeId]?.open).toBe(false)
  })
})
