import { useEffect, useMemo, useState } from 'react';
import { fetchPatients, triggerSOS, symptomCheck, voiceIntent, chatWithPatient } from '../services/api';
import RiskBadge from '../components/RiskBadge';

const LANGUAGE_CODES = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };

const TRANSLATIONS = {
  en: {
    title: 'AI Symptom Checker',
    subtitle: 'Complete patient risk analysis and medical intelligence for ASHA workers',
    patientSearching: 'Search patient',
    patientDetails: 'Patient profile',
    gender: 'Gender',
    village: 'Village',
    healthId: 'Patient ID',
    chronicTags: 'Chronic tags',
    age: 'Age',
    duration: 'Duration (days)',
    severity: 'Severity',
    bodyView: 'Body view',
    anatomyGender: 'Anatomy avatar',
    voiceAssistant: 'Voice Command Assistant',
    voiceHint: 'Speak symptom entries, patient search, SOS or save report',
    startVoice: 'Start voice',
    stopVoice: 'Stop listening',
    transcript: 'Transcript',
    chatAssistant: 'AI Medical Chatbot',
    chatHint: 'Ask about medication, hydration or emergency signs',
    ask: 'Ask',
    searchSymptom: 'Search symptoms',
    filterCategory: 'Category',
    runAnalysis: 'Run AI Analysis',
    saveHistory: 'Save patient history',
    saved: 'Saved to patient history',
    emergency: 'Emergency',
    infection: 'Infection',
    dehydration: 'Dehydration',
    recommendations: 'AI recommendation',
    emptyPatients: 'No patients found',
    selectPatientFirst: 'Select a patient to begin analysis',
    bodyParts: 'Interactive anatomy body',
  },
  hi: {
    title: 'एआई लक्षण जाँच',
    subtitle: 'ASHA कार्यकर्ताओं के लिए पूर्ण रोगी जोखिम विश्लेषण',
    patientSearching: 'रोगी खोजें',
    patientDetails: 'रोगी प्रोफ़ाइल',
    gender: 'लिंग',
    village: 'गाँव',
    healthId: 'पेशेंट आईडी',
    chronicTags: 'दीर्घकालिक टैग',
    age: 'उम्र',
    duration: 'अवधि (दिन)',
    severity: 'गंभीरता',
    bodyView: 'बॉडी व्यू',
    anatomyGender: 'एनाटॉमी अवतार',
    voiceAssistant: 'वॉइस कमांड सहायक',
    voiceHint: 'लक्षण बोलें, रोगी खोजें, SOS या रिपोर्ट सहेजें',
    startVoice: 'वॉइस शुरू करें',
    stopVoice: 'सुनना बंद करें',
    transcript: 'ट्रांसक्रिप्ट',
    chatAssistant: 'एआई मेडिकल चैटबॉट',
    chatHint: 'दवा, हाइड्रेशन या इमरजेंसी संकेत पूछें',
    ask: 'पूछें',
    searchSymptom: 'लक्षण खोजें',
    filterCategory: 'श्रेणी',
    runAnalysis: 'एआई विश्लेषण चलाएँ',
    saveHistory: 'रोगी इतिहास सहेजें',
    saved: 'रोगी इतिहास में सहेजा गया',
    emergency: 'आपातकाल',
    infection: 'संक्रमण',
    dehydration: 'निर्जलीकरण',
    recommendations: 'एआई सिफारिश',
    emptyPatients: 'कोई रोगी नहीं मिला',
    selectPatientFirst: 'विश्लेषण शुरू करने के लिए रोगी चुनें',
    bodyParts: 'इंटरैक्टिव एनाटॉमी बॉडी',
  },
  mr: {
    title: 'एआय लक्षण तपास',
    subtitle: 'ASHA कार्यकर्त्यांसाठी पूर्ण रुग्ण जोखीम विश्लेषण',
    patientSearching: 'रुग्ण शोधा',
    patientDetails: 'रुग्ण प्रोफाइल',
    gender: 'लिंग',
    village: 'शहर/गाव',
    healthId: 'रुग्ण आयडी',
    chronicTags: 'दीर्घकालीन टॅग',
    age: 'वय',
    duration: 'कालावधी (दिवस)',
    severity: 'तीव्रता',
    bodyView: 'बॉडी दृश्य',
    anatomyGender: 'एनाटॉमी अवतार',
    voiceAssistant: 'वॉइस कमांड सहाय्यक',
    voiceHint: 'लक्षण बोला, रुग्ण शोधा, SOS किंवा अहवाल जतन करा',
    startVoice: 'वॉइस सुरू करा',
    stopVoice: 'ऐकणे थांबवा',
    transcript: 'ट्रान्सक्रिप्ट',
    chatAssistant: 'एआय मेडिकल चॅटबॉट',
    chatHint: 'औषधे, हायड्रेशन किंवा आपातकालीन लक्षणे विचारा',
    ask: 'विचारा',
    searchSymptom: 'लक्षण शोधा',
    filterCategory: 'वर्ग',
    runAnalysis: 'एआय विश्लेषण चालवा',
    saveHistory: 'रुग्ण इतिहास जतन करा',
    saved: 'रुग्ण इतिहासात जतन केले',
    emergency: 'अतिनिबंध',
    infection: 'संक्रमण',
    dehydration: 'निर्जलीकरण',
    recommendations: 'एआय शिफारस',
    emptyPatients: 'रुग्ण सापडले नाही',
    selectPatientFirst: 'विश्लेषण सुरू करण्यासाठी रुग्ण निवडा',
    bodyParts: 'इंटरऐक्टिव्ह अँटोमी बॉडी',
  },
};

