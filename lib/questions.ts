export type QuestionType = "mcq" | "truefalse" | "short" | "fill" | "ordering";

export interface Question {
  id: string;
  part?: number;
  type: QuestionType;
  question: string;
  passage?: string;
  options?: string[];
  answer: string | boolean;
  points: number;
}

export interface WritingPrompt {
  id: string;
  part: number;
  situation: string;
  task: string;
  wordLimit: number;
  points: number;
}

export interface ListeningQuestion {
  id: string;
  part: number;
  transcript: string;
  question: string;
  type: QuestionType;
  options?: string[];
  answer: string;
  points: number;
  // ordering type only
  items?: string[];
  correctOrder?: string[];
}

// Official Cambridge UpSkill speaking part types
export type SpeakingPartType =
  | "listen_answer_short"   // Part 1: hear question, 10 sec answer
  | "listen_answer_long"    // Part 2: hear question, 20 sec answer
  | "read_aloud"            // Part 3: read 4 sentences, 10 sec each
  | "read_aloud_extended"   // Part 4: read 4 harder sentences, 10 sec each
  | "leave_message";        // Part 5: read notes, 40 sec prep, 60+ sec message

export interface SpeakingTask {
  id: string;
  part: number;
  partType: SpeakingPartType;
  partLabel: string;
  instruction: string;
  prompt: string;
  subPrompts?: string[];
  prepSeconds?: number;
  timeSeconds: number;
  points: number;
}

// ─── SET 1 ───────────────────────────────────────────────────────────────────

export const set1Reading: Question[] = [
  // Part 1 – Short texts, choose the meaning (4 Qs)
  {
    id: "r1p1q1", type: "mcq", points: 1, part: 1,
    passage: "Notice: 'Hand washing is compulsory before entering the patient's room.'",
    question: "What does this notice mean?",
    options: ["You must wash your hands before entering.", "You must remove your shoes before entering.", "You must sign in before entering.", "You must knock before entering."],
    answer: "You must wash your hands before entering.",
  },
  {
    id: "r1p1q2", type: "mcq", points: 1, part: 1,
    passage: "Sign: 'Staff only – Please knock before entering.'",
    question: "What does this sign mean?",
    options: ["Anyone can enter without knocking.", "Only staff can enter, and they must knock first.", "Residents must not enter this room.", "Visitors must not knock."],
    answer: "Only staff can enter, and they must knock first.",
  },
  {
    id: "r1p1q3", type: "mcq", points: 1, part: 1,
    passage: "Notice: 'No mobile phones allowed in the ICU.'",
    question: "What does this notice tell you?",
    options: ["Mobile phones can be used freely in the ICU.", "Mobile phones are not permitted in the ICU.", "Visitors cannot enter the ICU.", "Calls must be made at the nurses' station."],
    answer: "Mobile phones are not permitted in the ICU.",
  },
  {
    id: "r1p1q4", type: "mcq", points: 1, part: 1,
    passage: "Notice: 'Visiting hours: 10 AM – 12 PM and 4 PM – 6 PM only.'",
    question: "What does this notice mean?",
    options: ["Visitors can come at any time.", "Visitors must stay all day.", "Visitors can only come at certain times.", "Visiting is not allowed on weekdays."],
    answer: "Visitors can only come at certain times.",
  },
  // Part 2 – Complete the sentence (4 Qs)
  {
    id: "r1p2q1", type: "mcq", points: 1, part: 2,
    question: "I need to ___ my hands before touching the patient.",
    options: ["wash", "dry", "shake", "glove"],
    answer: "wash",
  },
  {
    id: "r1p2q2", type: "mcq", points: 1, part: 2,
    question: "The nurse asked me to ___ the medicine at 8 AM.",
    options: ["give", "cook", "write", "remove"],
    answer: "give",
  },
  {
    id: "r1p2q3", type: "mcq", points: 1, part: 2,
    question: "Please ___ the door when you leave the room.",
    options: ["open", "break", "close", "paint"],
    answer: "close",
  },
  {
    id: "r1p2q4", type: "mcq", points: 1, part: 2,
    question: "We must ___ any changes in the patient's condition.",
    options: ["report", "ignore", "celebrate", "delay"],
    answer: "report",
  },
  // Part 3 – Complete the sentence extended (4 Qs)
  {
    id: "r1p3q1", type: "mcq", points: 1, part: 3,
    question: "The patient is ___ comfortable now after her bath.",
    options: ["feel", "felt", "feeling", "feels"],
    answer: "feeling",
  },
  {
    id: "r1p3q2", type: "mcq", points: 1, part: 3,
    question: "Caregivers must keep all patient information ___.",
    options: ["public", "private", "shared", "open"],
    answer: "private",
  },
  {
    id: "r1p3q3", type: "mcq", points: 1, part: 3,
    question: "The medication should be taken ___ meals, not before.",
    options: ["after", "between", "during", "without"],
    answer: "after",
  },
  {
    id: "r1p3q4", type: "mcq", points: 1, part: 3,
    question: "She has been ___ at the care home for two years.",
    options: ["work", "works", "working", "worked"],
    answer: "working",
  },
  // Part 4 – Complete the sentence advanced (4 Qs)
  {
    id: "r1p4q1", type: "mcq", points: 1, part: 4,
    question: "The caregiver helped the resident ___ from the wheelchair to the bed.",
    options: ["transfer", "jump", "fall", "sleep"],
    answer: "transfer",
  },
  {
    id: "r1p4q2", type: "mcq", points: 1, part: 4,
    question: "The medication must be stored in a ___ cabinet at all times.",
    options: ["locked", "open", "glass", "broken"],
    answer: "locked",
  },
  {
    id: "r1p4q3", type: "mcq", points: 1, part: 4,
    question: "Residents with dementia may become ___ about the time and place.",
    options: ["excited", "confused", "angry", "sleepy"],
    answer: "confused",
  },
  {
    id: "r1p4q4", type: "mcq", points: 1, part: 4,
    question: "All incidents in the care home must be ___ in the incident book.",
    options: ["ignored", "erased", "recorded", "shared"],
    answer: "recorded",
  },
  // Part 5 – Longer text, comprehension (4 Qs, same passage)
  {
    id: "r1p5q1", type: "mcq", points: 1, part: 5,
    passage: "Being a caregiver in the UK requires patience, empathy and good communication. Caregivers often work with elderly or disabled people who need help with daily tasks. Good caregivers listen carefully to what their patients need and respond in a calm and friendly manner. Many caregivers also need to keep accurate records of medicines given and any changes in the patient's condition. Training is important, and most employers require caregivers to have a basic first aid certificate.",
    question: "What qualities are mentioned as important for a caregiver?",
    options: ["Speed and strength", "Patience, empathy and good communication", "Cooking and cleaning skills", "Formal qualifications only"],
    answer: "Patience, empathy and good communication",
  },
  {
    id: "r1p5q2", type: "mcq", points: 1, part: 5,
    passage: "Being a caregiver in the UK requires patience, empathy and good communication. Caregivers often work with elderly or disabled people who need help with daily tasks. Good caregivers listen carefully to what their patients need and respond in a calm and friendly manner. Many caregivers also need to keep accurate records of medicines given and any changes in the patient's condition. Training is important, and most employers require caregivers to have a basic first aid certificate.",
    question: "What must caregivers keep accurate records of?",
    options: ["Working hours and breaks", "Medicines given and condition changes", "Food eaten by residents", "Visitor names and times"],
    answer: "Medicines given and condition changes",
  },
  {
    id: "r1p5q3", type: "mcq", points: 1, part: 5,
    passage: "Being a caregiver in the UK requires patience, empathy and good communication. Caregivers often work with elderly or disabled people who need help with daily tasks. Good caregivers listen carefully to what their patients need and respond in a calm and friendly manner. Many caregivers also need to keep accurate records of medicines given and any changes in the patient's condition. Training is important, and most employers require caregivers to have a basic first aid certificate.",
    question: "What certificate do most employers require?",
    options: ["Driving licence", "Basic first aid certificate", "Food hygiene certificate", "English language certificate"],
    answer: "Basic first aid certificate",
  },
  {
    id: "r1p5q4", type: "mcq", points: 1, part: 5,
    passage: "Being a caregiver in the UK requires patience, empathy and good communication. Caregivers often work with elderly or disabled people who need help with daily tasks. Good caregivers listen carefully to what their patients need and respond in a calm and friendly manner. Many caregivers also need to keep accurate records of medicines given and any changes in the patient's condition. Training is important, and most employers require caregivers to have a basic first aid certificate.",
    question: "How should a good caregiver respond to a patient's needs?",
    options: ["Quickly and formally", "Calmly and in a friendly manner", "Firmly and directly", "Loudly and clearly"],
    answer: "Calmly and in a friendly manner",
  },
];

export const set1Writing: WritingPrompt[] = [
  {
    id: "w1p1", part: 1, points: 15, wordLimit: 50,
    situation: "Your colleague has left you a note asking you to cover her shift on Friday. You cannot do it.",
    task: "Write a note to your colleague. Tell her you cannot cover the shift. Give a reason. Suggest another solution.",
  },
  {
    id: "w1p2", part: 2, points: 15, wordLimit: 50,
    situation: "You are applying for a caregiver job in the UK.",
    task: "Write an email to the employer. Say who you are. Say why you want the job. Say what experience you have.",
  },
];

