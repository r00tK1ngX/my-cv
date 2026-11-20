export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  home = false,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  home?: boolean;
}) {
  const Heading = home ? "h2" : "h1";
  return (
    <div className="section-heading reveal">
      <span className="eyebrow">◈ {eyebrow}</span>
      <Heading>
        {title} <span className="accent">{accent}</span>
      </Heading>
      <p>{description}</p>
    </div>
  );
}