const SYMPTOM_CATEGORIES = {
  General: ['fever', 'fatigue', 'headache', 'dizziness', 'nausea', 'weakness', 'anxiety', 'malaise'],
  Respiratory: ['cough', 'breathlessness', 'chest_pain', 'sore_throat', 'wheezing', 'wheezing', 'rapid_breathing'],
  Gastrointestinal: ['diarrhea', 'vomiting', 'abdominal_pain', 'loss_of_appetite', 'cramps', 'dehydration'],
  Dermatology: ['rash', 'itching', 'swelling', 'burning_sensation', 'infection', 'skin_pain'],
  Pregnancy: ['bleeding', 'reduced_fetal_movement', 'severe_headache', 'pelvic_pain', 'high_bp', 'edema'],
  Neurological: ['confusion', 'seizures', 'blurred_vision', 'migraine', 'dizziness'],
  Cardiovascular: ['palpitations', 'chest_pain', 'high_bp', 'low_bp', 'cyanosis', 'swelling'],
  Pediatrics: ['fever_child', 'diarrhea_child', 'vomiting_child', 'irritability', 'poor_feeding'],
  Metabolic: ['high_sugar', 'fatigue', 'numbness', 'urinary_frequency', 'thirst'],
  Skin: ['rash', 'itching', 'redness', 'lesion', 'dry_skin'],
  Mental: ['anxiety', 'sleep_disturbance', 'confusion', 'mood_change'],
};