export const set1Listening: ListeningQuestion[] = [
  // Part 1 – Chat with a colleague (choose the correct reply)
  {
    id: "l1p1q1", part: 1, points: 1, type: "mcq",
    transcript: "Colleague: 'Good morning! Could you help me turn Mrs. Davies? She's been on her left side for too long.'",
    question: "What is the best reply?",
    options: ["Of course, let me finish this and I'll be right there.", "No, I'm on my break.", "Ask the manager.", "I'm not trained for that."],
    answer: "Of course, let me finish this and I'll be right there.",
  },
  {
    id: "l1p1q2", part: 1, points: 1, type: "mcq",
    transcript: "Manager: 'Have you completed the handover notes before your shift ends?'",
    question: "What is the best reply?",
    options: ["Yes, I've written everything in the communication book.", "No, I forgot about it.", "I'll do it tomorrow morning.", "That's not my job."],
    answer: "Yes, I've written everything in the communication book.",
  },
  {
    id: "l1p1q3", part: 1, points: 1, type: "mcq",
    transcript: "Nurse: 'Mrs. Jones hasn't eaten her lunch today. Have you noticed anything unusual?'",
    question: "What is the best reply?",
    options: ["She seemed quiet this morning and said her throat was sore.", "It's not my job to watch her.", "She eats too much anyway.", "I haven't seen her today."],
    answer: "She seemed quiet this morning and said her throat was sore.",
  },
  {
    id: "l1p1q4", part: 1, points: 1, type: "mcq",
    transcript: "Family member: 'Excuse me, can you tell me how my father has been today?'",
    question: "What is the best reply?",
    options: ["He's had a good day — he ate well and joined the activity session.", "I'm not sure, ask the manager.", "That's private information.", "I haven't been in his room today."],
    answer: "He's had a good day — he ate well and joined the activity session.",
  },
  // Part 2 – Order the information (1 ordering question)
  {
    id: "l1p2q1", part: 2, points: 5, type: "ordering",
    transcript: "Staff meeting: 'Before we start the morning round, let me go over the patient admission steps. First, we welcome the new resident and show them to their room. Then we complete the initial health assessment. After that, we create the care plan together with the resident and family. The next step is a family meeting to discuss the care plan. Finally, the resident settles in and regular care begins.'",
    question: "Put these steps in the order the manager describes them.",
    items: [
      "Complete the initial health assessment",
      "Welcome the new resident and show them to their room",
      "Hold a family meeting to discuss the care plan",
      "Create the care plan with the resident and family",
      "Resident settles in and regular care begins",
    ],
    correctOrder: [
      "Welcome the new resident and show them to their room",
      "Complete the initial health assessment",
      "Create the care plan with the resident and family",
      "Hold a family meeting to discuss the care plan",
      "Resident settles in and regular care begins",
    ],
    options: [],
    answer: "ordered",
  },
  // Part 3 – Fill in the gap (4 questions)
  {
    id: "l1p3q1", part: 3, points: 1, type: "fill",
    transcript: "Manager: 'Fire drill will be held this Thursday at 2 PM. All staff must participate and guide residents to the assembly point outside.'",
    question: "The fire drill will be held on ___.",
    options: [], answer: "Thursday",
  },
  {
    id: "l1p3q2", part: 3, points: 1, type: "fill",
    transcript: "Nurse: 'Remember, Mrs. Jones needs her blood pressure medication at noon and her vitamins in the evening.'",
    question: "Mrs. Jones needs her blood pressure medication at ___.",
    options: [], answer: "noon",
  },
  {
    id: "l1p3q3", part: 3, points: 1, type: "fill",
    transcript: "Caregiver: 'Mr. Brown, would you like tea or coffee this morning?' Mr. Brown: 'Coffee please, but no sugar.' Caregiver: 'Of course. I'll bring it right away.'",
    question: "Mr. Brown wants coffee with no ___.",
    options: [], answer: "sugar",
  },
  {
    id: "l1p3q4", part: 3, points: 1, type: "fill",
    transcript: "Manager: 'Today we have a new resident joining us, Mrs. Patel. She needs help with meals and walking. Please make her feel welcome.'",
    question: "Mrs. Patel needs help with meals and ___.",
    options: [], answer: "walking",
  },
  // Part 4 – Choose the correct answer (4 questions, short recordings)
  {
    id: "l1p4q1", part: 4, points: 1, type: "mcq",
    transcript: "Training session: 'When moving a patient from bed to wheelchair, always lock the wheelchair brakes first. Then help the patient to the edge of the bed. Place a transfer belt around their waist. Ask them to push up with their hands, then stand and pivot to sit in the chair.'",
    question: "What is the FIRST step when moving a patient to a wheelchair?",
    options: ["Put on the transfer belt", "Lock the wheelchair brakes", "Help patient to edge of bed", "Ask patient to stand"],
    answer: "Lock the wheelchair brakes",
  },
  {
    id: "l1p4q2", part: 4, points: 1, type: "mcq",
    transcript: "Doctor on phone: 'Please make sure Mr. Sharma takes his antibiotics three times a day with food. He should complete the full 7-day course even if he feels better.'",
    question: "How long must Mr. Sharma take his antibiotics?",
    options: ["3 days", "5 days", "7 days", "10 days"],
    answer: "7 days",
  },
  {
    id: "l1p4q3", part: 4, points: 1, type: "mcq",
    transcript: "Caregiver report: 'Mrs. Chen was upset this morning. She cried during breakfast and said she missed her family. I sat with her for 20 minutes and she felt calmer afterwards.'",
    question: "How did the caregiver help Mrs. Chen?",
    options: ["Called her family", "Gave her medicine", "Sat with her for 20 minutes", "Moved her to another room"],
    answer: "Sat with her for 20 minutes",
  },
  {
    id: "l1p4q4", part: 4, points: 1, type: "mcq",
    transcript: "[Phone rings] Receptionist: 'Good morning, Sunrise Care Home. How can I help?' Caller: 'I'd like to book an appointment to visit my mother. Is Saturday morning available?' Receptionist: 'Yes, Saturday at 10 AM is free.'",
    question: "What time is the appointment booked for?",
    options: ["9 AM Saturday", "10 AM Saturday", "10 AM Sunday", "11 AM Saturday"],
    answer: "10 AM Saturday",
  },
  // Part 5 – Choose the correct answer extended (4 questions, longer recordings)
  {
    id: "l1p5q1", part: 5, points: 1, type: "mcq",
    transcript: "Health and Safety Briefing: 'Good morning everyone. Today we are going over our infection control policy. The most important thing is hand hygiene. You must wash your hands before and after every patient contact. Use the six-step technique and wash for at least 20 seconds. Alcohol gel is available at every bedside but remember it is not a substitute for soap and water when hands are visibly dirty. If you have any cuts or wounds, please cover them with a waterproof plaster before starting your shift.'",
    question: "How long should you wash your hands for?",
    options: ["10 seconds", "15 seconds", "20 seconds", "30 seconds"],
    answer: "20 seconds",
  },
  {
    id: "l1p5q2", part: 5, points: 1, type: "mcq",
    transcript: "Health and Safety Briefing: 'Good morning everyone. Today we are going over our infection control policy. The most important thing is hand hygiene. You must wash your hands before and after every patient contact. Use the six-step technique and wash for at least 20 seconds. Alcohol gel is available at every bedside but remember it is not a substitute for soap and water when hands are visibly dirty. If you have any cuts or wounds, please cover them with a waterproof plaster before starting your shift.'",
    question: "When should you use soap and water instead of alcohol gel?",
    options: ["After every patient contact", "When hands are visibly dirty", "Before meals only", "At the end of the shift"],
    answer: "When hands are visibly dirty",
  },
  {
    id: "l1p5q3", part: 5, points: 1, type: "mcq",
    transcript: "Health and Safety Briefing: 'Good morning everyone. Today we are going over our infection control policy. The most important thing is hand hygiene. You must wash your hands before and after every patient contact. Use the six-step technique and wash for at least 20 seconds. Alcohol gel is available at every bedside but remember it is not a substitute for soap and water when hands are visibly dirty. If you have any cuts or wounds, please cover them with a waterproof plaster before starting your shift.'",
    question: "What should you do if you have a cut before your shift?",
    options: ["Go home", "Tell the manager", "Cover it with a waterproof plaster", "Wear double gloves"],
    answer: "Cover it with a waterproof plaster",
  },
  {
    id: "l1p5q4", part: 5, points: 1, type: "mcq",
    transcript: "End of life care briefing: 'When a resident enters the end-of-life stage, we focus on comfort, dignity and supporting the family. Pain management becomes the priority. Always follow the care plan and the advance directive. Family should be contacted promptly and allowed flexible visiting. Create a calm, peaceful environment and offer emotional support.'",
    question: "What becomes the priority in end-of-life care?",
    options: ["Medical treatment", "Pain management", "Exercise and rehabilitation", "Diet monitoring"],
    answer: "Pain management",
  },
];

export const set1Speaking: SpeakingTask[] = [
  {
    id: "s1p1", part: 1, partType: "listen_answer_short", partLabel: "Part 1 — Listen & Answer",
    instruction: "Listen to each question and answer it in a short sentence or two. You have 10 seconds per answer. Speak clearly.",
    prompt: "Answer each question directly.",
    subPrompts: [
      "What is your name and where are you from?",
      "What do you do for work at the moment?",
      "Do you like helping other people? Why?",
      "What time do you usually start your working day?",
    ],
    prepSeconds: 5, timeSeconds: 40, points: 10,
  },
  {
    id: "s1p2", part: 2, partType: "listen_answer_long", partLabel: "Part 2 — Listen & Answer",
    instruction: "Listen to each question and give a fuller answer. You have 20 seconds per answer. Give reasons and examples.",
    prompt: "Answer in 2–3 sentences. Give reasons where possible.",
    subPrompts: [
      "Why did you decide to become a caregiver?",
      "Tell me about your previous experience helping others.",
      "What do you think is the most important skill for a caregiver? Why?",
      "Describe a time when you helped someone who was upset or needed support.",
    ],
    prepSeconds: 5, timeSeconds: 80, points: 10,
  },
  {
    id: "s1p3", part: 3, partType: "read_aloud", partLabel: "Part 3 — Read Aloud",
    instruction: "Read each sentence aloud clearly and naturally. Pause at commas. Stop at full stops. Do not rush. You have 10 seconds per sentence.",
    prompt: "Read each sentence carefully.",
    subPrompts: [
      "Please wash your hands before and after every patient contact.",
      "The medication must be stored in a locked cabinet at the nurses' station.",
      "Always knock and introduce yourself before entering a resident's room.",
      "Report any changes in a patient's condition to the nurse immediately.",
    ],
    prepSeconds: 10, timeSeconds: 40, points: 10,
  },
  {
    id: "s1p4", part: 4, partType: "read_aloud_extended", partLabel: "Part 4 — Read Aloud",
    instruction: "Read each sentence aloud clearly. These sentences are longer — take your time and follow the punctuation.",
    prompt: "Read naturally. Aim for clear, accurate pronunciation.",
    subPrompts: [
      "Caregivers must maintain accurate records of all medication administered and any observations made during their shift.",
      "When assisting a resident with mobility, always ensure the area is clear and that appropriate footwear is worn.",
      "The care plan must be reviewed every three months, or sooner if there is a significant change in the resident's condition.",
      "Personal protective equipment, including gloves, aprons and masks, must be worn when handling any bodily fluids.",
    ],
    prepSeconds: 10, timeSeconds: 40, points: 10,
  },
  {
    id: "s1p5", part: 5, partType: "leave_message", partLabel: "Part 5 — Leave a Message",
    instruction: "Read the notes carefully. You have 40 seconds to prepare. Then leave a voicemail message of at least one minute. Cover all the points in the notes.",
    prompt: "You need to leave a voicemail for your manager.\n\nNotes:\n• You cannot come to work tomorrow\n• You are unwell — mention what is wrong\n• Ask if a colleague can cover your shift\n• Say you will call back in the afternoon",
    prepSeconds: 40, timeSeconds: 60, points: 10,
  },
];

// ─── SETS 2–7: ABBREVIATED (same structure, different topics) ────────────────

