import { Card } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'

interface StepSendEmailProps {
  emailFrom: string
  emailTo: string
  emailSubject: string
  emailBody: string
  quoteNumber: number
  quoteRevision: number
  onSubjectChange: (subject: string) => void
  onBodyChange: (body: string) => void
}

export function StepSendEmail({
  emailFrom,
  emailTo,
  emailSubject,
  emailBody,
  quoteNumber,
  quoteRevision,
  onSubjectChange,
  onBodyChange,
}: StepSendEmailProps) {
  return (
    <Card className="p-6 flex-1">
      <div className="space-y-4 max-w-4xl">
        {/* From */}
        <div>
          <Label htmlFor="emailFrom" className="text-sm font-medium text-muted-foreground">
            Da
          </Label>
          <Input id="emailFrom" value={emailFrom} disabled className="mt-1 bg-muted" />
        </div>

        {/* To */}
        <div>
          <Label htmlFor="emailTo" className="text-sm font-medium text-muted-foreground">
            A
          </Label>
          <Input id="emailTo" value={emailTo} disabled className="mt-1 bg-muted" />
        </div>

        {/* Subject */}
        <div>
          <Label htmlFor="emailSubject" className="text-sm font-medium text-muted-foreground">
            Oggetto
          </Label>
          <Input
            id="emailSubject"
            value={emailSubject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="mt-1"
            placeholder="Oggetto dell'email"
          />
        </div>

        {/* Email Body */}
        <div className="flex-1">
          <Label htmlFor="emailBody" className="text-sm font-medium text-muted-foreground">
            Messaggio
          </Label>
          <Textarea
            id="emailBody"
            value={emailBody}
            onChange={(e) => onBodyChange(e.target.value)}
            className="mt-1 min-h-[300px] font-sans"
            placeholder="Scrivi il testo dell'email..."
          />
        </div>

        {/* Attachment Info */}
        <div className="bg-muted/50 border border-border rounded-md p-3">
          <p className="text-sm text-muted-foreground">
            <strong>Allegato:</strong> preventivo_{quoteNumber}_rev{quoteRevision}.pdf
          </p>
        </div>
      </div>
    </Card>
  )
}
