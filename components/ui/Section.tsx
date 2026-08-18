import { ReactNode } from "react";
import { Container } from "./Container";

export function Section({
  id,
  eyebrow,
  title,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`py-20 sm:py-28 ${className}`}>
      <Container>
        {(eyebrow || title) && (
          <div className="mb-10">
            {eyebrow && (
              <p className="font-mono text-sm tracking-widest text-primary uppercase">{eyebrow}</p>
            )}
            {title && (
              <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
                {title}
              </h2>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
