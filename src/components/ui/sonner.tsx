import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[hsl(var(--ds-color-card-main))] group-[.toaster]:text-[hsl(var(--ds-color-ink))] group-[.toaster]:border-[hsl(var(--ds-color-border))] group-[.toaster]:shadow-[var(--ds-elevation-glass)]",
          description: "group-[.toast]:text-[hsl(var(--ds-color-ink-60))]",
          actionButton:
            "group-[.toast]:bg-[hsl(var(--ds-color-ink))] group-[.toast]:text-[hsl(var(--ds-color-white))]",
          cancelButton:
            "group-[.toast]:bg-[hsl(var(--ds-color-panel))] group-[.toast]:text-[hsl(var(--ds-color-ink-60))]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
