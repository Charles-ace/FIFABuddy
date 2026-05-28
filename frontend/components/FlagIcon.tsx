import React from "react";

type FlagIconProps = {
  country: string;
  className?: string;
  size?: number;
};

export function FlagIcon({ country, className = "", size = 20 }: FlagIconProps) {
  const norm = country.toLowerCase().trim();

  // Custom circular SVGs for each country's flag
  if (norm.includes("england") || norm === "eng") {
    // England: White circle with red St. George's cross
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="16" cy="16" r="16" fill="#F0F0F0" />
        <rect x="13" y="0" width="6" height="32" fill="#D80027" />
        <rect x="0" y="13" width="32" height="6" fill="#D80027" />
      </svg>
    );
  }

  if (norm.includes("france") || norm === "fra") {
    // France: Blue, white, red vertical stripes
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <clipPath id="circle-clip">
          <circle cx="16" cy="16" r="16" />
        </clipPath>
        <g clipPath="url(#circle-clip)">
          <rect x="0" y="0" width="10.66" height="32" fill="#002395" />
          <rect x="10.66" y="0" width="10.68" height="32" fill="#F0F0F0" />
          <rect x="21.34" y="0" width="10.66" height="32" fill="#ED2939" />
        </g>
      </svg>
    );
  }

  if (norm.includes("brazil") || norm === "bra") {
    // Brazil: Green circle, yellow rhombus, blue center circle
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <clipPath id="circle-clip-br">
          <circle cx="16" cy="16" r="16" />
        </clipPath>
        <g clipPath="url(#circle-clip-br)">
          <rect width="32" height="32" fill="#009B3A" />
          <polygon points="16,4 28,16 16,28 4,16" fill="#FEDF00" />
          <circle cx="16" cy="16" r="6" fill="#002776" />
          <path d="M10.5 17 C13 15, 19 15, 21.5 17" stroke="#F0F0F0" strokeWidth="1" fill="none" />
        </g>
      </svg>
    );
  }

  if (norm.includes("croatia") || norm === "cro") {
    // Croatia: Red, white, blue horizontal stripes with stylized crown/shield emblem in center
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <clipPath id="circle-clip-hr">
          <circle cx="16" cy="16" r="16" />
        </clipPath>
        <g clipPath="url(#circle-clip-hr)">
          <rect x="0" y="0" width="32" height="10.66" fill="#FF0000" />
          <rect x="0" y="10.66" width="32" height="10.68" fill="#F0F0F0" />
          <rect x="0" y="21.34" width="32" height="10.66" fill="#00209F" />
          {/* Stylized shield */}
          <rect x="13.5" y="10" width="5" height="5.5" fill="#D80027" rx="0.5" />
          <rect x="14.5" y="11" width="3" height="3.5" fill="#F0F0F0" rx="0.5" />
        </g>
      </svg>
    );
  }

  if (norm.includes("netherlands") || norm === "ned" || norm === "holland") {
    // Netherlands: Red, white, blue horizontal stripes
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <clipPath id="circle-clip-nl">
          <circle cx="16" cy="16" r="16" />
        </clipPath>
        <g clipPath="url(#circle-clip-nl)">
          <rect x="0" y="0" width="32" height="10.66" fill="#AE1C28" />
          <rect x="0" y="10.66" width="32" height="10.68" fill="#F0F0F0" />
          <rect x="0" y="21.34" width="32" height="10.66" fill="#21468B" />
        </g>
      </svg>
    );
  }

  if (norm.includes("argentina") || norm === "arg") {
    // Argentina: Light blue, white, light blue horizontal stripes with a golden Sun of May
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <clipPath id="circle-clip-ar">
          <circle cx="16" cy="16" r="16" />
        </clipPath>
        <g clipPath="url(#circle-clip-ar)">
          <rect x="0" y="0" width="32" height="10.66" fill="#74ACDF" />
          <rect x="0" y="10.66" width="32" height="10.68" fill="#F0F0F0" />
          <rect x="0" y="21.34" width="32" height="10.66" fill="#74ACDF" />
          <circle cx="16" cy="16" r="2.5" fill="#F9A81A" />
        </g>
      </svg>
    );
  }

  if (norm.includes("morocco") || norm === "mar") {
    // Morocco: Red circle with a green pentagram star
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="16" cy="16" r="16" fill="#C1272D" />
        {/* Stylized star */}
        <polygon
          points="16,8 18.5,13.5 24,14 20,18 21.5,23.5 16,20.5 10.5,23.5 12,18 8,14 13.5,13.5"
          stroke="#006233"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    );
  }

  if (norm.includes("portugal") || norm === "por") {
    // Portugal: Green and red vertical stripes (2:3 split) with stylized armillary sphere/shield
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <clipPath id="circle-clip-pt">
          <circle cx="16" cy="16" r="16" />
        </clipPath>
        <g clipPath="url(#circle-clip-pt)">
          <rect x="0" y="0" width="12.8" height="32" fill="#046A38" />
          <rect x="12.8" y="0" width="19.2" height="32" fill="#DA291C" />
          <circle cx="12.8" cy="16" r="4.5" fill="#FFC72C" />
          <rect x="11.8" y="14" width="2" height="4" fill="#DA291C" />
        </g>
      </svg>
    );
  }

  if (norm.includes("spain") || norm === "esp") {
    // Spain: Red, yellow (double height), red horizontal stripes with stylized crest
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <clipPath id="circle-clip-es">
          <circle cx="16" cy="16" r="16" />
        </clipPath>
        <g clipPath="url(#circle-clip-es)">
          <rect x="0" y="0" width="32" height="8" fill="#AD1519" />
          <rect x="0" y="8" width="32" height="16" fill="#FABD00" />
          <rect x="0" y="24" width="32" height="8" fill="#AD1519" />
          <rect x="8" y="12" width="3" height="4.5" fill="#AD1519" rx="0.5" />
        </g>
      </svg>
    );
  }

  if (norm.includes("south africa") || norm === "rsa") {
    // South Africa stylized placeholder: Green circle with gold/white stripes
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="16" cy="16" r="16" fill="#007A87" />
        <polygon points="0,0 12,16 0,32" fill="#FFB81C" />
        <polygon points="0,4 9,16 0,28" fill="#000000" />
      </svg>
    );
  }

  if (norm.includes("mexico") || norm === "mex") {
    // Mexico: Green, white, red vertical stripes with brown eagle in center
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <clipPath id="circle-clip-mx">
          <circle cx="16" cy="16" r="16" />
        </clipPath>
        <g clipPath="url(#circle-clip-mx)">
          <rect x="0" y="0" width="10.66" height="32" fill="#006847" />
          <rect x="10.66" y="0" width="10.68" height="32" fill="#F0F0F0" />
          <rect x="21.34" y="0" width="10.66" height="32" fill="#C8102E" />
          <circle cx="16" cy="16" r="2" fill="#8B5A2B" />
        </g>
      </svg>
    );
  }

  if (norm.includes("south korea") || norm.includes("korea") || norm === "kor") {
    // South Korea: White background, red/blue yin-yang center, black trigram approximations
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="16" cy="16" r="16" fill="#F0F0F0" />
        <path d="M16 11 C 18.5 11, 18.5 16, 16 16 C 13.5 16, 13.5 21, 16 21 C 18.7 21, 18.7 11, 16 11" fill="#CD2E3A" />
        <path d="M16 11 C 13.3 11, 13.3 21, 16 21 C 18.5 21, 18.5 16, 16 16 C 13.5 16, 13.5 11, 16 11" fill="#0047A0" />
        <rect x="7" y="7" width="2" height="3" fill="#000000" transform="rotate(45 7 7)" />
        <rect x="23" y="7" width="2" height="3" fill="#000000" transform="rotate(-45 23 7)" />
      </svg>
    );
  }

  // Generic circular soccer ball icon as a premium fallback flag
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="16" r="15" fill="#ff5a00" stroke="#F0F0F0" strokeWidth="1" />
      <circle cx="16" cy="16" r="6" fill="#0D0C0B" />
      <path d="M16 1 L16 10 M16 22 L16 31 M1 16 L10 16 M22 16 L31 16" stroke="#F0F0F0" strokeWidth="1" />
    </svg>
  );
}
