import { ReactNode } from "react"

type IconHoverEffectProps = {
    children: ReactNode
    red?: boolean
    roundedFull?: boolean
}

export function IconHoverEffect({ children, red = false, roundedFull = true }: IconHoverEffectProps) {
    const colorClasses = red ?
        "outline-red-400 hover:bg-red-200 group-hover-bg-red-200 group-focus-visible:bg-red-200 focus-visible:bg-red-200"
        : "outline-gray-400 hover:bg-gray-200 group-hover-bg-gray-200 group-focus-visible:bg-gray-200 focus-visible:bg-gray-200";

    return <div className={`${roundedFull ? "rounded-full" : "rounded-lg"} p-2 transition-colors duration-200 ${colorClasses}`}>
        {children}
    </div>
}