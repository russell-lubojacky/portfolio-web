import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-2 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Russell Lubojacky</p>
        <div className="flex gap-6">
          <a href="mailto:russell.lubojacky@gmail.com" className="hover:text-primary">
            russell.lubojacky@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/rdlubojacky/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary"
          >
            LinkedIn
          </a>
        </div>
      </Container>
    </footer>
  );
}
