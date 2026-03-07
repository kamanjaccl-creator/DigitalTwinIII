import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { AboutSection } from "@/components/about-section"
import { AgentsSection } from "@/components/agents-section"
import { ProjectsSection } from "@/components/projects-section"
import { TeamSection } from "@/components/team-section"
import { SecurityDashboard } from "@/components/security-dashboard"
import { Chatbot } from "@/components/chatbot"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background scroll-smooth">
      <Navigation />
      <Hero />
      <AboutSection />
      <ProjectsSection />
      <AgentsSection />
      <SecurityDashboard />
      <TeamSection />
      <Footer />
      <Chatbot />
    </main>
  )
}