const makeReadingSet = (setNum: number): Question[] => {
  const data: Array<{
    passage: string; p1: Array<[string, string[]]>; p2: Array<[string, string[]]>;
    p3: Array<[string, string[]]>; p4: Array<[string, string[]]>;
    longPassage: string; p5: Array<[string, string[]]>;
  }> = [
    { // set 4
      passage: "",
      p1: [
        ["What does this sign mean? 'A care worker must knock before entering any resident's room.'", ["Knock before entering a resident's room.", "Enter quietly without knocking.", "Always wait outside the room.", "Announce yourself from the corridor."]],
        ["What does this notice mean? 'Medication errors are serious. Check before you give.'", ["Always check medication details before administering.", "Give medication quickly to save time.", "Ask a colleague to give all medication.", "Only senior nurses can check medication."]],
        ["What does this sign mean? 'Wet floor — use alternative route.'", ["The floor is dirty.", "Staff must clean the floor now.", "Do not walk here — use another way.", "Wet floors are safe to walk on."]],
        ["What does this notice mean? 'All residents must be offered fluids every two hours.'", ["Residents can ask for water any time.", "Caregivers must offer drinks every two hours.", "Fluids are only given at mealtimes.", "Residents must drink two litres per hour."]],
      ],
      p2: [
        ["Caregivers must always ___ the dignity of their patients.", ["respect", "ignore", "forget", "question"]],
        ["Before giving medication, always ___ the patient's name and dose.", ["check", "guess", "skip", "delay"]],
        ["A ___ plan helps reduce the risk of residents falling.", ["fall prevention", "meal", "sleeping", "activity"]],
        ["People with dementia may need extra ___ when they become confused.", ["punishment", "reassurance", "exercise", "food"]],
      ],
      p3: [
        ["End of life care ___ on comfort, dignity and quality of life.", ["focuses", "forget", "ignores", "delays"]],
        ["PPE ___ gloves, aprons and face masks.", ["includes", "removes", "sells", "ignores"]],
        ["Elderly residents should drink ___ glasses of water daily.", ["6–8", "1–2", "10–12", "0–1"]],
        ["Caregivers should ___ the care plan and support the family.", ["follow", "rewrite", "ignore", "hide"]],
      ],
      p4: [
        ["The senior nurse asked the caregiver to ___ the patient's temperature every hour.", ["monitor", "guess", "ignore", "forget"]],
        ["Residents with mobility problems should always wear ___ footwear.", ["non-slip", "open", "wet", "loose"]],
        ["The incident must be ___ in the report book before the end of the shift.", ["recorded", "deleted", "shared", "ignored"]],
        ["All care records must be kept ___ to protect patient privacy.", ["confidential", "public", "shared", "open"]],
      ],
      longPassage: "A care worker must always respect the dignity of their clients. This means knocking before entering a room, using the client's preferred name and ensuring privacy during personal care. Medication errors are serious in care settings. Always check the patient's name, the medicine name, the dose, the time and the route before administering any medication. A fall prevention plan includes keeping floors dry, ensuring good lighting, using non-slip mats and checking that the resident is wearing appropriate footwear.",
      p5: [
        ["What should a care worker do before entering a resident's room?", ["Enter immediately.", "Knock first.", "Wait for permission from the manager.", "Ask another resident."]],
        ["How many things should you check before giving medicine?", ["Three", "Four", "Five", "Six"]],
        ["Which of the following helps prevent falls?", ["Wet floors", "Dim lighting", "Non-slip mats", "Open-toe shoes"]],
        ["Why is it important to use a client's preferred name?", ["It saves time.", "It respects their dignity.", "It is required by law.", "It helps the caregiver remember them."]],
      ],
    },
    { // set 5
      passage: "",
      p1: [
        ["What does this notice mean? 'PPE must be worn when handling bodily fluids.'", ["Wear PPE when handling bodily fluids.", "PPE is only for senior staff.", "PPE is optional in care settings.", "Bodily fluids are not a risk."]],
        ["What does this sign mean? 'Care plans must be reviewed every three months.'", ["Review care plans every three months.", "Review care plans only when problems occur.", "Care plans never need reviewing.", "Residents write their own care plans."]],
        ["What does this notice mean? 'No food or drink in the medication room.'", ["Food is allowed in the medication room.", "Do not bring food or drink into the medication room.", "The medication room is also a kitchen.", "Drinks must be stored in the medication room."]],
        ["What does this sign mean? 'All resident information is strictly confidential.'", ["Resident information can be shared with anyone.", "Do not discuss resident details in public areas.", "Resident files must be left on desks.", "Confidentiality only applies to medical staff."]],
      ],
      p2: [
        ["The medication must be ___ in a locked cabinet at all times.", ["stored", "eaten", "thrown", "shared"]],
        ["Care plans must be ___ every three months.", ["reviewed", "deleted", "ignored", "printed"]],
        ["Caregivers must ___ PPE when handling any bodily fluids.", ["wear", "remove", "sell", "avoid"]],
        ["Resident information must remain ___ and must not be shared publicly.", ["confidential", "public", "useful", "optional"]],
      ],
      p3: [
        ["The caregiver ___ the resident from the bed to the wheelchair carefully.", ["transferred", "dropped", "ignored", "lifted alone"]],
        ["She has ___ at the care home for three years.", ["worked", "works", "work", "working"]],
        ["The nurse must ___ the medication list before the end of the shift.", ["update", "ignore", "remove", "share"]],
        ["The resident felt ___ after her morning routine.", ["refreshed", "refresh", "refreshing", "refreshes"]],
      ],
      p4: [
        ["Caregivers must ___ the resident's blood sugar levels twice a day.", ["check", "guess", "skip", "ignore"]],
        ["All incidents must be ___ in the incident book on the same day.", ["documented", "deleted", "announced", "forgotten"]],
        ["Moving and handling must only be done by ___ staff.", ["trained", "any", "visiting", "family"]],
        ["The nurse was ___ about the changes in the resident's condition.", ["informed", "ignored", "forgotten", "hidden from"]],
      ],
      longPassage: "Personal protective equipment (PPE) includes gloves, aprons and face masks. It is used to protect both the caregiver and the patient from infection. A healthy diet for elderly residents includes plenty of vegetables, fruit, whole grains and protein. Hydration is also essential — residents should drink 6–8 glasses of water daily. End of life care focuses on comfort, dignity and quality of life. Caregivers should follow the care plan, support the family, and ensure the patient is not in pain.",
      p5: [
        ["What does PPE protect against?", ["Bad weather", "Infection", "Falls", "Noise"]],
        ["How much water should elderly residents drink daily?", ["2–3 glasses", "4–5 glasses", "6–8 glasses", "10–12 glasses"]],
        ["What is the focus of end-of-life care?", ["Cure and recovery", "Comfort, dignity and quality of life", "Exercise and diet", "Family visits only"]],
        ["What should caregivers do when a patient is in end-of-life care?", ["Follow the care plan and support the family.", "Focus only on medication.", "Limit family visits.", "Stop all personal care."]],
      ],
    },
    { // set 6
      passage: "",
      p1: [
        ["What does this sign mean? 'Fall Risk — ensure bed rails are up at night.'", ["Put up bed rails at night for high-risk residents.", "Remove bed rails at night.", "Bed rails are not needed.", "Only use bed rails during the day."]],
        ["What does this notice mean? 'Do not attempt to lift a resident alone.'", ["One person can lift a resident safely.", "Always use two staff or correct equipment.", "Ask the resident to help themselves.", "Lifting is not part of caregiving."]],
        ["What does this sign mean? 'Hydration check — offer fluids every two hours.'", ["Offer drinks to residents every two hours.", "Residents must ask for drinks themselves.", "Fluids are offered only at mealtimes.", "Only nurses can offer fluids."]],
        ["What does this notice mean? 'Dementia residents — follow individual care plan.'", ["All dementia residents follow the same plan.", "Each dementia resident has their own care plan.", "Dementia residents do not need care plans.", "Care plans are written by families."]],
      ],
      p2: [
        ["Residents at high risk of falling should ___ bed rails up at night.", ["have", "remove", "ignore", "fold"]],
        ["Caregivers must ___ two hours between repositioning residents.", ["allow", "skip", "forget", "extend to four"]],
        ["When a resident has dementia, use ___ and simple language.", ["calm", "loud", "technical", "formal"]],
        ["Residents must be ___ fluids every two hours.", ["offered", "refused", "hidden", "given once"]],
      ],
      p3: [
        ["The physiotherapist ___ the care home every Tuesday and Thursday.", ["visits", "visit", "visiting", "visited often"]],
        ["Rose ___ the night shift from 10 PM to 6 AM.", ["works", "worked last week", "avoiding", "is refusing"]],
        ["Falls ___ by keeping floors dry and using non-slip mats.", ["are prevented", "are caused", "are ignored", "are celebrated"]],
        ["The risk assessment must be ___ within 24 hours of the resident's arrival.", ["completed", "delayed", "forgotten", "shared publicly"]],
      ],
      p4: [
        ["The care plan must be ___ if there is a significant change in condition.", ["updated", "deleted", "hidden", "ignored"]],
        ["High-risk residents are given a ___ wristband as a warning sign.", ["red", "green", "blue", "yellow"]],
        ["Caregivers on non-physiotherapy days must ___ the prescribed exercises.", ["continue", "skip", "replace", "ignore"]],
        ["The senior nurse must be ___ of any unusual behaviour immediately.", ["informed", "hidden from", "kept away from", "replaced by"]],
      ],
      longPassage: "Dementia is a condition that affects memory, thinking, behaviour and the ability to perform everyday tasks. It is most common in people over 65, though it can affect younger people too. Symptoms include forgetting names, repeating questions, confusion about time and place, and sometimes becoming agitated or withdrawn. Caregivers can help by using a calm tone, maintaining routines and offering reassurance. Activities such as music, reminiscence and gentle exercise are also known to be beneficial.",
      p5: [
        ["What age group is dementia most common in?", ["Under 40", "Over 65", "Between 30 and 50", "All age groups equally"]],
        ["Which behaviour is listed as a symptom of dementia?", ["Sleeping too much", "Refusing food", "Repeating questions", "Speaking loudly"]],
        ["How should caregivers speak to dementia residents?", ["Loudly and firmly", "In a calm tone", "Using medical terms", "Quickly and directly"]],
        ["Which activity is described as beneficial for dementia residents?", ["Card games", "Music and reminiscence", "Reading long texts", "Competitive sports"]],
      ],
    },
    { // set 7
      passage: "",
      p1: [
        ["What does this sign mean? 'End of shift: complete handover report before leaving.'", ["Complete the handover report before leaving.", "The handover report is optional.", "Only senior staff complete handover reports.", "Handover reports are written the next day."]],
        ["What does this notice mean? 'Palliative care: pain management is the priority.'", ["Pain management is the most important part of palliative care.", "Palliative care focuses on recovery.", "Pain should not be reported.", "Only nurses manage pain in palliative care."]],
        ["What does this sign mean? 'Respect cultural and religious wishes of all residents.'", ["Cultural preferences do not matter in care homes.", "All residents must follow the same cultural routine.", "Caregivers must respect each resident's cultural and religious wishes.", "Religious wishes are only respected on special days."]],
        ["What does this notice mean? 'English language support available — ask at reception.'", ["No English support is provided.", "English support is only for staff.", "Residents can request English language help at reception.", "English classes are compulsory for all residents."]],
      ],
      p2: [
        ["In palliative care, always ___ the cultural wishes of the patient.", ["respect", "ignore", "change", "question"]],
        ["The handover must ___ all relevant updates before the shift ends.", ["include", "remove", "hide", "delay"]],
        ["Pain in palliative care must be ___ to the nurse promptly.", ["reported", "hidden", "ignored", "measured"]],
        ["Caregivers must ___ carefully to what the patient and family say.", ["listen", "speak", "shout", "write"]],
      ],
      p3: [
        ["End of life care ___ compassion, patience and professionalism.", ["requires", "removes", "ignores", "replaces"]],
        ["The caregiver has ___ the family about the patient's condition.", ["informed", "forgotten", "hidden from", "replaced"]],
        ["The advance directive must be ___ when making care decisions.", ["followed", "ignored", "changed", "deleted"]],
        ["Caregivers should ___ emotional support to both the resident and the family.", ["offer", "refuse", "hide", "delay"]],
      ],
      p4: [
        ["The caregiver ___ to complete the documentation before the end of her shift.", ["remembered", "forgot", "refused", "delayed until tomorrow"]],
        ["Flexible visiting hours should be ___ to families of end-of-life residents.", ["allowed", "refused", "limited to one hour", "charged for"]],
        ["The environment should be kept ___ and peaceful for end-of-life residents.", ["calm", "noisy", "busy", "bright"]],
        ["Family members should be ___ promptly when a resident enters end-of-life stage.", ["contacted", "ignored", "sent away", "left waiting"]],
      ],
      longPassage: "End of life care requires compassion, patience and professionalism. When a resident enters the end-of-life stage, caregivers should focus on comfort, dignity and supporting the family rather than curative treatment. Pain management becomes the priority. Always follow the care plan and the advance directive if there is one. Family should be contacted promptly and allowed flexible visiting. Create a calm, peaceful environment and offer emotional support to both the resident and the family. Respecting cultural and religious wishes is a fundamental part of compassionate end-of-life care.",
      p5: [
        ["What is the main focus of end-of-life care?", ["Cure and recovery", "Comfort, dignity and supporting the family", "Exercise and rehabilitation", "Medical research"]],
        ["What becomes the priority in end-of-life care?", ["Diet monitoring", "Exercise", "Pain management", "Documentation only"]],
        ["What should caregivers do when a resident enters end-of-life stage?", ["Contact the family promptly.", "Limit family visits.", "Focus only on medication.", "Stop all personal care."]],
        ["What is described as a fundamental part of end-of-life care?", ["Medical treatment", "Respecting cultural and religious wishes", "Completing paperwork only", "Moving the resident to hospital"]],
      ],
    },
  ];

  const d = data[setNum - 4] ?? data[0];
  const result: Question[] = [];
  d.p1.forEach(([q, opts], i) => result.push({ id: `r${setNum}p1q${i+1}`, type: "mcq", points: 1, part: 1, passage: opts[0].endsWith(".") ? "" : "", question: q, options: opts, answer: opts[0] }));
  // Fix: p1 answers are always the first option (correct option is listed first in data above)
  d.p2.forEach(([q, opts], i) => result.push({ id: `r${setNum}p2q${i+1}`, type: "mcq", points: 1, part: 2, question: q, options: opts, answer: opts[0] }));
  d.p3.forEach(([q, opts], i) => result.push({ id: `r${setNum}p3q${i+1}`, type: "mcq", points: 1, part: 3, question: q, options: opts, answer: opts[0] }));
  d.p4.forEach(([q, opts], i) => result.push({ id: `r${setNum}p4q${i+1}`, type: "mcq", points: 1, part: 4, question: q, options: opts, answer: opts[0] }));
  d.p5.forEach(([q, opts], i) => result.push({ id: `r${setNum}p5q${i+1}`, type: "mcq", points: 1, part: 5, passage: d.longPassage, question: q, options: opts, answer: opts[0] }));
  return result;
};

