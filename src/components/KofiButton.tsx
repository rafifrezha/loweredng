// Same destination and label as Ko-fi's widget (kofiwidget2, id N4N41UTMV3),
// rendered as a plain link: the widget script draws with document.write,
// which does nothing once a React app has loaded.
export const KOFI_SUPPORT_URL = 'https://ko-fi.com/N4N41UTMV3';

interface Props {
  /** Lift above the sticky download bar while it is on screen. */
  raised: boolean;
}

export function KofiButton({ raised }: Props) {
  return (
    <a
      className={`kofi-float${raised ? ' is-raised' : ''}`}
      href={KOFI_SUPPORT_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src="https://storage.ko-fi.com/cdn/cup-border.png" alt="" width={22} height={15} />
      Support me on Ko-fi
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
