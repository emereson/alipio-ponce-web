const EvaluacionLoading = () => {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-yellow-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">
        Cargando evaluación...
      </p>
    </div>
  );
};

export default EvaluacionLoading;
