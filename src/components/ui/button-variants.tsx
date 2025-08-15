import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Variantes específicas do AgroVita
        hero: "bg-agro-green text-primary-foreground hover:bg-agro-green-light shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1",
        field: "bg-agro-field text-primary-foreground hover:bg-agro-field/90 border border-agro-field/20",
        earth: "bg-agro-earth text-primary-foreground hover:bg-agro-earth/90",
        sky: "bg-agro-sky text-primary-foreground hover:bg-agro-sky/90",
        gradient: "bg-gradient-to-r from-agro-green to-agro-field text-primary-foreground hover:shadow-lg transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)