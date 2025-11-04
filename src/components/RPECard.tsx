import React from "react";

export default function RPECard({ min = 2, max = 4 }: { min?: number; max?: number }) {
  return (
    <div className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]">
      <h3 className="font-caveat text-2xl font-bold mb-3">Escala RPE (Percepción del Esfuerzo)</h3>

      {/* Barra 0–10 con franja recomendada */}
      <div className="relative mt-2">
        <div className="h-3 w-full rounded-full border-2 border-black overflow-hidden bg-gray-200" />
        <div
          className="h-3 rounded-full absolute top-0"
          style={{
            left: `${(min / 10) * 100}%`,
            width: `${((max - min) / 10) * 100}%`,
            background:
              "linear-gradient(90deg, rgba(250,204,21,1) 0%, rgba(253,224,71,1) 100%)",
          }}
          aria-label={`Rango recomendado de esfuerzo: ${min} a ${max}`}
          title={`Rango recomendado: ${min}–${max}`}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-3 mt-4 text-sm">
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
          <p className="font-bold mb-1">¿Qué es RPE?</p>
          <p>Es cómo <span className="font-semibold">sientes</span> el esfuerzo del 0 al 10. No necesitas medir nada.</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
          <p className="font-bold mb-1">Rango ideal para este ejercicio</p>
          <p>Mantente entre <span className="font-semibold">{min} y {max}</span>. Si pasa de ahí, baja un poco; si queda corto, sube suave.</p>
        </div>
      </div>

      <ul className="space-y-1 text-sm mt-4">
        <li><b>0</b> — Sin esfuerzo.</li>
        <li><b>1–2</b> — Muy fácil. Respiras tranquilo.</li>
        <li><b>3–4</b> — Suave. Puedes hablar sin problema.</li>
        <li><b>5–6</b> — Moderado. Respiras más profundo pero controlado.</li>
        <li><b>7–8</b> — Intenso. Conversación entrecortada.</li>
        <li><b>9–10</b> — Máximo (no usar en este plan).</li>
      </ul>
    </div>
  );
}
