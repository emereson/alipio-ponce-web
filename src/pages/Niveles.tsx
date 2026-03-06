const Niveles = () => {
  const levelsData = [
    {
      title: "Primaria",
      description:
        "En este nivel los estimulamos a tener confianza en sí mismos, a pensar de manera independiente y asumir responsabilidades de sus propias acciones.",
      vacantes: "5to y 6to",
      image: "./primary.jpeg",
      color: "border-yellow-500",
      badge: "bg-yellow-500",
    },
    {
      title: "Secundaria",
      description:
        "Los estudiantes consolidan los conocimientos adquiridos con un método de aprendizaje intensivo de Matemáticas, Ciencias y Letras, adquiriendo hábitos de estudio, disciplina y valores.",
      vacantes: "1ro al 5to",
      image: "./secundary.jpeg",
      color: "border-red-600",
      badge: "bg-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      {/* Encabezado de Sección */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tight">
          Niveles <span className="text-red-600">Educativos</span>
        </h2>
        <div className="h-1.5 w-32 bg-yellow-500 mx-auto rounded-full"></div>
        <p className="mt-6 text-slate-600 text-lg">
          Contamos con una infraestructura moderna y una metodología enfocada en
          la excelencia académica.
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-24">
        {levelsData.map((level, index) => (
          <section
            key={level.title}
            className={`flex flex-col ${index % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12 lg:gap-20`}
          >
            {/* Imagen con efectos decorativos */}
            <div className="w-full lg:w-1/2 relative group">
              <div
                className={`absolute -inset-2 rounded-2xl blur-lg opacity-10 transition duration-500 group-hover:opacity-10 ${level.badge}`}
              ></div>
              <div className="relative overflow-hidden rounded-2xl shadow-md border-b-8 ${level.color}">
                <img
                  src={level.image}
                  alt={`Nivel ${level.title}`}
                  className="w-full h-75 md:h-112.5 object-cover transform transition duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Contenido de Texto */}
            <article className="w-full lg:w-1/2 space-y-6">
              <div
                className={`inline-flex items-center px-4 py-1 rounded-full text-white text-xs font-bold uppercase tracking-widest ${level.badge}`}
              >
                Admisión Abierta
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic">
                {level.title}
              </h3>
              <p className="text-xl text-slate-600 leading-relaxed font-light">
                {level.description}
              </p>

              <div className="pt-4">
                <div
                  className={`inline-block border-l-4 ${level.color} pl-6 py-2`}
                >
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    Grados disponibles:
                  </p>
                  <h4 className="text-2xl font-black text-slate-800 tracking-tight">
                    Vacantes: {level.vacantes}
                  </h4>
                </div>
              </div>

              <div className="pt-6">
                <a
                  href="http://bit.ly/informesymatriculas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-yellow-500/20 active:scale-95"
                >
                  <i className="bx bx-info-circle text-xl text-yellow-500"></i>
                  SOLICITAR INFORMES
                </a>
              </div>
            </article>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Niveles;
