// --- DATOS DEL CRONOGRAMA Y CAPACIDADES ---
const ROOM_MAP = { 
  "p1": "Piso 1", 
  "p2": "Piso 2", 
  "sp": "Spinning", 
  "ug": "Subsuelo",
  "musc": "Musculación"
};

const ROOM_CAPACITIES = {
  "p1": 20,
  "p2": 20,
  "sp": 25,
  "ug": 15,
  "musc": 99
};

const DAY_NAMES = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
const DAY_NAMES_SHORT = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

const CATEGORY_MAP = {
  "PILATES": "Control",
  "STRETCHING": "Control",
  "BALANCE": "Control",
  "YOGA": "Control",
  "SPINNING": "Spinning",
  "SPIN/CROSS": "Spinning",
  "SPIN/CORE": "Spinning",
  "FUNCIONAL": "Funcional",
  "BODY PUMP": "Aeróbicos",
  "ZUMBA": "Aeróbicos",
  "BODY JAM": "Aeróbicos",
  "BODY ATTACK": "Aeróbicos",
  "LESMILLS GRIT": "Aeróbicos",
  "LESMILLS CORE": "Aeróbicos",
  "BODY COMBAT": "Aeróbicos",
  "POWER JUMP": "Aeróbicos",
  "HORARIO DE SALA (ABIERTO)": "Musculación",
  "TURNO MAÑANA": "Musculación",
  "TURNO TARDE": "Musculación",
  "TURNO NOCHE": "Musculación",
  "TURNO SÁBADO": "Musculación",
  "SALA ABIERTA (ENTRENAMIENTO LIBRE)": "Musculación",
  "GUÍA DE ENTRENAMIENTO": "Musculación",
  "MUSCULACIÓN": "Musculación",
  "CARDIO": "Cardio",
  "SALA DE CARDIO": "Cardio",

  "Pilates": "Control",
  "Stretching": "Control",
  "Balance": "Control",
  "Yoga": "Control",
  "Spinning": "Spinning",
  "Spin/Cross": "Spinning",
  "Spin/Core": "Spinning",
  "Funcional": "Funcional",
  "Body Pump": "Aeróbicos",
  "Zumba": "Aeróbicos",
  "Body Jam": "Aeróbicos",
  "Body Attack": "Aeróbicos",
  "LesMills Grit": "Aeróbicos",
  "LesMills Core": "Aeróbicos",
  "Body Combat": "Aeróbicos",
  "Power Jump": "Aeróbicos",
  "Musculación": "Musculación",
  "Horario de Sala (Abierto)": "Musculación",
  "Turno Mañana": "Musculación",
  "Turno Tarde": "Musculación",
  "Turno Noche": "Musculación",
  "Turno Sábado": "Musculación",
  "Sala Abierta (Entrenamiento Libre)": "Musculación",
  "Guía de Entrenamiento": "Musculación",
  "Cardio": "Cardio",
  "Sala de Cardio": "Cardio"
};