const SYMPTOM_LABELS = {
  en: {
    fever: 'Fever', fatigue: 'Fatigue', headache: 'Headache', dizziness: 'Dizziness', nausea: 'Nausea', weakness: 'Weakness', anxiety: 'Anxiety', malaise: 'Malaise',
    cough: 'Cough', breathlessness: 'Breathlessness', chest_pain: 'Chest pain', sore_throat: 'Sore throat', wheezing: 'Wheezing', rapid_breathing: 'Rapid breathing',
    diarrhea: 'Diarrhea', vomiting: 'Vomiting', abdominal_pain: 'Abdominal pain', loss_of_appetite: 'Loss of appetite', cramps: 'Cramps', dehydration: 'Dehydration',
    rash: 'Rash', itching: 'Itching', swelling: 'Swelling', burning_sensation: 'Burning', infection: 'Infection', skin_pain: 'Skin pain',
    bleeding: 'Bleeding', reduced_fetal_movement: 'Reduced fetal movement', severe_headache: 'Severe headache', pelvic_pain: 'Pelvic pain', high_bp: 'High BP', edema: 'Edema',
    confusion: 'Confusion', seizures: 'Seizures', blurred_vision: 'Blurred vision', migraine: 'Migraine',
    palpitations: 'Palpitations', low_bp: 'Low BP', cyanosis: 'Cyanosis',
    fever_child: 'Child fever', diarrhea_child: 'Child diarrhea', vomiting_child: 'Child vomiting', irritability: 'Irritability', poor_feeding: 'Poor feeding',
    high_sugar: 'High sugar', numbness: 'Numbness', urinary_frequency: 'Urinary frequency', thirst: 'Thirst',
    redness: 'Redness', lesion: 'Lesion', dry_skin: 'Dry skin', sleep_disturbance: 'Sleep disturbance', mood_change: 'Mood change',
  },
  hi: {
    fever: 'बुखार', fatigue: 'थकान', headache: 'सिरदर्द', dizziness: 'चक्कर', nausea: 'मतली', weakness: 'कमज़ोरी', anxiety: 'चिंता', malaise: 'अस्वस्थता',
    cough: 'खांसी', breathlessness: 'सांस की कमी', chest_pain: 'छाती में दर्द', sore_throat: 'गले में खराश', wheezing: 'सीटी जैसा श्वास', rapid_breathing: 'तेज़ सांस',
    diarrhea: 'दस्त', vomiting: 'उल्टी', abdominal_pain: 'पेट में दर्द', loss_of_appetite: 'भूख की कमी', cramps: 'पेट में ऐंठन', dehydration: 'निर्जलीकरण',
    rash: 'दाने', itching: 'खुजली', swelling: 'सूजन', burning_sensation: 'झुनझुनी', infection: 'संक्रमण', skin_pain: 'त्वचा में दर्द',
    bleeding: 'रक्तस्राव', reduced_fetal_movement: 'भ्रूण की कम चाल', severe_headache: 'तेज़ सिरदर्द', pelvic_pain: 'पेल्विक दर्द', high_bp: 'उच्च रक्तचाप', edema: 'सूजन',
    confusion: 'उलझन', seizures: 'दौरे', blurred_vision: 'धुंधली दृष्टि', migraine: 'माइग्रेन',
    palpitations: 'दिल की धड़कन', low_bp: 'निम्न रक्तचाप', cyanosis: 'नीली त्वचा',
    fever_child: 'बच्चे को बुखार', diarrhea_child: 'बच्चे को दस्त', vomiting_child: 'बच्चे को उल्टी', irritability: 'चिड़चिड़ापन', poor_feeding: 'खराब खाने की इच्छा',
    high_sugar: 'उच्च शुगर', numbness: 'सूजी हुई', urinary_frequency: 'बार-बार पेशाब', thirst: 'प्यास',
    redness: 'लालिमा', lesion: 'घाव', dry_skin: 'सूखी त्वचा', sleep_disturbance: 'नींद में व्यवधान', mood_change: 'मूड परिवर्तन',
  },
  mr: {
    fever: 'ताप', fatigue: 'थकवा', headache: 'डोकेदुखी', dizziness: 'चक्कर', nausea: 'उलटी', weakness: 'कमजोरी', anxiety: 'ताण', malaise: 'अस्वस्थता',
    cough: 'खोकला', breathlessness: 'श्वासमुखीनता', chest_pain: 'छातीत वेदना', sore_throat: 'घशात दुखणे', wheezing: 'श्वासात सिटी', rapid_breathing: 'वेगवान श्वास',
    diarrhea: 'जुलाब', vomiting: 'उलट्या', abdominal_pain: 'पोटात वेदना', loss_of_appetite: 'भूक कमी', cramps: 'संकुचन', dehydration: 'निर्जलीकरण',
    rash: 'झाड', itching: 'खाज', swelling: 'सुजलेपणा', burning_sensation: 'जळजळ', infection: 'संक्रमण', skin_pain: 'त्वचेतील वेदना',
    bleeding: 'उत्सर्जन', reduced_fetal_movement: 'गर्भातील हालचाली कमी', severe_headache: 'तीव्र डोकेदुखी', pelvic_pain: 'पेल्विस वेदना', high_bp: 'उच्च रक्तदाब', edema: 'सूज',
    confusion: 'गोंधळ', seizures: 'संसर्ग', blurred_vision: 'धुकट दृष्टि', migraine: 'मायग्रेन',
    palpitations: 'हृदय ठोका', low_bp: 'कमी रक्तदाब', cyanosis: 'निळसर त्वचा',
    fever_child: 'लहान बाळाला ताप', diarrhea_child: 'लहान बाळाला जुलाब', vomiting_child: 'लहान बाळाला उलट्या', irritability: 'चिडचिड', poor_feeding: 'कमजोर आहार',
    high_sugar: 'उच्च साखर', numbness: 'सुन्नपणा', urinary_frequency: 'वारंवार लघवी', thirst: 'तृष्णा',
    redness: 'लालसरपणा', lesion: 'घाव', dry_skin: 'कोरडी त्वचा', sleep_disturbance: 'झोपेत व्यत्यय', mood_change: 'मूड बदल',
  },
};

