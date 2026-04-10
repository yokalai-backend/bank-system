export default function Hero() {
  return (
    <section className="py-20 flex flex-col gap-3 bg-indigo-900/20 px-5 h-fit rounded-3xl items-center w-fit mx-5 shadow-lg">
      <h1 className="text-white text-3xl font-bold text-center">
        Bank System Simulation
      </h1>
      <p className="text-white/70 text-center">
        Serious, proffesional, and safe simulation of bank flow real system
      </p>

      <button
        className="
      bg-white/90 rounded-2xl 
      h-13 w-fit px-5 font-semibold text-gray-700 
      underline transition duration-300 
      hover:bg-white/90 
      hover:-translate-y-1 cursor-pointer 
      active:opacity-85 active:translate-y-0.5
      "
      >
        Get started
      </button>
    </section>
  );
}
