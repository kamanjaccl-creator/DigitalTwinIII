"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Shield, Github, Linkedin, LayoutDashboard, FileText, FlaskConical, Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "/resume", label: "Resume", isRoute: true },
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#agents", label: "AI Agents" },
  { href: "#team", label: "Team" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-foreground font-bold text-lg">
          <Shield className="w-6 h-6 text-primary" />
          <span className="hidden sm:inline">DigitalTwin III</span>
        </a>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            )
          )}
        </div>
        
        <div className="hidden md:flex items-center gap-3">
          <Link href="/sandbox">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent text-muted-foreground hover:text-foreground">
              <FlaskConical className="w-4 h-4" />
              Sandbox
            </Button>
          </Link>
          <Link href="/playground">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent text-muted-foreground hover:text-foreground">
              <Gamepad2 className="w-4 h-4" />
              Playground
            </Button>
          </Link>
          <a
            href="https://github.com/ashmin7/digital-twin-DigitalMind"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub Repository"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <Link href="/dashboard">
            <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-foreground p-2"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>
      
      {/* Mobile navigation */}
      {isOpen && (
        <div className="md:hidden bg-card border-b border-border">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                >
                  {link.label}
                </a>
              )
            )}
            <Link
              href="/sandbox"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary font-medium text-sm"
            >
              <FlaskConical className="w-4 h-4" />
              Security Sandbox
            </Link>
            <Link
              href="/playground"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary font-medium text-sm"
            >
              <Gamepad2 className="w-4 h-4" />
              Playground
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-primary font-medium text-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              Security Dashboard
            </Link>
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <a
                href="https://github.com/ashmin7/digital-twin-DigitalMind"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
