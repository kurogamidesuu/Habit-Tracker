import type { ReactNode } from "react"
import type { IconType } from "react-icons/lib"

const SettingTab = ({ Icon, title, content }: {
  Icon: IconType,
  title: string,
  content: ReactNode
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Icon className="text-sky-400/60 text-xs" />
        <span className="text-xs text-sky-200">{title}</span>
      </div>
      {content}
    </div>
  )
}

export default SettingTab