const makeWritingSet = (setNum: number): WritingPrompt[] => {
  const situations = [
    ["Your manager asked you to write a report about a resident's eating habits this week.", "Write a short report. Describe what the resident ate. Note any concerns."],
    ["You want to request a day off next Monday.", "Write an email to your manager. Explain why you need the day off. Politely ask for approval."],
    ["A new caregiver has just joined your team.", "Write a welcome note. Introduce yourself. Give them one helpful tip for the job."],
    ["A resident's family wants an update on their mother's progress.", "Write a short update. Say how their mother is doing. Mention one positive thing."],
    ["You noticed a safety hazard in the corridor (wet floor, no sign).", "Write a report to your manager. Describe the hazard. Say what action you took."],
    ["You are writing in your work diary about your day.", "Describe your day. Say what tasks you did. Mention one challenge you faced."],
  ];
  const s = situations[setNum - 2] || situations[0];
  return [
    { id: `w${setNum}p1`, part: 1, points: 15, wordLimit: 50, situation: s[0], task: s[1] },
    { id: `w${setNum}p2`, part: 2, points: 15, wordLimit: 50, situation: "You saw an advertisement for a caregiver training course.", task: "Write an email to register. Give your name and experience. Ask one question about the course." },
  ];
};

const SPEAKING_SETS: Record<number, {
  p1: string[];
  p2: string[];
  p3: string[];
  p4: string[];
  p5: string;
}> = {
  2: {
    p1: [
      "How long have you been interested in caregiving?",
      "What languages do you speak?",
      "Do you prefer working alone or as part of a team?",
      "Are you comfortable working night shifts?",
    ],
    p2: [
      "Have you cared for someone in your family before? Tell me about it.",
      "How do you handle stressful situations at work?",
      "What challenges do you think a caregiver faces when working in a new country?",
      "Describe your ideal working environment and explain why.",
    ],
    p3: [
      "Good morning, Mrs. Kim. It is time for your morning exercises.",
      "Please take this tablet with a full glass of water.",
      "The physiotherapist will visit you at ten o'clock this morning.",
      "Remember to press the call button if you need any help.",
    ],
    p4: [
      "All medication must be checked against the prescription before it is administered to the patient.",
      "Residents should not be left alone during meal times, particularly those with swallowing difficulties.",
      "Please complete the handover report before your shift ends to ensure a safe transition of care.",
      "If a resident refuses care, do not force them — inform the senior nurse and document the refusal.",
    ],
    p5: "You need to leave a message for a colleague.\n\nNotes:\n• You need to swap your shift next Friday\n• Explain why you cannot work that day\n• Offer to cover their shift on Saturday instead\n• Ask them to reply by text or phone",
  },
  3: {
    p1: [
      "What made you decide to apply for caregiver work?",
      "Describe your personality in two or three words.",
      "Have you taken any health or care training courses?",
      "Do you enjoy meeting new people?",
    ],
    p2: [
      "How do you usually build trust with a new patient?",
      "Tell me about a time you solved a problem at work.",
      "What does patient dignity mean to you in a care setting?",
      "How do you stay motivated when your job is difficult or tiring?",
    ],
    p3: [
      "All medication must be stored in the locked cabinet at the nurses' station.",
      "Residents should not be left alone during personal care routines.",
      "Please complete the handover report before your shift ends.",
      "Emergency exits are located at the end of each corridor.",
    ],
    p4: [
      "When helping a resident with personal care, always close the door and draw the curtain to protect their privacy.",
      "Care workers must never share personal information about a resident with anyone outside the care team.",
      "Any accident or incident, however minor, must be recorded in the incident report on the same day it occurs.",
      "Residents have the right to refuse any aspect of their care, and this decision must always be respected.",
    ],
    p5: "You need to leave a voicemail for your supervisor.\n\nNotes:\n• You found an issue with a resident's medication record\n• Describe what you noticed\n• Say what action you took immediately\n• Ask the supervisor to call you back as soon as possible",
  },
  4: {
    p1: [
      "Tell me briefly about your work experience so far.",
      "What do you find most rewarding about helping others?",
      "Are you comfortable working night shifts?",
      "How do you usually get to work?",
    ],
    p2: [
      "How would you describe your relationship with a previous employer?",
      "Tell me about a time you made a mistake at work and what you learned.",
      "How do you handle a patient who is upset or refuses help?",
      "What English skills do you think are most important for a caregiver?",
    ],
    p3: [
      "The patient's blood pressure must be checked every four hours.",
      "Do not administer any medication without a signed prescription.",
      "Report any skin redness or soreness to the nurse immediately.",
      "Keep all patient records confidential at all times.",
    ],
    p4: [
      "Always use a mechanical hoist or two members of staff when moving a patient who cannot bear their own weight.",
      "Infection control procedures must be followed at all times, particularly when dealing with open wounds or bodily fluids.",
      "A full risk assessment must be carried out before beginning any new care procedure for a resident.",
      "Caregivers must attend all mandatory training sessions and ensure their certifications remain up to date.",
    ],
    p5: "You need to leave a message for the care home manager.\n\nNotes:\n• A new resident has just arrived\n• Their room is not yet ready\n• Ask the manager to arrange temporary accommodation\n• The resident's family is waiting and is concerned",
  },
  5: {
    p1: [
      "What country do you hope to work in as a caregiver?",
      "Do you have any family living abroad?",
      "What hobbies do you enjoy outside of work?",
      "Have you ever worked the night shift?",
    ],
    p2: [
      "How do you prepare for a new job in a new country or city?",
      "Have you ever lived away from your family? How did you manage?",
      "What are your main goals for the next three years?",
      "How do you practise your English outside of work or study?",
    ],
    p3: [
      "A resident's care plan must be reviewed every three months.",
      "Always introduce yourself when entering a patient's room.",
      "Use clear and simple language when communicating with residents.",
      "Document all incidents, no matter how small, in the incident report.",
    ],
    p4: [
      "Never share personal patient information with anyone who is not directly involved in that person's care.",
      "Caregivers should approach each resident with patience, empathy and a positive attitude at all times.",
      "When a resident shows signs of distress or pain, the situation must be assessed and reported without delay.",
      "All staff must follow the fire evacuation procedure and know the location of the assembly point.",
    ],
    p5: "You are calling a training centre to leave a message.\n\nNotes:\n• You want to enrol on an English language course\n• Ask about the schedule and total cost\n• You work during the week — ask if there are evening or weekend classes\n• Leave your phone number and ask them to call you back",
  },
  6: {
    p1: [
      "Tell me something interesting about your hometown.",
      "What hobbies or activities do you enjoy in your free time?",
      "Are you a morning person or an evening person?",
      "Do you have any experience caring for elderly people?",
    ],
    p2: [
      "How do you usually deal with difficult or demanding patients?",
      "What does person-centred care mean to you?",
      "Tell me about a challenge you faced at work and how you solved it.",
      "How do you communicate with a patient who does not speak much English?",
    ],
    p3: [
      "Moving and handling must only be done by trained staff.",
      "Always check a resident's identity before giving medication.",
      "Offer residents a choice whenever possible to respect their independence.",
      "If you are unsure about a task, always ask a senior member of staff.",
    ],
    p4: [
      "Residents with dementia may experience confusion and anxiety, so a calm and consistent approach is essential.",
      "All care home staff have a duty of care to protect residents from abuse, neglect and any form of harm.",
      "When completing documentation, always use clear and factual language and never leave any section blank.",
      "Safe moving and handling techniques must be used at all times to protect both the resident and the caregiver.",
    ],
    p5: "You need to leave a message for a doctor's surgery.\n\nNotes:\n• You are calling on behalf of a resident\n• The resident has been feeling unwell since yesterday\n• Describe two symptoms you have noticed\n• Ask for an urgent appointment or a home visit today",
  },
  7: {
    p1: [
      "If you could describe yourself as a caregiver in one sentence, what would you say?",
      "What is your favourite part of the working day?",
      "Do you prefer working with older adults or younger patients?",
      "How long have you been studying English?",
    ],
    p2: [
      "Tell me about a time you made a mistake at work. What did you learn from it?",
      "How do you stay calm when a patient is very unwell or in distress?",
      "What advice would you give to someone starting their first caregiving job?",
      "How has preparing for this exam helped improve your English?",
    ],
    p3: [
      "End of life care requires compassion, patience and professionalism.",
      "Always listen carefully to what the patient and family are telling you.",
      "Pain management is a priority in palliative care — report pain promptly.",
      "Handover must include all relevant updates before leaving the shift.",
    ],
    p4: [
      "Respecting the cultural and religious wishes of residents and their families is a fundamental part of compassionate care.",
      "Caregivers must never enter a private conversation between a resident and their family without being invited.",
      "If a resident wishes to change their care plan, this must be discussed with the senior nurse and documented.",
      "The wellbeing of every resident depends on clear communication between all members of the care team throughout each shift.",
    ],
    p5: "You need to leave a voicemail for your English teacher.\n\nNotes:\n• You cannot attend the class tomorrow\n• Explain clearly why you are unable to come\n• Ask if you can complete the work at home instead\n• Say you will be back next week and give your phone number",
  },
};

