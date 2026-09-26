const links = [
  { name: "Instagram", href: "https://www.instagram.com/" },
  { name: "Facebook", href: "https://www.facebook.com/" },
  { name: "TikTok", href: "https://www.tiktok.com/" },
] as const;

export function SocialLinks() {
  return (
    <div className="social-links">
      {links.map((link) => (
        <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
          {link.name === "Instagram" && <InstagramIcon />}
          {link.name === "Facebook" && <FacebookIcon />}
          {link.name === "TikTok" && <TikTokIcon />}
        </a>
      ))}
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <radialGradient id="luxora-ig" cx="30%" cy="110%" r="150%">
          <stop offset="0%" stopColor="#feda75" />
          <stop offset="25%" stopColor="#fa7e1e" />
          <stop offset="50%" stopColor="#d62976" />
          <stop offset="75%" stopColor="#962fbf" />
          <stop offset="100%" stopColor="#4f5bd5" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#luxora-ig)" />
      <rect x="6.2" y="6.2" width="11.6" height="11.6" rx="3.4" fill="none" stroke="#fff" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="2.7" fill="none" stroke="#fff" strokeWidth="1.7" />
      <circle cx="16.35" cy="7.7" r="1.05" fill="#fff" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#1877F2" d="M24 12.073C24 5.446 18.627 0 12 0S0 5.446 0 12.073C0 18.062 4.388 23.027 10.125 23.927v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669.876 0 1.791.156 1.791.156v2.953h-1.008c-1.49 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      <path fill="#fff" d="M16.671 15.543l.532-3.47h-3.328v-2.25c0-.949.466-1.874 1.956-1.874h1.008V4.996s-.915-.156-1.791-.156c-2.741 0-4.533 1.662-4.533 4.669v1.594H7.078v3.47h3.047v8.385a12.08 12.08 0 0 0 3.75 0v-8.385h2.796z" />
    </svg>
  );
}

function TikTokIcon() {
  const note = "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z";
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#111" />
      <g transform="translate(3.1 3.1) scale(0.74)">
        <path fill="#25F4EE" d={note} transform="translate(-0.7 0.55)" />
        <path fill="#FE2C55" d={note} transform="translate(0.7 -0.35)" />
        <path fill="#fff" d={note} />
      </g>
    </svg>
  );
}
