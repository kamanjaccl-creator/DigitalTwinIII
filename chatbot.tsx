"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Award,
  Briefcase,
  GraduationCap,
  Globe,
  Shield,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Experience {
  title: string
  company: string
  location?: string
  period: string
  responsibilities: string[]
}

interface Education {
  degree: string
  institution: string
  location?: string
  period: string
  description?: string
}

interface Certification {
  name: string
  issuer: string
  date: string
}

const contactInfo = {
  email: "kamanjavictor29@gmail.com",
  phone: "0423950568",
  location: "Australia",
  credly: "credly.com/users/victor-kamanja",
}

const careerObjective =
  "Experienced IT personnel with proficiency in installing and configuring hardware and software, managing virtual environments, and maintaining network systems and security. Proficient in troubleshooting and resolving technical issues for end-users, with expertise in Windows and Linux operating systems, Microsoft 365 and Business Central/Navision, and various software applications. Skilled in managing helpdesk tickets, providing remote support, and implementing IT solutions to improve efficiency and productivity. Excellent communication and interpersonal skills, with a passion for delivering exceptional customer service to meet the needs of diverse users."

const experiences: Experience[] = [
  {
    title: "System Implementer",
    company: "Dynasoft Business Solutions Ltd",
    period: "09/2023 - 01/2025",
    responsibilities: [
      "Configuring and customizing Microsoft Dynamics NAV and 365 Business Central ERP Solutions for clients, tailoring it to their unique business processes and requirements.",
      "Designing and implementing solutions that enhance financial management, human resource, procurement and overall business efficiency within Microsoft Dynamics 365 Business Central.",
      "System setup, data migration, and user training.",
      "Conducting user acceptance testing (UAT) to validate system functionality and ensure it meets client expectations.",
      "Providing ongoing support, troubleshooting, and system maintenance post-implementation, ensuring continuous system reliability.",
      "Implementation and support of Microsoft 365 products.",
    ],
  },
  {
    title: "Infrastructure and Security Intern",
    company: "Smart Applications International",
    period: "01/2023 - 04/2023",
    responsibilities: [
      "Installation and configuration of virtual servers.",
      "Network design and configuration of networking devices: routers, firewalls, switches and IP phones.",
      "Monitoring and troubleshooting of servers and network using Nagios.",
      "Asset management.",
      "Active directory and domain management: adding computers to domain and resetting of passwords.",
      "Staff network, VPN and printers support.",
    ],
  },
  {
    title: "Technical Engineer: Office Automation",
    company: "The Copy Cat Ltd, Westlands, Nairobi",
    period: "07/2022 - 01/2023",
    responsibilities: [
      "Configuration of Electronic Tax Registers (types A, B and C).",
      "Integrating ETR devices with Client ERP Systems like QuickBooks, Microsoft Dynamics, SAP and Tally.",
      "Providing onsite and remote customer support and troubleshooting of client systems integrated with TIMS system.",
      "Linking ETR devices to KRA servers.",
      "Training clients how to use new Tax Invoice Management System.",
    ],
  },
  {
    title: "Packaging and Dispatch Assistant",
    company: "WEEE Centre - Digital Literacy Program, Utawala Nairobi",
    period: "09/2021 - 10/2021",
    responsibilities: [
      "Keeping record, crosschecking and packaging of laptops, tablets, access points and hard disks given by government for the Digital Literacy Program.",
    ],
  },
  {
    title: "Industrial Attachment",
    company: "WEEE Centre / Computers for Schools Kenya (CFSK), Utawala Nairobi",
    period: "06/2021 - 09/2021",
    responsibilities: [
      "Data wiping.",
      "Physical cleaning of computers and accessories.",
      "Software installation and upgrade.",
      "Computer maintenance and virus cleaning.",
      "Scrapping of obsolete computers.",
      "Data Entry.",
    ],
  },
]

const education: Education[] = [
  {
    degree: "Masters in Information Technology (Cyber Security)",
    institution: "The Institute of International Studies",
    location: "Sydney, Australia",
    period: "03/2025 - Present",
    description: "Masters degree major in Cyber Security",
  },
  {
    degree: "Bachelor of Science in Business Computing",
    institution: "Jomo Kenyatta University of Agriculture and Technology",
    period: "2018 - 2022",
    description: "Undergraduate Degree",
  },
  {
    degree: "Kenya Certificate of Secondary Education",
    institution: "Alliance High School",
    period: "2014 - 2017",
  },
]

