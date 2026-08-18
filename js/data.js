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
  "Horario de Sala (Abierto)": "Musculación",
  "Turno Mañana": "Musculación",
  "Turno Tarde": "Musculación",
  "Turno Noche": "Musculación",
  "Turno Sábado": "Musculación",
  "Sala Abierta (Entrenamiento Libre)": "Musculación",
  "Guía de Entrenamiento": "Musculación"
};

// Cronograma semanal con IDs únicos por clase
const SCHEDULE_DATA = {
  1: { // Lunes
    "p1": [
      { id: "lun_p1_0830", t: "08:30", n: "Pilates", i: "TEO", cap: 18 },
      { id: "lun_p1_0930", t: "09:30", n: "Body Pump", i: "TEO", cap: 22 },
      { id: "lun_p1_1030", t: "10:30", n: "Zumba", i: "DAVID", cap: 25 },
      { id: "lun_p1_1800", t: "18:00", n: "Body Pump", i: "CINTHYA", cap: 22 },
      { id: "lun_p1_1900", t: "19:00", n: "Body Pump", i: "JESSY", cap: 22 },
      { id: "lun_p1_2000", t: "20:00", n: "Body Pump", i: "SANDRA", cap: 22 }
    ],
    "p2": [
      { id: "lun_p2_0930", t: "09:30", n: "Stretching", i: "BEATRIZ", cap: 20 },
      { id: "lun_p2_1700", t: "17:00", n: "Power Jump", i: "TEO", cap: 18 },
      { id: "lun_p2_1800", t: "18:00", n: "Pilates", i: "ALE", cap: 18 },
      { id: "lun_p2_1900", t: "19:00", n: "Power Jump", i: "SANDRA", cap: 18 },
      { id: "lun_p2_2000", t: "20:00", n: "LesMills Core", i: "CINTHYA", cap: 20 }
    ],
    "sp": [
      { id: "lun_sp_0600", t: "06:00", n: "Spinning", i: "ANA", cap: 25 },
      { id: "lun_sp_0830", t: "08:30", n: "Spinning", i: "MA. ELENA", cap: 25 },
      { id: "lun_sp_1800", t: "18:00", n: "Spinning", i: "REBECA", cap: 25 },
      { id: "lun_sp_1900", t: "19:00", n: "Spinning", i: "JORGE S.", cap: 25 }
    ],
    "ug": [
      { id: "lun_ug_0730", t: "07:30", n: "Funcional", i: "CINTHYA", cap: 15 },
      { id: "lun_ug_0830", t: "08:30", n: "Funcional", i: "CINTHYA", cap: 15 },
      { id: "lun_ug_0930", t: "09:30", n: "Funcional", i: "CINTHYA", cap: 15 },
      { id: "lun_ug_1900", t: "19:00", n: "Funcional", i: "CINTHYA", cap: 15 }
    ]
  },
  2: { // Martes
    "p1": [
      { id: "mar_p1_0830", t: "08:30", n: "Pilates", i: "ELIANA", cap: 18 },
      { id: "mar_p1_0930", t: "09:30", n: "LesMills Core", i: "CINTHYA", cap: 20 },
      { id: "mar_p1_1030", t: "10:30", n: "Zumba", i: "DAVID", cap: 25 },
      { id: "mar_p1_1800", t: "18:00", n: "Pilates", i: "ALE", cap: 18 },
      { id: "mar_p1_1900", t: "19:00", n: "Body Pump", i: "SANDRA", cap: 22 },
      { id: "mar_p1_2000", t: "20:00", n: "Zumba", i: "BRED", cap: 25 }
    ],
    "p2": [
      { id: "mar_p2_0930", t: "09:30", n: "Power Jump", i: "RICKY", cap: 18 },
      { id: "mar_p2_1700", t: "17:00", n: "Power Jump", i: "RICKY", cap: 18 },
      { id: "mar_p2_1800", t: "18:00", n: "LesMills Core", i: "SANDRA", cap: 20 },
      { id: "mar_p2_1900", t: "19:00", n: "Power Jump", i: "RICKY", cap: 18 },
      { id: "mar_p2_2000", t: "20:00", n: "Body Attack", i: "JESSY", cap: 22 }
    ],
    "sp": [
      { id: "mar_sp_0830", t: "08:30", n: "Spinning", i: "MA. ELENA", cap: 25 },
      { id: "mar_sp_1800", t: "18:00", n: "Spinning", i: "JORGE S.", cap: 25 },
      { id: "mar_sp_1900", t: "19:00", n: "Spinning", i: "JORGE S.", cap: 25 }
    ],
    "ug": [
      { id: "mar_ug_0600", t: "06:00", n: "Funcional", i: "CINTHYA", cap: 15 },
      { id: "mar_ug_0730", t: "07:30", n: "Funcional", i: "ARACELY", cap: 15 },
      { id: "mar_ug_0830", t: "08:30", n: "Funcional", i: "CINTHYA", cap: 15 },
      { id: "mar_ug_1800", t: "18:00", n: "Funcional", i: "CINTHYA", cap: 15 },
      { id: "mar_ug_1900", t: "19:00", n: "Funcional", i: "CINTHYA", cap: 15 },
      { id: "mar_ug_2000", t: "20:00", n: "Funcional", i: "CINTHYA", cap: 15 }
    ]
  },
  3: { // Miércoles
    "p1": [
      { id: "mie_p1_0830", t: "08:30", n: "Pilates", i: "ELIANA", cap: 18 },
      { id: "mie_p1_0930", t: "09:30", n: "Stretching", i: "BEATRIZ", cap: 20 },
      { id: "mie_p1_1030", t: "10:30", n: "Zumba", i: "DAVID", cap: 25 },
      { id: "mie_p1_1800", t: "18:00", n: "Body Pump", i: "CINTHYA", cap: 22 },
      { id: "mie_p1_1900", t: "19:00", n: "Zumba", i: "BRED", cap: 25 },
      { id: "mie_p1_2000", t: "20:00", n: "Body Pump", i: "SANDRA", cap: 22 }
    ],
    "p2": [
      { id: "mie_p2_0930", t: "09:30", n: "Power Jump", i: "RICKY", cap: 18 },
      { id: "mie_p2_1700", t: "17:00", n: "Power Jump", i: "RICKY", cap: 18 },
      { id: "mie_p2_1800", t: "18:00", n: "Pilates", i: "ALE", cap: 18 },
      { id: "mie_p2_1900", t: "19:00", n: "Body Combat", i: "JESSY", cap: 22 },
      { id: "mie_p2_2000", t: "20:00", n: "LesMills Core", i: "CINTHYA", cap: 20 }
    ],
    "sp": [
      { id: "mie_sp_0600", t: "06:00", n: "Spinning", i: "ANA", cap: 25 },
      { id: "mie_sp_0830", t: "08:30", n: "Spinning", i: "MA. ELENA", cap: 25 },
      { id: "mie_sp_1800", t: "18:00", n: "Spinning", i: "REBECA", cap: 25 },
      { id: "mie_sp_1900", t: "19:00", n: "Spinning", i: "JORGE S.", cap: 25 }
    ],
    "ug": [
      { id: "mie_ug_0730", t: "07:30", n: "Funcional", i: "CINTHYA", cap: 15 },
      { id: "mie_ug_0830", t: "08:30", n: "Funcional", i: "CINTHYA", cap: 15 },
      { id: "mie_ug_0930", t: "09:30", n: "Funcional", i: "CINTHYA", cap: 15 },
      { id: "mie_ug_1900", t: "19:00", n: "Funcional", i: "CINTHYA", cap: 15 }
    ]
  },
  4: { // Jueves
    "p1": [
      { id: "jue_p1_0830", t: "08:30", n: "Pilates", i: "ELIANA", cap: 18 },
      { id: "jue_p1_0930", t: "09:30", n: "Body Pump", i: "CINTHYA", cap: 22 },
      { id: "jue_p1_1030", t: "10:30", n: "Zumba", i: "DAVID", cap: 25 },
      { id: "jue_p1_1800", t: "18:00", n: "Pilates", i: "ALE", cap: 18 },
      { id: "jue_p1_1900", t: "19:00", n: "Body Pump", i: "SANDRA", cap: 22 },
      { id: "jue_p1_2000", t: "20:00", n: "Zumba", i: "BRED", cap: 25 }
    ],
    "p2": [
      { id: "jue_p2_0930", t: "09:30", n: "Power Jump", i: "RICKY", cap: 18 },
      { id: "jue_p2_1700", t: "17:00", n: "Power Jump", i: "RICKY", cap: 18 },
      { id: "jue_p2_1800", t: "18:00", n: "LesMills Core", i: "SANDRA", cap: 20 },
      { id: "jue_p2_1900", t: "19:00", n: "Power Jump", i: "RICKY", cap: 18 },
      { id: "jue_p2_2000", t: "20:00", n: "LesMills Grit", i: "JESSY", cap: 15 }
    ],
    "sp": [
      { id: "jue_sp_0830", t: "08:30", n: "Spinning", i: "MA. ELENA", cap: 25 },
      { id: "jue_sp_1800", t: "18:00", n: "Spinning", i: "JORGE S.", cap: 25 },
      { id: "jue_sp_1900", t: "19:00", n: "Spinning", i: "JORGE S.", cap: 25 }
    ],
    "ug": [
      { id: "jue_ug_0600", t: "06:00", n: "Funcional", i: "MARCELA", cap: 15 },
      { id: "jue_ug_0730", t: "07:30", n: "Funcional", i: "ARACELY", cap: 15 },
      { id: "jue_ug_0830", t: "08:30", n: "Funcional", i: "CINTHYA", cap: 15 },
      { id: "jue_ug_1800", t: "18:00", n: "Funcional", i: "CINTHYA", cap: 15 },
      { id: "jue_ug_1900", t: "19:00", n: "Funcional", i: "ARACELY", cap: 15 },
      { id: "jue_ug_2000", t: "20:00", n: "Funcional", i: "ARACELY", cap: 15 }
    ]
  },
  5: { // Viernes
    "p1": [
      { id: "vie_p1_0830", t: "08:30", n: "Pilates", i: "ELIANA", cap: 18 },
      { id: "vie_p1_0930", t: "09:30", n: "Stretching", i: "BEATRIZ", cap: 20 },
      { id: "vie_p1_1030", t: "10:30", n: "Zumba", i: "DAVID", cap: 25 },
      { id: "vie_p1_1800", t: "18:00", n: "Body Pump", i: "RICKY", cap: 22 },
      { id: "vie_p1_1900", t: "19:00", n: "Body Jam", i: "JESSY", cap: 25 },
      { id: "vie_p1_2000", t: "20:00", n: "Body Pump", i: "SANDRA", cap: 22 }
    ],
    "p2": [
      { id: "vie_p2_0930", t: "09:30", n: "Power Jump", i: "RICKY", cap: 18 },
      { id: "vie_p2_1700", t: "17:00", n: "Power Jump", i: "RICKY", cap: 18 },
      { id: "vie_p2_1800", t: "18:00", n: "Pilates", i: "ALE", cap: 18 },
      { id: "vie_p2_1900", t: "19:00", n: "Body Combat", i: "SANDRA", cap: 22 }
    ],
    "sp": [
      { id: "vie_sp_0600", t: "06:00", n: "Spinning", i: "ANA", cap: 25 },
      { id: "vie_sp_0830", t: "08:30", n: "Spinning", i: "MA. ELENA", cap: 25 },
      { id: "vie_sp_1800", t: "18:00", n: "Spinning", i: "REBECA", cap: 25 },
      { id: "vie_sp_1900", t: "19:00", n: "Spinning", i: "JORGE S.", cap: 25 }
    ],
    "ug": [
      { id: "vie_ug_0730", t: "07:30", n: "Funcional", i: "CINTHYA", cap: 15 },
      { id: "vie_ug_0830", t: "08:30", n: "Funcional", i: "CINTHYA", cap: 15 },
      { id: "vie_ug_0930", t: "09:30", n: "Funcional", i: "CINTHYA", cap: 15 },
      { id: "vie_ug_1900", t: "19:00", n: "Funcional", i: "ARACELY", cap: 15 }
    ]
  },
  6: { // Sábado
    "p1": [
      { id: "sab_p1_0900", t: "09:00", n: "Body Pump", i: "RICKY", cap: 22 },
      { id: "sab_p1_1000", t: "10:00", n: "Zumba", i: "DAVID", cap: 25 }
    ],
    "p2": [
      { id: "sab_p2_1100", t: "11:00", n: "Power Jump", i: "RICKY", cap: 18 }
    ],
    "sp": [
      { id: "sab_sp_1000", t: "10:00", n: "Spin/Core", i: "JORGE S.", cap: 25 }
    ],
    "ug": [
      { id: "sab_ug_0830", t: "08:30", n: "Funcional", i: "ARACELY", cap: 15 },
      { id: "sab_ug_0930", t: "09:30", n: "Funcional", i: "CINTHYA", cap: 15 }
    ]
  },
  0: {} // Domingo
};