const ANATOMY_PARTS = {
  front: [
    { id: 'head', labelKey: 'head', path: 'head', symptoms: ['headache', 'migraine', 'dizziness', 'fever'] },
    { id: 'chest', labelKey: 'chest', path: 'chest', symptoms: ['chest_pain', 'cough', 'breathlessness', 'sore_throat'] },
    { id: 'stomach', labelKey: 'stomach', path: 'stomach', symptoms: ['vomiting', 'cramps', 'diarrhea', 'abdominal_pain'] },
    { id: 'skin', labelKey: 'skin', path: 'skin', symptoms: ['rash', 'itching', 'infection', 'burning_sensation'] },
    { id: 'legs', labelKey: 'legs', path: 'legs', symptoms: ['swelling', 'weakness', 'injury', 'numbness'] },
  ],
  back: [
    { id: 'neck', labelKey: 'neck', path: 'neck', symptoms: ['stiff_neck', 'back_pain', 'headache'] },
    { id: 'spine', labelKey: 'spine', path: 'spine', symptoms: ['back_pain', 'weakness', 'numbness'] },
    { id: 'lower_back', labelKey: 'lower_back', path: 'lower_back', symptoms: ['pelvic_pain', 'swelling', 'back_pain'] },
  ],
};

const BODY_LABELS = {
  en: { head: 'Head', chest: 'Chest', stomach: 'Stomach', skin: 'Skin', legs: 'Legs', neck: 'Neck', spine: 'Spine', lower_back: 'Lower back' },
  hi: { head: 'सिर', chest: 'छाती', stomach: 'पेट', skin: 'त्वचा', legs: 'पैर', neck: 'गरदन', spine: 'रीढ़', lower_back: 'निचला पीठ' },
  mr: { head: 'डोकं', chest: 'छाती', stomach: 'पोट', skin: 'त्वचा', legs: 'पाय', neck: 'मान', spine: 'कनिष्ठ', lower_back: 'खालचे पाठीचे' },
};

const ANATOMY_GENDERS = ['female', 'male'];