const makeSpeakingSet = (setNum: number): SpeakingTask[] => {
  const s = SPEAKING_SETS[setNum] || SPEAKING_SETS[2];
  return [
    {
      id: `s${setNum}p1`, part: 1, partType: "listen_answer_short", partLabel: "Part 1 — Listen & Answer",
      instruction: "Listen to each question and answer in a short sentence or two. You have 10 seconds per answer.",
      prompt: "Answer each question directly.",
      subPrompts: s.p1,
      prepSeconds: 5, timeSeconds: 40, points: 10,
    },
    {
      id: `s${setNum}p2`, part: 2, partType: "listen_answer_long", partLabel: "Part 2 — Listen & Answer",
      instruction: "Listen to each question and give a fuller answer. You have 20 seconds per answer. Give reasons and examples.",
      prompt: "Answer in 2–3 sentences with reasons.",
      subPrompts: s.p2,
      prepSeconds: 5, timeSeconds: 80, points: 10,
    },
    {
      id: `s${setNum}p3`, part: 3, partType: "read_aloud", partLabel: "Part 3 — Read Aloud",
      instruction: "Read each sentence aloud clearly and naturally. Pause at commas. Stop at full stops. You have 10 seconds per sentence.",
      prompt: "Read each sentence carefully.",
      subPrompts: s.p3,
      prepSeconds: 10, timeSeconds: 40, points: 10,
    },
    {
      id: `s${setNum}p4`, part: 4, partType: "read_aloud_extended", partLabel: "Part 4 — Read Aloud",
      instruction: "Read each sentence aloud. These are longer sentences — take your time and follow the punctuation.",
      prompt: "Read naturally. Aim for clear, accurate pronunciation.",
      subPrompts: s.p4,
      prepSeconds: 10, timeSeconds: 40, points: 10,
    },
    {
      id: `s${setNum}p5`, part: 5, partType: "leave_message", partLabel: "Part 5 — Leave a Message",
      instruction: "Read the notes carefully. You have 40 seconds to prepare. Then leave a voicemail message of at least one minute. Cover all points.",
      prompt: s.p5,
      prepSeconds: 40, timeSeconds: 60, points: 10,
    },
  ];
};

// ─── SET 2 READING ───────────────────────────────────────────────────────────
const set2Reading: Question[] = [
  // Part 1 – Notices
  { id:"r2p1q1", type:"mcq", points:1, passage:"Notice: 'Personal Protective Equipment (PPE) must be worn when handling any bodily fluids. Gloves, apron and mask are available at the nurses' station.'", question:"Where can you find PPE?", options:["In the kitchen","At the nurses' station","In residents' rooms","In the car park"], answer:"At the nurses' station" },
  { id:"r2p1q2", type:"mcq", points:1, passage:"Sign: 'Medication must only be administered by authorised staff. Never give a resident another person's medication.'", question:"Who can give medication to residents?", options:["Any caregiver","Family members","Authorised staff only","The resident themselves"], answer:"Authorised staff only" },
  { id:"r2p1q3", type:"mcq", points:1, passage:"Notice: 'Care plans must be reviewed every three months. Inform the senior nurse immediately if there is a significant change in a resident's condition.'", question:"What should you do if a resident's condition changes significantly?", options:["Wait for the three-month review","Inform the senior nurse immediately","Update the care plan yourself","Contact the family"], answer:"Inform the senior nurse immediately" },
  { id:"r2p1q4", type:"mcq", points:1, passage:"Sign: 'No food or drinks in the medication room. Keep this area clean and free from contamination at all times.'", question:"What is not allowed in the medication room?", options:["Medical equipment","Food or drinks","Care plans","Staff members"], answer:"Food or drinks" },
  { id:"r2p1q5", type:"mcq", points:1, passage:"Notice: 'All resident information is strictly confidential. Do not discuss resident details in corridors, reception or outside the building.'", question:"Where should you NOT discuss resident information?", options:["In the office","In the meeting room","In corridors and public areas","In the care plan room"], answer:"In corridors and public areas" },
  // Part 2 – Short texts
  { id:"r2p2q1", type:"mcq", points:1, passage:"Mr. Hassan is 78 and has Type 2 diabetes. His care plan requires his blood sugar to be checked twice daily — before breakfast and before dinner. He takes his metformin tablets with each meal.", question:"How many times a day is Mr. Hassan's blood sugar checked?", options:["Once","Twice","Three times","Four times"], answer:"Twice" },
  { id:"r2p2q2", type:"mcq", points:1, passage:"Mr. Hassan is 78 and has Type 2 diabetes. His care plan requires his blood sugar to be checked twice daily — before breakfast and before dinner. He takes his metformin tablets with each meal.", question:"When does Mr. Hassan take his metformin tablets?", options:["On an empty stomach","Before meals","With each meal","Before bed only"], answer:"With each meal" },
  { id:"r2p2q3", type:"mcq", points:1, passage:"The handover meeting takes place at 7 AM and 3 PM each day. The outgoing caregiver must report any changes in residents' health, any incidents, and unfinished tasks. All handover notes must be written clearly in the communication book.", question:"What time does the afternoon handover take place?", options:["1 PM","2 PM","3 PM","4 PM"], answer:"3 PM" },
  { id:"r2p2q4", type:"mcq", points:1, passage:"The handover meeting takes place at 7 AM and 3 PM each day. The outgoing caregiver must report any changes in residents' health, any incidents, and unfinished tasks. All handover notes must be written clearly in the communication book.", question:"Where must handover notes be written?", options:["On a sticky note","In the communication book","On the whiteboard","In an email"], answer:"In the communication book" },
  { id:"r2p2q5", type:"mcq", points:1, passage:"The senior nurse reviewed Mrs. Kim's records and noticed she had lost 2 kg in two weeks. She immediately referred Mrs. Kim to the dietitian and added a nutrition monitoring plan to her care file.", question:"Why was Mrs. Kim referred to the dietitian?", options:["She was eating too much","She had lost weight","She refused her medication","She had an infection"], answer:"She had lost weight" },
  // Part 3 – True/False
  { id:"r2p3q1", type:"truefalse", points:1, passage:"Daniel has been a caregiver for two years at Meadow Lane Care Home. He recently completed a manual handling certificate course. He says that learning safe techniques has reduced his back pain and made his work much easier.", question:"Daniel has been a caregiver for five years.", answer:false },
  { id:"r2p3q2", type:"truefalse", points:1, passage:"Daniel has been a caregiver for two years at Meadow Lane Care Home. He recently completed a manual handling certificate course. He says that learning safe techniques has reduced his back pain and made his work much easier.", question:"Daniel completed a manual handling training course.", answer:true },
  { id:"r2p3q3", type:"truefalse", points:1, passage:"Sunrise Care Home recently introduced electronic care records. Caregivers now use tablets to update care notes after each interaction. The system sends an alert to the nurse if a resident's condition is marked as 'urgent'.", question:"Caregivers at Sunrise Care Home still use paper records.", answer:false },
  { id:"r2p3q4", type:"truefalse", points:1, passage:"Sunrise Care Home recently introduced electronic care records. Caregivers now use tablets to update care notes after each interaction. The system sends an alert to the nurse if a resident's condition is marked as 'urgent'.", question:"The system alerts the nurse when a condition is marked urgent.", answer:true },
  { id:"r2p3q5", type:"truefalse", points:1, passage:"Sunrise Care Home recently introduced electronic care records. Caregivers now use tablets to update care notes after each interaction. The system sends an alert to the nurse if a resident's condition is marked as 'urgent'.", question:"Caregivers update care notes once per day.", answer:false },
  // Part 4 – Longer passage
  { id:"r2p4q1", type:"mcq", points:1, passage:"Pressure sores develop when skin and tissue are damaged by prolonged pressure, most commonly in people who cannot move easily. The most vulnerable areas are the heels, hips, elbows and lower back. Caregivers must reposition residents at least every two hours and check the skin regularly for redness or warmth. Pressure-relief mattresses, good nutrition and hydration also help reduce risk. Any signs of a pressure sore must be reported to the nurse immediately and recorded in the care plan.", question:"How often must residents be repositioned?", options:["Every hour","Every two hours","Every four hours","Every six hours"], answer:"Every two hours" },
  { id:"r2p4q2", type:"mcq", points:1, passage:"Pressure sores develop when skin and tissue are damaged by prolonged pressure, most commonly in people who cannot move easily. The most vulnerable areas are the heels, hips, elbows and lower back. Caregivers must reposition residents at least every two hours and check the skin regularly for redness or warmth. Pressure-relief mattresses, good nutrition and hydration also help reduce risk. Any signs of a pressure sore must be reported to the nurse immediately and recorded in the care plan.", question:"What is an early sign of a pressure sore?", options:["Bruising","Redness or warmth","Swelling","Bleeding"], answer:"Redness or warmth" },
  { id:"r2p4q3", type:"mcq", points:1, passage:"Pressure sores develop when skin and tissue are damaged by prolonged pressure, most commonly in people who cannot move easily. The most vulnerable areas are the heels, hips, elbows and lower back. Caregivers must reposition residents at least every two hours and check the skin regularly for redness or warmth. Pressure-relief mattresses, good nutrition and hydration also help reduce risk. Any signs of a pressure sore must be reported to the nurse immediately and recorded in the care plan.", question:"What must happen when a pressure sore is noticed?", options:["Apply cream and continue","Report to nurse and record it","Ask the resident to exercise","Wait for the next review"], answer:"Report to nurse and record it" },
  { id:"r2p4q4", type:"mcq", points:1, passage:"Pressure sores develop when skin and tissue are damaged by prolonged pressure, most commonly in people who cannot move easily. The most vulnerable areas are the heels, hips, elbows and lower back. Caregivers must reposition residents at least every two hours and check the skin regularly for redness or warmth. Pressure-relief mattresses, good nutrition and hydration also help reduce risk. Any signs of a pressure sore must be reported to the nurse immediately and recorded in the care plan.", question:"Which body part is listed as a vulnerable area?", options:["Shoulders","Knees","Heels","Ankles"], answer:"Heels" },
  { id:"r2p4q5", type:"mcq", points:1, passage:"Pressure sores develop when skin and tissue are damaged by prolonged pressure, most commonly in people who cannot move easily. The most vulnerable areas are the heels, hips, elbows and lower back. Caregivers must reposition residents at least every two hours and check the skin regularly for redness or warmth. Pressure-relief mattresses, good nutrition and hydration also help reduce risk. Any signs of a pressure sore must be reported to the nurse immediately and recorded in the care plan.", question:"Besides repositioning, what else helps prevent pressure sores?", options:["Exercise and sunlight","Good nutrition and hydration","Cold compresses","Regular bathing"], answer:"Good nutrition and hydration" },
  // Part 5 – Gap fill
  { id:"r2p5q1", type:"mcq", points:1, question:"The caregiver helped the resident ___ from the wheelchair to the bed.", options:["transfer","jump","fall","sleep"], answer:"transfer" },
  { id:"r2p5q2", type:"mcq", points:1, question:"The medication must be stored in a ___ cabinet at all times.", options:["locked","open","glass","broken"], answer:"locked" },
  { id:"r2p5q3", type:"mcq", points:1, question:"Residents with dementia may become ___ about the time and place.", options:["excited","confused","angry","sleepy"], answer:"confused" },
  { id:"r2p5q4", type:"mcq", points:1, question:"All incidents in the care home must be ___ in the incident book.", options:["ignored","erased","recorded","shared"], answer:"recorded" },
  { id:"r2p5q5", type:"mcq", points:1, question:"The nurse asked the caregiver to ___ the resident's blood pressure every four hours.", options:["guess","check","write","forget"], answer:"check" },
];