const certifications: Certification[] = [
  { name: "ISO 20000 - Principles of IT Service Management System", issuer: "Alison Education Company", date: "Jul 2023" },
  { name: "Introduction to Cyber Security", issuer: "Cisco Networking Academy", date: "Feb 2023" },
  { name: "Cisco Certified Network Associate (CCNA 1)", issuer: "Jomo Kenyatta University of Agriculture and Technology", date: "Jan 2023" },
  { name: "Cyber Readiness Program", issuer: "Cyber Readiness Institute", date: "Dec 2022" },
  { name: "International Computer Driving License (ICDL)", issuer: "Nairobi Institute of Business Studies", date: "Dec 2017" },
]

const skills = ["Good communication", "Creativity", "Problem solving", "Team work", "Eloquent and articulate"]
const languages = ["English", "Kiswahili"]

export default function ResumePage() {
  const [expandedExp, setExpandedExp] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <h1 className="text-lg font-semibold text-foreground">Resume</h1>
              </div>
            </div>
            <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Name & Contact */}
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground text-balance">
              Victor Kamanja Rurira
            </h1>
            <p className="text-xl text-primary font-mono">IT Personnel & Cyber Security Student</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="w-4 h-4" />
              {contactInfo.email}
            </a>
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {contactInfo.phone}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {contactInfo.location}
            </span>
            <a
              href={`https://${contactInfo.credly}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Credly Profile
            </a>
          </div>
        </div>

        {/* Career Objective */}
        <section className="bg-card border border-border rounded-xl p-8">
          <h2 className="text-sm font-mono text-primary mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            CAREER OBJECTIVE
          </h2>
          <p className="text-muted-foreground leading-relaxed">{careerObjective}</p>
        </section>

        {/* Experience */}
        <section className="space-y-6">
          <h2 className="text-sm font-mono text-primary flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            EXPERIENCE
          </h2>
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedExp(expandedExp === index ? null : index)}
                  className="w-full p-6 flex items-start justify-between text-left"
                >
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">{exp.title}</h3>
                    <p className="text-sm text-primary font-medium">{exp.company}</p>
                    <p className="text-xs text-muted-foreground font-mono">{exp.period}</p>
                  </div>
                  {expandedExp === index ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
                  )}
                </button>
                {expandedExp === index && (
                  <div className="px-6 pb-6 border-t border-border pt-4">
                    <ul className="space-y-3">
                      {exp.responsibilities.map((resp, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                          <span className="leading-relaxed">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="space-y-6">
          <h2 className="text-sm font-mono text-primary flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            EDUCATION
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {education.map((edu, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 space-y-3 hover:border-primary/50 transition-colors"
              >
                <p className="text-xs text-muted-foreground font-mono">{edu.period}</p>
                <h3 className="text-base font-semibold text-foreground leading-snug">{edu.degree}</h3>
                <p className="text-sm text-primary">{edu.institution}</p>
                {edu.location && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {edu.location}
                  </p>
                )}
                {edu.description && (
                  <p className="text-xs text-muted-foreground">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="space-y-6">
          <h2 className="text-sm font-mono text-primary flex items-center gap-2">
            <Award className="w-4 h-4" />
            CERTIFICATIONS
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-5 space-y-2 hover:border-primary/50 transition-colors"
              >
                <p className="text-xs text-muted-foreground font-mono">{cert.date}</p>
                <h3 className="text-sm font-semibold text-foreground leading-snug">{cert.name}</h3>
                <p className="text-xs text-primary">{cert.issuer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills & Languages */}
        <div className="grid gap-6 md:grid-cols-2">
          <section className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-mono text-primary">ABILITIES</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-lg font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
          <section className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-mono text-primary flex items-center gap-2">
              <Globe className="w-4 h-4" />
              LANGUAGES
            </h2>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-lg font-medium"
                >
                  {lang}
                </span>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
