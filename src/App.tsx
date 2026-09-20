import { useMemo, useState } from 'react'
import './App.css'

type Chapter = {
  id: string
  title: string
  location: string
  function: string
  connections: string
  exam: string
  lesion: string
  laterality: string
  clinical: string
  pearl: string
  localizationTable: Array<{ label: string; value: string }>
  application: string
}

type HemisphereSubtopic = Chapter

type Question = {
  id: number
  category: string
  subtopic: string
  level: 'Básico' | 'Intermedio' | 'Avanzado'
  stem: string
  options: [string, string, string, string]
  answer: 0 | 1 | 2 | 3
  explanation: string
  distractors: [string, string, string, string]
  pearl: string
  reference: string
  tag: string
}

const hemisphereSubtopics: HemisphereSubtopic[] = [
  {
    id: 'lobulo-frontal',
    title: '1.1.2 Lóbulo frontal',
    location: 'Anterior al surco central y superior a la cisura de Silvio.',
    function: 'Planificación motora, conducta ejecutiva, producción del lenguaje (área de Broca dominante).',
    connections: 'Vías corticoespinal y fronto-estriatal; conexiones con tálamo dorsomedial.',
    exam: 'Fuerza segmentaria, praxias motoras, fluencia verbal y mirada conjugada.',
    lesion: 'Afasia de Broca, hemiparesia contralateral, desviación ocular hacia la lesión, desinhibición.',
    laterality: 'Déficit motor contralateral; alteraciones del lenguaje en hemisferio dominante.',
    clinical: 'Debilidad faciobraquial contralateral sugiere lesión frontal lateral (territorio ACM).',
    pearl: 'En ENARM, afasia no fluente + hemiparesia faciobraquial localiza en frontal dominante.',
    localizationTable: [
      { label: 'Dónde está', value: 'Región precentral y prefrontal anterior' },
      { label: 'Dato clave', value: 'Control motor voluntario y ejecución' },
      { label: 'Hallazgo guía', value: 'Hemiparesia contralateral + afasia de Broca' },
    ],
    application:
      'Caso: paciente diestro con lenguaje no fluido y paresia de cara-brazo derechos. ¿Localización más probable? Lóbulo frontal izquierdo.',
  },
  {
    id: 'lobulo-parietal',
    title: '1.1.3 Lóbulo parietal',
    location: 'Posterior al surco central y superior a la cisura de Silvio.',
    function: 'Integración somatosensitiva cortical, esquema corporal y atención espacial.',
    connections: 'Proyecciones tálamo-corticales somatosensitivas y redes fronto-parietales.',
    exam: 'Sensibilidad cortical (estereognosia, grafestesia), extinción sensitiva y praxias.',
    lesion: 'Astereognosia, heminegligencia no dominante, síndrome de Gerstmann dominante.',
    laterality: 'Déficits corticales contralaterales; negligencia marcada en lesión parietal derecha.',
    clinical: 'Heminegligencia izquierda + extinción táctil orienta a parietal derecho.',
    pearl: 'Gerstmann (acalculia, agrafia, agnosia digital, desorientación D-I) localiza en parietal dominante.',
    localizationTable: [
      { label: 'Dónde está', value: 'Corteza poscentral y lóbulo parietal posterior' },
      { label: 'Dato clave', value: 'Procesamiento sensitivo cortical' },
      { label: 'Hallazgo guía', value: 'Negligencia o déficit sensitivo cortical contralateral' },
    ],
    application:
      'Pregunta de aplicación: pérdida de grafestesia y heminegligencia izquierda sugieren lesión en lóbulo parietal derecho.',
  },
  {
    id: 'lobulo-temporal',
    title: '1.1.4 Lóbulo temporal',
    location: 'Inferior a la cisura de Silvio, lateral a estructuras mesiales límbicas.',
    function: 'Comprensión del lenguaje, memoria episódica y procesamiento auditivo.',
    connections: 'Asociación con hipocampo, amígdala y radiaciones ópticas temporales (asa de Meyer).',
    exam: 'Comprensión verbal, memoria reciente, campimetría para cuadrantanopsia superior.',
    lesion: 'Afasia de Wernicke dominante, amnesia y cuadrantanopsia homónima superior contralateral.',
    laterality: 'Lenguaje en dominante; campo visual contralateral por radiaciones ópticas.',
    clinical: 'Lenguaje fluido incoherente + mala comprensión localiza en temporal posterior dominante.',
    pearl: '“Pie en el cielo” (cuadrantanopsia superior) sugiere lesión temporal contralateral.',
    localizationTable: [
      { label: 'Dónde está', value: 'Corteza lateral temporal y región mesial' },
      { label: 'Dato clave', value: 'Lenguaje receptivo y memoria' },
      { label: 'Hallazgo guía', value: 'Afasia de Wernicke o cuadrantanopsia superior' },
    ],
    application:
      'Caso: comprensión alterada con habla fluida parafásica en paciente diestro. Localiza en temporal izquierdo posterior.',
  },
  {
    id: 'lobulo-occipital',
    title: '1.1.5 Lóbulo occipital',
    location: 'Polo posterior cerebral alrededor de la cisura calcarina.',
    function: 'Procesamiento visual primario y asociación visual.',
    connections: 'Entradas desde radiaciones ópticas y salidas a vías dorsal/ventral visual.',
    exam: 'Campimetría por confrontación y reconocimiento visual básico.',
    lesion: 'Hemianopsia homónima contralateral, con posible preservación macular.',
    laterality: 'Déficit visual contralateral al hemisferio lesionado.',
    clinical: 'Hemianopsia homónima derecha sin déficit motor sugiere occipital izquierdo.',
    pearl: 'Preservación macular orienta a lesión cortical occipital por circulación posterior.',
    localizationTable: [
      { label: 'Dónde está', value: 'Polo occipital y cisura calcarina' },
      { label: 'Dato clave', value: 'Corteza visual primaria' },
      { label: 'Hallazgo guía', value: 'Hemianopsia homónima contralateral' },
    ],
    application:
      'Pregunta: pérdida de hemicampos derechos con fuerza conservada indica localización en lóbulo occipital izquierdo.',
  },
  {
    id: 'insula',
    title: '1.1.6 Ínsula',
    location: 'Profunda en la cisura de Silvio, cubierta por opérculos frontal, parietal y temporal.',
    function: 'Integración viscerosensitiva, autonómica, gusto e interocepción.',
    connections: 'Conexiones con corteza cingulada, amígdala, hipotálamo y corteza orbitofrontal.',
    exam: 'Interrogatorio de gusto, percepción visceral y correlación autonómica básica.',
    lesion: 'Disgeusia, alteración autonómica, síntomas viscerales mal localizados.',
    laterality: 'Manifestaciones frecuentemente contralaterales en sensibilidad gustativa integrada.',
    clinical: 'Disgeusia súbita con déficits corticales vecinos puede orientar a ínsula dominante.',
    pearl: 'La ínsula conecta emoción-autonomía; en localización, no aislarla de la cisura de Silvio.',
    localizationTable: [
      { label: 'Dónde está', value: 'Profunda a la cisura lateral (Silvio)' },
      { label: 'Dato clave', value: 'Integración autonómica y gusto' },
      { label: 'Hallazgo guía', value: 'Disgeusia + síntomas viscerales/autonómicos' },
    ],
    application:
      'Caso: paciente con disgeusia y sensación epigástrica ascendente focal sin déficits motores francos. Localización sugerida: ínsula.',
  },
]