// Cronograma semanal con IDs únicos por clase
const SCHEDULE_DATA = {
  1: { // Lunes
    "p1": [
      { id: "lun_p1_0830", t: "08:30", n: "PILATES", i: "TEO", cap: 18 },
      { id: "lun_p1_0930", t: "09:30", n: "BODY PUMP", i: "TEO", cap: 22 },
      { id: "lun_p1_1030", t: "10:30", n: "ZUMBA", i: "DAVID", cap: 25 },
      { id: "lun_p1_1800", t: "18:00", n: "BODY PUMP", i: "CINTHYA", cap: 22 },
      { id: "lun_p1_1900", t: "19:00", n: "BODY PUMP", i: "JESSY", cap: 22 },
      { id: "lun_p1_2000", t: "20:00", n: "BODY PUMP", i: "SANDRA", cap: 22 }
    ],
    "p2": [
      { id: "lun_p2_0930", t: "09:30", n: "STRETCHING", i: "BEATRIZ", cap: 20 },
      { id: "lun_p2_1700", t: "17:00", n: "POWER JUMP", i: "TEO", cap: 18 },
      { id: "lun_p2_1800", t: "18:00", n: "PILATES", i: "ALE", cap: 18 },
      { id: "lun_p2_1900", t: "19:00", n: "POWER JUMP", i: "SANDRA", cap: 18 },
      { id: "lun_p2_2000", t: "20:00", n: "LESMILLS CORE", i: "CINTHYA", cap: 20 }
    ],
    "sp": [
      { id: "lun_sp_0600", t: "06:00", n: "SPINNING", i: "ANA", cap: 25 },
      { id: "lun_sp_0830", t: "08:30", n: "SPINNING", i: "MA. ELENA", cap: 25 },
      { id: "lun_sp_1800", t: "18:00", n: "SPINNING", i: "REBECA", cap: 25 },
      { id: "lun_sp_1900", t: "19:00", n: "SPINNING", i: "JORGE S.", cap: 25 }
    ],
    "ug": [
      { id: "lun_ug_0730", t: "07:30", n: "FUNCIONAL", i: "CINTHYA", cap: 15 },
      { id: "lun_ug_0830", t: "08:30", n: "FUNCIONAL", i: "CINTHYA", cap: 15 },
      { id: "lun_ug_0930", t: "09:30", n: "FUNCIONAL", i: "CINTHYA", cap: 15 },
      { id: "lun_ug_1900", t: "19:00", n: "FUNCIONAL", i: "CINTHYA", cap: 15 }
    ]
  },
  2: { // Martes
    "p1": [
      { id: "mar_p1_0830", t: "08:30", n: "PILATES", i: "ELIANA", cap: 18 },
      { id: "mar_p1_0930", t: "09:30", n: "LESMILLS CORE", i: "CINTHYA", cap: 20 },
      { id: "mar_p1_1030", t: "10:30", n: "ZUMBA", i: "DAVID", cap: 25 },
      { id: "mar_p1_1800", t: "18:00", n: "PILATES", i: "ALE", cap: 18 },
      { id: "mar_p1_1900", t: "19:00", n: "BODY PUMP", i: "SANDRA", cap: 22 },
      { id: "mar_p1_2000", t: "20:00", n: "ZUMBA", i: "BRED", cap: 25 }
    ],
    "p2": [
      { id: "mar_p2_0930", t: "09:30", n: "POWER JUMP", i: "RICKY", cap: 18 },
      { id: "mar_p2_1700", t: "17:00", n: "POWER JUMP", i: "RICKY", cap: 18 },
      { id: "mar_p2_1800", t: "18:00", n: "LESMILLS CORE", i: "SANDRA", cap: 20 },
      { id: "mar_p2_1900", t: "19:00", n: "POWER JUMP", i: "RICKY", cap: 18 },
      { id: "mar_p2_2000", t: "20:00", n: "BODY ATTACK", i: "JESSY", cap: 22 }
    ],
    "sp": [
      { id: "mar_sp_0830", t: "08:30", n: "SPINNING", i: "MA. ELENA", cap: 25 },
      { id: "mar_sp_1800", t: "18:00", n: "SPINNING", i: "JORGE S.", cap: 25 },
      { id: "mar_sp_1900", t: "19:00", n: "SPINNING", i: "JORGE S.", cap: 25 }
    ],
    "ug": [
      { id: "mar_ug_0600", t: "06:00", n: "FUNCIONAL", i: "CINTHYA", cap: 15 },
      { id: "mar_ug_0730", t: "07:30", n: "FUNCIONAL", i: "ARACELY", cap: 15 },
      { id: "mar_ug_0830", t: "08:30", n: "FUNCIONAL", i: "CINTHYA", cap: 15 },
      { id: "mar_ug_1800", t: "18:00", n: "FUNCIONAL", i: "CINTHYA", cap: 15 },
      { id: "mar_ug_1900", t: "19:00", n: "FUNCIONAL", i: "CINTHYA", cap: 15 },
      { id: "mar_ug_2000", t: "20:00", n: "FUNCIONAL", i: "CINTHYA", cap: 15 }
    ]
  },
  3: { // Miércoles
    "p1": [
      { id: "mie_p1_0830", t: "08:30", n: "PILATES", i: "ELIANA", cap: 18 },
      { id: "mie_p1_0930", t: "09:30", n: "STRETCHING", i: "BEATRIZ", cap: 20 },
      { id: "mie_p1_1030", t: "10:30", n: "ZUMBA", i: "DAVID", cap: 25 },
      { id: "mie_p1_1800", t: "18:00", n: "BODY PUMP", i: "CINTHYA", cap: 22 },
      { id: "mie_p1_1900", t: "19:00", n: "ZUMBA", i: "BRED", cap: 25 },
      { id: "mie_p1_2000", t: "20:00", n: "BODY PUMP", i: "SANDRA", cap: 22 }
    ],
    "p2": [
      { id: "mie_p2_0930", t: "09:30", n: "POWER JUMP", i: "RICKY", cap: 18 },
      { id: "mie_p2_1700", t: "17:00", n: "POWER JUMP", i: "RICKY", cap: 18 },
      { id: "mie_p2_1800", t: "18:00", n: "PILATES", i: "ALE", cap: 18 },
      { id: "mie_p2_1900", t: "19:00", n: "BODY COMBAT", i: "JESSY", cap: 22 },
      { id: "mie_p2_2000", t: "20:00", n: "LESMILLS CORE", i: "CINTHYA", cap: 20 }
    ],
    "sp": [
      { id: "mie_sp_0600", t: "06:00", n: "SPINNING", i: "ANA", cap: 25 },
      { id: "mie_sp_0830", t: "08:30", n: "SPINNING", i: "MA. ELENA", cap: 25 },
      { id: "mie_sp_1800", t: "18:00", n: "SPINNING", i: "REBECA", cap: 25 },
      { id: "mie_sp_1900", t: "19:00", n: "SPINNING", i: "JORGE S.", cap: 25 }
    ],
    "ug": [
      { id: "mie_ug_0730", t: "07:30", n: "FUNCIONAL", i: "CINTHYA", cap: 15 },
      { id: "mie_ug_0830", t: "08:30", n: "FUNCIONAL", i: "CINTHYA", cap: 15 },
      { id: "mie_ug_0930", t: "09:30", n: "FUNCIONAL", i: "CINTHYA", cap: 15 },
      { id: "mie_ug_1900", t: "19:00", n: "FUNCIONAL", i: "CINTHYA", cap: 15 }
    ]
  },
  4: { // Jueves
    "p1": [
      { id: "jue_p1_0830", t: "08:30", n: "PILATES", i: "ELIANA", cap: 18 },
      { id: "jue_p1_0930", t: "09:30", n: "BODY PUMP", i: "CINTHYA", cap: 22 },
      { id: "jue_p1_1030", t: "10:30", n: "ZUMBA", i: "DAVID", cap: 25 },
      { id: "jue_p1_1800", t: "18:00", n: "PILATES", i: "ALE", cap: 18 },
      { id: "jue_p1_1900", t: "19:00", n: "BODY PUMP", i: "SANDRA", cap: 22 },
      { id: "jue_p1_2000", t: "20:00", n: "ZUMBA", i: "BRED", cap: 25 }
    ],
    "p2": [
      { id: "jue_p2_0930", t: "09:30", n: "POWER JUMP", i: "RICKY", cap: 18 },
      { id: "jue_p2_1700", t: "17:00", n: "POWER JUMP", i: "RICKY", cap: 18 },
      { id: "jue_p2_1800", t: "18:00", n: "LESMILLS CORE", i: "SANDRA", cap: 20 },
      { id: "jue_p2_1900", t: "19:00", n: "POWER JUMP", i: "RICKY", cap: 18 },
      { id: "jue_p2_2000", t: "20:00", n: "LESMILLS GRIT", i: "JESSY", cap: 15 }
    ],
    "sp": [
      { id: "jue_sp_0830", t: "08:30", n: "SPINNING", i: "MA. ELENA", cap: 25 },
      { id: "jue_sp_1800", t: "18:00", n: "SPINNING", i: "JORGE S.", cap: 25 },
      { id: "jue_sp_1900", t: "19:00", n: "SPINNING", i: "JORGE S.", cap: 25 }
    ],
    "ug": [
      { id: "jue_ug_0600", t: "06:00", n: "FUNCIONAL", i: "MARCELA", cap: 15 },
      { id: "jue_ug_0730", t: "07:30", n: "FUNCIONAL", i: "ARACELY", cap: 15 },
      { id: "jue_ug_0830", t: "08:30", n: "FUNCIONAL", i: "CINTHYA", cap: 15 },
      { id: "jue_ug_1800", t: "18:00", n: "FUNCIONAL", i: "CINTHYA", cap: 15 },
      { id: "jue_ug_1900", t: "19:00", n: "FUNCIONAL", i: "ARACELY", cap: 15 },
      { id: "jue_ug_2000", t: "20:00", n: "FUNCIONAL", i: "ARACELY", cap: 15 }
    ]
  },
  5: { // Viernes
    "p1": [
      { id: "vie_p1_0830", t: "08:30", n: "PILATES", i: "ELIANA", cap: 18 },
      { id: "vie_p1_0930", t: "09:30", n: "STRETCHING", i: "BEATRIZ", cap: 20 },
      { id: "vie_p1_1030", t: "10:30", n: "ZUMBA", i: "DAVID", cap: 25 },
      { id: "vie_p1_1800", t: "18:00", n: "BODY PUMP", i: "RICKY", cap: 22 },
      { id: "vie_p1_1900", t: "19:00", n: "BODY JAM", i: "JESSY", cap: 25 },
      { id: "vie_p1_2000", t: "20:00", n: "BODY PUMP", i: "SANDRA", cap: 22 }
    ],
    "p2": [
      { id: "vie_p2_0930", t: "09:30", n: "POWER JUMP", i: "RICKY", cap: 18 },
      { id: "vie_p2_1700", t: "17:00", n: "POWER JUMP", i: "RICKY", cap: 18 },
      { id: "vie_p2_1800", t: "18:00", n: "PILATES", i: "ALE", cap: 18 },
      { id: "vie_p2_1900", t: "19:00", n: "BODY COMBAT", i: "SANDRA", cap: 22 }
    ],
    "sp": [
      { id: "vie_sp_0600", t: "06:00", n: "SPINNING", i: "ANA", cap: 25 },
      { id: "vie_sp_0830", t: "08:30", n: "SPINNING", i: "MA. ELENA", cap: 25 },
      { id: "vie_sp_1800", t: "18:00", n: "SPINNING", i: "REBECA", cap: 25 },
      { id: "vie_sp_1900", t: "19:00", n: "SPINNING", i: "JORGE S.", cap: 25 }
    ],
    "ug": [
      { id: "vie_ug_0730", t: "07:30", n: "FUNCIONAL", i: "CINTHYA", cap: 15 },
      { id: "vie_ug_0830", t: "08:30", n: "FUNCIONAL", i: "CINTHYA", cap: 15 },
      { id: "vie_ug_0930", t: "09:30", n: "FUNCIONAL", i: "CINTHYA", cap: 15 },
      { id: "vie_ug_1900", t: "19:00", n: "FUNCIONAL", i: "ARACELY", cap: 15 }
    ]
  },
  6: { // Sábado
    "p1": [
      { id: "sab_p1_0900", t: "09:00", n: "BODY PUMP", i: "RICKY", cap: 22 },
      { id: "sab_p1_1000", t: "10:00", n: "ZUMBA", i: "DAVID", cap: 25 }
    ],
    "p2": [
      { id: "sab_p2_1100", t: "11:00", n: "POWER JUMP", i: "RICKY", cap: 18 }
    ],
    "sp": [
      { id: "sab_sp_1000", t: "10:00", n: "SPIN/CORE", i: "JORGE S.", cap: 25 }
    ],
    "ug": [
      { id: "sab_ug_0830", t: "08:30", n: "FUNCIONAL", i: "ARACELY", cap: 15 },
      { id: "sab_ug_0930", t: "09:30", n: "FUNCIONAL", i: "CINTHYA", cap: 15 }
    ]
  },
  0: {} // Domingo
};

