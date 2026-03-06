interface Props {
  semanaNombre: string;
  evaluacionNombre: string;
}

const EvaluacionHeader = ({ semanaNombre, evaluacionNombre }: Props) => {
  return (
    <div className="mb-8">
      <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full tracking-widest uppercase">
        {semanaNombre || "Evaluación"}
      </span>
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter mt-3">
        {evaluacionNombre}
      </h1>
      <p className="text-slate-500 mt-2 font-medium">
        Lee atentamente las indicaciones antes de comenzar. Una vez iniciado el
        tiempo, no se podrá pausar.
      </p>
    </div>
  );
};

export default EvaluacionHeader;
