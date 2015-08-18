

var CoS = CoS || {};

CoS.ProfileBolivia = function( ctx, config ) {
    config = config || {};
    config.domains = config.domains || [
        { name: 'Economia', subdomains: ["Las Oportunidades para Mejorar la Vida Económica", "Ingresos Económicos (Bienestar Financiero)", "Acceso al Mercado", "Acceso a Productos para Consumir", "Producción Económica", "La producción económica para el consumo en Bolivia", "la producción económica para la exportación"] },

        { name: 'Ambiente', subdomains: ["Medio Ambiente", "Clima", "Agua Potable", "Vida Silvestre", "Energía (Gas y Luz)", "Espacio Suficiente para el Recreo", "Ambiente Limpio"] },

        { name: 'Cultural', subdomains: ["La comunidad valora la cultura", "Participacion en los aspectos culturales de la vestimenta tradicional", "Participacion en los aspectos culturales de la religión", "Participacion en los aspectos culturales de las festividades comunitarias", "Participacion en los aspectos culturales de las tradiciones familiares", "Participacion en los aspectos culturales del idioma", "La transferencia o creencia de los conociemtos originarios"] },

        { name: 'Social', subdomains: ["Ambiente Político", "Servicios de Salud", "Comunidad en el área de salud", "Área de Educación", "Toma de Decisiones", "Confianza", ""] }
        ];

    CoS.GenericCircle.call( this, ctx, config );

};
CoS.ProfileBolivia.prototype = Object.create(CoS.GenericCircle.prototype);

// Register this as the circle factory class
CoS.circleFactory = CoS.ProfileBolivia;

