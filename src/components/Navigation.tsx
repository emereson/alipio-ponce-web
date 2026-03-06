import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "CONÓCENOS", path: "/" },
    { name: "NIVELES", path: "/niveles" },
    { name: "GALERÍA DE FOTOS", path: "/galeria-fotos" },
    { name: "REPORTE DEL ESTUDIANTE", path: "/reporte-estudiante" },
  ];

  // Función para cerrar menú al hacer click en un link
  const closeMenu = () => setShowMenu(false);

  return (
    <nav className="sticky top-0 w-full z-50 bg-slate-900 border-b-2 border-yellow-500 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* LOGO Y NOMBRE */}
          <div className="shrink-0 flex items-center">
            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center gap-3 group"
            >
              <img
                src="/logo.png"
                alt="Logo Alipio Ponce"
                className="h-14 w-auto transform transition-transform group-hover:scale-105"
              />
              <div className="hidden md:block leading-none">
                <h1 className="text-white font-bold text-lg tracking-tight">
                  ALIPIO PONCE
                </h1>
                <p className="text-yellow-500 text-[10px] font-semibold tracking-[0.2em]">
                  SATIPO
                </p>
              </div>
            </Link>
          </div>

          {/* MENÚ DESKTOP */}
          <div className="hidden lg:block">
            <ul className="flex items-baseline space-x-6">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-xs font-bold transition-all duration-300 ${
                      location.pathname === link.path
                        ? "text-yellow-500 border-b-2 border-yellow-500 rounded-none"
                        : "text-gray-200 hover:text-yellow-400 hover:bg-white/5"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* BOTÓN MÓVIL (HAMBURGUESA) */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-white hover:text-yellow-500 focus:outline-none p-2 transition-colors"
            >
              <i className={`bx ${showMenu ? "bx-x" : "bx-menu"} text-3xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL (OVERLAY) */}
      <div
        className={`lg:hidden absolute w-full bg-slate-900 border-b border-yellow-600 transition-all duration-300 ease-in-out overflow-hidden ${
          showMenu ? "max-h-100 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="px-4 pt-2 pb-6 space-y-2 shadow-inner text-center">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                onClick={closeMenu}
                className={`block px-3 py-4 text-sm font-bold rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? "bg-yellow-500 text-slate-900"
                    : "text-gray-200 hover:bg-slate-800 hover:text-yellow-500"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
