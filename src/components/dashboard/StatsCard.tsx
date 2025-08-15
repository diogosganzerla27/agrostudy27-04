import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  variant?: 'default' | 'green' | 'earth' | 'sky'
}

export const StatsCard = ({ title, value, icon: Icon, description, variant = 'default' }: StatsCardProps) => {
  const variantStyles = {
    default: "bg-card",
    green: "bg-gradient-to-br from-agro-green/5 to-agro-green/10 border-agro-green/20",
    earth: "bg-gradient-to-br from-agro-earth/5 to-agro-earth/10 border-agro-earth/20",
    sky: "bg-gradient-to-br from-agro-sky/5 to-agro-sky/10 border-agro-sky/20"
  }

  const iconStyles = {
    default: "text-muted-foreground",
    green: "text-agro-green",
    earth: "text-agro-earth",
    sky: "text-agro-sky"
  }

  return (
    <Card className={`${variantStyles[variant]} transition-all duration-300 hover:shadow-md border`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${iconStyles[variant]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}