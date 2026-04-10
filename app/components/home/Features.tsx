const features = [
  { title: "Auth", desc: "Complex auth for user safety and privacy" },
  {
    title: "Withdraw",
    desc: "Safe built widhdraw following real banking system",
  },
  {
    title: "Deposit",
    desc: "Safe deposit, no worry about the safety",
  },
  {
    title: "Transfer",
    desc: "Users are able to transfer to another user safely",
  },
];

export default function Features() {
  return (
    <div className="flex flex-col items-center gap-5">
      <h1 className="text-white font-bold text-2xl">Features</h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 items-center justify-center gap-4">
        {features.map((item, i) => (
          <div
            key={i}
            className="flex flex-col h-30 justify-center bg-gray-900/50 py-3 px-3 items-center w-60 rounded-4xl shadow-lg transition duration-300 hover:opacity-80 hover:scale-95"
          >
            <h3 className="text-white font-semibold">{item.title}</h3>

            <p className="text-white/80 font-sm text-center">{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