// Catálogo de Disciplinas con detalles y beneficios
const DISCIPLINES_CATALOG = [
  {
    name: "Musculación",
    category: "Musculación",
    intensity: "Variable",
    room: "Planta Baja",
    duration: "Libre",
    description: "Entrenamiento de fuerza y acondicionamiento en sala equipada con maquinaria biomecánica de alta gama, peso libre y área funcional.",
    recommended: "Adultos para evitar la pérdida de masa muscular y ganar fuerza.",
    benefits: [
      { text: "Ganancia de fuerza", points: 5 },
      { text: "Hipertrofia muscular", points: 5 },
      { text: "Acondicionamiento físico", points: 4 }
    ]
  },
  {
    name: "Body Pump",
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
    name: "Spinning",
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
    name: "Funcional",
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
    name: "Pilates",
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
    name: "Power Jump",
    category: "Aeróbicos",
    intensity: "Alta",
    room: "Piso 2",
    duration: "50 min",
    description: "Programa de entrenamiento en minitrampolines con combinaciones coreografiadas de gran energía y bajísimo impacto articular.",
    recommended: "Quienes desean quemar calorías divirtiéndose y activando su circulación.",
    benefits: [
      { text: "Drenaje linfático", points: 5 },
      { text: "Quema calórica masiva", points: 5 },
      { text: "Coordinación y agilidad", points: 4 }
    ]
  },
  {
    name: "Zumba",
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
    name: "Body Combat",
    category: "Aeróbicos",
    intensity: "Alta",
    room: "Piso 2",
    duration: "50 min",
    description: "Entrenamiento inspirado en artes marciales mixtas como Karate, Boxeo, Taekwondo y Muay Thai. Libera tensiones y tonifica.",
    recommended: "Quienes buscan descargar tensiones y entrenar cardio de alta intensidad.",
    benefits: [
      { text: "Resistencia y agilidad", points: 5 },
      { text: "Descarga de estrés", points: 5 },
      { text: "Tonificación general", points: 4 }
    ]
  },
  {
    name: "Stretching",
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
  name: "Gimnasio Formas",
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
      { id: `musc_open_${dayNum}`, t: "06:00", range: "06:00 - 22:00", n: "Sala Abierta (Entrenamiento Libre)", i: "Sin Instructor Obligatorio", cap: 99, isMuscOpenHours: true },
      { id: `musc_inst1_${dayNum}`, t: "06:00", range: "06:00 - 12:00", n: "Guía de Entrenamiento", i: "MARCELA VELASCO", cap: 99, isMuscShift: true },
      { id: `musc_inst2_${dayNum}`, t: "06:00", range: "06:00 - 13:00", n: "Guía de Entrenamiento", i: "DANIEL CORTEZ", cap: 99, isMuscShift: true },
      { id: `musc_inst3_${dayNum}`, t: "13:00", range: "13:00 - 22:00", n: "Guía de Entrenamiento", i: "ARMANDO ROJAS", cap: 99, isMuscShift: true },
      { id: `musc_inst4_${dayNum}`, t: "16:00", range: "16:00 - 22:00", n: "Guía de Entrenamiento", i: "ERNESTO HIDALGO", cap: 99, isMuscShift: true }
    ];
  }
});
if (SCHEDULE_DATA[6]) {
  SCHEDULE_DATA[6]["musc"] = [
    { id: "musc_sab_open", t: "08:00", range: "08:00 - 13:00", n: "Sala Abierta (Entrenamiento Libre)", i: "Sin Instructor", cap: 99, isMuscOpenHours: true }
  ];
}
if (SCHEDULE_DATA[0]) {
  SCHEDULE_DATA[0]["musc"] = [
    { id: "musc_dom_open", t: "08:00", range: "08:00 - 13:00", n: "Sala Abierta (Entrenamiento Libre)", i: "Sin Instructor", cap: 99, isMuscOpenHours: true }
  ];
}

