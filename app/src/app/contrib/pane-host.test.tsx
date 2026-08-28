import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

import { ContributedRightPaneBody, PANES_AREA } from './pane-host'

afterEach(cleanup)

it('exposes a close control for a contributed workspace pane', () => {
  const onClose = vi.fn()
  const rendered = render(
    <ContributedRightPaneBody onClose={onClose} pane={{ area: PANES_AREA, id: 'test:routines', title: 'Cronjobs' }} />
  )

  fireEvent.click(rendered.getByRole('button', { name: 'Close Cronjobs' }))

  expect(onClose).toHaveBeenCalledOnce()
})
