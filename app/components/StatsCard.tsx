import { Card } from '@/app/components/ui/card'
import { LucideIcon, ArrowRight } from 'lucide-react'
import { Button } from '@/app/components/ui/button'

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  iconColor?: string
  onNavigate?: () => void
}

export function StatsCard({ title, value, icon: Icon, iconColor = 'text-primary', onNavigate }: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg bg-muted ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
          {onNavigate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigate}
              className="text-xs font-medium gap-1 h-auto px-2 py-1"
            >
              VAI
              <ArrowRight className="h-3 w-3" />
            </Button>
          )}
        </div>
        <div>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground mt-1">{title}</p>
        </div>
      </div>
    </Card>
  )
}
