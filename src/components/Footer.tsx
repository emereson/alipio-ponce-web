import { socialLinks } from "../pages/Home";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h4 className="text-xl md:text-3xl font-bold mb-6 md:mb-8">
          ¿Deseas más información sobre el proceso de admisión?
        </h4>
        <div className="flex justify-center gap-6 md:gap-8 mb-8 md:mb-12">
          {socialLinks.slice(0, 3).map((link) => (
            <a
              key={link.label + "-ft"}
              href={link.href}
              className="text-3xl md:text-4xl hover:text-yellow-500 transition-transform hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className={link.icon}></i>
            </a>
          ))}
        </div>
        <div className="border-t border-white/10 pt-8 text-gray-400 text-[10px] md:text-sm">
          <p className="font-bold text-yellow-500 mb-2 italic tracking-widest uppercase">
            "Disciplina y Valores"
          </p>
          <p>
            © 2026 Colegio Alipio Ponce Satipo. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
