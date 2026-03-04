"use client"

import { Github, Linkedin, Mail } from "lucide-react"

const team = [
  {
    name: "Ashmin Aryal",
    role: "Team Lead / STAR File Author",
    contributions: [
      "Created consolidated star.json including metadata, sample content, and agent configurations",
      "Project architecture and workflow coordination",
      "Documentation and team management",
    ],
    initials: "AA",
  },
  {
    name: "Victor Kamanja",
    role: "Frontend Developer / PRD Author",
    contributions: [
      "Defined project requirements and technical specifications",
      "Frontend UI/UX implementation",
      "Risk and mitigation strategies documentation",
    ],
    initials: "VK",
  },
  {
    name: "Phuntshok Wangdruk",
    role: "Backend Developer / Agents Developer",
    contributions: [
      "Developed AI agents including Persona and Security Guardian",
      "Backend API and security infrastructure",
      "MCP server implementation",
    ],
    initials: "PW",
  },
]

export function TeamSection() {
  return (
    <section id="team" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <span className="text-primary font-mono text-sm">THE TEAM</span>
          <h2 className="text-4xl font-bold text-foreground">
            Meet <span className="text-primary">DigitalMind</span> Team
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A collaborative team of developers passionate about cybersecurity, 
            AI-assisted development, and building secure web applications.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-card border border-border rounded-xl p-6 space-y-6 hover:border-primary/50 transition-colors group text-center"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <span className="text-2xl font-bold text-primary">{member.initials}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary">{member.role}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-left">
                <span className="text-xs font-mono text-muted-foreground">CONTRIBUTIONS</span>
                <ul className="space-y-2">
                  {member.contributions.map((contribution, index) => (
                    <li
                      key={index}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary mt-1.5 w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                      <span>{contribution}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-border">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={`${member.name} GitHub`}
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={`${member.name} LinkedIn`}
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={`Email ${member.name}`}
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
