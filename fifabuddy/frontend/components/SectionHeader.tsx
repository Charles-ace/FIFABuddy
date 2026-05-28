"use client";

type Props = {
  label: string;
  title: string;
  desc?: string;
  align?: "left" | "center";
};

export function SectionHeader({ label, title, desc, align = "left" }: Props) {
  return (
    <div style={{
      textAlign: align,
      marginBottom: 32,
    }}>
      <div className="section-label" style={{
        justifyContent: align === "center" ? "center" : "flex-start",
      }}>
        {label}
      </div>
      <h2 className="section-title gradient-text" style={{
        textAlign: align,
        maxWidth: align === "center" ? 600 : undefined,
        margin: align === "center" ? "0 auto 12px" : undefined,
      }}>
        {title}
      </h2>
      {desc && (
        <p className="section-desc" style={{
          textAlign: align,
          margin: align === "center" ? "0 auto" : undefined,
        }}>
          {desc}
        </p>
      )}
    </div>
  );
}
