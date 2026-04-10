const links = [
  { title: "About", link: "" },
  { title: "Contact me", link: "" },
  { title: "Follow me", link: "" },
];

export default function Header() {
  return (
    <header className="flex justify-between text-white w-full max-w-5xl border-b border-b-white/15 py-5 px-3 items-center">
      <h2 className="text-2xl font-bold">Welcome</h2>

      <div className="flex gap-3 text-sm text-white/70">
        {links.map((e, i) => (
          <a
            className="transition duration-300 hover:text-white/90"
            key={i}
            href={e.link}
          >
            {e.title}
          </a>
        ))}
      </div>
    </header>
  );
}
