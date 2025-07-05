function obtenerFechaLimite() {
  const mesesVisible = process.env.MESES_VISIBLE || 4;
  const fechaLimite = new Date();
  //modifica el mes(setMonth) restando al mes los meses de mesesVisible
  //o resta 4 si no definimos variable de entorno
  fechaLimite.setMonth(fechaLimite.getMonth() - mesesVisible);
  return fechaLimite;
}

module.exports = { obtenerFechaLimite };