// ─── SET 3 READING ───────────────────────────────────────────────────────────
const set3Reading: Question[] = [
  // Part 1 – Notices
  { id:"r3p1q1", type:"mcq", points:1, passage:"Notice: 'Fall Risk. This resident is at high risk of falling. Ensure bed rails are up at night and the call bell is within reach at all times.'", question:"What must be within the resident's reach at all times?", options:["Their glasses","The call bell","A glass of water","The remote control"], answer:"The call bell" },
  { id:"r3p1q2", type:"mcq", points:1, passage:"Sign: 'Wet floor — Caution. Do not walk here until dry. Use the alternative route via the east corridor.'", question:"What should staff use when the floor is wet?", options:["The main corridor","The west exit","The east corridor route","The emergency stairs"], answer:"The east corridor route" },
  { id:"r3p1q3", type:"mcq", points:1, passage:"Notice: 'Residents with dementia may become distressed if routines change suddenly. Follow each resident's individual care plan and inform the senior nurse of any unusual behaviour.'", question:"What should you do if a dementia resident behaves unusually?", options:["Change their routine","Inform the senior nurse","Leave them alone","Call their family"], answer:"Inform the senior nurse" },
  { id:"r3p1q4", type:"mcq", points:1, passage:"Sign: 'Do not attempt to lift a resident alone. Always use two staff members or the correct equipment. Single-person lifts are not permitted under any circumstances.'", question:"How many staff are needed to lift a resident?", options:["One","Two","Three","It depends"], answer:"Two" },
  { id:"r3p1q5", type:"mcq", points:1, passage:"Notice: 'Hydration check — All residents must be offered fluids every two hours. Record fluid intake in the hydration chart on the resident's door.'", question:"How often should fluids be offered to residents?", options:["Every hour","Every two hours","Every four hours","Twice a day"], answer:"Every two hours" },
  // Part 2 – Short texts
  { id:"r3p2q1", type:"mcq", points:1, passage:"Rose is a caregiver at Greenview Care Home. She works the night shift from 10 PM to 6 AM. Her main duties are checking on residents every two hours, responding to call bells and completing documentation before handover.", question:"What time does Rose's shift end?", options:["10 PM","12 AM","4 AM","6 AM"], answer:"6 AM" },
  { id:"r3p2q2", type:"mcq", points:1, passage:"Rose is a caregiver at Greenview Care Home. She works the night shift from 10 PM to 6 AM. Her main duties are checking on residents every two hours, responding to call bells and completing documentation before handover.", question:"How often does Rose check on residents?", options:["Every hour","Every two hours","Every three hours","Every four hours"], answer:"Every two hours" },
  { id:"r3p2q3", type:"mcq", points:1, passage:"A fall prevention risk assessment is completed for every new resident within 24 hours of arrival. The assessment looks at mobility, medication, vision and history of falls. High-risk residents are given a red wristband and a falls prevention care plan.", question:"When is the fall prevention assessment completed?", options:["After one week","Within 24 hours of arrival","At the first care plan review","On discharge only"], answer:"Within 24 hours of arrival" },
  { id:"r3p2q4", type:"mcq", points:1, passage:"A fall prevention risk assessment is completed for every new resident within 24 hours of arrival. The assessment looks at mobility, medication, vision and history of falls. High-risk residents are given a red wristband and a falls prevention care plan.", question:"What do high-risk residents receive?", options:["Extra meals","A red wristband and falls prevention plan","A private room","A walking frame"], answer:"A red wristband and falls prevention plan" },
  { id:"r3p2q5", type:"mcq", points:1, passage:"The physiotherapist visits Greenview Care Home every Tuesday and Thursday to work with residents on mobility and strength. Caregivers are expected to continue the prescribed exercises with residents on other days.", question:"Who continues the exercises on non-physiotherapy days?", options:["The senior nurse","The resident's family","Caregivers","The manager"], answer:"Caregivers" },
  // Part 3 – True/False
  { id:"r3p3q1", type:"truefalse", points:1, passage:"Grace has worked as a caregiver for six years. She specialises in dementia care and recently attended a three-day training course on communication techniques for residents with dementia. She says using simple, calm language and maintaining eye contact makes a big difference.", question:"Grace has worked as a caregiver for three years.", answer:false },
  { id:"r3p3q2", type:"truefalse", points:1, passage:"Grace has worked as a caregiver for six years. She specialises in dementia care and recently attended a three-day training course on communication techniques for residents with dementia. She says using simple, calm language and maintaining eye contact makes a big difference.", question:"Grace recently attended a training course on dementia communication.", answer:true },
  { id:"r3p3q3", type:"truefalse", points:1, passage:"Residents at Bluebell Lodge have access to a garden area from 9 AM to 5 PM during summer months. Staff must accompany any resident who wishes to use the garden. The garden is fully accessible for wheelchair users.", question:"The garden at Bluebell Lodge is accessible for wheelchair users.", answer:true },
  { id:"r3p3q4", type:"truefalse", points:1, passage:"Residents at Bluebell Lodge have access to a garden area from 9 AM to 5 PM during summer months. Staff must accompany any resident who wishes to use the garden. The garden is fully accessible for wheelchair users.", question:"Residents can go to the garden without a staff member.", answer:false },
  { id:"r3p3q5", type:"truefalse", points:1, passage:"Residents at Bluebell Lodge have access to a garden area from 9 AM to 5 PM during summer months. Staff must accompany any resident who wishes to use the garden. The garden is fully accessible for wheelchair users.", question:"The garden is open until 6 PM.", answer:false },
  // Part 4 – Longer passage
  { id:"r3p4q1", type:"mcq", points:1, passage:"Dementia is a condition that affects memory, thinking, behaviour and the ability to perform everyday tasks. It is most common in people over 65, though it can affect younger people too. Alzheimer's disease is the most common type. Symptoms include forgetting names, repeating questions, confusion about time and place, and sometimes becoming agitated or withdrawn. Caregivers can help by using a calm tone, maintaining routines and offering reassurance. Activities such as music, reminiscence and gentle exercise are also known to be beneficial.", question:"What is the most common type of dementia?", options:["Vascular dementia","Lewy body dementia","Alzheimer's disease","Frontotemporal dementia"], answer:"Alzheimer's disease" },
  { id:"r3p4q2", type:"mcq", points:1, passage:"Dementia is a condition that affects memory, thinking, behaviour and the ability to perform everyday tasks. It is most common in people over 65, though it can affect younger people too. Alzheimer's disease is the most common type. Symptoms include forgetting names, repeating questions, confusion about time and place, and sometimes becoming agitated or withdrawn. Caregivers can help by using a calm tone, maintaining routines and offering reassurance. Activities such as music, reminiscence and gentle exercise are also known to be beneficial.", question:"What type of voice should caregivers use with dementia residents?", options:["Loud and clear","Firm and direct","Calm","Slow and formal"], answer:"Calm" },
  { id:"r3p4q3", type:"mcq", points:1, passage:"Dementia is a condition that affects memory, thinking, behaviour and the ability to perform everyday tasks. It is most common in people over 65, though it can affect younger people too. Alzheimer's disease is the most common type. Symptoms include forgetting names, repeating questions, confusion about time and place, and sometimes becoming agitated or withdrawn. Caregivers can help by using a calm tone, maintaining routines and offering reassurance. Activities such as music, reminiscence and gentle exercise are also known to be beneficial.", question:"Which activity is mentioned as beneficial for dementia residents?", options:["Card games","Music and reminiscence","Reading aloud","Cooking"], answer:"Music and reminiscence" },
  { id:"r3p4q4", type:"mcq", points:1, passage:"Dementia is a condition that affects memory, thinking, behaviour and the ability to perform everyday tasks. It is most common in people over 65, though it can affect younger people too. Alzheimer's disease is the most common type. Symptoms include forgetting names, repeating questions, confusion about time and place, and sometimes becoming agitated or withdrawn. Caregivers can help by using a calm tone, maintaining routines and offering reassurance. Activities such as music, reminiscence and gentle exercise are also known to be beneficial.", question:"Which behaviour is listed as a symptom of dementia?", options:["Sleeping too much","Refusing food","Repeating questions","Speaking loudly"], answer:"Repeating questions" },
  { id:"r3p4q5", type:"mcq", points:1, passage:"Dementia is a condition that affects memory, thinking, behaviour and the ability to perform everyday tasks. It is most common in people over 65, though it can affect younger people too. Alzheimer's disease is the most common type. Symptoms include forgetting names, repeating questions, confusion about time and place, and sometimes becoming agitated or withdrawn. Caregivers can help by using a calm tone, maintaining routines and offering reassurance. Activities such as music, reminiscence and gentle exercise are also known to be beneficial.", question:"What age group is dementia most common in?", options:["People under 40","People over 65","People aged 50–60","All age groups equally"], answer:"People over 65" },
  // Part 5 – Gap fill
  { id:"r3p5q1", type:"mcq", points:1, question:"Residents who are at risk of falling should always wear ___ footwear.", options:["open","non-slip","soft","old"], answer:"non-slip" },
  { id:"r3p5q2", type:"mcq", points:1, question:"The caregiver noticed that the resident seemed ___, so she sat with him and listened.", options:["hungry","happy","distressed","tired"], answer:"distressed" },
  { id:"r3p5q3", type:"mcq", points:1, question:"The nurse asked the caregiver to ___ the resident's fluid intake every two hours.", options:["guess","ignore","monitor","reduce"], answer:"monitor" },
  { id:"r3p5q4", type:"mcq", points:1, question:"Before helping a resident stand up, always check that the floor is ___ and clear.", options:["wet","dry","warm","soft"], answer:"dry" },
  { id:"r3p5q5", type:"mcq", points:1, question:"A person with dementia may need extra ___ when they become confused or upset.", options:["medicine","food","reassurance","exercise"], answer:"reassurance" },
];

