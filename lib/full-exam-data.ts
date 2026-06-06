export interface MCQQuestion {
  id: string;
  type: "mcq";
  context?: string;
  contextLabel?: string;
  question: string;
  options: string[];
  correct: number;
  points: number;
  audioUrl?: string;
}

export interface TextQuestion {
  id: string;
  type: "text";
  question: string;
  prompt: string;
  instructions: string;
  minWords: number;
  timeSeconds: number;
  sampleAnswer: string;
  assessmentCriteria: string[];
  subPrompts?: string[];
}

export interface OrderingQuestion {
  id: string;
  type: "ordering";
  context: string;
  contextLabel?: string;
  question: string;
  items: string[];
  correctOrder: string[];
  points: number;
}

export interface FillQuestion {
  id: string;
  type: "fill";
  context: string;
  contextLabel?: string;
  question: string;
  answer: string;
  points: number;
}

export type ExamQuestion = MCQQuestion | TextQuestion | OrderingQuestion | FillQuestion;

export interface ExamPart {
  id: string;
  partNum: number;
  title: string;
  directions: string;
  questions: ExamQuestion[];
  audioUrl?: string;
}

export interface ExamSection {
  id: "listening" | "reading" | "writing" | "speaking";
  title: string;
  icon: string;
  durationMinutes: number;
  color: string;
  bg: string;
  overview: string;
  parts: ExamPart[];
}

// ─── LISTENING SECTION ────────────────────────────────────────────────────────

