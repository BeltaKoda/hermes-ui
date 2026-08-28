import { useStore } from '@nanostores/react'

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
import { useI18n } from '@/i18n'
import { triggerHaptic } from '@/lib/haptics'
import { cn } from '@/lib/utils'
import { $mobileLayoutPreset, type MobileLayoutPreset, setMobileLayoutPreset } from '@/store/mobile-layout'

interface MobileLayoutPickerProps {
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

export function MobileLayoutPicker({ onOpenChange, open }: MobileLayoutPickerProps) {
  const { t } = useI18n()
  const activePreset = useStore($mobileLayoutPreset)

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

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="w-[calc(100vw-2rem)] max-w-sm"
        onOpenAutoFocus={preventCloseButtonAutoFocus}
        showCloseButton={false}
      >
        <DialogHeader className="text-left">
          <DialogTitle>{t.zones.editTitle}</DialogTitle>
          <DialogDescription>{t.zones.mobileEditHint}</DialogDescription>
        </DialogHeader>

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

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} size="sm" variant="outline">
            {t.common.done}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
