import { useStore } from '@nanostores/react'

import { useWorkspaceRightPanes } from '@/app/contrib/pane-host'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  preventCloseButtonAutoFocus
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { useI18n } from '@/i18n'
import { triggerHaptic } from '@/lib/haptics'
import { cn } from '@/lib/utils'
import { CHAT_SIDEBAR_PANE_ID, FILE_BROWSER_PANE_ID } from '@/store/layout'
import { $mobileLayoutPreset, type MobileLayoutPreset, setMobileLayoutPreset } from '@/store/mobile-layout'
import { $paneStates, setPaneOpen } from '@/store/panes'

interface LayoutPickerProps {
  mobile: boolean
  onOpenChange: (open: boolean) => void
  open: boolean
}

function LayoutThumbnail({ preset }: { preset: MobileLayoutPreset }) {
  return (
    <div aria-hidden className="flex h-14 w-full gap-0.5 text-foreground">
      {preset === 'default' ? (
        <>
          <div className="w-[22%] rounded-[3px] bg-current opacity-15" />
          <div className="flex-1 rounded-[3px] bg-current opacity-20" />
          <div className="w-[24%] rounded-[3px] bg-current opacity-15" />
        </>
      ) : (
        <>
          <div className="w-[18%] rounded-[3px] bg-current opacity-15" />
          <div className="flex-1 rounded-[3px] bg-current opacity-25" />
        </>
      )}
    </div>
  )
}

export function LayoutPicker({ mobile, onOpenChange, open }: LayoutPickerProps) {
  const { t } = useI18n()
  const activePreset = useStore($mobileLayoutPreset)
  const paneStates = useStore($paneStates)
  const workspacePanes = useWorkspaceRightPanes()

  const presets: Array<{ description: string; id: MobileLayoutPreset; title: string }> = [
    {
      description: t.zones.mobileDefaultDescription,
      id: 'default',
      title: t.zones.mobileDefault
    },
    {
      description: t.zones.mobileFocusDescription,
      id: 'focus',
      title: t.zones.mobileFocus
    }
  ]

  const desktopPanes = [
    { defaultOpen: true, id: CHAT_SIDEBAR_PANE_ID, title: t.sidebar.sessions },
    { defaultOpen: false, id: FILE_BROWSER_PANE_ID, title: t.zones.filesPane },
    ...workspacePanes.map(pane => ({ defaultOpen: true, id: `contrib:${pane.id}`, title: pane.title ?? pane.id }))
  ]

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="w-[calc(100vw-2rem)] max-w-sm"
        onOpenAutoFocus={preventCloseButtonAutoFocus}
        showCloseButton={false}
      >
        <DialogHeader className="text-left">
          <DialogTitle>{t.zones.editTitle}</DialogTitle>
          <DialogDescription>{mobile ? t.zones.mobileEditHint : t.zones.desktopEditHint}</DialogDescription>
        </DialogHeader>

        {mobile ? (
          <div aria-label={t.zones.templates} className="grid grid-cols-2 gap-2" role="radiogroup">
            {presets.map(preset => {
              const active = activePreset === preset.id

              return (
                <button
                  aria-checked={active}
                  className={cn(
                    'flex min-w-0 flex-col gap-2 rounded-lg border p-2 text-left transition-colors',
                    active
                      ? 'border-(--ui-accent) bg-(--ui-row-active-background)'
                      : 'border-(--ui-stroke-secondary) hover:border-(--ui-stroke-primary) hover:bg-(--ui-row-hover-background)'
                  )}
                  key={preset.id}
                  onClick={() => {
                    if (!active) {
                      triggerHaptic('selection')
                      setMobileLayoutPreset(preset.id)
                    }
                  }}
                  role="radio"
                  type="button"
                >
                  <LayoutThumbnail preset={preset.id} />
                  <span className="text-xs font-medium text-foreground">{preset.title}</span>
                  <span className="text-[0.6875rem] leading-4 text-(--ui-text-tertiary)">{preset.description}</span>
                </button>
              )
            })}
          </div>
        ) : (
          <section aria-label={t.zones.panes} className="flex flex-col gap-2">
            <h3 className="text-[0.6875rem] font-medium tracking-wide text-(--ui-text-tertiary) uppercase">
              {t.zones.panes}
            </h3>
            <div className="divide-y divide-(--ui-stroke-quaternary) overflow-hidden rounded-lg border border-(--ui-stroke-secondary)">
              {desktopPanes.map(pane => {
                const checked = paneStates[pane.id]?.open ?? pane.defaultOpen

                return (
                  <div className="flex min-h-10 items-center gap-3 px-3 py-2" key={pane.id}>
                    <span className="min-w-0 flex-1 truncate text-xs text-foreground">{pane.title}</span>
                    <Switch
                      aria-label={pane.title}
                      checked={checked}
                      onCheckedChange={next => {
                        triggerHaptic('selection')
                        setPaneOpen(pane.id, next)
                      }}
                      size="xs"
                    />
                  </div>
                )
              })}
            </div>
          </section>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} size="sm" variant="outline">
            {t.common.done}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
