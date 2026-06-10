/* ============================================================
 * Icons.jsx — set de iconos SVG inline (cero dependencias).
 * Marcas: GitHub/WhatsApp/Facebook desde Simple Icons (CC0);
 * LinkedIn desde Bootstrap Icons (MIT). UI: trazos propios.
 * ============================================================ */

const BRAND_PATHS = {
  github:
    'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  whatsapp:
    'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z',
  facebook:
    'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',
};

/* LinkedIn (Bootstrap Icons, viewBox 16) */
const LINKEDIN_PATH =
  'M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z';

function Brand({ path, viewBox = '0 0 24 24', ...props }) {
  return (
    <svg
      viewBox={viewBox}
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={path} />
    </svg>
  );
}

function Stroke({ children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const GithubIcon = (p) => <Brand path={BRAND_PATHS.github} {...p} />;
export const WhatsappIcon = (p) => <Brand path={BRAND_PATHS.whatsapp} {...p} />;
export const FacebookIcon = (p) => <Brand path={BRAND_PATHS.facebook} {...p} />;
export const LinkedinIcon = (p) => <Brand path={LINKEDIN_PATH} viewBox="0 0 16 16" {...p} />;

export const MailIcon = (p) => (
  <Stroke {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </Stroke>
);

export const ArrowRightIcon = (p) => (
  <Stroke {...p}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </Stroke>
);

export const ArrowUpRightIcon = (p) => (
  <Stroke {...p}>
    <path d="M7 17 17 7" />
    <path d="M9 7h8v8" />
  </Stroke>
);

export const ArrowDownIcon = (p) => (
  <Stroke {...p}>
    <path d="M12 4v15" />
    <path d="m6 13 6 6 6-6" />
  </Stroke>
);

export const ArrowUpIcon = (p) => (
  <Stroke {...p}>
    <path d="M12 20V5" />
    <path d="m6 11 6-6 6 6" />
  </Stroke>
);

export const DownloadIcon = (p) => (
  <Stroke {...p}>
    <path d="M12 4v11" />
    <path d="m7 11 5 5 5-5" />
    <path d="M4 19.5h16" />
  </Stroke>
);

export const CopyIcon = (p) => (
  <Stroke {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" />
  </Stroke>
);

export const CheckIcon = (p) => (
  <Stroke {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </Stroke>
);

export const MenuIcon = (p) => (
  <Stroke {...p}>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h10" />
  </Stroke>
);

export const CloseIcon = (p) => (
  <Stroke {...p}>
    <path d="m5 5 14 14" />
    <path d="M19 5 5 19" />
  </Stroke>
);

/* Mapa id→icono para datos de profile.js. Este archivo solo contiene
   iconos sin estado, así que perder fast-refresh aquí es irrelevante. */
// eslint-disable-next-line react-refresh/only-export-components
export const SOCIAL_ICONS = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  whatsapp: WhatsappIcon,
  facebook: FacebookIcon,
  mail: MailIcon,
};