const listeningSection: ExamSection = {
  id: "listening",
  title: "Listening",
  icon: "hearing",
  durationMinutes: 25,
  color: "#92400e",
  bg: "#fffbeb",
  overview: "You will hear five different recordings. Answer the questions by choosing the best option, ordering information, or filling in missing words.",
  parts: [
    {
      id: "L1",
      partNum: 1,
      title: "Part 1 — Chat with a Colleague",
      directions: "Listen to each short recording. Choose the best reply (A, B or C).",
      questions: [
        {
          id: "L1Q1", type: "mcq", points: 1,
          context: `Supervisor: Good morning. Has Mr. Yamamoto taken his blood pressure medication?\nCaregiver: He took it at 7am, just before breakfast.\nSupervisor: Good. Did he eat a full meal?\nCaregiver: He had porridge and orange juice. He left the toast.`,
          contextLabel: "Conversation 1",
          question: "What did Mr. Yamamoto eat for breakfast?",
          options: ["Porridge, orange juice and toast", "Porridge and orange juice only", "Toast and orange juice"],
          correct: 1,
        },
        {
          id: "L1Q2", type: "mcq", points: 1,
          context: `Manager: 'All care plans for residents on your ward need to be updated by Friday. Can you do that?'`,
          contextLabel: "Conversation 2",
          question: "What is the best reply?",
          options: ["Yes, I'll make sure they are all updated before Friday.", "No, that's too much work.", "I'll do it next week."],
          correct: 0,
        },
        {
          id: "L1Q3", type: "mcq", points: 1,
          context: `Resident: 'Excuse me, could you help me put on my cardigan? My shoulder is a bit stiff today.'`,
          contextLabel: "Conversation 3",
          question: "What is the best reply?",
          options: ["I'm too busy right now.", "Of course, let's do it slowly so we don't hurt your shoulder.", "Ask another resident."],
          correct: 1,
        },
        {
          id: "L1Q4", type: "mcq", points: 1,
          context: `Nurse: 'Mrs. Okafor's new medication must be taken 30 minutes before her meal. Can you make sure that happens?'`,
          contextLabel: "Conversation 4",
          question: "What is the best reply?",
          options: ["That's the nurse's job.", "She can take it whenever she wants.", "Yes, I'll give it to her before her meal."],
          correct: 2,
        },
        {
          id: "L1Q5", type: "mcq", points: 1,
          context: `Senior caregiver: 'Before you go home, make sure you've handed over the medication keys to Jenny.'`,
          contextLabel: "Conversation 5",
          question: "What is the best reply?",
          options: ["Understood — I'll hand the keys to Jenny before I leave.", "I left them on the desk.", "I'll do it tomorrow."],
          correct: 0,
        },
      ],
    },
    {
      id: "L2",
      partNum: 2,
      title: "Part 2 — Order the Information",
      directions: "Listen to the recording about writing a handover report. Put the five steps in the correct order by tapping them (1st → 5th).",
      questions: [
        {
          id: "L2Q1", type: "ordering", points: 5,
          context: `Handover training: 'When writing your end-of-shift handover report, follow this structure carefully. First, write your name, the date, and your shift hours at the top. Second, list any significant changes in residents' conditions since the last handover. Third, record all medications given, refused, or omitted, with the reasons noted. Fourth, write down any incidents or accidents, including near-misses. Finally, sign and date the report and hand it directly to the incoming caregiver.'`,
          contextLabel: "Handover Training",
          question: "Put these steps in the order described in the recording.",
          items: [
            "Sign and hand to the incoming caregiver",
            "Write your name, date and shift hours",
            "Note any incidents or near-misses",
            "List significant changes in residents' conditions",
            "Record medications given, refused or omitted",
          ],
          correctOrder: [
            "Write your name, date and shift hours",
            "List significant changes in residents' conditions",
            "Record medications given, refused or omitted",
            "Note any incidents or near-misses",
            "Sign and hand to the incoming caregiver",
          ],
        },
      ],
    },
    {
      id: "L3",
      partNum: 3,
      title: "Part 3 — Fill in the Gap",
      directions: "Listen to each short recording. Type the missing word or number in the gap.",
      questions: [
        {
          id: "L3Q1", type: "fill", points: 1,
          context: `Nurse: 'Mrs. Cohen requires pain relief every six hours. Please sign the medication chart after each dose you give.'`,
          contextLabel: "Recording 1",
          question: "Mrs. Cohen requires pain relief every ___ hours.",
          answer: "six",
        },
        {
          id: "L3Q2", type: "fill", points: 1,
          context: `Manager: 'All new staff must sign a confidentiality agreement before they begin their first shift.'`,
          contextLabel: "Recording 2",
          question: "New staff must sign a ___ agreement before starting.",
          answer: "confidentiality",
        },
        {
          id: "L3Q3", type: "fill", points: 1,
          context: `Doctor on phone: 'Mr. Hassan's wound dressing must be changed every 48 hours. Please update his care plan accordingly.'`,
          contextLabel: "Recording 3",
          question: "Mr. Hassan's dressing must be changed every ___ hours.",
          answer: "48",
        },
        {
          id: "L3Q4", type: "fill", points: 1,
          context: `Senior caregiver: 'The CQC inspection is scheduled for next Tuesday. All care plans and risk assessments must be fully up to date by Monday evening.'`,
          contextLabel: "Recording 4",
          question: "The CQC inspection is next ___.",
          answer: "Tuesday",
        },
      ],
    },
    {
      id: "L4",
      partNum: 4,
      title: "Part 4 — Choose the Correct Answer",
      directions: "Listen to the recording. Choose the best answer A, B or C.",
      questions: [
        {
          id: "L4Q1", type: "mcq", points: 1,
          context: `Trainer: Welcome to your caregiver orientation. Over the next two days, we will cover patient dignity, communication, moving and handling, infection control, and emergency procedures.\n\nLet's begin with patient dignity. This means treating every person with respect, regardless of their age or condition. Always knock before entering a room, explain what you are going to do before you do it, and use the patient's preferred name.\n\nDignity also means protecting privacy. Never discuss a patient's condition in a corridor. Always close the curtain during personal care.\n\nNow, communication. Studies show that over 70% of care complaints are caused not by medical errors, but by poor communication. Speak clearly, use simple words, and always check that the patient has understood you.`,
          contextLabel: "Caregiver Orientation — Day 1",
          question: "How many topics will be covered over the two days?",
          options: ["Three", "Four", "Five"],
          correct: 2,
        },
        {
          id: "L4Q2", type: "mcq", points: 1,
          context: "Same training transcript.",
          contextLabel: "",
          question: "What should a caregiver do before entering a patient's room?",
          options: ["Check the medication chart", "Knock on the door", "Read the patient file"],
          correct: 1,
        },
        {
          id: "L4Q3", type: "mcq", points: 1,
          context: "Same training transcript.",
          contextLabel: "",
          question: "According to the trainer, what causes most care complaints?",
          options: ["Medical errors", "Poor communication", "Understaffing"],
          correct: 1,
        },
        {
          id: "L4Q4", type: "mcq", points: 1,
          context: "Same training transcript.",
          contextLabel: "",
          question: "Where should a caregiver NOT discuss a patient's condition?",
          options: ["In a private meeting room", "In the patient's room", "In a corridor or public area"],
          correct: 2,
        },
        {
          id: "L4Q5", type: "mcq", points: 1,
          context: "Same training transcript.",
          contextLabel: "",
          question: "What should a caregiver always check after speaking to a patient?",
          options: ["That the patient has understood", "That the medication was given", "That the door is closed"],
          correct: 0,
        },
      ],
    },
    {
      id: "L5",
      partNum: 5,
      title: "Part 5 — Choose the Correct Answer (Extended)",
      directions: "Listen to the longer recording. Choose the best answer A, B or C.",
      questions: [
        {
          id: "L5Q1", type: "mcq", points: 1,
          context: `Interviewer: Sunita, you have been working as a caregiver in Israel for four years. What was the biggest challenge when you first arrived?\n\nSunita: Honestly, the language was difficult at first — I spoke some Hebrew but medical terms were hard. But my agency provided a two-week language course, which helped a lot. The bigger challenge was cultural differences. In Nepal, we rarely discuss emotions openly, but here patients and families expected me to talk about feelings.\n\nInterviewer: How did your family feel about you going abroad?\n\nSunita: My parents were worried, of course. But when they saw that I was safe, had a stable salary, and was sending money home regularly, they became very supportive. My younger sister is now studying nursing because of me.`,
          contextLabel: "Caregiver Interview",
          question: "What did Sunita find most challenging when she first arrived?",
          options: ["The medical equipment was different", "Cultural differences, especially discussing emotions", "The language was impossible to learn"],
          correct: 1,
        },
        {
          id: "L5Q2", type: "mcq", points: 1,
          context: "Same interview.",
          contextLabel: "",
          question: "What did Sunita's agency provide?",
          options: ["A two-week language course", "Free accommodation", "A translation service"],
          correct: 0,
        },
        {
          id: "L5Q3", type: "mcq", points: 1,
          context: "Same interview.",
          contextLabel: "",
          question: "How did Sunita's parents feel after some time?",
          options: ["Still worried about her safety", "Very supportive", "Unhappy that she was away"],
          correct: 1,
        },
        {
          id: "L5Q4", type: "mcq", points: 1,
          context: "Same interview.",
          contextLabel: "",
          question: "What did Sunita's sister decide to do?",
          options: ["Move abroad with Sunita", "Study nursing", "Work as a caregiver"],
          correct: 1,
        },
        {
          id: "L5Q5", type: "mcq", points: 1,
          context: "Same interview.",
          contextLabel: "",
          question: "How long has Sunita been working in Israel?",
          options: ["Two years", "Three years", "Four years"],
          correct: 2,
        },
      ],
    },
  ],
};