export default function SymptomChecker() {
  const [patients, setPatients] = useState([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [activeCategory, setActiveCategory] = useState('General');
  const PATIENT_STORAGE_KEY = 'asha_selected_patient';
  const [searchSymptom, setSearchSymptom] = useState('');
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('female');
  const [severity, setSeverity] = useState('moderate');
  const [duration, setDuration] = useState(1);
  const [bodyView, setBodyView] = useState('front');
  const [anatomyGender, setAnatomyGender] = useState('female');
  const [selectedBodyPart, setSelectedBodyPart] = useState('head');
  const [language, setLanguage] = useState('en');
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceResponse, setVoiceResponse] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([{ role: 'assistant', text: 'Hello, ask about symptoms, risk, or pregnancy warning signs.' }]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState(null);

  const t = (key) => TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;

  const labelFor = (symptom) => SYMPTOM_LABELS[language]?.[symptom] || symptom.replace(/_/g, ' ');
  const bodyLabel = (id) => BODY_LABELS[language]?.[id] || id;

  const patient = useMemo(() => patients.find((p) => p.id === selectedPatient), [patients, selectedPatient]);

  useEffect(() => {
    fetchPatients().then((data) => {
      const patientsList = data || [];
      setPatients(patientsList);
      const storedPatient = localStorage.getItem(PATIENT_STORAGE_KEY);
      if (storedPatient && patientsList.find((p) => p.id === storedPatient)) {
        setSelectedPatient(storedPatient);
      } else if (patientsList.length) {
        setSelectedPatient(patientsList[0].id);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      localStorage.setItem(PATIENT_STORAGE_KEY, selectedPatient);
    }
  }, [selectedPatient]);

  useEffect(() => {
    if (patient) {
      setAge(patient.age || age);
      setGender(patient.gender || gender);
    }
  }, [patient]);

  const shownSymptoms = useMemo(() => {
    const list = SYMPTOM_CATEGORIES[activeCategory] || [];
    return list.filter((symptom) => labelFor(symptom).toLowerCase().includes(searchSymptom.toLowerCase()));
  }, [activeCategory, searchSymptom, language]);

  const addSymptom = (symptom) => {
    setSelectedSymptoms((prev) => (prev.includes(symptom) ? prev.filter((item) => item !== symptom) : [...prev, symptom]));
  };

  const selectBodyPart = (part) => {
    const anatomy = ANATOMY_PARTS[bodyView].find((item) => item.id === part);
    if (!anatomy) return;
    setSelectedBodyPart(part);
    anatomy.symptoms.forEach((symptom) => addSymptom(symptom));
  };

  const parseVoiceSymptoms = (text) => {
    const found = [];
    const lower = text.toLowerCase();
    Object.keys(SYMPTOM_LABELS.en).forEach((key) => {
      const label = SYMPTOM_LABELS[language]?.[key] || SYMPTOM_LABELS.en[key];
      if (!label) return;
      const normal = label.toLowerCase();
      const phrase = key.replace(/_/g, ' ');
      if (lower.includes(normal) || lower.includes(phrase)) found.push(key);
    });
    return Array.from(new Set(found));
  };

  const parsePatientName = (text) => {
    const lower = text.toLowerCase();
    const found = patients.find((p) => lower.includes(p.name.toLowerCase()));
    return found?.id || null;
  };

  const handleVoiceCommand = async (text) => {
    setTranscript(text);
    const action = await voiceIntent(text, language, selectedPatient);
    setVoiceResponse(`${action.intent} · ${action.action}`);

    if (action.intent === 'emergency' || /sos|emergency|urgent|help|आपात|मदद|आणीबाण/.test(text.toLowerCase())) {
      try {
        await triggerSOS({ patient_id: selectedPatient, message: `Voice emergency from ASHA: ${text}` });
        setVoiceResponse((prev) => `${prev} · SOS sent`);
      } catch (e) {
        setError(e.message);
      }
    }

    if (action.intent === 'search_patient') {
      const id = parsePatientName(text);
      if (id) setSelectedPatient(id);
      return;
    }

    if (action.intent === 'symptom_entry') {
      const symptoms = parseVoiceSymptoms(text);
      symptoms.forEach(addSymptom);
    }

    if (/save patient report|save report|save history/.test(text.toLowerCase())) {
      await handleAnalyze();
    }

    const bodyPartMap = {
      chest: 'chest', head: 'head', stomach: 'stomach', skin: 'skin', legs: 'legs', back: 'spine', pelvic: 'lower_back', neck: 'neck', abdomen: 'stomach', rash: 'skin', cough: 'chest', fever: 'head', vomiting: 'stomach', swelling: 'legs', weakness: 'legs', dizziness: 'head', anxiety: 'head', bleeding: 'pelvic', pregnancy: 'lower_back', 'chest pain': 'chest', 'headache': 'head', 'skin rash': 'skin', 'breathing issue': 'chest' };
    Object.entries(bodyPartMap).forEach(([keyword, part]) => {
      if (text.toLowerCase().includes(keyword)) selectBodyPart(part);
    });
  };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setError('Speech recognition is not supported in this browser. Use Chrome or Edge.');
      return;
    }
    const rec = new SR();
    rec.lang = LANGUAGE_CODES[language] || LANGUAGE_CODES.en;
    rec.onresult = async (e) => {
      const text = e.results[0][0].transcript;
      setListening(false);
      await handleVoiceCommand(text);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
    setListening(true);
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    if (!selectedPatient) {
      setError(t('selectPatientFirst'));
      return;
    }
    const userMessage = chatInput.trim();
    setError('');
    try {
      const response = await chatWithPatient({
        patient_id: selectedPatient,
        message: userMessage,
        chat_history: chatHistory,
      });
      setChatHistory((prev) => [
        ...prev,
        { role: 'user', text: userMessage },
        { role: 'assistant', text: response.reply },
      ]);
      setChatInput('');
    } catch (e) {
      setError(e.message);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedPatient) {
      setError(t('selectPatientFirst'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {
        symptoms: selectedSymptoms,
        age: Number(age),
        gender,
        severity,
        duration: Number(duration),
        vitals: {},
        patient_id: selectedPatient,
        is_pregnant: patient?.is_pregnant || false,
        medical_history: patient?.medical_history || [],
        anatomy_part: selectedBodyPart,
        anatomy_view: bodyView,
        anatomy_gender: anatomyGender,
        voice_transcript: transcript,
        voice_language: language,
        chat_log: chatHistory,
        patient_context: {
          id: patient?.health_id || patient?.id,
          name: patient?.name,
          village: patient?.village,
          gender: patient?.gender,
        },
      };
      const data = await symptomCheck(payload);
      setResult(data.prediction);
      setSavedAt(new Date());
      setVoiceResponse((prev) => prev || 'Analysis saved to patient history.');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const anatomyParts = ANATOMY_PARTS[bodyView];
  const selectedBodyData = anatomyParts.find((part) => part.id === selectedBodyPart) || anatomyParts[0];

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-800 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold text-white tracking-tight">{t('title')}</h2>
            <p className="mt-3 text-slate-400">{t('subtitle')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white">
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
            </select>
            <button type="button" onClick={handleAnalyze} className="rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-400">
              {t('runAnalysis')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-[32px] border border-slate-800 bg-slate-950/80 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">{t('patientDetails')}</h3>
                <p className="mt-2 text-sm text-slate-400">{t('patientSearching')}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 md:w-[360px]">
                <input value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} placeholder={t('patientSearching')} className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none" />
                <button type="button" onClick={() => fetchPatients(patientSearch).then((data) => setPatients(data || [])).catch(() => {})} className="rounded-2xl bg-slate-800 px-4 py-3 text-sm text-white hover:bg-slate-700">
                  {t('patientSearching')}
                </button>
              </div>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
              <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
                {patients.length ? patients.map((p) => (
                  <button key={p.id} type="button" onClick={() => setSelectedPatient(p.id)} className={`w-full rounded-3xl border px-4 py-3 text-left transition ${selectedPatient === p.id ? 'border-brand-500 bg-brand-500/10' : 'border-slate-800 bg-slate-950/80 hover:border-slate-600'}`}>
                    <p className="font-semibold text-white">{p.name}</p>
                    <p className="text-sm text-slate-400">{p.village || p.district || '—'}</p>
                  </button>
                )) : <p className="text-slate-500">{t('emptyPatients')}</p>}
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-inner shadow-slate-950/30">
                {patient ? (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-500/20 text-2xl text-brand-200">{patient.name?.split(' ').map((part) => part[0]).join('').slice(0,2)}</div>
                      <div>
                        <p className="text-lg font-semibold text-white">{patient.name}</p>
                        <p className="text-sm text-slate-400">{patient.health_id || patient.id}</p>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <Stat label={t('age')} value={patient.age ?? age} />
                      <Stat label={t('gender')} value={patient.gender || gender} />
                      <Stat label={t('village')} value={patient.village || patient.district || '—'} />
                      <Stat label={t('healthId')} value={patient.health_id || patient.id} />
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {(patient.medical_history || ['Primary care']).slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full bg-slate-800 px-3 py-2 text-xs text-slate-300">{tag}</span>
                      ))}
                      {patient.is_pregnant && <span className="rounded-full bg-rose-500/10 px-3 py-2 text-xs text-rose-200">Pregnant</span>}
                    </div>
                  </>
                ) : <p className="text-slate-400">{t('selectPatientFirst')}</p>}
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-slate-800 bg-slate-950/80 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">{t('bodyParts')}</h3>
                <p className="mt-2 text-sm text-slate-400">{t('anatomyGender')} · {t('bodyView')}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <select value={anatomyGender} onChange={(e) => setAnatomyGender(e.target.value)} className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white">
                  {ANATOMY_GENDERS.map((option) => (
                    <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                  ))}
                </select>
                <select value={bodyView} onChange={(e) => setBodyView(e.target.value)} className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white">
                  <option value="front">Front</option>
                  <option value="back">Back</option>
                </select>
              </div>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_240px]">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[32px] bg-slate-950/80 p-4">
                  <svg viewBox="0 0 200 320" className="h-full w-full">
                    <defs>
                      <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="200" height="320" rx="24" fill="url(#glow)" />
                    <g transform="translate(0 12)">
                      {bodyView === 'front' ? (
                        <>
                          <circle cx="100" cy="46" r="28" fill={selectedBodyPart === 'head' ? '#38bdf8' : '#1f2937'} stroke="#60a5fa" strokeWidth="2" style={{ filter: selectedBodyPart === 'head' ? 'drop-shadow(0 0 16px rgba(56,189,248,0.45))' : undefined }} onClick={() => selectBodyPart('head')} cursor="pointer" />
                          <rect x="60" y="84" width="80" height="90" rx="22" fill={selectedBodyPart === 'chest' ? '#38bdf8' : '#1f2937'} stroke="#60a5fa" strokeWidth="2" style={{ filter: selectedBodyPart === 'chest' ? 'drop-shadow(0 0 16px rgba(56,189,248,0.45))' : undefined }} onClick={() => selectBodyPart('chest')} cursor="pointer" />
                          <rect x="70" y="186" width="60" height="90" rx="18" fill={selectedBodyPart === 'stomach' ? '#38bdf8' : '#1f2937'} stroke="#60a5fa" strokeWidth="2" style={{ filter: selectedBodyPart === 'stomach' ? 'drop-shadow(0 0 16px rgba(56,189,248,0.45))' : undefined }} onClick={() => selectBodyPart('stomach')} cursor="pointer" />
                          <rect x="40" y="92" width="20" height="68" rx="10" fill="#1f2937" stroke="#60a5fa" strokeWidth="2" onClick={() => selectBodyPart('chest')} cursor="pointer" />
                          <rect x="140" y="92" width="20" height="68" rx="10" fill="#1f2937" stroke="#60a5fa" strokeWidth="2" onClick={() => selectBodyPart('chest')} cursor="pointer" />
                          <rect x="58" y="284" width="28" height="34" rx="12" fill={selectedBodyPart === 'legs' ? '#38bdf8' : '#1f2937'} stroke="#60a5fa" strokeWidth="2" style={{ filter: selectedBodyPart === 'legs' ? 'drop-shadow(0 0 16px rgba(56,189,248,0.45))' : undefined }} onClick={() => selectBodyPart('legs')} cursor="pointer" />
                          <rect x="114" y="284" width="28" height="34" rx="12" fill={selectedBodyPart === 'legs' ? '#38bdf8' : '#1f2937'} stroke="#60a5fa" strokeWidth="2" style={{ filter: selectedBodyPart === 'legs' ? 'drop-shadow(0 0 16px rgba(56,189,248,0.45))' : undefined }} onClick={() => selectBodyPart('legs')} cursor="pointer" />
                          <circle cx="150" cy="140" r="16" fill={selectedBodyPart === 'skin' ? '#38bdf8' : '#1f2937'} stroke="#60a5fa" strokeWidth="2" style={{ filter: selectedBodyPart === 'skin' ? 'drop-shadow(0 0 16px rgba(56,189,248,0.45))' : undefined }} onClick={() => selectBodyPart('skin')} cursor="pointer" />
                        </>
                      ) : (
                        <>
                          <circle cx="100" cy="46" r="28" fill={selectedBodyPart === 'head' ? '#38bdf8' : '#1f2937'} stroke="#60a5fa" strokeWidth="2" style={{ filter: selectedBodyPart === 'head' ? 'drop-shadow(0 0 16px rgba(56,189,248,0.45))' : undefined }} onClick={() => selectBodyPart('head')} cursor="pointer" />
                          <rect x="76" y="90" width="48" height="140" rx="22" fill={selectedBodyPart === 'spine' ? '#38bdf8' : '#1f2937'} stroke="#60a5fa" strokeWidth="2" style={{ filter: selectedBodyPart === 'spine' ? 'drop-shadow(0 0 16px rgba(56,189,248,0.45))' : undefined }} onClick={() => selectBodyPart('spine')} cursor="pointer" />
                          <rect x="58" y="90" width="24" height="70" rx="12" fill="#1f2937" stroke="#60a5fa" strokeWidth="2" onClick={() => selectBodyPart('spine')} cursor="pointer" />
                          <rect x="118" y="90" width="24" height="70" rx="12" fill="#1f2937" stroke="#60a5fa" strokeWidth="2" onClick={() => selectBodyPart('spine')} cursor="pointer" />
                          <rect x="70" y="232" width="60" height="90" rx="18" fill={selectedBodyPart === 'lower_back' ? '#38bdf8' : '#1f2937'} stroke="#60a5fa" strokeWidth="2" style={{ filter: selectedBodyPart === 'lower_back' ? 'drop-shadow(0 0 16px rgba(56,189,248,0.45))' : undefined }} onClick={() => selectBodyPart('lower_back')} cursor="pointer" />
                          <rect x="42" y="132" width="24" height="60" rx="12" fill={selectedBodyPart === 'neck' ? '#38bdf8' : '#1f2937'} stroke="#60a5fa" strokeWidth="2" style={{ filter: selectedBodyPart === 'neck' ? 'drop-shadow(0 0 16px rgba(56,189,248,0.45))' : undefined }} onClick={() => selectBodyPart('neck')} cursor="pointer" />
                          <rect x="134" y="132" width="24" height="60" rx="12" fill={selectedBodyPart === 'neck' ? '#38bdf8' : '#1f2937'} stroke="#60a5fa" strokeWidth="2" style={{ filter: selectedBodyPart === 'neck' ? 'drop-shadow(0 0 16px rgba(56,189,248,0.45))' : undefined }} onClick={() => selectBodyPart('neck')} cursor="pointer" />
                        </>
                      )}
                    </g>
                  </svg>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{bodyLabel(selectedBodyData?.id)}</p>
                <p className="mt-4 text-white">{selectedBodyData?.symptoms.map((sym) => labelFor(sym)).join(', ')}</p>
                <div className="mt-4 space-y-2">
                  {selectedBodyData?.symptoms.map((sym) => (
                    <button key={sym} type="button" onClick={() => addSymptom(sym)} className="block w-full rounded-2xl bg-slate-800 px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-700">
                      + {labelFor(sym)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-slate-800 bg-slate-950/80 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">{t('searchSymptom')}</h3>
                <p className="mt-2 text-sm text-slate-400">{t('filterCategory')}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 md:w-[360px]">
                <input value={searchSymptom} onChange={(e) => setSearchSymptom(e.target.value)} placeholder={t('searchSymptom')} className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none" />
                <select value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)} className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white">
                  {Object.keys(SYMPTOM_CATEGORIES).map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {shownSymptoms.map((symptom) => (
                <button key={symptom} type="button" onClick={() => addSymptom(symptom)} className={`rounded-3xl border px-4 py-3 text-left transition ${selectedSymptoms.includes(symptom) ? 'border-brand-500 bg-brand-500/10 text-white' : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-600'}`}>
                  <p className="font-semibold">{labelFor(symptom)}</p>
                  <p className="mt-2 text-xs text-slate-400">{symptom.replace(/_/g, ' ')}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-slate-800 bg-slate-950/80 p-6">
            <div className="flex flex-wrap items-center gap-3">
              {selectedSymptoms.length ? selectedSymptoms.map((symptom) => (
                <button key={symptom} type="button" onClick={() => addSymptom(symptom)} className="rounded-full bg-brand-500/10 px-4 py-2 text-sm text-white transition hover:bg-brand-500/20">
                  {labelFor(symptom)} ×
                </button>
              )) : <p className="text-slate-500">{t('searchSymptom')}...</p>}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <label className="text-sm text-slate-300">
                {t('age')}
                <input type="number" min="0" value={age} onChange={(e) => setAge(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white" />
              </label>
              <label className="text-sm text-slate-300">
                {t('severity')}
                <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white">
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                  <option value="critical">Critical</option>
                </select>
              </label>
              <label className="text-sm text-slate-300">
                {t('duration')}
                <input type="number" min="1" value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white" />
              </label>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[32px] border border-slate-800 bg-slate-950/80 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-white">{t('voiceAssistant')}</h3>
                <p className="mt-2 text-sm text-slate-400">{t('voiceHint')}</p>
              </div>
              <button type="button" onClick={startVoice} className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${listening ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
                {listening ? t('stopVoice') : t('startVoice')}
              </button>
            </div>
            <div className="mt-5 grid gap-3">
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white">
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-200">
                <p><span className="font-semibold text-slate-100">{t('transcript')}:</span> {transcript || '—'}</p>
                <p className="mt-2 text-slate-400">{voiceResponse || 'Ready to receive commands.'}</p>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-slate-800 bg-slate-950/80 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-white">{t('chatAssistant')}</h3>
                <p className="mt-2 text-sm text-slate-400">{t('chatHint')}</p>
              </div>
            </div>
            <div className="mt-5 space-y-3 rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
              {chatHistory.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`rounded-3xl px-4 py-3 ${message.role === 'assistant' ? 'bg-slate-950 text-slate-100' : 'bg-slate-800 text-slate-200'}`}>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{message.role === 'assistant' ? 'AI' : 'You'}</p>
                  <p className="mt-2 text-sm">{message.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3">
              <textarea rows="3" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder={t('chatHint')} className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none" />
              <button type="button" onClick={handleChatSubmit} className="rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-400">
                {t('ask')}
              </button>
            </div>
          </section>

          <section className="rounded-[32px] border border-slate-800 bg-slate-950/80 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{t('recommendations')}</h3>
                <p className="mt-2 text-sm text-slate-400">{savedAt ? `${t('saved')} ${savedAt.toLocaleString()}` : 'Awaiting AI review.'}</p>
              </div>
              <RiskBadge level={result?.risk_level || 'Green'} />
            </div>
            <div className="mt-5 grid gap-4">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-sm text-slate-400">{t('emergency')}</p>
                <p className="mt-2 text-white">{result?.emergency_level || 'low'}</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-sm text-slate-400">{t('infection')}</p>
                <p className="mt-2 text-white">{result?.infection_risk || 'low'}</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-sm text-slate-400">{t('dehydration')}</p>
                <p className="mt-2 text-white">{result?.dehydration_risk || 'low'}</p>
              </div>
            </div>
            {result?.recommendations && (
              <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-slate-300">
                {result.recommendations.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </section>
        </div>
      </div>

      {error && <div className="rounded-[32px] border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-3xl bg-slate-950/90 p-4 text-sm">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-2 font-semibold text-white">{value}</p>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-3xl bg-slate-950/90 p-4 text-sm">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-2 font-semibold text-white">{value}</p>
    </div>
  );
}