const otherChapters: Chapter[] = [
  {
    id: 'nucleos-grises-base',
    title: '1.2 Núcleos grises de la base',
    location: 'Profundos en telencéfalo y diencéfalo (caudado, putamen, globo pálido, subtálamo, sustancia negra).',
    function: 'Selección y modulación del movimiento voluntario.',
    connections: 'Circuitos directos/indirectos con corteza, tálamo y dopamina nigroestriatal.',
    exam: 'Marcha, tono, bradicinesia, movimientos involuntarios.',
    lesion: 'Hipocinesia (parkinsonismo) o hipercinesia (corea, hemibalismo).',
    laterality: 'Signos motores predominan contralaterales a lesión hemisférica funcional.',
    clinical: 'Hemibalismo súbito sugiere lesión subtalámica contralateral.',
    pearl: 'Vía directa facilita movimiento; indirecta lo frena.',
    localizationTable: [
      { label: 'Dónde está', value: 'Ganglios basales profundos' },
      { label: 'Qué explorar', value: 'Bradicinesia, temblor, corea, distonía' },
    ],
    application:
      'Pregunta de aplicación: movimientos amplios proximales de hemicuerpo izquierdo localizan en núcleo subtalámico derecho.',
  },
  {
    id: 'sistema-limbico',
    title: '1.3 Sistema límbico',
    location: 'Estructuras mediales: hipocampo, amígdala, giro cingulado, hipotálamo.',
    function: 'Memoria episódica, emoción y regulación autonómica relacionada.',
    connections: 'Circuito de Papez y conexiones hipocampo-tálamo-cingulado.',
    exam: 'Memoria reciente, evocación diferida y reactividad emocional.',
    lesion: 'Amnesia anterógrada, alteración emocional contextual.',
    laterality: 'Memoria declarativa bilateral; lateralización variable por red dominante.',
    clinical: 'Amnesia reciente desproporcionada orienta a hipocampo bilateral/mesial temporal.',
    pearl: 'Hipocampo consolida memoria; amígdala modula valencia emocional.',
    localizationTable: [
      { label: 'Dónde está', value: 'Regiones mediales temporales y diencefálicas' },
      { label: 'Hallazgo guía', value: 'Amnesia anterógrada' },
    ],
    application: 'Caso: incapacidad para fijar nueva información con lenguaje intacto sugiere compromiso hipocampal.',
  },
  {
    id: 'cerebelo',
    title: '1.4 Cerebelo',
    location: 'Fosa posterior, dorsal al tallo cerebral.',
    function: 'Coordinación, temporización y ajuste fino del movimiento.',
    connections: 'Pedúnculos cerebelosos con corteza, médula y sistema vestibular.',
    exam: 'Dedo-nariz, talón-rodilla, disdiadococinesia, marcha en tándem.',
    lesion: 'Ataxia, dismetría, nistagmo, temblor de intención.',
    laterality: 'Déficit ipsilateral al hemisferio cerebeloso lesionado.',
    clinical: 'Ataxia troncal predominante orienta a vermis.',
    pearl: 'Romberg positivo aislado sugiere vía sensitiva, no cerebelo puro.',
    localizationTable: [
      { label: 'Dónde está', value: 'Fosa posterior' },
      { label: 'Hallazgo guía', value: 'Ataxia ipsilateral + dismetría' },
    ],
    application:
      'Pregunta: paciente con dismetría derecha y nistagmo horizontal. Localización probable: hemisferio cerebeloso derecho.',
  },
  {
    id: 'tallo-cerebral',
    title: '1.5 Tallo cerebral',
    location: 'Mesencéfalo, puente y bulbo entre diencéfalo y médula.',
    function: 'Conducción de vías largas y núcleos de pares craneales.',
    connections: 'Tractos corticoespinales, lemniscos, espinotalámicos y conexiones reticulares.',
    exam: 'Pares craneales, fuerza/sensibilidad y patrones cruzados.',
    lesion: 'Síndromes alternos (pares craneales ipsilaterales + déficit corporal contralateral).',
    laterality: 'Déficits cruzados característicos por lesión focal.',
    clinical: 'Wallenberg: disfagia y pérdida termoalgésica cruzada.',
    pearl: 'En tallo, combinación “cara ipsi + cuerpo contra” es clave topográfica.',
    localizationTable: [
      { label: 'Dónde está', value: 'Eje central del SNC entre cerebro y médula' },
      { label: 'Hallazgo guía', value: 'Síndrome cruzado' },
    ],
    application:
      'Caso: diplopía con hemiparesia contralateral sugiere síndrome de Weber mesencefálico.',
  },
  {
    id: 'medula-espinal',
    title: '1.6 Médula espinal',
    location: 'Canal vertebral hasta cono medular.',
    function: 'Conducción sensitivo-motora y reflejos segmentarios.',
    connections: 'Columnas dorsales, tracto espinotalámico y corticoespinal.',
    exam: 'Nivel sensitivo, fuerza por miotomas, reflejos y tono.',
    lesion: 'Síndromes medulares (Brown-Séquard, medular anterior, cono/cauda).',
    laterality: 'Patrones ipsi/contra dependen de vía y nivel de decusación.',
    clinical: 'Pérdida dolor bilateral suspendida sugiere siringomielia cervical.',
    pearl: 'Ubica primero el nivel medular; luego interpreta tractos comprometidos.',
    localizationTable: [
      { label: 'Dónde está', value: 'Canal vertebral segmentado' },
      { label: 'Hallazgo guía', value: 'Nivel sensitivo + patrón de vías' },
    ],
    application:
      'Pregunta: hemisección medular derecha produce debilidad ipsilateral y pérdida dolor contralateral bajo lesión.',
  },
  {
    id: 'nervios-craneales-espinales',
    title: '1.7 Nervios craneales y espinales',
    location: 'Pares craneales I-XII y raíces/plexos periféricos.',
    function: 'Funciones motoras, sensitivas y autonómicas periféricas.',
    connections: 'Núcleos de pares craneales, raíces dorsales/ventrales y nervios periféricos.',
    exam: 'Exploración sistemática de pares, dermatomas, miotomas y reflejos.',
    lesion: 'Déficits focales de nervio, raíz, plexo o neuropatía periférica.',
    laterality: 'Déficit ipsilateral al nervio periférico lesionado; patrón dermatomal en raíz.',
    clinical: 'Parálisis facial periférica compromete hemicara completa ipsilateral.',
    pearl: 'Distinguir central vs periférico en VII por respeto de frente en lesión central.',
    localizationTable: [
      { label: 'Dónde está', value: 'SNP craneal y espinal' },
      { label: 'Hallazgo guía', value: 'Patrón por nervio, raíz o plexo' },
    ],
    application:
      'Caso: ptosis, midriasis y ojo en abducción-depresión localiza lesión del III par ipsilateral.',
  },
  {
    id: 'circulacion',
    title: '1.8 Circulación arterial y venosa',
    location: 'Polígono de Willis, sistema carotídeo, vertebrobasilar y senos venosos.',
    function: 'Aporte sanguíneo regional del SNC y drenaje venoso.',
    connections: 'Territorios ACA, ACM, ACP; PICA/AICA/espinal anterior.',
    exam: 'Correlación sindrómica vascular con topografía neurológica.',
    lesion: 'Síndromes territoriales y datos de trombosis venosa cerebral.',
    laterality: 'Déficit según hemisferio o tronco irrigado comprometido.',
    clinical: 'Afasia + hemiparesia braquiofacial sugiere territorio ACM dominante.',
    pearl: 'Relaciona territorio arterial con signos corticales y de vía larga.',
    localizationTable: [
      { label: 'Dónde está', value: 'Red arterial/venosa intracraneal' },
      { label: 'Hallazgo guía', value: 'Síndrome territorial reproducible' },
    ],
    application:
      'Pregunta: hemiparesia crural predominante orienta a infarto en territorio de ACA contralateral.',
  },
  {
    id: 'lcr',
    title: '1.9 Líquido cefalorraquídeo',
    location: 'Ventrículos, espacio subaracnoideo y granulaciones aracnoideas.',
    function: 'Amortiguación, homeostasis y depuración metabólica.',
    connections: 'Flujo desde plexos coroideos a cisternas y reabsorción venosa.',
    exam: 'Correlación de signos de hipertensión intracraneal/hidrocefalia.',
    lesion: 'Hidrocefalia obstructiva o comunicante por alteración de flujo/reabsorción.',
    laterality: 'Efectos usualmente bilaterales por dinámica global de presión.',
    clinical: 'Marcha magnética + deterioro cognitivo + incontinencia sugiere hidrocefalia normotensiva.',
    pearl: 'Agujero de Monro y acueducto son puntos clásicos de obstrucción.',
    localizationTable: [
      { label: 'Dónde está', value: 'Sistema ventricular y subaracnoideo' },
      { label: 'Hallazgo guía', value: 'Síndrome de presión/flujo de LCR' },
    ],
    application:
      'Caso: ventriculomegalia desproporcionada sin atrofia cortical marcada orienta a trastorno de dinámica de LCR.',
  },
  {
    id: 'meninges',
    title: '1.10 Meninges y espacios meníngeos',
    location: 'Duramadre, aracnoides y piamadre con espacios epidural, subdural y subaracnoideo.',
    function: 'Protección mecánica y compartimentalización del SNC.',
    connections: 'Relación con arterias meníngeas, venas puente y cisternas.',
    exam: 'Signos meníngeos y correlación de patrón hemorrágico por espacio.',
    lesion: 'Hematoma epidural/subdural o hemorragia subaracnoidea según espacio afectado.',
    laterality: 'Déficit focal variable por efecto de masa lateralizado.',
    clinical: 'Trauma temporal con intervalo lúcido sugiere hematoma epidural.',
    pearl: 'Epidural: arterial y biconvexo; subdural: venoso y semilunar.',
    localizationTable: [
      { label: 'Dónde está', value: 'Cubiertas del SNC y espacios meníngeos' },
      { label: 'Hallazgo guía', value: 'Patrón de sangrado por compartimento' },
    ],
    application:
      'Pregunta: cefalea súbita intensa con rigidez nucal orienta a sangrado en espacio subaracnoideo.',
  },
]

