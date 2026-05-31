export interface MCQQuestion {
  id: string;
  type: "mcq";
  context?: string;
  contextLabel?: string;
  question: string;
  options: string[];
  correct: number;
  points: number;
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
}

export type ExamQuestion = MCQQuestion | TextQuestion;

export interface ExamPart {
  id: string;
  partNum: number;
  title: string;
  directions: string;
  questions: ExamQuestion[];
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

// ─── LISTENING SECTION ───────────────────────────────────────────────────────

const listeningSection: ExamSection = {
  id: "listening",
  title: "Listening",
  icon: "hearing",
  durationMinutes: 25,
  color: "#92400e",
  bg: "#fffbeb",
  overview: "You will hear five different recordings. Answer the questions by choosing the best option. In the real test you would listen to audio — here you will read the transcript and answer questions.",
  parts: [
    {
      id: "L1",
      partNum: 1,
      title: "Part 1 — Short Conversations",
      directions: "Read the five short conversations. For each conversation, choose the best answer A, B or C.",
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
          context: `Doctor: The patient in Room 4 needs her vitals checked every three hours, not two.\nNurse: Should I update the chart now?\nDoctor: Yes, and please tell the night shift caregiver.\nNurse: I will do it before I leave at 6pm.`,
          contextLabel: "Conversation 2",
          question: "How often should the patient's vitals be checked?",
          options: ["Every two hours", "Every three hours", "Every six hours"],
          correct: 1,
        },
        {
          id: "L1Q3", type: "mcq", points: 1,
          context: `Family member: My grandmother is being discharged on Friday. What time can we pick her up?\nCaregiver: The doctor signs the paperwork in the morning, so usually after 11am.\nFamily member: Can we come at 10?\nCaregiver: I'd recommend 11:30 to be safe — sometimes there's a delay.`,
          contextLabel: "Conversation 3",
          question: "What time does the caregiver recommend picking up the patient?",
          options: ["10:00am", "11:00am", "11:30am"],
          correct: 2,
        },
        {
          id: "L1Q4", type: "mcq", points: 1,
          context: `Caregiver A: I can't find the new patient's allergy information anywhere.\nCaregiver B: Did you check the blue folder on the nurses' station?\nCaregiver A: Yes, it's not there.\nCaregiver B: Then call the admissions office — they have all incoming patient files.`,
          contextLabel: "Conversation 4",
          question: "Where should the caregiver look for the allergy information?",
          options: ["In the blue folder", "In the patient's room", "At the admissions office"],
          correct: 2,
        },
        {
          id: "L1Q5", type: "mcq", points: 1,
          context: `Manager: All staff must complete the fire safety training by the end of this month.\nCaregiver: Is it the online module or the classroom session?\nManager: Both. The online part takes about 45 minutes, and the practical session is on Thursday morning.\nCaregiver: Does it matter what order we do them in?\nManager: Please do the online part first.`,
          contextLabel: "Conversation 5",
          question: "What should the caregiver do first?",
          options: ["Attend the Thursday morning session", "Complete the online module", "Both at the same time"],
          correct: 1,
        },
      ],
    },
    {
      id: "L2",
      partNum: 2,
      title: "Part 2 — Staff Meeting Discussion",
      directions: "Read the transcript of a care home staff meeting. Choose the best answer A, B or C for each question.",
      questions: [
        {
          id: "L2Q1", type: "mcq", points: 1,
          context: `Manager: Good afternoon everyone. Today we need to discuss three things: the new patient intake process, weekend staffing, and the upcoming health inspection.\n\nFirst, from next Monday, all new patients will be assessed by both a nurse and a caregiver before being assigned to a room. This means the process will take longer — about 90 minutes instead of 45 — but it will improve patient safety.\n\nFor weekends, we are short two caregivers in July. I need volunteers for Saturday shifts. The pay rate is 1.5 times normal.\n\nFinally, the health inspection is on the 18th. Please make sure all documentation is complete and patient areas are tidy.`,
          contextLabel: "Staff Meeting — June",
          question: "How long will the new patient intake process take?",
          options: ["45 minutes", "90 minutes", "120 minutes"],
          correct: 1,
        },
        {
          id: "L2Q2", type: "mcq", points: 1,
          context: "Same transcript as above.",
          contextLabel: "",
          question: "Why are volunteers needed for Saturday shifts?",
          options: ["A new patient is arriving", "Two caregivers are absent in July", "The manager is taking leave"],
          correct: 1,
        },
        {
          id: "L2Q3", type: "mcq", points: 1,
          context: "Same transcript as above.",
          contextLabel: "",
          question: "What is the pay rate for weekend work?",
          options: ["Normal rate", "Double the normal rate", "1.5 times the normal rate"],
          correct: 2,
        },
        {
          id: "L2Q4", type: "mcq", points: 1,
          context: "Same transcript as above.",
          contextLabel: "",
          question: "When is the health inspection?",
          options: ["The following Monday", "On the 18th", "In July"],
          correct: 1,
        },
        {
          id: "L2Q5", type: "mcq", points: 1,
          context: "Same transcript as above.",
          contextLabel: "",
          question: "What must staff do before the health inspection?",
          options: ["Complete patient assessments", "Attend a training session", "Finish all documentation and tidy patient areas"],
          correct: 2,
        },
      ],
    },
    {
      id: "L3",
      partNum: 3,
      title: "Part 3 — Phone Message",
      directions: "Read the telephone message. Choose the best word or phrase (A, B or C) to complete each gap.",
      questions: [
        {
          id: "L3Q1", type: "mcq", points: 1,
          context: `TELEPHONE MESSAGE\nFrom: Dr. Hassan's office\nTo: Care Team, Ward 2\n\nDr. Hassan called at 2:15pm regarding patient ___[1]___ in Room 7. He says the patient should start the new ___[2]___ from tomorrow morning. The dose is ___[3]___ milligrams twice daily, with food. Please do NOT give the old tablets — ___[4]___ them and document the change in the ___[5]___ record.`,
          contextLabel: "Gap 1",
          question: "Gap 1 — The patient's description:",
          options: ["Mrs. Chen (age 72)", "Mr. Singh (age 65)", "Mrs. Patel (age 68)"],
          correct: 0,
        },
        {
          id: "L3Q2", type: "mcq", points: 1,
          context: "Same telephone message.",
          contextLabel: "Gap 2",
          question: "Gap 2 — What should the patient start?",
          options: ["physiotherapy", "antibiotic course", "exercise programme"],
          correct: 1,
        },
        {
          id: "L3Q3", type: "mcq", points: 1,
          context: "Same telephone message.",
          contextLabel: "Gap 3",
          question: "Gap 3 — The dose is:",
          options: ["100", "250", "500"],
          correct: 2,
        },
        {
          id: "L3Q4", type: "mcq", points: 1,
          context: "Same telephone message.",
          contextLabel: "Gap 4",
          question: "Gap 4 — What should staff do with the old tablets?",
          options: ["return", "dispose of", "store"],
          correct: 1,
        },
        {
          id: "L3Q5", type: "mcq", points: 1,
          context: "Same telephone message.",
          contextLabel: "Gap 5",
          question: "Gap 5 — Document the change in the:",
          options: ["shift handover", "medication", "admission"],
          correct: 1,
        },
      ],
    },
    {
      id: "L4",
      partNum: 4,
      title: "Part 4 — Training Talk",
      directions: "Read the transcript of a training session for new caregivers. Choose the best answer A, B or C.",
      questions: [
        {
          id: "L4Q1", type: "mcq", points: 1,
          context: `Trainer: Welcome to the first day of your caregiver orientation. Over the next two days, we will cover patient dignity, communication, moving and handling, infection control, and emergency procedures.\n\nLet's begin with something fundamental — patient dignity. This means treating every person in your care with respect, regardless of their age, condition or background. Simple things matter enormously: always knock before entering a room, explain what you are going to do before you do it, and use the patient's preferred name — not just "dear" or "love".\n\nDignity also means protecting privacy. Never discuss a patient's condition in a corridor or public area. Always close the curtain or door during personal care.\n\nNow, communication. Studies show that over 70% of care complaints are caused not by medical errors, but by poor communication — caregivers not listening, not explaining, or using language the patient doesn't understand. Speak clearly, use simple words, and always check that the patient has understood you.`,
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
      title: "Part 5 — Caregiver Interview",
      directions: "Read the interview with an experienced caregiver working abroad. Choose the best answer A, B or C.",
      questions: [
        {
          id: "L5Q1", type: "mcq", points: 1,
          context: `Interviewer: Sunita, you have been working as a caregiver in Israel for four years. What was the biggest challenge when you first arrived?\n\nSunita: Honestly, the language was difficult at first — I spoke some Hebrew but medical terms were hard. But my agency provided a two-week language course, which helped a lot. The bigger challenge was cultural differences. In Nepal, we rarely discuss emotions openly, but here the patients and families expected me to talk about feelings. I had to learn to say things like, "I understand this is difficult for you."\n\nInterviewer: How did your family feel about you going abroad?\n\nSunita: My parents were worried, of course. But when they saw that I was safe, had a stable salary, and was sending money home regularly, they became very supportive. My younger sister is now studying nursing because of me.`,
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
  overview: "Read the following texts and answer the questions. Choose the best answer A, B or C for each question.",
  parts: [
    {
      id: "R1",
      partNum: 1,
      title: "Part 1 — Signs and Notices",
      directions: "Look at each text. What does it mean? Choose the best explanation A, B or C.",
      questions: [
        {
          id: "R1Q1", type: "mcq", points: 1,
          context: `⚠ NOTICE — ROOM 6\nPatient on restricted diet.\nNo food or drinks to be given without checking with the nurse on duty first.`,
          contextLabel: "Sign on a patient's door",
          question: "What does this notice tell you?",
          options: [
            "The patient cannot have any visitors",
            "You must check with a nurse before giving the patient food or drinks",
            "The patient needs to eat more food",
          ],
          correct: 1,
        },
        {
          id: "R1Q2", type: "mcq", points: 1,
          context: `HANDOVER SHEET — NIGHT SHIFT\nPlease complete and leave at the nurses' station before leaving.\nIncomplete forms will be returned.`,
          contextLabel: "Notice on staff noticeboard",
          question: "What are staff told to do?",
          options: [
            "Pick up handover sheets before their shift",
            "Fill in and leave the form before they go home",
            "Return any old forms to the manager",
          ],
          correct: 1,
        },
        {
          id: "R1Q3", type: "mcq", points: 1,
          context: `FROM: Fatima (Supervisor)\nTO: All caregivers\n\nReminder: The staff room fridge is for personal food only. Patient medication stored in the wrong place is a serious safety issue. Thank you.`,
          contextLabel: "Email from supervisor",
          question: "Why did the supervisor send this message?",
          options: [
            "To tell staff the fridge is broken",
            "To warn staff not to put medication in the staff fridge",
            "To ask staff to bring more food",
          ],
          correct: 1,
        },
        {
          id: "R1Q4", type: "mcq", points: 1,
          context: `APPOINTMENT REMINDER\nMrs. Levin — Physiotherapy\nDate: Tuesday 4th June\nTime: 10:30am\nLocation: Ground floor, Room 12\n\nPlease bring Mrs. Levin 15 minutes early to complete paperwork.`,
          contextLabel: "Appointment card",
          question: "What should the caregiver do?",
          options: [
            "Bring Mrs. Levin exactly at 10:30",
            "Bring Mrs. Levin 15 minutes before 10:30",
            "Call Room 12 to confirm the appointment",
          ],
          correct: 1,
        },
        {
          id: "R1Q5", type: "mcq", points: 1,
          context: `OUT OF ORDER\nElevator B — Under maintenance until Friday.\nPlease use Elevator A or the stairs.\nWe apologise for the inconvenience.`,
          contextLabel: "Sign near elevator",
          question: "What does this sign mean?",
          options: [
            "Elevator B is only for staff",
            "Elevator B is not working — use another option",
            "Both elevators are closed",
          ],
          correct: 1,
        },
      ],
    },
    {
      id: "R2",
      partNum: 2,
      title: "Part 2 — Vocabulary in Context",
      directions: "Choose the best word (A, B or C) to complete each sentence.",
      questions: [
        {
          id: "R2Q1", type: "mcq", points: 1,
          question: "The patient was feeling ______ after the operation, so the nurse asked her to rest.",
          options: ["energetic", "exhausted", "excited"],
          correct: 1,
        },
        {
          id: "R2Q2", type: "mcq", points: 1,
          question: "Caregivers must ______ their hands before and after touching a patient to prevent infection.",
          options: ["wash", "shake", "dry"],
          correct: 0,
        },
        {
          id: "R2Q3", type: "mcq", points: 1,
          question: "The doctor gave the patient a ______ for new medication, which the family took to the pharmacy.",
          options: ["receipt", "prescription", "reminder"],
          correct: 1,
        },
        {
          id: "R2Q4", type: "mcq", points: 1,
          question: "It is important to treat all patients with ______ and respect, regardless of their background.",
          options: ["speed", "dignity", "authority"],
          correct: 1,
        },
        {
          id: "R2Q5", type: "mcq", points: 1,
          question: "The caregiver kept a careful ______ of the patient's temperature and blood pressure throughout the day.",
          options: ["record", "memory", "guess"],
          correct: 0,
        },
      ],
    },
    {
      id: "R3",
      partNum: 3,
      title: "Part 3 — Matching Headings",
      directions: "Read the article about working as a caregiver abroad. Match headings A–F to paragraphs 1–5. There is one extra heading you do not need.",
      questions: [
        {
          id: "R3Q1", type: "mcq", points: 1,
          context: `Paragraph 1:\nBefore you can work as a caregiver in another country, you will need to pass a language test, complete an accredited training programme, and obtain the necessary work visa. The process can take several months, so it is important to start early and keep copies of all your documents.`,
          contextLabel: "Paragraph 1",
          question: "Which heading matches Paragraph 1?",
          options: [
            "A — Daily Duties of a Caregiver",
            "B — How to Prepare Before Going Abroad",
            "C — Dealing With Difficult Patients",
          ],
          correct: 1,
        },
        {
          id: "R3Q2", type: "mcq", points: 1,
          context: `Paragraph 2:\nMany caregivers say the hardest adjustment is being far from family. Video calls help, but nothing fully replaces being home. Experienced workers advise building friendships with colleagues from your own country, joining community groups, and keeping busy outside work hours to avoid homesickness.`,
          contextLabel: "Paragraph 2",
          question: "Which heading matches Paragraph 2?",
          options: [
            "A — Managing Loneliness and Missing Home",
            "B — How Much Caregivers Earn",
            "C — The Importance of Teamwork",
          ],
          correct: 0,
        },
        {
          id: "R3Q3", type: "mcq", points: 1,
          context: `Paragraph 3:\nA caregiver's typical day includes helping patients wash and dress, preparing and serving meals, administering medication, assisting with mobility exercises, and keeping records. Shifts can be long, so good physical health and strong time management skills are essential.`,
          contextLabel: "Paragraph 3",
          question: "Which heading matches Paragraph 3?",
          options: [
            "A — Benefits of Working Abroad",
            "B — A Typical Day in the Job",
            "C — Language Requirements",
          ],
          correct: 1,
        },
        {
          id: "R3Q4", type: "mcq", points: 1,
          context: `Paragraph 4:\nSalaries for caregivers working abroad are significantly higher than in Nepal. In countries like Israel, Germany and the UK, monthly earnings range from USD 1,500 to USD 3,000, depending on experience and qualifications. Most employers also provide accommodation and meals.`,
          contextLabel: "Paragraph 4",
          question: "Which heading matches Paragraph 4?",
          options: [
            "A — Salary and Benefits",
            "B — How to Apply for a Visa",
            "C — Patient Rights",
          ],
          correct: 0,
        },
        {
          id: "R3Q5", type: "mcq", points: 1,
          context: `Paragraph 5:\nOnce you have work experience abroad, your career options expand considerably. You can apply for senior carer or team leader roles, move into nursing with additional training, or even open your own care agency back home. Many returned caregivers use their savings to start small businesses.`,
          contextLabel: "Paragraph 5",
          question: "Which heading matches Paragraph 5?",
          options: [
            "A — How Families Feel About Caregivers",
            "B — Career Growth and Opportunities",
            "C — Common Mistakes New Caregivers Make",
          ],
          correct: 1,
        },
      ],
    },
    {
      id: "R4",
      partNum: 4,
      title: "Part 4 — Email Comprehension",
      directions: "Read the email and answer the questions. Choose the best answer A, B or C.",
      questions: [
        {
          id: "R4Q1", type: "mcq", points: 1,
          context: `FROM: Maria Santos (Care Home Manager)\nTO: All Care Staff\nSUBJECT: New Patient — Mr. David Cohen, Room 9\n\nDear Team,\n\nMr. David Cohen (82 years old) will be joining us on Wednesday 12th June. He is recovering from a hip replacement operation.\n\nImportant notes:\n• He has a nut allergy — please inform the kitchen staff immediately.\n• He uses a walking frame and should not be left unsupported.\n• He has mild hearing loss in his left ear — speak clearly to his right side.\n• He prefers to be called "David," not "Mr. Cohen."\n• His daughter, Rachel, visits every Tuesday and Thursday afternoon.\n\nPlease introduce yourselves warmly. David is anxious about moving to a care home and needs reassurance.\n\nThank you,\nMaria`,
          contextLabel: "Email to care staff",
          question: "Why is Mr. Cohen coming to the care home?",
          options: [
            "He has a serious heart condition",
            "He is recovering from a hip operation",
            "His family can no longer look after him",
          ],
          correct: 1,
        },
        {
          id: "R4Q2", type: "mcq", points: 1,
          context: "Same email.",
          contextLabel: "",
          question: "What must staff tell the kitchen?",
          options: ["He needs a soft food diet", "He has a nut allergy", "He eats very little"],
          correct: 1,
        },
        {
          id: "R4Q3", type: "mcq", points: 1,
          context: "Same email.",
          contextLabel: "",
          question: "How should staff speak to Mr. Cohen?",
          options: ["Loudly into his left ear", "Clearly to his right side", "In simple written notes"],
          correct: 1,
        },
        {
          id: "R4Q4", type: "mcq", points: 1,
          context: "Same email.",
          contextLabel: "",
          question: "What name does Mr. Cohen prefer?",
          options: ["Mr. Cohen", "David", "Dave"],
          correct: 1,
        },
        {
          id: "R4Q5", type: "mcq", points: 1,
          context: "Same email.",
          contextLabel: "",
          question: "Why does Mr. Cohen need reassurance?",
          options: [
            "He is in a lot of pain",
            "He is worried about his operation",
            "He is anxious about moving to a care home",
          ],
          correct: 2,
        },
      ],
    },
    {
      id: "R5",
      partNum: 5,
      title: "Part 5 — Article Comprehension",
      directions: "Read the article and choose the best answer A, B or C for each question.",
      questions: [
        {
          id: "R5Q1", type: "mcq", points: 1,
          context: `UNDERSTANDING DEMENTIA: A GUIDE FOR CAREGIVERS\n\nDementia is not a single disease but a group of symptoms affecting memory, thinking and social abilities severely enough to interfere with daily life. The most common type is Alzheimer's disease, which accounts for 60–80% of all dementia cases worldwide.\n\nCaregivers working with dementia patients need specific skills. First, patience is essential — patients may repeat the same question many times without remembering the previous answer. Becoming frustrated or correcting the patient harshly can increase their anxiety. Instead, answer calmly each time and redirect their attention if needed.\n\nCreating a consistent routine is also very important. Dementia patients feel more secure when they know what to expect. Sudden changes to their schedule — a different caregiver, a new room, or an unexpected visitor — can cause confusion and distress.\n\nNon-verbal communication plays a major role. Because language ability often declines, patients respond more to tone of voice, facial expressions, and gentle touch than to words. A calm, smiling face and a reassuring hand on the shoulder can communicate more than a lengthy explanation.\n\nFinally, self-care for caregivers is critical. Looking after a dementia patient is emotionally demanding work. Research shows that caregivers who take regular breaks, talk to colleagues about difficulties, and seek professional support when needed are more effective and less likely to make errors.`,
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
          options: [
            "Correct the patient gently",
            "Answer calmly each time",
            "Ignore the repeated question",
          ],
          correct: 1,
        },
        {
          id: "R5Q3", type: "mcq", points: 1,
          context: "Same article.",
          contextLabel: "",
          question: "Why is routine important for dementia patients?",
          options: [
            "It keeps caregivers organised",
            "It helps patients feel secure and less confused",
            "It reduces the workload for care staff",
          ],
          correct: 1,
        },
        {
          id: "R5Q4", type: "mcq", points: 1,
          context: "Same article.",
          contextLabel: "",
          question: "What form of communication does the article say dementia patients often respond best to?",
          options: [
            "Long, detailed explanations",
            "Written notes and instructions",
            "Tone of voice, facial expressions and gentle touch",
          ],
          correct: 2,
        },
        {
          id: "R5Q5", type: "mcq", points: 1,
          context: "Same article.",
          contextLabel: "",
          question: "According to the article, what helps caregivers stay effective?",
          options: [
            "Working longer hours to get more done",
            "Taking breaks and seeking support when needed",
            "Avoiding emotional involvement with patients",
          ],
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
  overview: "Complete two short writing tasks. Each task requires approximately 50 words. Read the prompt carefully and address every point mentioned. You will be assessed on content, vocabulary, grammar and organisation.",
  parts: [
    {
      id: "W1",
      partNum: 1,
      title: "Task 1 — Reply to a Message",
      directions: "Read the message below. Write a reply of approximately 50 words. Address ALL the points in the message.",
      questions: [
        {
          id: "W1Q1",
          type: "text",
          question: "Task 1",
          prompt: `You received this message from a patient's family member:\n\n"Hello, I am Rachel Cohen, daughter of Mrs. Miriam Cohen in Room 5. Could you please tell me: How is my mother feeling today? Did she eat her meals? And what time will you be on duty tomorrow? Thank you."\n\nWrite a reply. Address all three questions. Write approximately 50 words.`,
          instructions: "Write approximately 50 words. Keep your sentences clear and simple. Use correct greeting and closing.",
          minWords: 40,
          timeSeconds: 900,
          sampleAnswer: "Dear Ms. Cohen,\n\nYour mother is feeling comfortable and is in good spirits today. She ate her breakfast and lunch well — she especially enjoyed her soup.\n\nI will be on duty tomorrow from 8am to 4pm. Please feel free to call if you need anything.\n\nKind regards,\nCaregiver",
          assessmentCriteria: [
            "Did you answer all 3 questions (how is she feeling / did she eat / what time tomorrow)?",
            "Did you use a greeting and closing?",
            "Are your sentences clear and simple?",
            "Is the length approximately 50 words?",
          ],
        },
      ],
    },
    {
      id: "W2",
      partNum: 2,
      title: "Task 2 — Reply to an Advertisement",
      directions: "Read the advertisement below. Write a response of approximately 50 words following the specific prompts.",
      questions: [
        {
          id: "W2Q1",
          type: "text",
          question: "Task 2",
          prompt: `You saw this job advertisement:\n\n"WANTED: Experienced Caregiver for elderly patient in Tel Aviv, Israel. Must have at least 1 year experience. Please tell us: your experience, one reason you want this job, and when you can start."\n\nWrite your response. Address all three points. Write approximately 50 words.`,
          instructions: "Write approximately 50 words. Address ALL three points in the advertisement. Keep your language professional and simple.",
          minWords: 40,
          timeSeconds: 900,
          sampleAnswer: "Dear Hiring Manager,\n\nI have two years of experience as a caregiver, looking after elderly patients with mobility difficulties and dementia.\n\nI want this job because I am dedicated to providing high-quality care and I am eager to work in an international environment.\n\nI am available to start from next month.\n\nThank you,\nApplicant",
          assessmentCriteria: [
            "Did you mention your experience?",
            "Did you give a reason for wanting the job?",
            "Did you say when you can start?",
            "Is the length approximately 50 words?",
            "Is the language professional and clear?",
          ],
        },
      ],
    },
  ],
};

// ─── SPEAKING SECTION ─────────────────────────────────────────────────────────

const speakingSection: ExamSection = {
  id: "speaking",
  title: "Speaking",
  icon: "record_voice_over",
  durationMinutes: 12,
  color: "#065f46",
  bg: "#dcfce7",
  overview: "In the real Cambridge UpSkill test, you speak and record your responses directly into the application. In this practice, type what you would say. Model answers are shown for self-assessment. Parts include: Read Aloud, Respond to Questions, and a Long Turn.",
  parts: [
    {
      id: "S1",
      partNum: 1,
      title: "Part 1 — Read Aloud",
      directions: "Read the sentence or short text aloud clearly and naturally. In the real test your voice is recorded. Here, type the sentence exactly as written, then check pronunciation tips.",
      questions: [
        {
          id: "S1Q1",
          type: "text",
          question: "Read Aloud",
          prompt: `Read this sentence aloud clearly:\n\n"The patient in Room 4 needs her blood pressure checked every three hours. Please record the results in the digital system and inform the doctor if there are any changes."\n\nType the sentence below (this helps you practise the vocabulary). Then note any words you found difficult to pronounce.`,
          instructions: "Type the sentence as written. Note any difficult words. In the real test, speak slowly and pause at commas (,) and full stops (.).",
          minWords: 15,
          timeSeconds: 60,
          sampleAnswer: "The patient in Room 4 needs her blood pressure checked every three hours. Please record the results in the digital system and inform the doctor if there are any changes.\n\n[Pronunciation tips: 'pressure' = PREH-sher, 'digital' = DIH-jih-tul, 'inform' = in-FORM, 'changes' = CHAYN-jiz]",
          assessmentCriteria: ["Did you read every word correctly?", "Did you pause at the comma and full stop?", "Did you not rush — speak slowly and clearly?", "Did you pronounce medical words correctly?"],
        },
        {
          id: "S1Q2",
          type: "text",
          question: "Read Aloud",
          prompt: `Read this notice aloud:\n\n"Good morning, Mrs. Tanaka. It is time for your morning medication. I will also help you with your breakfast and your physiotherapy exercises afterwards. Please let me know if you feel any pain or discomfort."\n\nType the text below and mark any words you need to practise.`,
          instructions: "Type the text as written. Speak clearly and at a natural pace. Stress important words.",
          minWords: 20,
          timeSeconds: 60,
          sampleAnswer: "Good morning, Mrs. Tanaka. It is time for your morning medication. I will also help you with your breakfast and your physiotherapy exercises afterwards. Please let me know if you feel any pain or discomfort.\n\n[Key words to stress: 'medication', 'physiotherapy', 'pain', 'discomfort']",
          assessmentCriteria: ["Did you read every word without skipping?", "Did you stress the key medical words?", "Did you speak at a steady pace — not too fast?"],
        },
      ],
    },
    {
      id: "S2",
      partNum: 2,
      title: "Part 2 — Respond to Questions",
      directions: "Answer each question in a complete sentence. In the real test you speak for about 20–30 seconds per question. Type your answer here.",
      questions: [
        {
          id: "S2Q1",
          type: "text",
          question: "Question 1",
          prompt: "Please tell me your name and where you are from.",
          instructions: "Answer in 1–2 complete sentences. Do not rush. Speak clearly.",
          minWords: 10,
          timeSeconds: 30,
          sampleAnswer: "My name is Sunita Tamang and I am from Kathmandu, Nepal.",
          assessmentCriteria: ["Did you state your full name?", "Did you say where you are from?", "Did you speak in a complete sentence?"],
        },
        {
          id: "S2Q2",
          type: "text",
          question: "Question 2",
          prompt: "How long have you been working as a caregiver, and what kind of patients do you care for?",
          instructions: "Answer in 2–3 complete sentences.",
          minWords: 20,
          timeSeconds: 45,
          sampleAnswer: "I have been working as a caregiver for two years. I mainly care for elderly patients who have mobility difficulties and chronic health conditions such as diabetes and high blood pressure.",
          assessmentCriteria: ["Did you say how long?", "Did you describe the type of patients?", "Did you use correct grammar?"],
        },
        {
          id: "S2Q3",
          type: "text",
          question: "Question 3",
          prompt: "What is one thing you like about your job as a caregiver?",
          instructions: "Answer in 2–3 sentences. Give a reason.",
          minWords: 20,
          timeSeconds: 45,
          sampleAnswer: "I like building a good relationship with my patients. When they trust me and feel comfortable, I know I am doing my job well. It gives me great satisfaction to help them with their daily routine.",
          assessmentCriteria: ["Did you give one thing you like?", "Did you explain why?", "Did you use clear, simple sentences?"],
        },
        {
          id: "S2Q4",
          type: "text",
          question: "Question 4",
          prompt: "You see a patient who looks upset and is not eating. What do you do?",
          instructions: "Answer in 3–4 sentences. Use simple, clear language.",
          minWords: 30,
          timeSeconds: 60,
          sampleAnswer: "First, I approach the patient calmly and ask if everything is alright. I listen carefully to understand why they are upset. Then I try to comfort them and offer the food again gently, without pressure. I also record the situation and inform the supervisor if the patient continues to refuse food.",
          assessmentCriteria: ["Did you describe a clear first action?", "Did you mention communicating with the patient?", "Did you mention informing a supervisor?", "Were your sentences complete and correct?"],
        },
      ],
    },
    {
      id: "S3",
      partNum: 3,
      title: "Part 3 — React to a Situation",
      directions: "Read the situation. React to it naturally, as if speaking directly to the person. Speak in 2–4 sentences.",
      questions: [
        {
          id: "S3Q1",
          type: "text",
          question: "Situation 1",
          prompt: `A patient's family member calls you and says:\n"I am worried about my father. He has not been sleeping well and he seems confused. What should I do?"\n\nReact to this. What do you say?`,
          instructions: "Write what you would say — naturally and kindly. 2–4 sentences.",
          minWords: 25,
          timeSeconds: 60,
          sampleAnswer: "I understand your concern and I want to assure you that we are keeping a close eye on your father. Confusion and poor sleep can sometimes be caused by a change in routine or medication. I will speak with the nurse about this today and ask the doctor to review his condition. I will call you back with an update this afternoon.",
          assessmentCriteria: ["Did you reassure the family member?", "Did you suggest a practical action?", "Was your tone calm and professional?", "Did you use complete sentences?"],
        },
        {
          id: "S3Q2",
          type: "text",
          question: "Situation 2",
          prompt: `Your supervisor asks you:\n"Can you explain your duties during the morning shift?"\n\nDescribe your morning duties clearly.`,
          instructions: "Write 3–5 sentences. Use words like 'first', 'then', 'after that'.",
          minWords: 35,
          timeSeconds: 60,
          sampleAnswer: "During the morning shift, I first check on each patient and greet them. Then I help them with personal hygiene — washing, dressing, and brushing teeth. After that, I assist with breakfast and make sure they take their medication. I also record any changes in their condition in the patient diary and report anything unusual to the nurse.",
          assessmentCriteria: ["Did you use sequence words (first, then, after)?", "Did you mention at least 3 duties?", "Were your sentences clear and professional?"],
        },
      ],
    },
    {
      id: "S4",
      partNum: 4,
      title: "Part 4 — Long Turn",
      directions: "This is the Long Turn. Read the prompt carefully and speak about ALL the points. In the real test you speak for 30–60 seconds. Type your full response here.",
      questions: [
        {
          id: "S4Q1",
          type: "text",
          question: "Long Turn",
          prompt: `Talk about a typical day in your life as a caregiver.\n\nIn your answer, include:\n• What time you start work and what you do first\n• The main duties you have during the day\n• How you communicate with patients and their families\n• What you do at the end of your shift`,
          instructions: "Cover ALL four points. Write 80–120 words. Use sequence words: first, then, after that, finally.",
          minWords: 70,
          timeSeconds: 180,
          sampleAnswer: "I usually start work at 7am. First, I read the handover notes from the night shift to understand what happened with each patient. Then I go to each room, greet the patients, and help them with their morning routine — washing, dressing, and having breakfast. Throughout the day, I assist with medication, mobility exercises, and meals. I communicate with patients by speaking calmly and listening carefully. If a family member calls, I give them a polite and clear update. Finally, at the end of my shift, I complete the patient diary, record any changes in condition, and give a clear handover to the next caregiver.",
          assessmentCriteria: ["Did you cover all four points?", "Did you use sequence words?", "Was your response 80–120 words?", "Was your language clear and professional?", "Did you use correct grammar throughout?"],
        },
      ],
    },
    {
      id: "S5",
      partNum: 5,
      title: "Part 5 — Express Your Opinion",
      directions: "Give your personal opinion on the topic below. Support your view with a reason or an example.",
      questions: [
        {
          id: "S5Q1",
          type: "text",
          question: "Opinion Question",
          prompt: "What do you think is the most important quality for a caregiver to have? Give ONE quality and explain why you think it is important.",
          instructions: "Write 30–50 words. State ONE quality and give a reason.",
          minWords: 25,
          timeSeconds: 60,
          sampleAnswer: "I think patience is the most important quality for a caregiver. Many patients are in pain or confused, and they need someone who will listen without rushing. A patient caregiver makes the patient feel safe and respected, which is essential for good care.",
          assessmentCriteria: ["Did you name ONE clear quality?", "Did you give a reason?", "Were your sentences complete and correct?", "Was your response 30–50 words?"],
        },
      ],
    },
  ],
};

// ─── FULL EXAM ────────────────────────────────────────────────────────────────

export const FULL_EXAM_SECTIONS: ExamSection[] = [
  listeningSection,
  readingSection,
  writingSection,
  speakingSection,
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
          }
        });
      });
    }
  });
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  // Official CIIN grading: B1 = 87.5%+, A2 = 62.5%+, A1 = below
  const cefr = pct >= 88 ? "B1" : pct >= 63 ? "A2" : "A1";
  return { correct, total, pct, cefr };
}