// ─── SET 2 LISTENING ──────────────────────────────────────────────────────────
const set2Listening: ListeningQuestion[] = [
  // Part 1 – Chat with a colleague (choose the correct reply)
  { id:"l2p1q1", part:1, points:1, type:"mcq", transcript:"Manager: 'All care plans for residents on your ward need to be reviewed and updated by Friday afternoon. Can you do that?'", question:"What is the best reply?", options:["Yes, I'll make sure they are all updated before Friday.", "No, that's too much work.", "Ask someone else to do it.", "I'll do it next week."], answer:"Yes, I'll make sure they are all updated before Friday." },
  { id:"l2p1q2", part:1, points:1, type:"mcq", transcript:"Resident: 'Excuse me, could you help me put on my cardigan? My shoulder is a bit stiff today.'", question:"What is the best reply?", options:["Of course, let's do it slowly so we don't hurt your shoulder.", "I'm too busy right now.", "Ask another resident.", "You should be able to do that yourself."], answer:"Of course, let's do it slowly so we don't hurt your shoulder." },
  { id:"l2p1q3", part:1, points:1, type:"mcq", transcript:"Nurse: 'Mrs. Okafor's new medication must be taken 30 minutes before her meal. Can you make sure that happens?'", question:"What is the best reply?", options:["Yes, I'll give it to her before her meal.", "She can take it whenever she wants.", "I'll ask the family.", "That's the nurse's job."], answer:"Yes, I'll give it to her before her meal." },
  { id:"l2p1q4", part:1, points:1, type:"mcq", transcript:"Senior caregiver: 'Before you go home, make sure you've handed over the medication keys to Jenny.'", question:"What is the best reply?", options:["Understood — I'll hand the keys to Jenny before I leave.", "I left them on the desk.", "Jenny can find them herself.", "I'll do it tomorrow."], answer:"Understood — I'll hand the keys to Jenny before I leave." },
  // Part 2 – Order the information
  { id:"l2p2q1", part:2, points:5, type:"ordering",
    transcript: "PPE training: 'When entering an isolation room, the order is very important. First, wash your hands thoroughly. Then put on the apron. After that, put on your gloves. Next, put on the mask. Finally, you may enter the room. Remember this order every time.'",
    question: "Put these PPE steps in the correct order.",
    items: ["Put on the mask", "Put on the apron", "Enter the room", "Wash your hands", "Put on gloves"],
    correctOrder: ["Wash your hands", "Put on the apron", "Put on gloves", "Put on the mask", "Enter the room"],
    options: [], answer: "ordered" },
  // Part 3 – Fill in the gap
  { id:"l2p3q1", part:3, points:1, type:"fill", transcript:"Nurse to caregiver: 'Please check on Mr. Peters in room 8. He pressed his call bell 20 minutes ago and nobody responded. Call bells must be answered within five minutes.'", question:"Call bells must be answered within ___ minutes.", options:[], answer:"five" },
  { id:"l2p3q2", part:3, points:1, type:"fill", transcript:"Job interview: 'My name is Priya. I have been working in elderly care for five years — two years in India and three years in the UK.'", question:"Priya has worked in the UK for ___ years.", options:[], answer:"three" },
  { id:"l2p3q3", part:3, points:1, type:"fill", transcript:"Staff meeting: 'All staff must keep personal mobile phones stored in lockers during working hours. You may check them during your break.'", question:"Staff can check their phones during their ___.", options:[], answer:"break" },
  { id:"l2p3q4", part:3, points:1, type:"fill", transcript:"Nurse briefing: 'We have a new resident coming in tomorrow — Mrs. Begum. She has high blood pressure and is allergic to penicillin. Please make a note of this.'", question:"Mrs. Begum is allergic to ___.", options:[], answer:"penicillin" },
  // Part 4 – Choose the correct answer
  { id:"l2p4q1", part:4, points:1, type:"mcq", transcript:"Moving and Handling Briefing: 'The most important rule is never to lift a resident alone. All manual lifts require two members of staff. Before any transfer, introduce yourself to the resident and explain what you are going to do. If the resident is in pain or refuses, do not proceed — inform the nurse immediately. After the transfer, always record it in the care notes.'", question:"How many staff are needed for a manual lift?", options:["One","Two","Three","Four"], answer:"Two" },
  { id:"l2p4q2", part:4, points:1, type:"mcq", transcript:"Moving and Handling Briefing: 'The most important rule is never to lift a resident alone. All manual lifts require two members of staff. Before any transfer, introduce yourself to the resident and explain what you are going to do. If the resident is in pain or refuses, do not proceed — inform the nurse immediately. After the transfer, always record it in the care notes.'", question:"What should you do before transferring a resident?", options:["Check the weather","Introduce yourself and explain what you will do","Ask another resident to watch","Lock the door"], answer:"Introduce yourself and explain what you will do" },
  { id:"l2p4q3", part:4, points:1, type:"mcq", transcript:"Moving and Handling Briefing: 'The most important rule is never to lift a resident alone. All manual lifts require two members of staff. Before any transfer, introduce yourself to the resident and explain what you are going to do. If the resident is in pain or refuses, do not proceed — inform the nurse immediately. After the transfer, always record it in the care notes.'", question:"If a resident refuses to be transferred, what should you do?", options:["Force the transfer gently","Leave them and come back later","Inform the nurse immediately","Ask the family"], answer:"Inform the nurse immediately" },
  { id:"l2p4q4", part:4, points:1, type:"mcq", transcript:"Moving and Handling Briefing: 'The most important rule is never to lift a resident alone. All manual lifts require two members of staff. Before any transfer, introduce yourself to the resident and explain what you are going to do. If the resident is in pain or refuses, do not proceed — inform the nurse immediately. After the transfer, always record it in the care notes.'", question:"What should you do after a transfer?", options:["Have a break","Record it in the care notes","Report to the manager","Clean the hoist only"], answer:"Record it in the care notes" },
  // Part 5 – Choose the correct answer (extended)
  { id:"l2p5q1", part:5, points:1, type:"mcq", transcript:"Caregiver report: 'Mrs. Diaz had a small accident in her room this morning. She needs help to the bathroom and her bedding needs changing. I've informed the nurse and completed the incident form.'", question:"What did the caregiver do after Mrs. Diaz's accident?", options:["Called the family","Informed the nurse and completed the incident form","Moved Mrs. Diaz to another room","Asked a colleague to handle it"], answer:"Informed the nurse and completed the incident form" },
  { id:"l2p5q2", part:5, points:1, type:"mcq", transcript:"Staff announcement: 'The activity coordinator has set up a sing-along session in the lounge at 2 PM today. Please encourage residents to attend, especially those who seem withdrawn or low in mood. Their participation will improve their wellbeing.'", question:"Who should especially be encouraged to attend the sing-along?", options:["New residents only","Mobile residents","Residents who seem withdrawn or low in mood","All staff members"], answer:"Residents who seem withdrawn or low in mood" },
  { id:"l2p5q3", part:5, points:1, type:"mcq", transcript:"Caregiver: 'The shower in Room 5 is still not working. Maintenance was called yesterday but nobody came. Mrs. Wright needs her shower this morning. Can we use the accessible bathroom on the second floor?'", question:"What problem is described?", options:["The heating is off in Room 5","The shower in Room 5 is not working","The call bell in Room 5 is broken","The window in Room 5 is stuck"], answer:"The shower in Room 5 is not working" },
  { id:"l2p5q4", part:5, points:1, type:"mcq", transcript:"Nurse: 'The GP is visiting this Wednesday at 11 AM to review medication for residents in the Bluebell wing. Please make sure all relevant care files and medication records are available at the nurses' station before 10:30 AM.'", question:"What must be ready before the GP visit?", options:["Residents dressed and in the lounge","Care files and medication records at the nurses' station","Breakfast served early","All staff in uniform"], answer:"Care files and medication records at the nurses' station" },
];

