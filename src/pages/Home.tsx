interface SocialLink {
  label: string;
  href: string;
  icon: string;
  colorClass: string;
}

export const socialLinks: SocialLink[] = [
  {
    label: "Whatsapp",
    href: "http://bit.ly/informesymatriculas",
    icon: "bx bxl-whatsapp",
    colorClass: "hover:bg-green-600",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/alipio.ponce.359",
    icon: "bx bxl-facebook-square",
    colorClass: "hover:bg-blue-700",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/alipioponcesatipo/",
    icon: "bx bxl-instagram-alt",
    colorClass: "hover:bg-pink-600",
  },
  {
    label: "Tiktok",
    href: "https://www.tiktok.com/@alipioponcesatipo",
    icon: "bx bxl-tiktok",
    colorClass: "hover:bg-black",
  },
  {
    label: "Maps",
    href: "https://www.google.com/maps/place/Colegio+ALIPIO+PONCE+-+Satipo/@-11.2353135,-74.6397717,17z/data=!3m1!4b1!4m6!3m5!1s0x910bc119eeb6fd9d:0x181aefeb7fa019ca!8m2!3d-11.2353188!4d-74.6371968!16s%2Fg%2F11fjxfvnkd?entry=ttu",
    icon: "bx bxs-map",
    colorClass: "hover:bg-red-600",
  },
];

const Home = () => {
  return (
    <main className="flex flex-col w-full bg-slate-50 overflow-x-hidden">
      {/* SECCIÓN HERO - Ajustada para móviles */}
      <section className="relative h-[90vh] md:h-[85vh] w-full overflow-hidden">
        <img
          src="./inicio.jpeg"
          alt="Inicio Alipio Ponce"
          className="w-full h-full object-cover scale-105"
        />
        {/* Overlay optimizado */}
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-slate-900 flex flex-col items-center justify-center p-4 text-center">
          <h2 className="text-white text-3xl sm:text-4xl md:text-7xl font-black mb-4 tracking-tighter drop-shadow-2xl px-2">
            COLEGIO PRE POLICIAL <br />
            <span className="text-yellow-500 underline decoration-red-600 underline-offset-4 md:underline-offset-8">
              "ALIPIO PONCE"
            </span>
          </h2>
          <p className="text-gray-200 text-base md:text-xl mb-8 md:mb-10 font-medium max-w-2xl px-4">
            Formando líderes con disciplina, estudio y valores en la provincia
            de Satipo.
          </p>

          {/* Redes sociales: Flex-wrap y scroll prevenido */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-full px-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold transition-all duration-300 ${link.colorClass}`}
              >
                <i className={`${link.icon} text-lg md:text-xl`}></i>
                <span className="text-[10px] md:text-sm uppercase tracking-wider">
                  {link.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN DE IDENTIDAD - Responsive Grid */}
      <section className="max-w-7xl mx-auto py-16 md:py-24 px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-32">
        {/* ARTÍCULO: MISIÓN */}
        <article className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="relative group order-1">
            <div className="absolute -inset-2 md:-inset-4 bg-yellow-500/20 rounded-3xl blur-2xl transition duration-500"></div>
            <img
              src="./mision.jpeg"
              alt="Misión Institucional"
              className="relative rounded-3xl shadow-xl w-full h-64 sm:h-80 md:h-112.5 object-cover border-b-8 border-yellow-500"
            />
          </div>
          <div className="flex flex-col space-y-4 md:space-y-6 order-2">
            <span className="text-red-600 font-black tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm">
              INSTITUCIONAL
            </span>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 uppercase">
              Misión
            </h3>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light border-l-4 border-slate-200 pl-4 md:pl-8 italic">
              "Cambiar la vida de nuestros estudiantes y colaboradores, formando
              jóvenes líderes, autónomos, disciplinados, responsables y
              respetuosos para servir a la sociedad."
            </p>
          </div>
        </article>

        {/* ARTÍCULO: VISIÓN */}
        <article className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* En móvil la imagen va primero, en desktop se mantiene a la derecha */}
          <div className="order-1 lg:order-2 relative group">
            <div className="absolute -inset-2 md:-inset-4 bg-red-600/10 rounded-3xl blur-2xl transition duration-500"></div>
            <img
              src="./primary.jpeg"
              alt="Visión Institucional"
              className="relative rounded-3xl shadow-xl w-full h-64 sm:h-80 md:h-112.5 object-cover border-b-8 border-red-600"
            />
          </div>
          <div className="flex flex-col space-y-4 md:space-y-6 order-2 lg:order-1 lg:text-right">
            <span className="text-yellow-600 font-black tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm">
              PROYECCIÓN
            </span>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 uppercase">
              Visión
            </h3>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light border-l-4 lg:border-l-0 lg:border-r-4 border-slate-200 pl-4 lg:pl-0 lg:pr-4">
              Ser el 2030 una institución líder a nivel regional con los más
              exigentes estándares de calidad, siendo reconocida por sus logros
              académicos, deportivos y culturales.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
};

export default Home;