// ─── READING SECTION ──────────────────────────────────────────────────────────

const readingSection: ExamSection = {
  id: "reading",
  title: "Reading",
  icon: "menu_book",
  durationMinutes: 25,
  color: "#0d2067",
  bg: "#dde1ff",
  overview: "Read the texts and choose the best answer. Parts 1–4 are sentence completion tasks. Part 5 is a longer text with comprehension questions.",
  parts: [
    {
      id: "R1",
      partNum: 1,
      title: "Part 1 — Short Texts, Choose the Meaning",
      directions: "Look at each text. What does it mean? Choose the best answer A, B or C.",
      questions: [
        {
          id: "R1Q1", type: "mcq", points: 1,
          context: `⚠ NOTICE — ROOM 6\nPatient on restricted diet.\nNo food or drinks to be given without checking with the nurse on duty first.`,
          contextLabel: "Sign on a patient's door",
          question: "What does this notice tell you?",
          options: ["The patient cannot have any visitors", "You must check with a nurse before giving the patient food or drinks", "The patient needs to eat more food"],
          correct: 1,
        },
        {
          id: "R1Q2", type: "mcq", points: 1,
          context: `HANDOVER SHEET — NIGHT SHIFT\nPlease complete and leave at the nurses' station before leaving.\nIncomplete forms will be returned.`,
          contextLabel: "Notice on staff noticeboard",
          question: "What are staff told to do?",
          options: ["Pick up handover sheets before their shift", "Fill in and leave the form before they go home", "Return any old forms to the manager"],
          correct: 1,
        },
        {
          id: "R1Q3", type: "mcq", points: 1,
          context: `FROM: Fatima (Supervisor)\nTO: All caregivers\n\nReminder: The staff room fridge is for personal food only. Patient medication stored in the wrong place is a serious safety issue.`,
          contextLabel: "Email from supervisor",
          question: "Why did the supervisor send this message?",
          options: ["To tell staff the fridge is broken", "To warn staff not to put medication in the staff fridge", "To ask staff to bring more food"],
          correct: 1,
        },
        {
          id: "R1Q4", type: "mcq", points: 1,
          context: `APPOINTMENT REMINDER\nMrs. Levin — Physiotherapy\nDate: Tuesday 4th June · Time: 10:30am · Location: Ground floor, Room 12\n\nPlease bring Mrs. Levin 15 minutes early to complete paperwork.`,
          contextLabel: "Appointment card",
          question: "What should the caregiver do?",
          options: ["Bring Mrs. Levin exactly at 10:30", "Bring Mrs. Levin 15 minutes before 10:30", "Call Room 12 to confirm the appointment"],
          correct: 1,
        },
        {
          id: "R1Q5", type: "mcq", points: 1,
          context: `OUT OF ORDER\nElevator B — Under maintenance until Friday.\nPlease use Elevator A or the stairs.\nWe apologise for the inconvenience.`,
          contextLabel: "Sign near elevator",
          question: "What does this sign mean?",
          options: ["Elevator B is only for staff", "Elevator B is not working — use another option", "Both elevators are closed"],
          correct: 1,
        },
      ],
    },
    {
      id: "R2",
      partNum: 2,
      title: "Part 2 — Complete the Sentence",
      directions: "Choose the best word (A, B or C) to complete each sentence.",
      questions: [
        {
          id: "R2Q1", type: "mcq", points: 1,
          question: "The patient was feeling ___ after the operation, so the nurse asked her to rest.",
          options: ["energetic", "exhausted", "excited"],
          correct: 1,
        },
        {
          id: "R2Q2", type: "mcq", points: 1,
          question: "Caregivers must ___ their hands before and after touching a patient to prevent infection.",
          options: ["wash", "shake", "dry"],
          correct: 0,
        },
        {
          id: "R2Q3", type: "mcq", points: 1,
          question: "The doctor gave the patient a ___ for new medication, which the family took to the pharmacy.",
          options: ["receipt", "prescription", "reminder"],
          correct: 1,
        },
        {
          id: "R2Q4", type: "mcq", points: 1,
          question: "It is important to treat all patients with ___ and respect, regardless of their background.",
          options: ["speed", "dignity", "authority"],
          correct: 1,
        },
        {
          id: "R2Q5", type: "mcq", points: 1,
          question: "The caregiver kept a careful ___ of the patient's temperature and blood pressure throughout the day.",
          options: ["record", "memory", "guess"],
          correct: 0,
        },
      ],
    },
    {
      id: "R3",
      partNum: 3,
      title: "Part 3 — Complete the Sentence (Extended)",
      directions: "Choose the best word or phrase (A, B or C) to complete each sentence.",
      questions: [
        {
          id: "R3Q1", type: "mcq", points: 1,
          question: "The doctor asked the nurse to ___ the patient's blood pressure every four hours.",
          options: ["check", "ignore", "estimate only"],
          correct: 0,
        },
        {
          id: "R3Q2", type: "mcq", points: 1,
          question: "Caregivers must ___ any changes in a resident's condition to the nurse on duty without delay.",
          options: ["conceal", "report", "postpone"],
          correct: 1,
        },
        {
          id: "R3Q3", type: "mcq", points: 1,
          question: "It is important to ___ a resident's privacy by always knocking before entering their room.",
          options: ["respect", "limit", "disregard"],
          correct: 0,
        },
        {
          id: "R3Q4", type: "mcq", points: 1,
          question: "Staff must ___ an incident form whenever an accident or near-miss takes place.",
          options: ["complete", "discard", "delay"],
          correct: 0,
        },
        {
          id: "R3Q5", type: "mcq", points: 1,
          question: "All personal protective equipment must be ___ before entering an isolation room.",
          options: ["removed first", "worn", "shared with colleagues"],
          correct: 1,
        },
      ],
    },
    {
      id: "R4",
      partNum: 4,
      title: "Part 4 — Complete the Sentence (Advanced)",
      directions: "Choose the best word or phrase (A, B or C) to complete each sentence.",
      questions: [
        {
          id: "R4Q1", type: "mcq", points: 1,
          question: "Despite being in pain, Mr. Petrov ___ to take his medication, which the caregiver immediately reported to the nurse.",
          options: ["refused", "forgot", "remembered too late"],
          correct: 0,
        },
        {
          id: "R4Q2", type: "mcq", points: 1,
          question: "The care plan ___ reviewed every three months, or sooner if there is a significant change in the resident's condition.",
          options: ["can never be", "must be", "should avoid being"],
          correct: 1,
        },
        {
          id: "R4Q3", type: "mcq", points: 1,
          question: "Residents have the legal right to ___ any aspect of their care, and this decision must always be documented.",
          options: ["fund", "refuse", "accelerate"],
          correct: 1,
        },
        {
          id: "R4Q4", type: "mcq", points: 1,
          question: "The shift handover report must be ___ and factual so that the incoming team has a complete picture of every resident's status.",
          options: ["brief and vague", "kept private from staff", "detailed"],
          correct: 2,
        },
        {
          id: "R4Q5", type: "mcq", points: 1,
          question: "When a family member ___ for clinical information, the caregiver must politely direct them to the nurse or doctor in charge.",
          options: ["asks", "pays", "refuses"],
          correct: 0,
        },
      ],
    },
    {
      id: "R5",
      partNum: 5,
      title: "Part 5 — Longer Text, Comprehension",
      directions: "Read the article and choose the best answer A, B or C for each question.",
      questions: [
        {
          id: "R5Q1", type: "mcq", points: 1,
          context: `UNDERSTANDING DEMENTIA: A GUIDE FOR CAREGIVERS\n\nDementia is not a single disease but a group of symptoms affecting memory, thinking and social abilities severely enough to interfere with daily life. The most common type is Alzheimer's disease, which accounts for 60–80% of all dementia cases worldwide.\n\nCaregivers working with dementia patients need specific skills. First, patience is essential — patients may repeat the same question many times without remembering the previous answer. Becoming frustrated or correcting the patient harshly can increase their anxiety. Instead, answer calmly each time and redirect their attention if needed.\n\nCreating a consistent routine is also very important. Dementia patients feel more secure when they know what to expect. Sudden changes — a different caregiver, a new room, or an unexpected visitor — can cause confusion and distress.\n\nNon-verbal communication plays a major role. Because language ability often declines, patients respond more to tone of voice, facial expressions, and gentle touch than to words. A calm, smiling face and a reassuring hand on the shoulder can communicate more than a lengthy explanation.\n\nFinally, self-care for caregivers is critical. Research shows that caregivers who take regular breaks, talk to colleagues, and seek support when needed are more effective and less likely to make errors.`,
          contextLabel: "Healthcare article",
          question: "What percentage of dementia cases is Alzheimer's disease?",
          options: ["40–60%", "60–80%", "80–100%"],
          correct: 1,
        },
        {
          id: "R5Q2", type: "mcq", points: 1,
          context: "Same article.",
          contextLabel: "",
          question: "What should a caregiver do if a patient asks the same question many times?",
          options: ["Correct the patient gently", "Answer calmly each time", "Ignore the repeated question"],
          correct: 1,
        },
        {
          id: "R5Q3", type: "mcq", points: 1,
          context: "Same article.",
          contextLabel: "",
          question: "Why is routine important for dementia patients?",
          options: ["It keeps caregivers organised", "It helps patients feel secure and less confused", "It reduces the workload for care staff"],
          correct: 1,
        },
        {
          id: "R5Q4", type: "mcq", points: 1,
          context: "Same article.",
          contextLabel: "",
          question: "What form of communication does the article say dementia patients respond best to?",
          options: ["Long, detailed explanations", "Written notes and instructions", "Tone of voice, facial expressions and gentle touch"],
          correct: 2,
        },
        {
          id: "R5Q5", type: "mcq", points: 1,
          context: "Same article.",
          contextLabel: "",
          question: "According to the article, what helps caregivers stay effective?",
          options: ["Working longer hours", "Taking breaks and seeking support when needed", "Avoiding emotional involvement with patients"],
          correct: 1,
        },
      ],
    },
  ],
};

