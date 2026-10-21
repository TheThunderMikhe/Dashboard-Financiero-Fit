# Cómo cargar gasto, inversión y utilidad

Los ingresos reales no se editan aquí. Siguen en `index.html`, en los arreglos `*Raw` y en `facilityDataStore`, para no reescribir cifras que ya están en uso. Gasto, inversión y utilidad se declaran en `data/metricas.js`.

Mientras una métrica tenga `ejemplo: true`, el tablero muestra la franja **Datos de ejemplo** y no presenta esas cifras como reales. Los montos de ejemplo son redondos (múltiplos de 10,000) y el ajuste R² aparece como «—».

## Forma de cada unidad

No incluya la clave `global`: el consolidado se suma solo a partir de las ocho unidades.

`real` tiene 33 números, en este orden: enero 2024 a septiembre 2026.

`q4` tiene 3 objetos, octubre, noviembre y diciembre 2026.

`y2027` tiene 12 objetos, enero a diciembre 2027.

```js
coapa: {
  title: 'Unidad Deportiva Coapa',
  subtitle: '33 meses reales (Ene 24 - Sep 26) • Pronóstico: Oct 26 a Dic 27',
  tag: 'Instalación Premium',
  r2: '0.90',
  betaTrend: '+$12,000 / mes',
  real: [ /* 33 números */ ],
  q4: [
    { val: 1000000, low: 900000, high: 1100000 },
    { val: 1000000, low: 900000, high: 1100000 },
    { val: 1000000, low: 900000, high: 1100000 }
  ],
  y2027: [ /* 12 objetos { val, low, high } */ ],
  budgets: { '2026-10-01': 1000000, '2026-11-01': 1000000, '2026-12-01': 1000000 }
}
```

`budgets` es opcional y solo cubre el cierre de 2026 (los tres meses en los que ingresos ya compara contra presupuesto). `low` y `high` son el intervalo de confianza. Si todavía no hay ajuste estadístico, puede poner el mismo número en `val`, `low` y `high`, y usar `r2: '—'` y `betaTrend: '—'`.

Las claves de unidad son: `coapa`, `cuemanco`, `azc`, `tlalli`, `coacalco`, `com`, `izcalli`, `lasalle`.

## Sustituir el ejemplo

1. Abra `data/metricas.js`.
2. En la métrica correspondiente, ponga `ejemplo: false`.
3. Reemplace `unidades: null` por un objeto con las ocho unidades, en la forma de arriba.
4. Puede borrar `bases`: solo sirve para dibujar el ejemplo.

## Utilidad

`utilidad.calcular: true` significa: si no hay `unidades`, la utilidad de cada mes es ingresos menos gasto (también se restan los límites del intervalo cuando los dos existen).

Eso solo ocurre cuando el gasto ya es real (`gasto.ejemplo: false`). No se resta un gasto de ejemplo a los ingresos reales, porque el resultado parecería una utilidad verdadera.

Hoy la utilidad que se ve es otra serie de ejemplo, independiente. Cuando cargue el gasto real, deje `utilidad.unidades` en `null`, `ejemplo: false` y `calcular: true` para usar ingresos − gasto. Si prefiere cargar la utilidad ya calculada, pegue `unidades` como en el gasto: eso tiene prioridad sobre el cálculo.

## Qué significa el color

- Ingresos y utilidad: subir es favorable (verde) y bajar es desfavorable (rojo).
- Gasto: bajar es favorable (verde) y subir es desfavorable (rojo).
- Inversión: la variación se muestra en gris, sin calificarla. Un aumento de inversión no es, por sí solo, bueno ni malo.
