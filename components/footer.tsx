"use client"

import { Shield, Github, Linkedin, Mail, ExternalLink } from "lucide-react"

const footerLinks = {
  project: [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "AI Agents", href: "#agents" },
    { label: "Team", href: "#team" },
  ],
  resources: [
    { label: "Documentation", href: "https://github.com/ashmin7/digital-twin-DigitalMind", external: true },
    { label: "GitHub", href: "https://github.com/ashmin7/digital-twin-DigitalMind", external: true },
    { label: "PRD", href: "https://github.com/ashmin7/digital-twin-DigitalMind/blob/main/docs/prd.md", external: true },
    { label: "Design Doc", href: "https://github.com/ashmin7/digital-twin-DigitalMind/blob/main/docs/design.md", external: true },
  ],
  security: [
    { label: "OWASP", href: "https://owasp.org", external: true },
    { label: "Security Policy", href: "#" },
    { label: "Responsible Disclosure", href: "#" },
    { label: "Audit Logs", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-2 text-foreground font-bold text-lg">
              <Shield className="w-6 h-6 text-primary" />
              <span>Digital Twin III</span>
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              A cyber-hardened personal portfolio with integrated AI agents, real-time 
              threat detection, and security analytics. Built by the DigitalMind Team.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/ashmin7/digital-twin-DigitalMind"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Project links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm">Project</h4>
            <ul className="space-y-3">
              {footerLinks.project.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm inline-flex items-center gap-1"
                  >
                    {link.label}
                    {link.external && <ExternalLink className="w-3 h-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Security links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm">Security</h4>
            <ul className="space-y-3">
              {footerLinks.security.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm inline-flex items-center gap-1"
                  >
                    {link.label}
                    {link.external && <ExternalLink className="w-3 h-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} DigitalMind Team. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
