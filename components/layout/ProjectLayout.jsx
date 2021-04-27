import ProjectHeader from "./ProjectHeader"

export const ProjectLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100s bg-opacity-50 bg-gradient-to-t from-white">
      <ProjectHeader />
      {children}
    </div>
  )
}