const questions: Question[] = [
  {
    id: 1,
    category: 'Hemisferios cerebrales',
    subtopic: 'Lóbulo frontal',
    level: 'Básico',
    stem: 'Paciente diestro con lenguaje no fluido, comprensión preservada y debilidad faciobraquial derecha. ¿Sitio más probable?',
    options: ['Lóbulo frontal izquierdo', 'Lóbulo temporal derecho', 'Lóbulo occipital izquierdo', 'Ínsula derecha'],
    answer: 0,
    explanation: 'Afasia de Broca + hemiparesia contralateral localizan en frontal dominante.',
    distractors: [
      'Correcta: integra producción verbal y corteza motora lateral.',
      'Temporal derecho no explica afasia de Broca típica.',
      'Occipital da déficit visual, no afasia motora.',
      'Ínsula aislada rara vez produce este patrón completo.',
    ],
    pearl: 'Broca suele acompañarse de hemiparesia faciobraquial contralateral.',
    reference: 'Snell Neuroanatomía clínica, edición vigente.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 2,
    category: 'Hemisferios cerebrales',
    subtopic: 'Lóbulo frontal',
    level: 'Intermedio',
    stem: 'Desviación ocular conjugada hacia la izquierda con hemiparesia derecha sugiere lesión en:',
    options: ['Campo ocular frontal izquierdo', 'Campo ocular frontal derecho', 'Parietal izquierdo', 'Tallo pontino derecho'],
    answer: 0,
    explanation: 'Lesión destructiva del campo ocular frontal desvía la mirada hacia el lado lesionado.',
    distractors: [
      'Correcta por relación mirada ipsiversiva en lesión cortical frontal.',
      'Derecho causaría desviación contraria al caso.',
      'Parietal no es principal generador de mirada conjugada.',
      'Puente daría patrones de pares craneales adicionales.',
    ],
    pearl: '“Ojos miran a la lesión” en lesión frontal destructiva aguda.',
    reference: 'Blumenfeld Neuroanatomy through Clinical Cases.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 3,
    category: 'Hemisferios cerebrales',
    subtopic: 'Lóbulo parietal',
    level: 'Básico',
    stem: 'Heminegligencia izquierda y extinción sensitiva izquierda al estímulo bilateral indican lesión en:',
    options: ['Parietal derecho', 'Frontal izquierdo', 'Temporal izquierdo', 'Occipital derecho'],
    answer: 0,
    explanation: 'La negligencia espacial severa clásica se asocia a parietal no dominante (derecho).',
    distractors: [
      'Correcta por red atencional espacial no dominante.',
      'Frontal puede afectar atención, pero no patrón típico aislado.',
      'Temporal dominante se asocia más a lenguaje.',
      'Occipital genera campo visual, no negligencia cortical principal.',
    ],
    pearl: 'Negligencia no es hemianopsia: falla atencional cortical.',
    reference: 'DeMyer The Neurologic Examination.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 4,
    category: 'Hemisferios cerebrales',
    subtopic: 'Lóbulo parietal',
    level: 'Avanzado',
    stem: 'Acalculia, agrafia, agnosia digital y desorientación derecha-izquierda sugieren lesión en:',
    options: ['Parietal inferior dominante', 'Frontal medial', 'Ínsula no dominante', 'Occipital bilateral'],
    answer: 0,
    explanation: 'Es el síndrome de Gerstmann, típico del parietal dominante.',
    distractors: [
      'Correcta: circunvolución angular dominante.',
      'Frontal medial no da tetrada clásica.',
      'Ínsula no produce Gerstmann típico.',
      'Occipital bilateral da ceguera cortical, no esta tetrada.',
    ],
    pearl: 'Gerstmann orienta a giro angular del hemisferio dominante.',
    reference: 'Adams and Victor Principles of Neurology.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 5,
    category: 'Hemisferios cerebrales',
    subtopic: 'Lóbulo temporal',
    level: 'Básico',
    stem: 'Lenguaje fluido con parafasias y mala comprensión en paciente diestro localiza en:',
    options: ['Temporal posterior izquierdo', 'Frontal derecho', 'Parietal derecho', 'Occipital izquierdo'],
    answer: 0,
    explanation: 'Corresponde a afasia de Wernicke, lesión temporal dominante posterior.',
    distractors: [
      'Correcta por compromiso de comprensión verbal dominante.',
      'Frontal derecho no explica afasia receptiva típica.',
      'Parietal derecho raramente da afasia clásica.',
      'Occipital no produce lenguaje fluido parafásico principal.',
    ],
    pearl: 'Wernicke = fluidez sin contenido + comprensión alterada.',
    reference: 'Kandel Principles of Neural Science.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 6,
    category: 'Hemisferios cerebrales',
    subtopic: 'Lóbulo temporal',
    level: 'Intermedio',
    stem: 'Cuadrantanopsia homónima superior derecha orienta a lesión de asa de Meyer en:',
    options: ['Temporal izquierdo', 'Parietal izquierdo', 'Temporal derecho', 'Occipital derecho'],
    answer: 0,
    explanation: 'Asa de Meyer izquierda transmite cuadrante superior contralateral.',
    distractors: [
      'Correcta: lesión temporal izquierda produce “pie en el cielo” derecho.',
      'Parietal suele afectar cuadrante inferior.',
      'Temporal derecho produciría defecto izquierdo.',
      'Occipital derecho produciría defecto izquierdo y más amplio.',
    ],
    pearl: 'Temporal = cuadrante superior contralateral.',
    reference: 'Nolte The Human Brain.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 7,
    category: 'Hemisferios cerebrales',
    subtopic: 'Lóbulo occipital',
    level: 'Básico',
    stem: 'Hemianopsia homónima derecha con fuerza y sensibilidad conservadas sugiere lesión en:',
    options: ['Occipital izquierdo', 'Parietal derecho', 'Frontal izquierdo', 'Ínsula izquierda'],
    answer: 0,
    explanation: 'Déficit visual aislado homónimo sugiere corteza visual contralateral.',
    distractors: [
      'Correcta por topografía visual primaria.',
      'Parietal puede dar negligencia más que hemianopsia pura.',
      'Frontal no explica defecto campimétrico aislado.',
      'Ínsula no es corteza visual primaria.',
    ],
    pearl: 'Occipital puro: visual sin gran déficit motor.',
    reference: 'Snell Neuroanatomía clínica.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 8,
    category: 'Hemisferios cerebrales',
    subtopic: 'Lóbulo occipital',
    level: 'Avanzado',
    stem: 'Hemianopsia homónima con preservación macular orienta a lesión de:',
    options: ['Corteza visual occipital', 'Nervio óptico', 'Quiasma óptico', 'Radiación temporal bilateral'],
    answer: 0,
    explanation: 'La preservación macular es clásica de lesión cortical occipital.',
    distractors: [
      'Correcta por doble irrigación occipital macular relativa.',
      'Nervio óptico produce defecto monocular.',
      'Quiasma causa hemianopsia bitemporal.',
      'Radiación temporal bilateral no explica patrón típico.',
    ],
    pearl: 'Preservación macular apunta a corteza calcarina.',
    reference: 'Blumenfeld Neuroanatomy through Clinical Cases.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 9,
    category: 'Hemisferios cerebrales',
    subtopic: 'Ínsula',
    level: 'Intermedio',
    stem: 'Disgeusia súbita y sensación visceral epigástrica ascendente se correlacionan mejor con:',
    options: ['Ínsula', 'Lóbulo occipital', 'Núcleo caudado', 'Cerebelo'],
    answer: 0,
    explanation: 'Ínsula integra gusto e interocepción visceral.',
    distractors: [
      'Correcta por función viscerosensitiva/gustativa.',
      'Occipital es visual.',
      'Caudado es modulador motor cognitivo.',
      'Cerebelo coordina movimiento.',
    ],
    pearl: 'Síntomas viscerales + gusto sugieren red insular.',
    reference: 'Neuroscience Purves.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 10,
    category: 'Hemisferios cerebrales',
    subtopic: 'Ínsula',
    level: 'Avanzado',
    stem: 'Paciente con ictus silviano profundo presenta disfunción autonómica y alteración del gusto. Área más probable:',
    options: ['Ínsula dominante', 'Parietal superior', 'Occipital medial', 'Bulbo dorsal'],
    answer: 0,
    explanation: 'El territorio silviano profundo compromete con frecuencia la ínsula.',
    distractors: [
      'Correcta por localización anatómica en cisura de Silvio.',
      'Parietal superior no explica disgeusia principal.',
      'Occipital medial no integra gusto/autonomía.',
      'Bulbo dorsal daría otros signos de tallo.',
    ],
    pearl: 'La ínsula puede pasar desapercibida si solo se piensa en lóbulos superficiales.',
    reference: 'Adams and Victor Principles of Neurology.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 11,
    category: 'Núcleos grises de la base',
    subtopic: 'Vía directa e indirecta',
    level: 'Básico',
    stem: '¿Qué circuito facilita el inicio del movimiento voluntario?',
    options: ['Vía directa', 'Vía indirecta', 'Vía espinotalámica', 'Circuito de Papez'],
    answer: 0,
    explanation: 'La vía directa desinhibe tálamo y facilita ejecución motora.',
    distractors: [
      'Correcta por facilitación talamocortical.',
      'Indirecta incrementa freno motor.',
      'Espinotalámica es sensitiva dolor-temperatura.',
      'Papez es de memoria/emoción.',
    ],
    pearl: 'Directa acelera; indirecta modula y frena.',
    reference: 'Kandel Principles of Neural Science.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 12,
    category: 'Núcleos grises de la base',
    subtopic: 'Hemibalismo',
    level: 'Intermedio',
    stem: 'Movimientos balísticos del hemicuerpo izquierdo se localizan con mayor probabilidad en:',
    options: ['Núcleo subtalámico derecho', 'Putamen izquierdo', 'Cerebelo derecho', 'Tálamo izquierdo'],
    answer: 0,
    explanation: 'Hemibalismo clásico por lesión subtalámica contralateral.',
    distractors: [
      'Correcta por patrón motor proximal explosivo.',
      'Putamen puede dar corea/distonía, no típico hemibalismo.',
      'Cerebelo produce ataxia, no balismo.',
      'Tálamo no produce patrón clásico aislado.',
    ],
    pearl: 'Balismo = pensar subtálamo contralateral.',
    reference: 'Snell Neuroanatomía clínica.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 13,
    category: 'Núcleos grises de la base',
    subtopic: 'Hipocinético vs hipercinético',
    level: 'Intermedio',
    stem: 'Bradicinesia, rigidez y temblor de reposo son ejemplo de trastorno:',
    options: ['Hipocinético', 'Hipercinético', 'Cerebeloso puro', 'Neuropático distal'],
    answer: 0,
    explanation: 'El parkinsonismo corresponde a síndrome hipocinético.',
    distractors: [
      'Correcta por reducción del movimiento espontáneo.',
      'Hipercinético incluye corea/distonía.',
      'Cerebeloso se expresa con incoordinación.',
      'Neuropático distal no define este fenotipo.',
    ],
    pearl: 'Primero clasifica: exceso vs pobreza de movimiento.',
    reference: 'DeMyer The Neurologic Examination.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 14,
    category: 'Sistema límbico',
    subtopic: 'Hipocampo',
    level: 'Básico',
    stem: 'Incapacidad para consolidar nueva memoria episódica sugiere lesión predominante en:',
    options: ['Hipocampo', 'Putamen', 'Núcleo rojo', 'Corteza motora primaria'],
    answer: 0,
    explanation: 'Hipocampo es esencial para consolidación de memoria declarativa.',
    distractors: [
      'Correcta por papel central en memoria episódica.',
      'Putamen es motor.',
      'Núcleo rojo participa en vías motoras.',
      'M1 controla ejecución motora voluntaria.',
    ],
    pearl: 'Amnesia anterógrada: pensar red hipocampal.',
    reference: 'Neuroscience Purves.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 15,
    category: 'Sistema límbico',
    subtopic: 'Circuito de Papez',
    level: 'Avanzado',
    stem: '¿Cuál estructura enlaza hipocampo con cuerpos mamilares en el circuito de Papez?',
    options: ['Fórnix', 'Lemnisco medial', 'Cápsula interna', 'Comisura anterior'],
    answer: 0,
    explanation: 'El fórnix conduce proyecciones hipocampales hacia cuerpos mamilares.',
    distractors: [
      'Correcta por anatomía límbica clásica.',
      'Lemnisco medial transmite sensibilidad epicrítica.',
      'Cápsula interna es vía de paso motora/sensitiva.',
      'Comisura anterior no cumple esa conexión principal.',
    ],
    pearl: 'Papez: hipocampo → fórnix → mamilares → tálamo anterior → cingulado.',
    reference: 'Nolte The Human Brain.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 16,
    category: 'Cerebelo',
    subtopic: 'Vermis vs hemisferio cerebeloso',
    level: 'Básico',
    stem: 'Ataxia troncal marcada con base de sustentación amplia orienta a lesión en:',
    options: ['Vermis cerebeloso', 'Hemisferio cerebeloso lateral', 'Núcleo caudado', 'Lóbulo frontal medial'],
    answer: 0,
    explanation: 'El vermis regula control axial y marcha.',
    distractors: [
      'Correcta por dominio axial del vermis.',
      'Hemisferio lateral afecta más extremidades ipsilaterales.',
      'Caudado no genera ataxia troncal primaria.',
      'Frontal medial no da dismetría cerebelosa.',
    ],
    pearl: 'Vermis = tronco; hemisferio = extremidad ipsilateral.',
    reference: 'Snell Neuroanatomía clínica.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 17,
    category: 'Cerebelo',
    subtopic: 'Dismetría',
    level: 'Intermedio',
    stem: 'Dismetría y temblor de intención en brazo derecho localizan en:',
    options: ['Hemisferio cerebeloso derecho', 'Corteza motora izquierda', 'Tálamo derecho', 'Parietal izquierdo'],
    answer: 0,
    explanation: 'Déficits cerebelosos de extremidad suelen ser ipsilaterales.',
    distractors: [
      'Correcta por organización doblemente cruzada.',
      'M1 izquierdo produce debilidad, no dismetría primaria.',
      'Tálamo puede modular, pero patrón cerebeloso apunta al cerebelo.',
      'Parietal da déficit sensitivo cortical.',
    ],
    pearl: 'Ataxia ipsilateral es regla de oro cerebelosa.',
    reference: 'Blumenfeld Neuroanatomy through Clinical Cases.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 18,
    category: 'Cerebelo',
    subtopic: 'Romberg diferencial',
    level: 'Avanzado',
    stem: 'Paciente inestable que empeora mucho al cerrar ojos, sin dismetría franca. Esto sugiere más bien:',
    options: ['Ataxia sensitiva por columnas dorsales', 'Ataxia cerebelosa pura', 'Lesión del núcleo subtalámico', 'Afasia motora'],
    answer: 0,
    explanation: 'Romberg dependiente de visión sugiere déficit propioceptivo sensitivo.',
    distractors: [
      'Correcta por dependencia visual compensatoria.',
      'Ataxia cerebelosa suele persistir con ojos abiertos/cerrados.',
      'Subtalámico produce balismo.',
      'Afasia no explica inestabilidad postural.',
    ],
    pearl: 'Romberg positivo aislado no localiza al cerebelo.',
    reference: 'DeMyer The Neurologic Examination.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 19,
    category: 'Tallo cerebral',
    subtopic: 'Síndrome de Weber',
    level: 'Intermedio',
    stem: 'Ptosis y midriasis izquierdas con hemiparesia derecha sugieren síndrome de Weber en:',
    options: ['Mesencéfalo izquierdo', 'Puente derecho', 'Bulbo izquierdo', 'Cápsula interna izquierda'],
    answer: 0,
    explanation: 'III par ipsilateral + vía corticoespinal contralateral = mesencéfalo ventral.',
    distractors: [
      'Correcta por patrón alterno mesencefálico.',
      'Puente no explica III par típico.',
      'Bulbo no contiene núcleo del III.',
      'Cápsula no da par craneal ipsilateral focal.',
    ],
    pearl: 'Síndromes cruzados localizan mejor que síntomas aislados.',
    reference: 'Adams and Victor Principles of Neurology.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 20,
    category: 'Tallo cerebral',
    subtopic: 'Wallenberg',
    level: 'Avanzado',
    stem: 'Disfagia, disfonía, hipoestesia facial ipsilateral y corporal contralateral orientan a:',
    options: ['Bulbo lateral (Wallenberg)', 'Mesencéfalo dorsal', 'Puente medial', 'Cerebelo vermiano'],
    answer: 0,
    explanation: 'Wallenberg compromete núcleo ambiguo y tractos sensitivos cruzados.',
    distractors: [
      'Correcta por síndrome bulbar lateral clásico.',
      'Mesencéfalo dorsal se asocia a Parinaud.',
      'Puente medial afecta VI y corticoespinal.',
      'Vermis da ataxia troncal sin patrón cruzado sensitivo.',
    ],
    pearl: 'Núcleo ambiguo (disfagia/disfonía) es pista de bulbo lateral.',
    reference: 'Snell Neuroanatomía clínica.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 21,
    category: 'Tallo cerebral',
    subtopic: 'Parinaud',
    level: 'Intermedio',
    stem: 'Parálisis de la mirada vertical superior con retracción palpebral sugiere lesión en:',
    options: ['Mesencéfalo dorsal', 'Puente lateral', 'Bulbo ventral', 'Ínsula derecha'],
    answer: 0,
    explanation: 'Síndrome de Parinaud localiza en región tectal mesencefálica dorsal.',
    distractors: [
      'Correcta por centro de mirada vertical.',
      'Puente relaciona mirada horizontal.',
      'Bulbo no controla mirada vertical supranuclear.',
      'Ínsula no controla estas vías oculomotoras.',
    ],
    pearl: 'Mirada vertical = techo mesencefálico.',
    reference: 'Blumenfeld Neuroanatomy through Clinical Cases.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 22,
    category: 'Tallo cerebral',
    subtopic: 'Síndrome de enclaustramiento',
    level: 'Básico',
    stem: 'Cuadriplejia con conciencia preservada y parpadeo vertical sugiere lesión en:',
    options: ['Puente ventral bilateral', 'Bulbo dorsal', 'Mesencéfalo lateral', 'Tálamo bilateral'],
    answer: 0,
    explanation: 'El síndrome de enclaustramiento clásico se debe a lesión pontina ventral.',
    distractors: [
      'Correcta por interrupción corticoespinal/corticobulbar.',
      'Bulbo dorsal no explica patrón completo clásico.',
      'Mesencéfalo lateral produce otros síndromes oculomotores.',
      'Tálamo bilateral altera conciencia de forma prominente.',
    ],
    pearl: 'Consciencia intacta + cuadriplejia = pensar puente ventral.',
    reference: 'Adams and Victor Principles of Neurology.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 23,
    category: 'Médula espinal',
    subtopic: 'Brown-Séquard',
    level: 'Básico',
    stem: 'Hemisección medular derecha a T10 produce:',
    options: [
      'Déficit motor y propioceptivo derechos + dolor/temperatura izquierdos',
      'Pérdida bilateral de dolor y temperatura',
      'Sólo debilidad contralateral',
      'Afectación exclusiva de pares craneales',
    ],
    answer: 0,
    explanation: 'Brown-Séquard combina tractos con distinta decusación.',
    distractors: [
      'Correcta por patrón ipsi/contra clásico.',
      'Bilateral suspendido sugiere siringomielia central.',
      'No respeta neuroanatomía de tractos principales.',
      'Pares craneales no pertenecen a médula espinal.',
    ],
    pearl: 'Primero identifica nivel; luego aplica decusaciones.',
    reference: 'Snell Neuroanatomía clínica.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 24,
    category: 'Médula espinal',
    subtopic: 'Síndrome medular anterior',
    level: 'Intermedio',
    stem: 'Conservación de vibración/propriocepción con pérdida de fuerza y dolor-temperatura bilateral sugiere:',
    options: ['Síndrome medular anterior', 'Síndrome de cordones posteriores', 'Brown-Séquard', 'Cono medular puro'],
    answer: 0,
    explanation: 'Compromete corticoespinal y espinotalámico, respeta columnas dorsales.',
    distractors: [
      'Correcta por irrigación de arteria espinal anterior.',
      'Cordones posteriores causan pérdida propioceptiva.',
      'Brown-Séquard es hemimedular.',
      'Cono compromete esfínteres y patrón distal especial.',
    ],
    pearl: 'Vibración conservada es pista de cordones dorsales intactos.',
    reference: 'Blumenfeld Neuroanatomy through Clinical Cases.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 25,
    category: 'Médula espinal',
    subtopic: 'Siringomielia',
    level: 'Básico',
    stem: 'Pérdida bilateral suspendida de dolor y temperatura en “cape-like” orienta a:',
    options: ['Siringomielia cervical', 'Lesión de cordones posteriores', 'Lesión del nervio radial', 'Afasia de Broca'],
    answer: 0,
    explanation: 'Afecta comisura anterior espinotalámica segmentaria cervical.',
    distractors: [
      'Correcta por distribución suspendida bilateral típica.',
      'Cordones posteriores afectan vibración/propriocepción.',
      'Radial es neuropatía periférica focal.',
      'Afasia es cortical, no medular.',
    ],
    pearl: 'Distribución en “capa” bilateral = lesión central medular.',
    reference: 'Nolte The Human Brain.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 26,
    category: 'Médula espinal',
    subtopic: 'Cono medular vs cauda equina',
    level: 'Avanzado',
    stem: 'Inicio súbito de anestesia en silla de montar y arreflexia asimétrica radicular sugiere más:',
    options: ['Cauda equina', 'Cono medular puro', 'Síndrome pontino', 'Lesión del nervio facial'],
    answer: 0,
    explanation: 'Cauda equina da compromiso radicular asimétrico y arreflexia marcada.',
    distractors: [
      'Correcta por patrón radicular periférico.',
      'Cono suele ser más simétrico y con signos mixtos.',
      'Pontino no produce anestesia en silla de montar aislada.',
      'Facial no participa en esta topografía.',
    ],
    pearl: 'Asimetría dolor radicular intensa favorece cauda equina.',
    reference: 'DeMyer The Neurologic Examination.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 27,
    category: 'Médula espinal',
    subtopic: 'Columnas dorsales',
    level: 'Intermedio',
    stem: 'Pérdida de vibración y posición con dolor-temperatura conservados orienta a lesión de:',
    options: ['Columnas dorsales', 'Tracto espinotalámico lateral', 'Astas anteriores aisladas', 'Núcleo ambiguo'],
    answer: 0,
    explanation: 'Columnas dorsales transportan propriocepción y vibración.',
    distractors: [
      'Correcta por modalidad sensitiva epicrítica.',
      'Espinotalámico conduce dolor/temperatura.',
      'Astas anteriores dan déficit motor inferior.',
      'Núcleo ambiguo está en bulbo.',
    ],
    pearl: 'Sensibilidad fina y vibratoria viaja por cordones posteriores.',
    reference: 'Snell Neuroanatomía clínica.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 28,
    category: 'Médula espinal',
    subtopic: 'Tracto espinotalámico',
    level: 'Intermedio',
    stem: 'Lesión hemimedular derecha por arriba de T8 provoca pérdida de dolor/temperatura desde:',
    options: ['Hemicuerpo izquierdo 1-2 niveles por debajo', 'Hemicuerpo derecho al mismo nivel', 'Bilateral por arriba', 'Cara ipsilateral'],
    answer: 0,
    explanation: 'Fibras espinotalámicas cruzan en comisura 1-2 niveles después de entrar.',
    distractors: [
      'Correcta por decusación segmentaria temprana.',
      'No corresponde al cruce fisiológico.',
      'No explica distribución segmentaria real.',
      'La cara se integra en tallo, no médula torácica.',
    ],
    pearl: 'Recuerda el desfase de 1-2 niveles del espinotalámico.',
    reference: 'Blumenfeld Neuroanatomy through Clinical Cases.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 29,
    category: 'Médula espinal',
    subtopic: 'Tracto corticoespinal',
    level: 'Básico',
    stem: 'Signos de neurona motora superior bajo una lesión medular cervical indican compromiso de:',
    options: ['Tracto corticoespinal lateral', 'Fascículo grácil', 'Tracto trigeminotalámico', 'Núcleo del III par'],
    answer: 0,
    explanation: 'El corticoespinal lateral conduce motricidad voluntaria y signos piramidales.',
    distractors: [
      'Correcta por vía motora descendente principal.',
      'Fascículo grácil es sensitivo.',
      'Trigeminotalámico es vía de cara.',
      'Núcleo del III está en mesencéfalo.',
    ],
    pearl: 'Babinski e hiperreflexia = vía piramidal.',
    reference: 'Adams and Victor Principles of Neurology.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 30,
    category: 'Médula espinal',
    subtopic: 'Nivel medular',
    level: 'Básico',
    stem: 'El primer paso para localizar una lesión medular en exploración es:',
    options: ['Definir nivel sensitivo', 'Solicitar algoritmo terapéutico', 'Clasificar cefalea', 'Valorar dosis farmacológica'],
    answer: 0,
    explanation: 'El nivel sensitivo guía topografía segmentaria y vías afectadas.',
    distractors: [
      'Correcta porque orienta toda la localización.',
      'No corresponde a objetivo anatómico inicial.',
      'No es problema principal de lesión medular.',
      'No es enfoque de localización neuroanatómica.',
    ],
    pearl: 'Sin nivel sensitivo, la localización medular pierde precisión.',
    reference: 'DeMyer The Neurologic Examination.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 31,
    category: 'Médula espinal',
    subtopic: 'Reflejos segmentarios',
    level: 'Intermedio',
    stem: 'Arreflexia rotuliana sugiere compromiso predominante en raíz:',
    options: ['L4', 'S1', 'C7', 'T1'],
    answer: 0,
    explanation: 'Reflejo patelar evalúa principalmente raíz L4 (L3-L4).',
    distractors: [
      'Correcta por arco reflejo patelar.',
      'S1 corresponde aquíleo.',
      'C7 corresponde tricipital.',
      'T1 no es principal en este reflejo.',
    ],
    pearl: 'Mapear reflejo a raíz ayuda a distinguir radiculopatía.',
    reference: 'Snell Neuroanatomía clínica.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 32,
    category: 'Médula espinal',
    subtopic: 'Síndrome medular central',
    level: 'Avanzado',
    stem: 'Debilidad mayor en miembros superiores que inferiores tras trauma cervical hiperextensión sugiere:',
    options: ['Síndrome medular central', 'Brown-Séquard', 'Cono medular', 'Lesión cerebelosa'],
    answer: 0,
    explanation: 'El síndrome central cervical afecta fibras mediales para miembros superiores.',
    distractors: [
      'Correcta por patrón braquial predominante.',
      'Brown-Séquard es hemimedular típico.',
      'Cono afecta esfínteres y miembros inferiores.',
      'Cerebelo no da patrón piramidal segmentario.',
    ],
    pearl: 'En cervical central, brazos se afectan más que piernas.',
    reference: 'Adams and Victor Principles of Neurology.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 33,
    category: 'Nervios craneales y espinales',
    subtopic: 'III, IV, VI y diplopía',
    level: 'Básico',
    stem: 'Ptosis, midriasis y ojo “abajo y afuera” localizan lesión en:',
    options: ['III par craneal ipsilateral', 'VI par contralateral', 'Nervio facial', 'Nervio óptico'],
    answer: 0,
    explanation: 'Compromiso completo del III afecta elevador, pupila y músculos extraoculares.',
    distractors: [
      'Correcta por patrón oculomotor clásico.',
      'VI produce imposibilidad de abducción, no ptosis/midriasis.',
      'Facial mueve mímica, no motilidad ocular principal.',
      'Óptico da déficit visual aferente.',
    ],
    pearl: 'Midriasis dolorosa + III sugiere compromiso parasimpático superficial.',
    reference: 'Blumenfeld Neuroanatomy through Clinical Cases.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 34,
    category: 'Nervios craneales y espinales',
    subtopic: 'Parálisis facial central vs periférica',
    level: 'Básico',
    stem: 'Debilidad de hemicara inferior derecha con frente respetada sugiere:',
    options: ['Lesión supranuclear izquierda (central)', 'Parálisis facial periférica derecha', 'Lesión del trigémino derecho', 'Miopatía ocular'],
    answer: 0,
    explanation: 'La inervación frontal bilateral preserva frente en lesión central.',
    distractors: [
      'Correcta por patrón de VII central.',
      'Periférica afecta toda hemicara ipsilateral.',
      'Trigémino es sensibilidad facial/masticación.',
      'Miopatía ocular no explica distribución facial.',
    ],
    pearl: 'Frente respetada = lesión central hasta demostrar lo contrario.',
    reference: 'DeMyer The Neurologic Examination.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 35,
    category: 'Nervios craneales y espinales',
    subtopic: 'Reflejo corneal',
    level: 'Intermedio',
    stem: 'Aferencia y eferencia principales del reflejo corneal corresponden a:',
    options: ['V1 y VII', 'II y III', 'VIII y X', 'IX y XII'],
    answer: 0,
    explanation: 'Rama oftálmica del V detecta estímulo; VII ejecuta cierre palpebral.',
    distractors: [
      'Correcta por arco reflejo corneal clásico.',
      'II/III participan en reflejo fotomotor.',
      'VIII/X no median este reflejo.',
      'IX/XII no forman este circuito.',
    ],
    pearl: 'Corneal: V entra, VII cierra.',
    reference: 'Snell Neuroanatomía clínica.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 36,
    category: 'Nervios craneales y espinales',
    subtopic: 'Reflejo fotomotor',
    level: 'Intermedio',
    stem: 'Si la luz en ojo izquierdo no produce miosis bilateral, pero luz en derecho sí produce miosis en ambos, la lesión está en:',
    options: ['Aferencia del II izquierdo', 'Eferencia del III izquierdo', 'Núcleo del VI derecho', 'Nervio facial izquierdo'],
    answer: 0,
    explanation: 'Falla aferente izquierda impide activar ambos núcleos parasimpáticos al estimular ese ojo.',
    distractors: [
      'Correcta por patrón de defecto pupilar aferente.',
      'III izquierdo daría falla eferente en ojo izquierdo también al estimular derecho.',
      'VI no participa en reflejo pupilar.',
      'VII no regula miosis.',
    ],
    pearl: 'Comparar respuesta directa y consensual separa aferente de eferente.',
    reference: 'Blumenfeld Neuroanatomy through Clinical Cases.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 37,
    category: 'Nervios craneales y espinales',
    subtopic: 'Reflejo nauseoso',
    level: 'Básico',
    stem: 'La vía aferente principal del reflejo nauseoso es:',
    options: ['IX par craneal', 'XII par craneal', 'I par craneal', 'II par craneal'],
    answer: 0,
    explanation: 'IX aporta aferencia faríngea; X participa en eferencia.',
    distractors: [
      'Correcta por inervación sensitiva orofaríngea.',
      'XII es motor lingual.',
      'I es olfatorio.',
      'II es visual.',
    ],
    pearl: 'Nauseoso: IX entra, X sale.',
    reference: 'DeMyer The Neurologic Examination.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 38,
    category: 'Nervios craneales y espinales',
    subtopic: 'Reflejo vestíbulo-ocular',
    level: 'Avanzado',
    stem: 'La ausencia bilateral del reflejo vestíbulo-ocular en paciente comatoso orienta a disfunción en:',
    options: ['Tronco encefálico', 'Lóbulo occipital aislado', 'Nervio radial', 'Cono medular'],
    answer: 0,
    explanation: 'El VOR evalúa integridad de vías vestibulares y oculomotoras del tallo.',
    distractors: [
      'Correcta por integración pontomesencefálica.',
      'Occipital no media este reflejo troncal.',
      'Radial es periférico de miembro superior.',
      'Cono medular no participa en reflejo ocular.',
    ],
    pearl: 'VOR es herramienta de localización del tallo en estado crítico.',
    reference: 'Adams and Victor Principles of Neurology.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 39,
    category: 'Nervios craneales y espinales',
    subtopic: 'Dermatomas y miotomas',
    level: 'Básico',
    stem: 'Hipoestesia en borde lateral de antebrazo y debilidad en flexión de codo sugieren raíz:',
    options: ['C6', 'C8', 'T1', 'L4'],
    answer: 0,
    explanation: 'Dermatoma C6 y bíceps/flexión de codo se asocian a C5-C6, predominio C6 en patrón dado.',
    distractors: [
      'Correcta por integración sensitivo-motora segmentaria.',
      'C8 afecta más flexión de dedos y borde cubital.',
      'T1 afecta interóseos mano.',
      'L4 corresponde miembro inferior.',
    ],
    pearl: 'Combinar dermatoma + miotoma mejora precisión radicular.',
    reference: 'Snell Neuroanatomía clínica.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 40,
    category: 'Nervios craneales y espinales',
    subtopic: 'Radiculopatía vs plexopatía vs neuropatía',
    level: 'Intermedio',
    stem: 'Dolor irradiado dermatomal con reflejo disminuido en una sola raíz y estudio distal normal sugiere:',
    options: ['Radiculopatía', 'Plexopatía', 'Mononeuropatía distal', 'Miopatía'],
    answer: 0,
    explanation: 'El patrón dermatomal con reflejo segmentario señala raíz nerviosa.',
    distractors: [
      'Correcta por topografía segmentaria.',
      'Plexopatía combina múltiples raíces/territorios.',
      'Mononeuropatía sigue territorio de nervio periférico.',
      'Miopatía es proximal y no dermatomal.',
    ],
    pearl: 'Distribución clínica define nivel periférico de lesión.',
    reference: 'DeMyer The Neurologic Examination.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 41,
    category: 'Nervios craneales y espinales',
    subtopic: 'Nervios periféricos',
    level: 'Básico',
    stem: '“Pie caído” con debilidad de dorsiflexión y sensibilidad en dorso del pie sugiere lesión en:',
    options: ['Nervio peroneo común', 'Nervio tibial', 'Raíz S1 aislada', 'Nervio femoral'],
    answer: 0,
    explanation: 'Peroneo común compromete dorsiflexores y sensibilidad dorsal del pie.',
    distractors: [
      'Correcta por distribución motora/sensitiva típica.',
      'Tibial afecta flexión plantar.',
      'S1 se asocia más a plantarflexión/aquíleo.',
      'Femoral afecta extensión de rodilla.',
    ],
    pearl: 'Pie caído periférico clásico: peroneo común en cabeza de peroné.',
    reference: 'Blumenfeld Neuroanatomy through Clinical Cases.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 42,
    category: 'Nervios craneales y espinales',
    subtopic: 'Exploración pares I-XII',
    level: 'Avanzado',
    stem: 'Disfonía, desviación de úvula contralateral y disminución reflejo nauseoso eferente localizan en:',
    options: ['X par craneal ipsilateral', 'IX par contralateral', 'XI bilateral', 'XII contralateral'],
    answer: 0,
    explanation: 'Eferencia faríngea y elevación palatina dependen del X ipsilateral.',
    distractors: [
      'Correcta por compromiso vagal motor.',
      'IX es más aferente sensitivo en nauseoso.',
      'XI inerva esternocleidomastoideo/trapecio.',
      'XII produce desviación lingual, no palatina principal.',
    ],
    pearl: 'Disfonía + paladar caído = evaluar nervio vago.',
    reference: 'Adams and Victor Principles of Neurology.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 43,
    category: 'Circulación arterial y venosa',
    subtopic: 'Territorio ACM',
    level: 'Básico',
    stem: 'Hemiparesia faciobraquial y afasia en paciente diestro sugiere oclusión de:',
    options: ['Arteria cerebral media izquierda', 'Arteria cerebral anterior izquierda', 'Arteria cerebral posterior izquierda', 'Arteria basilar'],
    answer: 0,
    explanation: 'ACM irriga corteza lateral motora del brazo/cara y áreas de lenguaje dominantes.',
    distractors: [
      'Correcta por territorio cortical lateral dominante.',
      'ACA predomina en miembro inferior.',
      'ACP causa más déficit visual.',
      'Basilar da síndromes de tallo.',
    ],
    pearl: 'ACM dominante: lenguaje + cara/brazo.',
    reference: 'Snell Neuroanatomía clínica.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 44,
    category: 'Circulación arterial y venosa',
    subtopic: 'Territorio ACA',
    level: 'Intermedio',
    stem: 'Déficit motor predominante en pierna contralateral y abulia sugieren lesión en:',
    options: ['Arteria cerebral anterior', 'Arteria cerebral media', 'Arteria cerebral posterior', 'AICA'],
    answer: 0,
    explanation: 'ACA irriga cara medial frontal/parietal con representación crural.',
    distractors: [
      'Correcta por homúnculo medial y conducta frontal medial.',
      'ACM predomina cara/brazo.',
      'ACP se relaciona con visión.',
      'AICA es territorio pontocerebeloso.',
    ],
    pearl: 'Pierna > brazo apunta a ACA contralateral.',
    reference: 'Blumenfeld Neuroanatomy through Clinical Cases.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 45,
    category: 'Circulación arterial y venosa',
    subtopic: 'Territorio ACP',
    level: 'Básico',
    stem: 'Hemianopsia homónima contralateral aislada orienta a territorio de:',
    options: ['Arteria cerebral posterior', 'Arteria cerebral media', 'Arteria espinal anterior', 'Arteria comunicante anterior'],
    answer: 0,
    explanation: 'ACP irriga lóbulo occipital y corteza visual primaria.',
    distractors: [
      'Correcta por irrigación calcarina.',
      'ACM da más déficits motores/lenguaje.',
      'Espinal anterior afecta médula.',
      'Comunicante anterior no define territorio cortical aislado.',
    ],
    pearl: 'Visual puro frecuentemente ACP.',
    reference: 'Nolte The Human Brain.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 46,
    category: 'Circulación arterial y venosa',
    subtopic: 'PICA/AICA/espinal anterior',
    level: 'Avanzado',
    stem: 'Vértigo, nistagmo, disfonía y pérdida termoalgésica cruzada se relacionan más con:',
    options: ['PICA', 'AICA', 'Arteria cerebral anterior', 'Arteria coroidea anterior'],
    answer: 0,
    explanation: 'PICA se asocia a síndrome bulbar lateral (Wallenberg).',
    distractors: [
      'Correcta por compromiso bulbar lateral.',
      'AICA suele comprometer puente lateral y VII/VIII.',
      'ACA no irriga tallo lateral.',
      'Coroidea anterior se asocia a cápsula interna/tracto óptico.',
    ],
    pearl: 'Wallenberg clásico: pensar PICA.',
    reference: 'Adams and Victor Principles of Neurology.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 47,
    category: 'Circulación arterial y venosa',
    subtopic: 'Senos venosos',
    level: 'Intermedio',
    stem: 'Cefalea progresiva, papiledema y déficits fluctuantes con imagen venosa alterada orientan a:',
    options: ['Trombosis venosa cerebral', 'Infarto lacunar puro', 'Neuritis óptica aislada', 'Siringomielia'],
    answer: 0,
    explanation: 'La trombosis de senos venosos causa hipertensión intracraneal y focos variables.',
    distractors: [
      'Correcta por fisiopatología venosa intracraneal.',
      'Lacunar no da papiledema típico.',
      'Neuritis óptica no explica focalidad múltiple fluctuante.',
      'Siringomielia es medular crónica.',
    ],
    pearl: 'Patrón de presión + focalidad variable sugiere causa venosa.',
    reference: 'Snell Neuroanatomía clínica.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 48,
    category: 'Líquido cefalorraquídeo',
    subtopic: 'Flujo del LCR',
    level: 'Básico',
    stem: 'La obstrucción del acueducto de Silvio provoca típicamente:',
    options: ['Hidrocefalia obstructiva proximal', 'Hidrocefalia comunicante', 'Atrofia cortical primaria', 'Hematoma subdural'],
    answer: 0,
    explanation: 'Bloquea flujo entre tercer y cuarto ventrículo, dilatando ventrículos proximales.',
    distractors: [
      'Correcta por sitio anatómico de estrechamiento.',
      'Comunicante implica problema de reabsorción, no bloqueo focal.',
      'Atrofia no es defecto primario de flujo.',
      'Subdural es espacio meníngeo venoso.',
    ],
    pearl: 'Acueducto: punto crítico de hidrocefalia obstructiva.',
    reference: 'Blumenfeld Neuroanatomy through Clinical Cases.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 49,
    category: 'Líquido cefalorraquídeo',
    subtopic: 'Hidrocefalia normotensiva',
    level: 'Intermedio',
    stem: 'Marcha magnética, deterioro cognitivo e incontinencia urinaria orientan a:',
    options: ['Hidrocefalia normotensiva', 'Síndrome cerebeloso puro', 'Afasia global', 'Neuropatía periférica distal'],
    answer: 0,
    explanation: 'La tríada clásica se asocia a alteración crónica de dinámica de LCR.',
    distractors: [
      'Correcta por tríada de Hakim-Adams.',
      'Cerebelo no explica la tríada completa.',
      'Afasia global es cortical dominante extensa.',
      'Neuropatía no explica deterioro cognitivo típico asociado.',
    ],
    pearl: 'En localización, esta tríada apunta a sistema ventricular y redes frontales.',
    reference: 'Adams and Victor Principles of Neurology.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
  {
    id: 50,
    category: 'Meninges y espacios meníngeos',
    subtopic: 'Espacios meníngeos',
    level: 'Básico',
    stem: 'Trauma temporal con intervalo lúcido y lesión biconvexa en imagen corresponde a:',
    options: ['Hematoma epidural', 'Hematoma subdural', 'Hemorragia subaracnoidea', 'Contusión frontal simple'],
    answer: 0,
    explanation: 'El hematoma epidural arterial clásico es biconvexo y puede cursar con intervalo lúcido.',
    distractors: [
      'Correcta por patrón anatómico entre cráneo y duramadre.',
      'Subdural suele ser semilunar por venas puente.',
      'Subaracnoidea se distribuye en cisternas/surcos.',
      'Contusión simple no define el patrón biconvexo clásico.',
    ],
    pearl: 'Epidural = meníngea media y expansión rápida. Requiere valoración médica urgente y activación del protocolo institucional correspondiente.',
    reference: 'Snell Neuroanatomía clínica.',
    tag: 'Tema 1: Bases neuroanatómicas y neurofisiológicas',
  },
]

const officialFilters = [
  'Hemisferios cerebrales',
  'Núcleos grises de la base',
  'Sistema límbico',
  'Cerebelo',
  'Tallo cerebral',
  'Médula espinal',
  'Nervios craneales y espinales',
  'Circulación arterial y venosa',
  'Líquido cefalorraquídeo',
  'Meninges y espacios meníngeos',
] as const

const hemispheresSubtopicFilters = [
  'Lóbulo frontal',
  'Lóbulo parietal',
  'Lóbulo temporal',
  'Lóbulo occipital',
  'Ínsula',
] as const

function App() {
  const [expandedHemispheres, setExpandedHemispheres] = useState(true)
  const [questionFilter, setQuestionFilter] = useState('all')
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [referenceDrafts, setReferenceDrafts] = useState<Record<number, string>>(
    Object.fromEntries(questions.map((question) => [question.id, question.reference])),
  )

  const filteredQuestions = useMemo(() => {
    if (questionFilter === 'all') return questions

    if (questionFilter.startsWith('cat:')) {
      const category = questionFilter.replace('cat:', '')
      return questions.filter((question) => question.category === category)
    }

    if (questionFilter.startsWith('sub:')) {
      const subtopic = questionFilter.replace('sub:', '')
      return questions.filter((question) => question.subtopic === subtopic)
    }

    return questions
  }, [questionFilter])

  const answerQuestion = (questionId: number, choiceIndex: number) => {
    setSelectedAnswers((current) => ({ ...current, [questionId]: choiceIndex }))
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h1>Neuroanatomía ENARM</h1>
        <p>Tema 1: Bases neuroanatómicas y neurofisiológicas</p>
        <nav>
          <ul>
            <li><a href="#inicio">Inicio y objetivos</a></li>
            <li><a href="#mapa">Mapa general del sistema nervioso</a></li>
            <li>
              <button type="button" className="link-button" onClick={() => setExpandedHemispheres((state) => !state)}>
                1.1 Hemisferios cerebrales {expandedHemispheres ? '▾' : '▸'}
              </button>
              {expandedHemispheres ? (
                <ul className="nested-menu">
                  {hemisphereSubtopics.map((subtopic) => (
                    <li key={subtopic.id}>
                      <a href={`#${subtopic.id}`}>{subtopic.title}</a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
            {otherChapters.map((chapter) => (
              <li key={chapter.id}><a href={`#${chapter.id}`}>{chapter.title}</a></li>
            ))}
            <li><a href="#exploracion">Exploración neurológica y localización</a></li>
            <li><a href="#casos">Casos de localización</a></li>
            <li><a href="#enarm">Preguntas ENARM de neuroanatomía y semiología</a></li>
            <li><a href="#bibliografia">Bibliografía</a></li>
          </ul>
        </nav>
      </aside>

      <main className="content">
        <section id="inicio" className="card">
          <h2>Inicio y objetivos</h2>
          <p>
            Resultado de aprendizaje: reconocer la estructura esencial del sistema nervioso (SNC, SNP y SNA)
            para localizar hallazgos de exploración neurológica.
          </p>
          <p>
            Enfoque permanente: <strong>dónde está</strong>, <strong>función</strong>, <strong>exploración</strong>,
            <strong> hallazgos por lesión</strong> y <strong>lateralidad</strong>.
          </p>
        </section>

        <section id="mapa" className="card">
          <h2>Mapa general del sistema nervioso</h2>
          <ul>
            <li>SNC: corteza cerebral, núcleos profundos, cerebelo, tallo cerebral, médula espinal.</li>
            <li>SNP: pares craneales, raíces, plexos, nervios periféricos.</li>
            <li>SNA: integración central y periférica autonómica.</li>
          </ul>
        </section>

        <section id="hemisferios" className="card">
          <h2>1.1 Hemisferios cerebrales</h2>
          <p>
            Capítulo contenedor. Los subtemas se muestran anidados y se enfocan en localización anatómica,
            función y semiología de exploración.
          </p>
          {hemisphereSubtopics.map((subtopic) => (
            <article key={subtopic.id} id={subtopic.id} className="subsection-card">
              <h3>{subtopic.title}</h3>
              <div className="chapter-grid">
                <p><strong>Dónde está:</strong> {subtopic.location}</p>
                <p><strong>Función:</strong> {subtopic.function}</p>
                <p><strong>Conexiones/vías:</strong> {subtopic.connections}</p>
                <p><strong>Exploración:</strong> {subtopic.exam}</p>
                <p><strong>Hallazgos por lesión:</strong> {subtopic.lesion}</p>
                <p><strong>Lateralidad:</strong> {subtopic.laterality}</p>
                <p><strong>Correlación clínica:</strong> {subtopic.clinical}</p>
                <p><strong>Perla ENARM:</strong> {subtopic.pearl}</p>
              </div>
              <div className="table-card">
                <h4>Tabla breve de localización</h4>
                <table>
                  <tbody>
                    {subtopic.localizationTable.map((row) => (
                      <tr key={`${subtopic.id}-${row.label}`}>
                        <th>{row.label}</th>
                        <td>{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="application"><strong>Caso/pregunta de aplicación:</strong> {subtopic.application}</p>
            </article>
          ))}
        </section>

        {otherChapters.map((chapter) => (
          <section key={chapter.id} id={chapter.id} className="card">
            <h2>{chapter.title}</h2>
            <div className="chapter-grid">
              <p><strong>Anatomía y límites/componentes:</strong> {chapter.location}</p>
              <p><strong>Función neurofisiológica:</strong> {chapter.function}</p>
              <p><strong>Conexiones/vías principales:</strong> {chapter.connections}</p>
              <p><strong>Exploración relacionada:</strong> {chapter.exam}</p>
              <p><strong>Hallazgos por lesión:</strong> {chapter.lesion}</p>
              <p><strong>Lateralidad:</strong> {chapter.laterality}</p>
              <p><strong>Correlación clínica breve:</strong> {chapter.clinical}</p>
              <p><strong>Perla ENARM:</strong> {chapter.pearl}</p>
            </div>
            <div className="table-card">
              <h4>Esquema de localización</h4>
              <table>
                <tbody>
                  {chapter.localizationTable.map((row) => (
                    <tr key={`${chapter.id}-${row.label}`}>
                      <th>{row.label}</th>
                      <td>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="application"><strong>Caso/pregunta de aplicación:</strong> {chapter.application}</p>
          </section>
        ))}

        <section id="exploracion" className="card">
          <h2>Exploración neurológica y localización</h2>
          <ol>
            <li>Definir síndrome principal (motor, sensitivo, cerebeloso, lenguaje, pares craneales).</li>
            <li>Precisar lateralidad (ipsilateral, contralateral, bilateral).</li>
            <li>Mapear vía/neuroeje comprometido.</li>
            <li>Correlacionar con capítulo anatómico correspondiente.</li>
          </ol>
        </section>

        <section id="casos" className="card">
          <h2>Casos de localización</h2>
          <ul>
            <li>Afasia no fluente + hemiparesia faciobraquial: frontal dominante.</li>
            <li>Ataxia ipsilateral de extremidad + nistagmo: hemisferio cerebeloso ipsilateral.</li>
            <li>Síndrome cruzado de pares craneales y vía larga: tallo cerebral.</li>
          </ul>
        </section>

        <section id="enarm" className="card">
          <h2>ENARM Neuroanatomía y Semiología: preguntas de localización</h2>
          <p>Total de preguntas: {questions.length}</p>
          <div className="filters">
            <label>
              Filtro oficial por categoría:
              <select value={questionFilter} onChange={(event) => setQuestionFilter(event.target.value)}>
                <option value="all">Todas</option>
                {officialFilters.map((filter) => (
                  <option key={filter} value={`cat:${filter}`}>{filter}</option>
                ))}
                {hemispheresSubtopicFilters.map((filter) => (
                  <option key={filter} value={`sub:${filter}`}>{filter} (subtema opcional)</option>
                ))}
              </select>
            </label>
            <p>
              El filtro <strong>Hemisferios cerebrales</strong> incluye preguntas de lóbulo frontal, parietal,
              temporal, occipital e ínsula.
            </p>
          </div>

          <div className="question-list">
            {filteredQuestions.map((question) => {
              const selected = selectedAnswers[question.id]
              const isAnswered = selected !== undefined
              const isCorrect = selected === question.answer

              return (
                <article key={question.id} className="question-card">
                  <header>
                    <h3>Pregunta {question.id}</h3>
                    <p>
                      <strong>Categoría:</strong> {question.category} · <strong>Subtema:</strong> {question.subtopic} ·
                      <strong> Nivel:</strong> {question.level}
                    </p>
                    <p><strong>Etiqueta:</strong> {question.tag}</p>
                  </header>

                  <p>{question.stem}</p>
                  <div className="options">
                    {question.options.map((option, index) => (
                      <button
                        key={`${question.id}-${option}`}
                        type="button"
                        onClick={() => answerQuestion(question.id, index)}
                        className={selected === index ? 'option selected' : 'option'}
                      >
                        {String.fromCharCode(65 + index)}. {option}
                      </button>
                    ))}
                  </div>

                  {isAnswered ? (
                    <div className={isCorrect ? 'feedback ok' : 'feedback wrong'}>
                      <p>
                        <strong>{isCorrect ? 'Correcto' : 'Incorrecto'}.</strong> Respuesta esperada:
                        {' '}{String.fromCharCode(65 + question.answer)}. {question.options[question.answer]}
                      </p>
                      <p><strong>Explicación:</strong> {question.explanation}</p>
                      <ul>
                        {question.distractors.map((text, index) => (
                          <li key={`${question.id}-d-${index}`}>
                            <strong>{String.fromCharCode(65 + index)}:</strong> {text}
                          </li>
                        ))}
                      </ul>
                      <p><strong>Perla ENARM:</strong> {question.pearl}</p>
                    </div>
                  ) : null}

                  <label>
                    Referencia bibliográfica editable:
                    <input
                      value={referenceDrafts[question.id] ?? ''}
                      onChange={(event) =>
                        setReferenceDrafts((current) => ({ ...current, [question.id]: event.target.value }))
                      }
                    />
                  </label>
                </article>
              )
            })}
          </div>
        </section>

        <section id="bibliografia" className="card">
          <h2>Bibliografía</h2>
          <ul>
            <li>Snell RS. Neuroanatomía clínica.</li>
            <li>Blumenfeld H. Neuroanatomy through Clinical Cases.</li>
            <li>Adams and Victor. Principles of Neurology.</li>
          </ul>
        </section>
      </main>
    </div>
  )
}

export default App
