/**
 * ToastSample
 *
 * The Toast component on the /components page: four buttons that each show
 * one kind of toast. Velocity's ToastDemo does the same with green, red and
 * amber buttons whose white text doesn't reach 4.5:1; these use the outline
 * look of the other buttons on the page.
 */
import { ToastProvider, useToast } from '@/components/ui/feedback/Toast';

const kinds = [
  { variant: undefined, label: 'Default', title: 'Saved as a draft', description: 'Nothing is published yet.' },
  { variant: 'success', label: 'Success', title: 'Published', description: 'The post is live.' },
  { variant: 'error', label: 'Error', title: 'Not sent', description: 'Something went wrong. Please try again.' },
  { variant: 'warning', label: 'Warning', title: 'Unsaved changes', description: 'Save before you leave the page.' },
] as const;

function Buttons() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {kinds.map((kind) => (
        <button
          key={kind.label}
          type="button"
          className="border-border bg-background text-foreground hover:bg-secondary focus-visible:ring-ring inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          onClick={() => toast({ variant: kind.variant, title: kind.title, description: kind.description })}
        >
          {kind.label}
        </button>
      ))}
    </div>
  );
}

export default function ToastSample() {
  return (
    <ToastProvider>
      <Buttons />
    </ToastProvider>
  );
}