// Catálogo de Disciplinas con detalles y beneficios
const DISCIPLINES_CATALOG = [
  {
    name: "MUSCULACIÓN",
    category: "Musculación",
    intensity: "Variable",
    room: "Planta Baja",
    duration: "Libre",
    description: "Entrenamiento de fuerza y acondicionamiento en sala equipada con maquinaria biomecánica de alta gama, peso libre y área funcional.",
    recommended: "Adultos para evitar la pérdida de masa muscular y ganar fuerza.",
    benefits: [
      { text: "Ganancia de fuerza", points: 5 },
      { text: "Desarrollo muscular", points: 5 },
      { text: "Acondicionamiento físico", points: 4 }
    ]
  },
  {
    name: "BODY PUMP",
    category: "Aeróbicos",
    intensity: "Alta",
    room: "Piso 1",
    duration: "60 min",
    description: "Clase de entrenamiento con barra y discos que fortalece y tonifica todo el cuerpo utilizando los mejores ejercicios de la sala de musculación.",
    recommended: "Quienes buscan tonificar y ganar resistencia muscular en clases grupales.",
    benefits: [
      { text: "Tonificación muscular", points: 5 },
      { text: "Quema de calorías", points: 4 },
      { text: "Resistencia física", points: 4 }
    ]
  },
  {
    name: "SPINNING",
    category: "Spinning",
    intensity: "Alta",
    room: "Sala Spinning",
    duration: "50 min",
    description: "Ciclismo de interior de alta intensidad guiado por música enérgica y simulación de terrenos para potenciar la capacidad cardiovascular y quemar grasa.",
    recommended: "Cualquier persona que busque quemar grasa sin impacto en las articulaciones.",
    benefits: [
      { text: "Alto consumo calórico", points: 5 },
      { text: "Mejora cardiovascular", points: 5 },
      { text: "Sin impacto articular", points: 5 }
    ]
  },
  {
    name: "FUNCIONAL",
    category: "Funcional",
    intensity: "Media - Alta",
    room: "Subsuelo",
    duration: "50 min",
    description: "Entrenamiento dinámico en circuito enfocado en movimientos naturales del cuerpo para desarrollar agilidad, fuerza central (core) y coordinación.",
    recommended: "Adultos que deseen mejorar agilidad y fuerza en actividades cotidianas.",
    benefits: [
      { text: "Fuerza integrada", points: 5 },
      { text: "Mejora del equilibrio", points: 4 },
      { text: "Gasto metabólico", points: 4 }
    ]
  },
  {
    name: "PILATES",
    category: "Control",
    intensity: "Moderada",
    room: "Piso 1 y 2",
    duration: "50 min",
    description: "Sistema de entrenamiento que combina control mental, respiración y fortalecimiento del core para tonificar músculos y alinear la columna.",
    recommended: "Personas con dolores de espalda o postura que buscan alinear la columna.",
    benefits: [
      { text: "Postura y alineación", points: 5 },
      { text: "Flexibilidad profunda", points: 4 },
      { text: "Fortalecimiento de abdomen", points: 4 }
    ]
  },
  {
    name: "POWER JUMP",
    category: "Aeróbicos",
    intensity: "Alta",
    room: "Piso 2",
    duration: "50 min",
    description: "Programa de cardio dinámico sobre minitrampolines individuales con combinaciones coreografiadas de gran energía, drenaje linfático y mínimo impacto articular.",
    recommended: "Quienes desean quemar grasa divirtiéndose y activando su circulación sin sobrecargar rodillas.",
    benefits: [
      { text: "Drenaje linfático", points: 5 },
      { text: "Quema calórica masiva", points: 5 },
      { text: "Coordinación y agilidad", points: 4 }
    ]
  },
  {
    name: "ZUMBA",
    category: "Aeróbicos",
    intensity: "Media",
    room: "Piso 1",
    duration: "50 min",
    description: "Fiesta de acondicionamiento físico bailable con ritmos latinos e internacionales que combina diversión con cardio intenso.",
    recommended: "Personas de toda edad que quieran hacer ejercicio bailando y divirtiéndose.",
    benefits: [
      { text: "Liberación de estrés", points: 5 },
      { text: "Coordinación y ritmo", points: 4 },
      { text: "Pérdida de peso", points: 4 }
    ]
  },
  {
    name: "BODY JAM",
    category: "Aeróbicos",
    intensity: "Media - Alta",
    room: "Piso 1",
    duration: "50 min",
    description: "Fusión electrizante de música de vanguardia y estilos de danza urbana. Una clase festiva que tonifica y quema calorías bailando sin parar.",
    recommended: "Amantes del baile, el ritmo y quienes buscan una sesión aeróbica divertida y desinhibida.",
    benefits: [
      { text: "Ritmo y coordinación", points: 5 },
      { text: "Quema aeróbica", points: 4 },
      { text: "Liberación de endorfinas", points: 5 }
    ]
  },
  {
    name: "BODY COMBAT",
    category: "Aeróbicos",
    intensity: "Alta",
    room: "Piso 2",
    duration: "50 min",
    description: "Entrenamiento de cardio explosivo inspirado en artes marciales mixtas como Karate, Boxeo, Taekwondo y Muay Thai. Libera tensiones, quema calorías y tonifica.",
    recommended: "Quienes buscan descargar tensiones y entrenar cardio de alta intensidad sin contacto.",
    benefits: [
      { text: "Resistencia cardiovascular", points: 5 },
      { text: "Descarga de estrés", points: 5 },
      { text: "Tonificación general", points: 4 }
    ]
  },
  {
    name: "LESMILLS GRIT",
    category: "Aeróbicos",
    intensity: "Muy Alta (HIIT)",
    room: "Piso 2",
    duration: "30 min",
    description: "Entrenamiento en intervalos de alta intensidad (HIIT) de 30 minutos diseñado para acelerar el metabolismo, quemar grasa post-entreno y superar límites atléticos.",
    recommended: "Quienes buscan resultados rápidos y desafiar su resistencia cardiovascular al máximo.",
    benefits: [
      { text: "Quema calórica post-entreno", points: 5 },
      { text: "Potencia cardiovascular", points: 5 },
      { text: "Resistencia anaeróbica", points: 4 }
    ]
  },
  {
    name: "CARDIO",
    category: "Cardio",
    intensity: "Libre / Variable",
    room: "Sala de Cardio",
    duration: "Libre",
    description: "Sala de equipamiento cardiovascular con escaladoras, bicicletas estáticas y cintas de correr. Funciona en modalidad de entrenamiento libre a tu propio ritmo (sin instructor), equipada con pantallas de televisión para ver programas y entretenimiento mientras entrenas.",
    recommended: "Cualquier persona que busque acondicionamiento cardiovascular, quemar calorías o complementar su entrenamiento de musculación.",
    benefits: [
      { text: "Salud cardiovascular", points: 5 },
      { text: "Quema de calorías", points: 5 },
      { text: "Resistencia física", points: 4 }
    ]
  },
  {
    name: "STRETCHING",
    category: "Control",
    intensity: "Baja",
    room: "Piso 2",
    duration: "45 min",
    description: "Clase enfocada en la elongación muscular, flexibilidad asistida y descompresión articular para prevenir lesiones y aliviar sobrecargas.",
    recommended: "Adultos mayores y deportistas que necesiten descontracturar y relajarse.",
    benefits: [
      { text: "Flexibilidad muscular", points: 5 },
      { text: "Prevención de lesiones", points: 5 },
      { text: "Descompresión y relax", points: 5 }
    ]
  }
];

