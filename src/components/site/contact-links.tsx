export type SiteContacts = {
  email?: string;
  github?: string;
  x?: string;
};

export function ContactLinks({
  contacts,
  detailed = false,
}: {
  contacts?: SiteContacts;
  detailed?: boolean;
}) {
  const email = contacts?.email?.replace(/^mailto:/, "");
  const links = [
    {
      label: "GitHub",
      href: contacts?.github,
      detail: contacts?.github
        ? new URL(contacts.github).pathname.replace(/^\/+|\/+$/g, "")
        : "",
    },
    {
      label: "X",
      href: contacts?.x,
      detail: contacts?.x
        ? `@${new URL(contacts.x).pathname.replace(/^\/+|\/+$/g, "")}`
        : "",
    },
    { label: "Email", href: email ? `mailto:${email}` : "", detail: email },
  ].filter((link) => link.href);

  if (!links.length) return null;

  return (
    <nav
      className={
        detailed ? "landscape-contact-details" : "landscape-social-links"
      }
      aria-label="个人联系方式"
    >
      {links.map(({ label, href, detail }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" key={label}>
          {detailed ? (
            <>
              <span className="landscape-contact-label">{label}</span>
              <span className="landscape-contact-value">{detail}</span>
            </>
          ) : (
            label
          )}
          <span aria-hidden="true"> ↗</span>
        </a>
      ))}
    </nav>
  );
}
