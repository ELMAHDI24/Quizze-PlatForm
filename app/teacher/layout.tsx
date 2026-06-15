import { TeacherSidebar } from "@/components/teacher-sidebar"

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 w-full max-w-[1600px] mx-auto bg-slate-50/30">
      <TeacherSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  )
}
