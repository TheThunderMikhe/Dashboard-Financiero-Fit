/**
 * Gasto, inversión y utilidad.
 * Las cifras de ingresos reales siguen en index.html (facilityDataStore):
 * no se movieron para no alterar los números ya auditados.
 *
 * Forma de cada unidad (la misma que ingresos, sin el consolidado global;
 * el global se suma solo):
 *
 * {
 *   title: 'Unidad Deportiva Coapa',
 *   subtitle: '33 meses reales…',
 *   tag: 'Instalación Premium',
 *   r2: '0.90',              // texto libre; use '—' si aún no hay ajuste
 *   betaTrend: '+$10,000 / mes',
 *   real: [ 33 números, Ene 2024 → Sep 2026 ],
 *   q4: [ { val, low, high }, { val, low, high }, { val, low, high } ],  // Oct, Nov, Dic 2026
 *   y2027: [ 12 objetos { val, low, high }, Ene → Dic ],
 *   budgets: { '2026-10-01': 0, '2026-11-01': 0, '2026-12-01': 0 }  // opcional
 * }
 *
 * Cómo cargar datos reales: reemplace `bases` dejando `unidades` con las 8
 * claves (coapa, cuemanco, azc, tlalli, coacalco, com, izcalli, lasalle)
 * y ponga `ejemplo: false`. Guía completa en data/README.md.
 *
 * Utilidad: si `unidades` es null y `calcular` es true, se usa ingresos − gasto
 * mes a mes, pero solo cuando el gasto ya no es de ejemplo. Mientras el gasto
 * sea de ejemplo, se muestra la serie ilustrativa de `bases` (no se resta
 * gasto ficticio a ingresos reales).
 */
const METRICAS = {
  gasto: {
    ejemplo: true,
    calcular: false,
    favorable: 'down',
    bases: {
      coapa: 2200000,
      cuemanco: 1600000,
      azc: 1200000,
      tlalli: 900000,
      coacalco: 700000,
      com: 800000,
      izcalli: 850000,
      lasalle: 750000
    },
    unidades: null
  },
  inversion: {
    ejemplo: true,
    calcular: false,
    favorable: 'neutral',
    bases: {
      coapa: 500000,
      cuemanco: 300000,
      azc: 250000,
      tlalli: 200000,
      coacalco: 150000,
      com: 400000,
      izcalli: 180000,
      lasalle: 160000
    },
    unidades: null
  },
  utilidad: {
    ejemplo: true,
    calcular: true,
    favorable: 'up',
    bases: {
      coapa: 1100000,
      cuemanco: 800000,
      azc: 600000,
      tlalli: 450000,
      coacalco: 280000,
      com: 350000,
      izcalli: 400000,
      lasalle: 320000
    },
    unidades: null
  }
};

const PERFILES_EJEMPLO = {
  gasto: [0.96, 0.94, 0.98, 1.02, 1.04, 1.10, 1.12, 1.08, 1.00, 1.02, 1.05, 1.14],
  inversion: [1.40, 0.70, 0.60, 0.80, 0.90, 0.85, 1.35, 0.75, 0.80, 0.95, 1.00, 1.20],
  utilidad: [0.88, 0.90, 0.95, 1.02, 1.12, 1.06, 1.00, 0.96, 0.98, 1.08, 1.14, 0.92]
};

function redondearEjemplo(n) {
  return Math.round(n / 10000) * 10000;
}

function construirSerieEjemplo(base, perfil) {
  const seasonal = PERFILES_EJEMPLO[perfil];
  const real = [];
  for (let i = 0; i < 33; i++) {
    const month = i % 12;
    const yearStep = Math.floor(i / 12);
    real.push(redondearEjemplo(base * seasonal[month] * (1 + yearStep * 0.03)));
  }
  const banda = redondearEjemplo(base * 0.06) || 10000;
  const proyectar = (monthIndex, factor) => {
    const val = redondearEjemplo(base * seasonal[monthIndex] * factor);
    return { val: val, low: val - banda, high: val + banda };
  };
  const q4 = [9, 10, 11].map(m => proyectar(m, 1.09));
  const y2027 = seasonal.map((_, m) => proyectar(m, 1.12));
  return {
    real: real,
    q4: q4,
    y2027: y2027,
    budgets: {
      '2026-10-01': q4[0].val,
      '2026-11-01': redondearEjemplo(q4[1].val * 0.92),
      '2026-12-01': redondearEjemplo(q4[2].val * 1.05)
    }
  };
}