// Información General del Gimnasio
const GYM_INFO = {
  name: "GIMNASIO FORMAS",
  subtitle: "Centro de Entrenamiento Táctico y Fitness",
  whatsapp: "+59170000000",
  address: "Av. Portales y Pantaleón Dalence N° 1433, Cochabamba, Bolivia",
  musculacionHours: {
    weekdays: "06:00 a 22:00 hs",
    saturdays: "08:00 a 13:00 hs",
    sundays: "08:00 a 13:00 hs (y feriados)"
  }
};

// Inyección dinámica de horarios de Musculación
[1, 2, 3, 4, 5].forEach(dayNum => {
  if (SCHEDULE_DATA[dayNum]) {
    SCHEDULE_DATA[dayNum]["musc"] = [
      { id: `musc_open_${dayNum}`, t: "06:00", range: "06:00 - 22:00", n: "SALA ABIERTA (ENTRENAMIENTO LIBRE)", i: "Sin Instructor Obligatorio", cap: 99, isMuscOpenHours: true },
      { id: `musc_inst1_${dayNum}`, t: "06:00", range: "06:00 - 12:00", n: "GUÍA DE ENTRENAMIENTO", i: "MARCELA VELASCO", cap: 99, isMuscShift: true },
      { id: `musc_inst2_${dayNum}`, t: "06:00", range: "06:00 - 13:00", n: "GUÍA DE ENTRENAMIENTO", i: "DANIEL CORTEZ", cap: 99, isMuscShift: true },
      { id: `musc_inst3_${dayNum}`, t: "13:00", range: "13:00 - 22:00", n: "GUÍA DE ENTRENAMIENTO", i: "ARMANDO ROJAS", cap: 99, isMuscShift: true },
      { id: `musc_inst4_${dayNum}`, t: "16:00", range: "16:00 - 22:00", n: "GUÍA DE ENTRENAMIENTO", i: "ERNESTO HIDALGO", cap: 99, isMuscShift: true }
    ];
  }
});
if (SCHEDULE_DATA[6]) {
  SCHEDULE_DATA[6]["musc"] = [
    { id: "musc_sab_open", t: "08:00", range: "08:00 - 13:00", n: "SALA ABIERTA (ENTRENAMIENTO LIBRE)", i: "Sin Instructor", cap: 99, isMuscOpenHours: true }
  ];
}
if (SCHEDULE_DATA[0]) {
  SCHEDULE_DATA[0]["musc"] = [
    { id: "musc_dom_open", t: "08:00", range: "08:00 - 13:00", n: "SALA ABIERTA (ENTRENAMIENTO LIBRE)", i: "Sin Instructor", cap: 99, isMuscOpenHours: true }
  ];
}