// ─── SET 3 LISTENING ──────────────────────────────────────────────────────────
const set3Listening: ListeningQuestion[] = [
  // Part 1 – Chat with a colleague (choose the correct reply)
  { id:"l3p1q1", part:1, points:1, type:"mcq", transcript:"Caregiver to nurse: 'I just noticed Mr. Collins has a new reddening on his lower back. I've repositioned him. Should I complete an incident report?'", question:"What is the best reply?", options:["Yes, please complete the report and I'll come to assess him.", "No, it's probably nothing.", "Ask the family first.", "Wait until tomorrow."], answer:"Yes, please complete the report and I'll come to assess him." },
  { id:"l3p1q2", part:1, points:1, type:"mcq", transcript:"Manager: 'We have a mandatory fire safety training on Monday at 9 AM. All care staff must attend. Please arrange cover for your residents first.'", question:"What is the best reply?", options:["Understood — I'll arrange cover before the session.", "I'm too busy on Monday.", "I've already done that training.", "Can I skip it?"], answer:"Understood — I'll arrange cover before the session." },
  { id:"l3p1q3", part:1, points:1, type:"mcq", transcript:"Resident: 'I'm feeling dizzy today. I nearly fell when I stood up too fast.'", question:"What is the best reply?", options:["Thank you for telling me. Please sit down and I'll let the nurse know.", "You should be more careful.", "That happens sometimes, don't worry.", "I'll tell the manager later."], answer:"Thank you for telling me. Please sit down and I'll let the nurse know." },
  { id:"l3p1q4", part:1, points:1, type:"mcq", transcript:"Colleague: 'Mrs. Abbott won't eat her lunch. The food is too hard for her teeth. What should we do?'", question:"What is the best reply?", options:["I'll speak to the kitchen supervisor and request a softer diet option.", "She should eat it anyway.", "Leave it — she'll eat when she's hungry.", "Give her something from the vending machine."], answer:"I'll speak to the kitchen supervisor and request a softer diet option." },
  // Part 2 – Order the information
  { id:"l3p2q1", part:2, points:5, type:"ordering",
    transcript: "Falls prevention training: 'Before you help a resident to walk, always follow these steps in order. First, check that they are wearing non-slip footwear. Second, make sure their walking aid is within reach. Third, check that the path ahead is clear of any obstacles. Fourth, tell the resident what you are going to do. Finally, begin walking with them slowly.'",
    question: "Put these steps in the correct order.",
    items: ["Tell the resident what you are going to do", "Check non-slip footwear is worn", "Begin walking with them slowly", "Check the path is clear of obstacles", "Ensure the walking aid is within reach"],
    correctOrder: ["Check non-slip footwear is worn", "Ensure the walking aid is within reach", "Check the path is clear of obstacles", "Tell the resident what you are going to do", "Begin walking with them slowly"],
    options: [], answer: "ordered" },
  // Part 3 – Fill in the gap
  { id:"l3p3q1", part:3, points:1, type:"fill", transcript:"Interview: 'My name is Roberto. I moved to the UK three years ago and have been working in care since I arrived.'", question:"Roberto has been working in care for ___ years.", options:[], answer:"three" },
  { id:"l3p3q2", part:3, points:1, type:"fill", transcript:"End-of-life care briefing: 'When a resident enters the end-of-life stage, pain management becomes the priority. Always follow the care plan and contact the family promptly.'", question:"In end-of-life care, ___ management becomes the priority.", options:[], answer:"pain" },
  { id:"l3p3q3", part:3, points:1, type:"fill", transcript:"Nurse to caregiver: 'Mrs. Huang has been refusing her evening medication for three days. Document each refusal clearly in her medication record.'", question:"Each medication refusal must be recorded in the ___ record.", options:[], answer:"medication" },
  { id:"l3p3q4", part:3, points:1, type:"fill", transcript:"Manager: 'A family complained that the rooms are not clean enough. Please ensure all rooms are checked at the start of every shift and cleaning issues reported to housekeeping immediately.'", question:"Rooms should be checked at the ___ of every shift.", options:[], answer:"start" },
  // Part 4 – Choose the correct answer
  { id:"l3p4q1", part:4, points:1, type:"mcq", transcript:"Safeguarding Briefing: 'Safeguarding means protecting people from abuse, neglect and harm. Types of abuse include physical, emotional, financial and sexual abuse. Signs include unexplained bruises, withdrawal, sudden behaviour changes, or a resident appearing frightened around a certain person. If you suspect abuse, do not investigate yourself — report immediately to the manager or the designated safeguarding lead. All concerns must be documented.'", question:"What should you do if you suspect abuse?", options:["Investigate yourself first","Ask other residents","Report to the manager or safeguarding lead","Wait to see if it happens again"], answer:"Report to the manager or safeguarding lead" },
  { id:"l3p4q2", part:4, points:1, type:"mcq", transcript:"Safeguarding Briefing: 'Safeguarding means protecting people from abuse, neglect and harm. Types of abuse include physical, emotional, financial and sexual abuse. Signs include unexplained bruises, withdrawal, sudden behaviour changes, or a resident appearing frightened around a certain person. If you suspect abuse, do not investigate yourself — report immediately to the manager or the designated safeguarding lead. All concerns must be documented.'", question:"Which of these is listed as a sign of possible abuse?", options:["Eating too much","Unexplained bruises","Sleeping more than usual","Not wanting to exercise"], answer:"Unexplained bruises" },
  { id:"l3p4q3", part:4, points:1, type:"mcq", transcript:"Safeguarding Briefing: 'Safeguarding means protecting people from abuse, neglect and harm. Types of abuse include physical, emotional, financial and sexual abuse. Signs include unexplained bruises, withdrawal, sudden behaviour changes, or a resident appearing frightened around a certain person. If you suspect abuse, do not investigate yourself — report immediately to the manager or the designated safeguarding lead. All concerns must be documented.'", question:"Which type of abuse is NOT mentioned in the briefing?", options:["Physical abuse","Financial abuse","Medical abuse","Emotional abuse"], answer:"Medical abuse" },
  { id:"l3p4q4", part:4, points:1, type:"mcq", transcript:"Safeguarding Briefing: 'Safeguarding means protecting people from abuse, neglect and harm. Types of abuse include physical, emotional, financial and sexual abuse. Signs include unexplained bruises, withdrawal, sudden behaviour changes, or a resident appearing frightened around a certain person. If you suspect abuse, do not investigate yourself — report immediately to the manager or the designated safeguarding lead. All concerns must be documented.'", question:"What must happen to all concerns about abuse?", options:["They must be reviewed monthly","They must be kept private","They must be documented","They must be shared with residents"], answer:"They must be documented" },
  // Part 5 – Choose the correct answer (extended)
  { id:"l3p5q1", part:5, points:1, type:"mcq", transcript:"Caregiver report: 'Mrs. Reid has been very tearful today. She told me she is worried about her son who hasn't visited for three weeks. I sat with her for a while and she felt better. I've made a note in her daily report.'", question:"Why is Mrs. Reid tearful?", options:["She is in pain","She doesn't like the food","Her son hasn't visited for three weeks","She wants to go home"], answer:"Her son hasn't visited for three weeks" },
  { id:"l3p5q2", part:5, points:1, type:"mcq", transcript:"Caregiver: 'I've just checked on Mr. Vasquez and found him on the floor next to his bed. He seems confused but is conscious and says his hip hurts. I haven't moved him. I've pressed the emergency buzzer and I'm staying with him until the nurse arrives.'", question:"What did the caregiver do correctly after finding Mr. Vasquez?", options:["Helped him up immediately","Called his family first","Did not move him and called for help","Left the room to find a colleague"], answer:"Did not move him and called for help" },
  { id:"l3p5q3", part:5, points:1, type:"mcq", transcript:"Staff announcement: 'The dietitian has left a note saying three residents need more protein. Please offer them cheese, eggs or meat with every meal and record how much they eat on the nutrition monitoring sheet.'", question:"What should caregivers record on the nutrition monitoring sheet?", options:["What time meals are served","How much the residents eat","The residents' weight","Which food they prefer"], answer:"How much the residents eat" },
  { id:"l3p5q4", part:5, points:1, type:"mcq", transcript:"Nurse: 'Tomorrow's morning medication round will start at 7:30 AM instead of 8 AM because the pharmacist is coming early to audit our controlled drugs cabinet. Please make sure all night staff have updated the medication records before handing over.'", question:"Why will the medication round start early tomorrow?", options:["There are new residents","The pharmacist is coming early","The nurse requested it","It is a new policy"], answer:"The pharmacist is coming early" },
];

export const testSets: Record<number, {
  reading: Question[];
  writing: WritingPrompt[];
  listening: ListeningQuestion[];
  speaking: SpeakingTask[];
}> = {
  1: { reading: set1Reading, writing: set1Writing, listening: set1Listening, speaking: set1Speaking },
  2: { reading: set2Reading, writing: makeWritingSet(2), listening: set2Listening, speaking: makeSpeakingSet(2) },
  3: { reading: set3Reading, writing: makeWritingSet(3), listening: set3Listening, speaking: makeSpeakingSet(3) },
  4: { reading: makeReadingSet(4), writing: makeWritingSet(4), listening: set1Listening, speaking: makeSpeakingSet(4) },
  5: { reading: makeReadingSet(5), writing: makeWritingSet(5), listening: set1Listening, speaking: makeSpeakingSet(5) },
  6: { reading: makeReadingSet(6), writing: makeWritingSet(6), listening: set1Listening, speaking: makeSpeakingSet(6) },
  7: { reading: makeReadingSet(7), writing: makeWritingSet(7), listening: set1Listening, speaking: makeSpeakingSet(7) },
};

// ─── GRADING ─────────────────────────────────────────────────────────────────

export interface GradeResult {
  score: number;
  total: number;
  percentage: number;
  grade: "A1" | "A2" | "B1";
  label: string;
  feedback: string;
}

export function calculateGrade(score: number, total: number): GradeResult {
  const percentage = Math.round((score / total) * 100);
  let grade: "A1" | "A2" | "B1";
  let label: string;
  let feedback: string;

  if (percentage >= 80) {
    grade = "B1";
    label = "Intermediate";
    feedback = "Excellent! You have demonstrated intermediate English skills suitable for caregiver work in the UK. You are well-prepared for the Cambridge UpSkill exam.";
  } else if (percentage >= 50) {
    grade = "A2";
    label = "Elementary";
    feedback = "Good progress! You have basic English communication skills. With more practice you can reach B1 level for the Cambridge UpSkill exam.";
  } else {
    grade = "A1";
    label = "Beginner";
    feedback = "Keep practising! You are at beginner level. Focus on vocabulary, listening and reading skills to improve before your Cambridge UpSkill exam.";
  }

  return { score, total, percentage, grade, label, feedback };
}