// ─── WRITING SECTION ──────────────────────────────────────────────────────────

const writingSection: ExamSection = {
  id: "writing",
  title: "Writing",
  icon: "edit_note",
  durationMinutes: 30,
  color: "#7c3aed",
  bg: "#f5f3ff",
  overview: "Complete two short writing tasks. Each task requires approximately 50 words. Read the prompt carefully and address every point mentioned.",
  parts: [
    {
      id: "W1",
      partNum: 1,
      title: "Part 1 — Personal Email",
      directions: "Read the message below. Write a reply of approximately 50 words. Address ALL the points.",
      questions: [
        {
          id: "W1Q1", type: "text",
          question: "Part 1 — Personal Email",
          prompt: `Your friend Sara has sent you this message:\n\n"Hi! I am moving to a new flat next Saturday. Can you help me carry some boxes? What time are you free? And can you recommend a good restaurant near my new place where we can eat afterwards?"\n\nWrite a reply to Sara. Address all three points. Write approximately 50 words.`,
          instructions: "Write approximately 50 words. Use a greeting and sign-off.",
          minWords: 40, timeSeconds: 900,
          sampleAnswer: "Hi Sara,\n\nOf course I will help you move! I am free from 10am so I can come in the morning.\n\nFor dinner, I recommend Casa Verde near the city centre — the food is great and it's not expensive. We can celebrate your new home!\n\nSee you Saturday!\n[Your name]",
          assessmentCriteria: ["Did you say you will help?", "Did you give a time you are free?", "Did you recommend a restaurant?", "Did you use a friendly greeting and sign-off?", "Is the length approximately 50 words?"],
        },
      ],
    },
    {
      id: "W2",
      partNum: 2,
      title: "Part 2 — Formal Reply",
      directions: "Read the advertisement below. Write a response of approximately 50 words addressing all the points.",
      questions: [
        {
          id: "W2Q1", type: "text",
          question: "Part 2 — Formal Reply",
          prompt: `You saw this job advertisement:\n\n"WANTED: Experienced Caregiver for elderly patient in Tel Aviv, Israel. Must have at least 1 year experience. Please tell us: your experience, one reason you want this job, and when you can start."\n\nWrite your response. Address all three points. Write approximately 50 words.`,
          instructions: "Write approximately 50 words. Address ALL three points. Keep your language professional and simple.",
          minWords: 40, timeSeconds: 900,
          sampleAnswer: "Dear Hiring Manager,\n\nI have two years of experience as a caregiver, looking after elderly patients with mobility difficulties and dementia.\n\nI want this job because I am dedicated to providing high-quality care and I am eager to work in an international environment.\n\nI am available to start from next month.\n\nThank you,\nApplicant",
          assessmentCriteria: ["Did you mention your experience?", "Did you give a reason for wanting the job?", "Did you say when you can start?", "Is the length approximately 50 words?", "Is the language professional?"],
        },
      ],
    },
  ],
};

