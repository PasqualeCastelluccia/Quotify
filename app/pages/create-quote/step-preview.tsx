import { Card } from '@/app/components/ui/card'

interface StepPreviewProps {
  previewHTML: string
}

export function StepPreview({ previewHTML }: StepPreviewProps) {
  return (
    <Card className="p-6 flex-1 overflow-hidden">
      <div className="w-full h-full overflow-auto bg-white p-8">
        <iframe
          srcDoc={previewHTML}
          className="w-full h-full border-0"
          style={{ minHeight: '800px' }}
          title="Anteprima Preventivo"
        />
      </div>
    </Card>
  )
}
