class Pokemon {
  constructor(datos) {
    this.id = datos.id;
    this.nombre = datos.name;
    this.spriteTrasero = datos.sprites.back_default;
    this.spriteFrontal = datos.sprites.front_default;
    this.altura = datos.height / 10; // decímetros -> metros
    this.peso = datos.weight / 10; // hectogramos -> kilogramos
    this.tipos = datos.types.map(({ type }) => type.name);
    this.experienciaBase = datos.base_experience;
    this.habilidades = datos.abilities.map(({ ability }) => ability.name);
    this.estadisticas = datos.stats.map(({ base_stat, stat }) => ({
      nombre: stat.name,
      valor: base_stat,
    }));
  }

  get idFormateado() {
    return String(this.id).padStart(3, "0");
  }

  get nombreFormateado() {
    return this.nombre.charAt(0).toUpperCase() + this.nombre.slice(1);
  }
}