// ─── SPEAKING SECTION — matches CINN Official format exactly ──────────────────

const speakingSection: ExamSection = {
  id: "speaking",
  title: "Speaking",
  icon: "record_voice_over",
  durationMinutes: 12,
  color: "#065f46",
  bg: "#dcfce7",
  overview: "5 parts matching the official Cambridge UpSkill Speaking format:\n• Part 1 — Listen and answer (4 questions, 10 seconds each)\n• Part 2 — Listen and answer, longer (4 questions, 20 seconds each)\n• Part 3 — Read aloud (4 sentences, 10 seconds each)\n• Part 4 — Read aloud extended (4 sentences, 20 seconds each)\n• Part 5 — Leave a message (40 seconds prep, at least 1 minute)",
  parts: [
    {
      id: "S1",
      partNum: 1,
      title: "Part 1 — Listen & Answer",
      directions: "Listen to each question. You have 10 seconds to answer. Speak in full sentences.",
      questions: [
        {
          id: "S1Q1", type: "text",
          question: "Part 1 — Listen & Answer (4 questions, 10 sec each)",
          prompt: "Listen to each question and answer in a short sentence or two.",
          instructions: "Listen carefully, then speak your answer clearly. You have 10 seconds per question.",
          subPrompts: [
            "What is your full name and what country are you hoping to work in?",
            "Do you prefer morning shifts, afternoon shifts, or night shifts — and why?",
            "Have you worked in a care home or hospital before?",
            "What do you do to look after your own health and wellbeing?",
          ],
          minWords: 0, timeSeconds: 40,
          sampleAnswer: "1. My name is Sunita Tamang and I hope to work in Israel.\n2. I prefer morning shifts because I am most alert in the morning and can give better care.\n3. Yes, I worked in a nursing home for one year helping elderly residents with daily tasks.\n4. I exercise regularly, eat balanced meals, and make sure I get enough sleep before each shift.",
          assessmentCriteria: ["Did you answer all four questions?", "Did you speak in full sentences?", "Were your answers direct and clear?"],
        },
      ],
    },
    {
      id: "S2",
      partNum: 2,
      title: "Part 2 — Listen & Answer (Longer)",
      directions: "Listen to each question. You have 20 seconds to answer. Give reasons and examples.",
      questions: [
        {
          id: "S2Q1", type: "text",
          question: "Part 2 — Listen & Answer Longer (4 questions, 20 sec each)",
          prompt: "Listen to each question and give a fuller answer with reasons and examples.",
          instructions: "Answer in 2–3 sentences. Give reasons where possible. You have 20 seconds per question.",
          subPrompts: [
            "Tell me about a time you helped someone who was in a difficult situation. What did you do and how did things turn out?",
            "In your opinion, what makes a truly good caregiver? Please give reasons.",
            "How would you manage a situation where a patient becomes upset and refuses your help?",
            "Describe the most important thing you have learned about caring for people who are elderly or unwell.",
          ],
          minWords: 0, timeSeconds: 80,
          sampleAnswer: "1. Once a patient was very anxious before a procedure. I sat with her, held her hand, and explained calmly what would happen. She relaxed and thanked me afterwards.\n2. I think patience and empathy make a good caregiver, because residents need to feel understood and respected, not rushed.\n3. I would stay calm, listen to their concerns, and explain the reason for the care. If they still refuse, I would inform the nurse immediately.\n4. The most important thing I have learned is that every resident is an individual — what works for one person may not work for another.",
          assessmentCriteria: ["Did you answer all four questions?", "Did you give reasons and examples?", "Were your answers 2–3 sentences each?"],
        },
      ],
    },
    {
      id: "S3",
      partNum: 3,
      title: "Part 3 — Read Aloud",
      directions: "Read each sentence aloud clearly. Pause at commas. Stop at full stops. Do not rush. You have 10 seconds per sentence.",
      questions: [
        {
          id: "S3Q1", type: "text",
          question: "Part 3 — Read Aloud (4 sentences, 10 sec each)",
          prompt: "Read each sentence aloud clearly and naturally.",
          instructions: "Pause at commas. Stop at full stops. Do not rush. 10 seconds per sentence.",
          subPrompts: [
            "Always ensure medication is given at the correct time and in the correct dose.",
            "Residents must be offered a drink of water at least every two hours.",
            "Wash your hands thoroughly before and after every personal care procedure.",
            "Report any concerns about a resident's condition to the nurse on duty without delay.",
          ],
          minWords: 0, timeSeconds: 40,
          sampleAnswer: "Read each sentence exactly as written:\n1. Always ensure medication is given at the correct time and in the correct dose.\n2. Residents must be offered a drink of water at least every two hours.\n3. Wash your hands thoroughly before and after every personal care procedure.\n4. Report any concerns about a resident's condition to the nurse on duty without delay.",
          assessmentCriteria: ["Did you read every word correctly?", "Did you pause at commas and stop at full stops?", "Did you speak clearly without rushing?"],
        },
      ],
    },
    {
      id: "S4",
      partNum: 4,
      title: "Part 4 — Read Aloud (Extended)",
      directions: "Read each sentence aloud clearly. These are longer sentences — take your time. You have 20 seconds per sentence.",
      questions: [
        {
          id: "S4Q1", type: "text",
          question: "Part 4 — Read Aloud Extended (4 sentences, 20 sec each)",
          prompt: "Read each longer sentence aloud clearly and naturally.",
          instructions: "Follow all punctuation. Take your time. 20 seconds per sentence.",
          subPrompts: [
            "Before assisting a resident with any mobility task, always conduct a brief risk assessment and confirm that the correct equipment is available and in working order.",
            "Care workers must maintain confidentiality at all times and must never discuss a resident's personal or medical information outside of the care team.",
            "When completing a medication administration record, always sign the chart immediately after giving the medication — never in advance or retrospectively.",
            "A person-centred approach to care requires that each resident's individual needs, preferences and cultural background are respected and reflected in their care plan.",
          ],
          minWords: 0, timeSeconds: 80,
          sampleAnswer: "Read each sentence exactly as written, following punctuation carefully.",
          assessmentCriteria: ["Did you read every word correctly?", "Did you handle punctuation — commas, dashes, full stops?", "Did you pronounce medical terms clearly?", "Did you not rush through the long sentences?"],
        },
      ],
    },
    {
      id: "S5",
      partNum: 5,
      title: "Part 5 — Leave a Message",
      directions: "Read the notes carefully. You have 40 seconds to prepare. Then leave a voicemail of at least one minute covering ALL the note points.",
      questions: [
        {
          id: "S5Q1", type: "text",
          question: "Part 5 — Leave a Message",
          prompt: "You need to leave a voicemail for your care home manager.\n\nNotes:\n• You have noticed that a resident, Mr. Ahmad, seems more confused than usual today\n• Describe two changes in behaviour you have noticed\n• Explain what action you have already taken\n• Ask the manager to call you back before the afternoon medication round",
          instructions: "Cover ALL four note points. Speak for at least 1 minute. Begin by saying who you are and why you are calling.",
          minWords: 0, timeSeconds: 60,
          sampleAnswer: "Hello, this is [your name] calling from the Bluebell ward. I'm leaving a message to let you know that I'm concerned about Mr. Ahmad in Room 3.\n\nI've noticed today that he seems more confused than usual. Specifically, he did not recognise me this morning when I brought his breakfast — which has never happened before — and he became quite anxious and kept asking where he was. I've repositioned him comfortably in his chair, made sure he had some water, and I've documented both incidents in his daily notes.\n\nI'd really appreciate it if you could call me back before the afternoon medication round so we can discuss whether his care plan needs to be reviewed. Thank you very much.",
          assessmentCriteria: ["Did you cover all four note points?", "Did you introduce yourself at the start?", "Did you speak for approximately one minute?", "Did you use linking words — and, also, so, because?", "Was your tone professional and clear?"],
        },
      ],
    },
  ],
};

