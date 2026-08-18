import Link from "next/link";
import { Container } from "@/components/ui/Container";

const links = [
  { href: "/#timeline", label: "Timeline" },
  { href: "/#skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/#leadership", label: "Leadership" },
  { href: "/fit", label: "Job Fit" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4 overflow-hidden">
        <Link
          href="/"
          className="shrink-0 font-mono text-sm font-semibold tracking-tight text-foreground"
        >
          Russell Lubojacky
        </Link>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <nav className="flex items-center gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="shrink-0 text-sm text-muted transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {/* Hints that more nav items exist off-screen on narrow viewports */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent sm:hidden" />
        </div>
      </Container>
    </header>
  );
}
