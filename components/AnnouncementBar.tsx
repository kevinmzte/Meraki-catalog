export default function AnnouncementBar() {
  const message = "Por la compra de 5 ítems, delivery gratis";

  return (
    <div className="overflow-hidden bg-gray-900 py-2.5 text-white">
      <div className="flex w-max animate-marquee">
        {/* Primera copia */}
        <div className="flex shrink-0 items-center">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`first-${index}`}
              className="flex items-center whitespace-nowrap"
            >
              <span className="text-xs font-medium uppercase tracking-[0.18em] sm:text-sm">
                {message}
              </span>

              <span className="mx-8 text-xs text-white/50">
                ✦
              </span>
            </div>
          ))}
        </div>

        {/* Segunda copia para que el loop sea continuo */}
        <div
          className="flex shrink-0 items-center"
          aria-hidden="true"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`second-${index}`}
              className="flex items-center whitespace-nowrap"
            >
              <span className="text-xs font-medium uppercase tracking-[0.18em] sm:text-sm">
                {message}
              </span>

              <span className="mx-8 text-xs text-white/50">
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}