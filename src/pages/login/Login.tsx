import { Button, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Eye, EyeOff, User, Phone, MapPin } from "lucide-react";
import { useAuthStore } from "../../auth/auth.store";
import { onInputNumber } from "../../utils/onInputs";

// Definimos la interfaz directamente para TS
interface LoginForm {
  dni: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<LoginForm>();
  const { login, savePerfil } = useAuthStore.getState();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const onSubmit = useCallback(
    async (data: LoginForm) => {
      setLoading(true);
      const url = `${import.meta.env.VITE_URL_API}/accessStudent/login`;

      try {
        const res = await axios.post(url, data);

        login(res.data.token);
        savePerfil(res.data.student);

        toast.success("Acceso concedido. Bienvenido.");
        navigate("/reporte-estudiante");
        window.location.reload();
      } catch (err) {
        console.error(err);
        toast.error("DNI o contraseña incorrectos");
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  return (
    <main className="w-full min-h-screen flex bg-slate-900 overflow-hidden">
      {/* SECCIÓN IZQUIERDA: IDENTIDAD INSTITUCIONAL (Solo Desktop) */}
      <section className="hidden lg:flex w-1/2 h-screen flex-col items-center justify-center p-10 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 relative">
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-500 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-red-600 rounded-full blur-[120px] opacity-20"></div>

        <article className="z-10 text-center space-y-6">
          <img
            className="w-48 h-auto mx-auto drop-shadow-[0_0_15px_rgba(234,179,8,0.3)] mb-8"
            src="/logo.png"
            alt="Logo Alipio Ponce"
          />
          <div className="space-y-2">
            <h1 className="text-2xl font-light tracking-[0.3em] text-slate-400 uppercase">
              Institución Educativa
            </h1>
            <h2 className="text-6xl xl:text-7xl font-black tracking-tighter text-white">
              ALIPIO{" "}
              <span className="text-yellow-500 font-outline-2">PONCE</span>
            </h2>
            <div className="h-1.5 w-24 bg-red-600 mx-auto rounded-full my-6"></div>
            <p className="text-xl font-medium text-slate-300 tracking-widest italic">
              "Disciplina y Valores"
            </p>
          </div>
          <p className="max-w-md mx-auto text-slate-500 mt-8 text-sm leading-relaxed">
            Accede a nuestra plataforma virtual para consultar reportes
            académicos, asistencia y trámites administrativos.
          </p>
        </article>
      </section>

      {/* SECCIÓN DERECHA: FORMULARIO (Móvil y Desktop) */}
      <section className="w-full lg:w-1/2 h-screen flex justify-center items-center p-4 sm:p-8 bg-transparent">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col items-center gap-6"
        >
          {/* Logo visible solo en móvil dentro del form */}
          <div className="lg:hidden mb-4 flex flex-col items-center">
            <img className="w-24 h-auto mb-4" src="/logo.png" alt="Logo" />
            <h4 className="text-2xl font-black text-slate-900 uppercase">
              Iniciar Sesión
            </h4>
          </div>

          <div className="w-full text-center space-y-2 mb-4 hidden lg:block">
            <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Iniciar Sesión
            </h4>
            <p className="text-slate-500 text-sm">
              Ingresa tus credenciales institucionales
            </p>
          </div>

          <div className="w-full flex flex-col gap-6">
            <Input
              {...register("dni")}
              isRequired
              label="DNI"
              placeholder="Ingrese su documento"
              labelPlacement="outside"
              type="text"
              variant="bordered"
              size="lg"
              classNames={{
                inputWrapper:
                  "border-slate-200 hover:border-yellow-500 focus-within:!border-yellow-500 transition-colors",
                label:
                  "font-bold text-slate-700 uppercase text-xs tracking-widest",
              }}
              endContent={<User className="text-xl text-slate-400 shrink-0" />}
              onInput={onInputNumber}
            />

            <Input
              {...register("password")}
              isRequired
              label="Contraseña"
              placeholder="••••••••••••"
              labelPlacement="outside"
              type={showPassword ? "text" : "password"}
              variant="bordered"
              size="lg"
              classNames={{
                inputWrapper:
                  "border-slate-200 hover:border-yellow-500 focus-within:!border-yellow-500 transition-colors",
                label:
                  "font-bold text-slate-700 uppercase text-xs tracking-widest",
              }}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="text-xl text-slate-400" />
                  ) : (
                    <Eye className="text-xl text-slate-400" />
                  )}
                </button>
              }
            />

            <Button
              className="w-full py-7 text-lg font-black bg-red-600 text-white shadow-xl shadow-red-600/20 mt-4 hover:bg-red-700 transition-all active:scale-95 uppercase tracking-[0.2em]"
              type="submit"
              isLoading={loading}
            >
              {loading ? "Verificando..." : "Entrar"}
            </Button>
          </div>

          {/* Enlaces de Ayuda */}
          <div className="grid grid-cols-2 gap-4 w-full pt-6 border-t border-slate-100">
            <a
              href="http://bit.ly/informesymatriculas"
              target="_blank"
              className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 hover:text-red-600 transition-colors uppercase"
            >
              <Phone size={14} /> Soporte
            </a>
            <a
              href="https://www.google.com/maps/place/Colegio+ALIPIO+PONCE+-+Satipo/@-11.2353135,-74.6397717,17z/data=!3m1!4b1!4m6!3m5!1s0x910bc119eeb6fd9d:0x181aefeb7fa019ca!8m2!3d-11.2353188!4d-74.6371968!16s%2Fg%2F11fjxfvnkd?entry=ttu"
              target="_blank"
              className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 hover:text-red-600 transition-colors uppercase"
            >
              <MapPin size={14} /> Ubícanos
            </a>
          </div>

          <p className="mt-4 text-[10px] text-slate-400 text-center uppercase tracking-widest">
            © {new Date().getFullYear()} I.E. Alipio Ponce - Satipo
          </p>
        </form>
      </section>
    </main>
  );
}