// ─── FULL EXAM ────────────────────────────────────────────────────────────────

export const FULL_EXAM_SECTIONS: ExamSection[] = [
  speakingSection,
  listeningSection,
  readingSection,
  writingSection,
];

export const TOTAL_EXAM_MINUTES = FULL_EXAM_SECTIONS.reduce((s, sec) => s + sec.durationMinutes, 0);

export function calcExamScore(answers: Record<string, string | number>) {
  let correct = 0;
  let total = 0;
  FULL_EXAM_SECTIONS.forEach((sec) => {
    if (sec.id === "listening" || sec.id === "reading") {
      sec.parts.forEach((part) => {
        part.questions.forEach((q) => {
          if (q.type === "mcq") {
            total += q.points;
            if (Number(answers[q.id]) === q.correct) correct += q.points;
          } else if (q.type === "fill") {
            total += q.points;
            const user = String(answers[q.id] ?? "").trim().toLowerCase();
            if (user === q.answer.toLowerCase()) correct += q.points;
          } else if (q.type === "ordering") {
            // 1 point per item in the correct position
            const itemCount = q.correctOrder.length;
            total += itemCount;
            try {
              const userOrder: string[] = JSON.parse(String(answers[q.id] ?? "[]"));
              q.correctOrder.forEach((item, i) => { if (userOrder[i] === item) correct++; });
            } catch { /* ignore */ }
          }
        });
      });
    }
  });
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const cefr = pct >= 88 ? "B1" : pct >= 63 ? "A2" : "A1";
  return { correct, total, pct, cefr };
}
