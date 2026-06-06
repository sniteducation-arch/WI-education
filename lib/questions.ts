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
  graphicAlt?: string;
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
    situation: "Your friend Mona has invited you to a football match this weekend. You want to go.",
    task: "Write an email to Mona. Tell her you will come. Ask what time to arrive. Suggest where to meet.",
  },
  {
    id: "w1p2", part: 2, points: 15, wordLimit: 50,
    situation: "You saw a job advertisement for a caregiver position at Sunrise Care Home.",
    task: "Write a reply to the advertisement. Say why you are interested in the role. Explain your relevant experience. Ask for an interview.",
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
    prepSeconds: 10, timeSeconds: 80, points: 10,
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

  // Rotate options so the correct answer (always opts[0] in raw data) is not always position 0
  const rot = (opts: string[], seed: number): string[] => {
    const k = seed % opts.length;
    return k === 0 ? opts : [...opts.slice(k), ...opts.slice(0, k)];
  };

  d.p1.forEach(([q, opts], i) => { const o = rot(opts as string[], i); result.push({ id: `r${setNum}p1q${i+1}`, type: "mcq" as QuestionType, points: 1, part: 1, question: q as string, options: o, answer: (opts as string[])[0] }); });
  d.p2.forEach(([q, opts], i) => { const o = rot(opts as string[], i + 1); result.push({ id: `r${setNum}p2q${i+1}`, type: "mcq" as QuestionType, points: 1, part: 2, question: q as string, options: o, answer: (opts as string[])[0] }); });
  d.p3.forEach(([q, opts], i) => { const o = rot(opts as string[], i + 2); result.push({ id: `r${setNum}p3q${i+1}`, type: "mcq" as QuestionType, points: 1, part: 3, question: q as string, options: o, answer: (opts as string[])[0] }); });
  d.p4.forEach(([q, opts], i) => { const o = rot(opts as string[], i + 3); result.push({ id: `r${setNum}p4q${i+1}`, type: "mcq" as QuestionType, points: 1, part: 4, question: q as string, options: o, answer: (opts as string[])[0] }); });
  d.p5.forEach(([q, opts], i) => { const o = rot(opts as string[], i); result.push({ id: `r${setNum}p5q${i+1}`, type: "mcq" as QuestionType, points: 1, part: 5, passage: d.longPassage, question: q as string, options: o, answer: (opts as string[])[0] }); });
  return result;
};

const makeWritingSet = (setNum: number): WritingPrompt[] => {
  // Part 1 — Personal email (to a friend, family member, or colleague)
  const part1Situations: [string, string][] = [
    [
      "Your friend Ana is having a birthday dinner on Saturday. You cannot go.",
      "Write an email to Ana. Say sorry you cannot come. Give a reason. Suggest another time to meet.",
    ],
    [
      "Your colleague Tom helped you when you were unwell at work last week.",
      "Write an email to Tom. Thank him for his help. Say what it meant to you. Invite him for coffee.",
    ],
    [
      "Your friend Carlos is moving to a new city next month.",
      "Write an email to Carlos. Wish him luck with the move. Ask about his new home. Offer to help in any way.",
    ],
    [
      "Your cousin is coming to visit you for the weekend.",
      "Write an email to your cousin. Welcome her. Suggest one thing to do together. Tell her what to bring.",
    ],
    [
      "Your neighbour looked after your plants while you were on holiday.",
      "Write an email to your neighbour. Thank them. Tell them one thing about your holiday. Invite them for dinner.",
    ],
    [
      "Your friend Maria just started a new job.",
      "Write an email to Maria. Congratulate her on the new job. Ask how it is going. Share some good news of your own.",
    ],
  ];

  // Part 2 — Formal reply (to an employer, business, or organisation)
  const part2Situations: [string, string][] = [
    [
      "You bought a jacket from an online shop but it arrived damaged.",
      "Write a complaint email to the shop. Describe the problem. Say what you want them to do. Ask for a quick reply.",
    ],
    [
      "You want to join an English evening class at City College.",
      "Write an email to the college. Ask about the schedule and cost. Explain why you want to join. Ask how to register.",
    ],
    [
      "You saw an advertisement for a part-time receptionist job at a local clinic.",
      "Write an email applying for the position. Say why you are interested. Describe your relevant skills. Ask about the next steps.",
    ],
    [
      "You want to volunteer at a local community centre on weekends.",
      "Write an email to the centre manager. Say you are interested in volunteering. Explain what skills you can offer. Ask about available roles.",
    ],
    [
      "Your heating has been broken for two weeks. Your landlord has not replied to your calls.",
      "Write an email to your landlord. Describe the problem. Explain how it is affecting you. Ask when it will be fixed.",
    ],
    [
      "You visited a restaurant last week and had a very bad experience — the food was cold and the service was slow.",
      "Write a complaint email to the restaurant manager. Describe what went wrong. Say how it affected your visit. Ask for compensation.",
    ],
  ];

  const s1 = part1Situations[setNum - 2] || part1Situations[0];
  const s2 = part2Situations[setNum - 2] || part2Situations[0];
  return [
    { id: `w${setNum}p1`, part: 1, points: 15, wordLimit: 50, situation: s1[0], task: s1[1] },
    { id: `w${setNum}p2`, part: 2, points: 15, wordLimit: 50, situation: s2[0], task: s2[1] },
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
      prepSeconds: 10, timeSeconds: 80, points: 10,
    },
    {
      id: `s${setNum}p5`, part: 5, partType: "leave_message", partLabel: "Part 5 — Leave a Message",
      instruction: "Read the notes carefully. You have 40 seconds to prepare. Then leave a voicemail message of at least one minute. Cover all points.",
      prompt: s.p5,
      prepSeconds: 40, timeSeconds: 60, points: 10,
    },
  ];
};

// ─── SET 2 READING (official 4+4+4+4+4) ──────────────────────────────────────
const set2Reading: Question[] = [
  // Part 1 – Short texts, choose the meaning (4 Qs)
  { id:"r2p1q1", type:"mcq", points:1, part:1, passage:"Notice: 'Personal Protective Equipment (PPE) must be worn when handling any bodily fluids. Gloves, apron and mask are available at the nurses' station.'", question:"What does this notice mean?", options:["Wear PPE when handling bodily fluids.","PPE is optional in care settings.","Only managers need to wear PPE.","PPE is only for hospital use."], answer:"Wear PPE when handling bodily fluids." },
  { id:"r2p1q2", type:"mcq", points:1, part:1, passage:"Sign: 'Medication must only be administered by authorised staff. Never give a resident another person's medication.'", question:"What does this sign mean?", options:["Any caregiver can give medication.","Only authorised staff can administer medication.","Residents can take their own medication.","Medication must be given twice daily."], answer:"Only authorised staff can administer medication." },
  { id:"r2p1q3", type:"mcq", points:1, part:1, passage:"Notice: 'Care plans must be reviewed every three months. Inform the senior nurse immediately if there is a significant change in a resident's condition.'", question:"What does this notice tell you?", options:["Wait for the three-month review before reporting changes.","Inform the senior nurse immediately if a resident's condition changes.","Update the care plan yourself if anything changes.","Care plans are reviewed once a year."], answer:"Inform the senior nurse immediately if a resident's condition changes." },
  { id:"r2p1q4", type:"mcq", points:1, part:1, passage:"Sign: 'No food or drinks in the medication room. Keep this area clean and free from contamination at all times.'", question:"What does this sign mean?", options:["Staff can eat lunch in the medication room.","Food and drinks must not be brought into the medication room.","Only water is allowed in the medication room.","Clean the medication room once a week."], answer:"Food and drinks must not be brought into the medication room." },
  // Part 2 – Complete the sentence (4 Qs)
  { id:"r2p2q1", type:"mcq", points:1, part:2, question:"The caregiver helped the resident ___ from the wheelchair to the bed.", options:["transfer","jump","fall","sleep"], answer:"transfer" },
  { id:"r2p2q2", type:"mcq", points:1, part:2, question:"The medication must be stored in a ___ cabinet at all times.", options:["open","locked","glass","broken"], answer:"locked" },
  { id:"r2p2q3", type:"mcq", points:1, part:2, question:"Residents with dementia may become ___ about the time and place.", options:["excited","angry","confused","sleepy"], answer:"confused" },
  { id:"r2p2q4", type:"mcq", points:1, part:2, question:"All incidents in the care home must be ___ in the incident book.", options:["ignored","shared","erased","recorded"], answer:"recorded" },
  // Part 3 – Complete the sentence extended (4 Qs)
  { id:"r2p3q1", type:"mcq", points:1, part:3, question:"Caregivers must ___ residents at least every two hours to prevent pressure sores.", options:["bathe","weigh","reposition","feed"], answer:"reposition" },
  { id:"r2p3q2", type:"mcq", points:1, part:3, question:"The morning handover meeting takes place at ___ AM each day.", options:["6","8","9","7"], answer:"7" },
  { id:"r2p3q3", type:"mcq", points:1, part:3, question:"Mrs. Kim was referred to the dietitian because she had ___ weight in two weeks.", options:["gained","checked","maintained","lost"], answer:"lost" },
  { id:"r2p3q4", type:"mcq", points:1, part:3, question:"When leaving an isolation room, always remove your gloves ___.", options:["last","with your mask","after the apron","first"], answer:"first" },
  // Part 4 – Complete the sentence advanced (4 Qs)
  { id:"r2p4q1", type:"mcq", points:1, part:4, question:"A pressure sore must be reported to the nurse ___ and recorded in the care plan.", options:["weekly","monthly","when convenient","immediately"], answer:"immediately" },
  { id:"r2p4q2", type:"mcq", points:1, part:4, question:"Electronic care records send an ___ to the nurse when a condition is marked urgent.", options:["email","alert","report","update"], answer:"alert" },
  { id:"r2p4q3", type:"mcq", points:1, part:4, question:"Manual handling training has ___ Daniel's back pain and made his work much easier.", options:["increased","caused","ignored","reduced"], answer:"reduced" },
  { id:"r2p4q4", type:"mcq", points:1, part:4, question:"All staff must keep personal mobile phones ___ in lockers during working hours.", options:["charged","displayed","switched on","stored"], answer:"stored" },
  // Part 5 – Longer text, comprehension (4 Qs, same passage)
  { id:"r2p5q1", type:"mcq", points:1, part:5, passage:"Pressure sores develop when skin and tissue are damaged by prolonged pressure, most commonly in people who cannot move easily. The most vulnerable areas are the heels, hips, elbows and lower back. Caregivers must reposition residents at least every two hours and check the skin regularly for redness or warmth. Pressure-relief mattresses, good nutrition and hydration also help reduce risk. Any signs of a pressure sore must be reported to the nurse immediately and recorded in the care plan.", question:"How often must residents be repositioned to prevent pressure sores?", options:["Every hour","Every four hours","Every two hours","Every six hours"], answer:"Every two hours" },
  { id:"r2p5q2", type:"mcq", points:1, part:5, passage:"Pressure sores develop when skin and tissue are damaged by prolonged pressure, most commonly in people who cannot move easily. The most vulnerable areas are the heels, hips, elbows and lower back. Caregivers must reposition residents at least every two hours and check the skin regularly for redness or warmth. Pressure-relief mattresses, good nutrition and hydration also help reduce risk. Any signs of a pressure sore must be reported to the nurse immediately and recorded in the care plan.", question:"What is an early sign of a pressure sore?", options:["Bleeding","Swelling","Redness or warmth","Bruising"], answer:"Redness or warmth" },
  { id:"r2p5q3", type:"mcq", points:1, part:5, passage:"Pressure sores develop when skin and tissue are damaged by prolonged pressure, most commonly in people who cannot move easily. The most vulnerable areas are the heels, hips, elbows and lower back. Caregivers must reposition residents at least every two hours and check the skin regularly for redness or warmth. Pressure-relief mattresses, good nutrition and hydration also help reduce risk. Any signs of a pressure sore must be reported to the nurse immediately and recorded in the care plan.", question:"What must happen when a pressure sore is noticed?", options:["Ask the resident to exercise","Wait for the next review","Apply cream and continue","Report to nurse and record it"], answer:"Report to nurse and record it" },
  { id:"r2p5q4", type:"mcq", points:1, part:5, passage:"Pressure sores develop when skin and tissue are damaged by prolonged pressure, most commonly in people who cannot move easily. The most vulnerable areas are the heels, hips, elbows and lower back. Caregivers must reposition residents at least every two hours and check the skin regularly for redness or warmth. Pressure-relief mattresses, good nutrition and hydration also help reduce risk. Any signs of a pressure sore must be reported to the nurse immediately and recorded in the care plan.", question:"Besides repositioning, what else helps prevent pressure sores?", options:["Exercise and sunlight","Cold compresses","Regular bathing","Good nutrition and hydration"], answer:"Good nutrition and hydration" },
];

// ─── SET 3 READING (official 4+4+4+4+4) ──────────────────────────────────────
const set3Reading: Question[] = [
  // Part 1 – Short texts, choose the meaning (4 Qs)
  { id:"r3p1q1", type:"mcq", points:1, part:1, passage:"Notice: 'Fall Risk. This resident is at high risk of falling. Ensure bed rails are up at night and the call bell is within reach at all times.'", question:"What does this notice mean?", options:["Residents can walk freely at night.","Bed rails are only needed during the day.","Keep bed rails up and call bell within reach for this resident.","The resident must stay in bed all day."], answer:"Keep bed rails up and call bell within reach for this resident." },
  { id:"r3p1q2", type:"mcq", points:1, part:1, passage:"Sign: 'Wet floor — Caution. Do not walk here until dry. Use the alternative route via the east corridor.'", question:"What does this sign tell you?", options:["Walk carefully on the wet floor.","Use the east corridor route while the floor is wet.","Wait for a caregiver to clean the floor first.","Only managers may use this area."], answer:"Use the east corridor route while the floor is wet." },
  { id:"r3p1q3", type:"mcq", points:1, part:1, passage:"Notice: 'Residents with dementia may become distressed if routines change suddenly. Follow each resident's individual care plan and inform the senior nurse of any unusual behaviour.'", question:"What does this notice advise?", options:["Change routines frequently to keep residents stimulated.","Follow the individual care plan and report unusual behaviour.","Leave dementia residents alone if they seem distressed.","All dementia residents follow the same care plan."], answer:"Follow the individual care plan and report unusual behaviour." },
  { id:"r3p1q4", type:"mcq", points:1, part:1, passage:"Sign: 'Do not attempt to lift a resident alone. Always use two staff members or the correct equipment. Single-person lifts are not permitted under any circumstances.'", question:"What does this sign mean?", options:["Two staff members or correct equipment are always required to lift a resident.","One trained caregiver can lift a resident alone.","Equipment is only needed for very heavy residents.","Single-person lifts are allowed in emergencies."], answer:"Two staff members or correct equipment are always required to lift a resident." },
  // Part 2 – Complete the sentence (4 Qs)
  { id:"r3p2q1", type:"mcq", points:1, part:2, question:"Residents who are at risk of falling should always wear ___ footwear.", options:["open","soft","old","non-slip"], answer:"non-slip" },
  { id:"r3p2q2", type:"mcq", points:1, part:2, question:"The caregiver noticed the resident seemed ___, so she sat with him and listened.", options:["happy","hungry","tired","distressed"], answer:"distressed" },
  { id:"r3p2q3", type:"mcq", points:1, part:2, question:"The nurse asked the caregiver to ___ the resident's fluid intake every two hours.", options:["ignore","reduce","monitor","guess"], answer:"monitor" },
  { id:"r3p2q4", type:"mcq", points:1, part:2, question:"A person with dementia may need extra ___ when they become confused or upset.", options:["food","medicine","exercise","reassurance"], answer:"reassurance" },
  // Part 3 – Complete the sentence extended (4 Qs)
  { id:"r3p3q1", type:"mcq", points:1, part:3, question:"Grace has worked as a caregiver for ___ years and specialises in dementia care.", options:["three","four","five","six"], answer:"six" },
  { id:"r3p3q2", type:"mcq", points:1, part:3, question:"A fall prevention risk assessment must be completed within ___ hours of a new resident's arrival.", options:["12","48","72","24"], answer:"24" },
  { id:"r3p3q3", type:"mcq", points:1, part:3, question:"High-risk residents receive a ___ wristband as a warning sign for falls.", options:["blue","green","yellow","red"], answer:"red" },
  { id:"r3p3q4", type:"mcq", points:1, part:3, question:"Residents at Bluebell Lodge can access the garden from 9 AM to ___ PM in summer.", options:["4","6","7","5"], answer:"5" },
  // Part 4 – Complete the sentence advanced (4 Qs)
  { id:"r3p4q1", type:"mcq", points:1, part:4, question:"The physiotherapist visits Greenview Care Home every ___ and Thursday.", options:["Monday","Wednesday","Friday","Tuesday"], answer:"Tuesday" },
  { id:"r3p4q2", type:"mcq", points:1, part:4, question:"Caregivers are expected to ___ the prescribed exercises with residents on non-physiotherapy days.", options:["stop","replace","ignore","continue"], answer:"continue" },
  { id:"r3p4q3", type:"mcq", points:1, part:4, question:"Residents with dementia may become distressed if their ___ change suddenly.", options:["meals","visitors","medication times","routines"], answer:"routines" },
  { id:"r3p4q4", type:"mcq", points:1, part:4, question:"Before helping a resident stand up, always check that the floor is ___ and clear.", options:["wet","warm","soft","dry"], answer:"dry" },
  // Part 5 – Longer text, comprehension (4 Qs, same passage)
  { id:"r3p5q1", type:"mcq", points:1, part:5, passage:"Dementia is a condition that affects memory, thinking, behaviour and the ability to perform everyday tasks. It is most common in people over 65, though it can affect younger people too. Alzheimer's disease is the most common type. Symptoms include forgetting names, repeating questions, confusion about time and place, and sometimes becoming agitated or withdrawn. Caregivers can help by using a calm tone, maintaining routines and offering reassurance. Activities such as music, reminiscence and gentle exercise are also known to be beneficial.", question:"What is the most common type of dementia?", options:["Vascular dementia","Frontotemporal dementia","Alzheimer's disease","Lewy body dementia"], answer:"Alzheimer's disease" },
  { id:"r3p5q2", type:"mcq", points:1, part:5, passage:"Dementia is a condition that affects memory, thinking, behaviour and the ability to perform everyday tasks. It is most common in people over 65, though it can affect younger people too. Alzheimer's disease is the most common type. Symptoms include forgetting names, repeating questions, confusion about time and place, and sometimes becoming agitated or withdrawn. Caregivers can help by using a calm tone, maintaining routines and offering reassurance. Activities such as music, reminiscence and gentle exercise are also known to be beneficial.", question:"What type of tone should caregivers use with dementia residents?", options:["Loud and clear","Firm and direct","Slow and formal","Calm"], answer:"Calm" },
  { id:"r3p5q3", type:"mcq", points:1, part:5, passage:"Dementia is a condition that affects memory, thinking, behaviour and the ability to perform everyday tasks. It is most common in people over 65, though it can affect younger people too. Alzheimer's disease is the most common type. Symptoms include forgetting names, repeating questions, confusion about time and place, and sometimes becoming agitated or withdrawn. Caregivers can help by using a calm tone, maintaining routines and offering reassurance. Activities such as music, reminiscence and gentle exercise are also known to be beneficial.", question:"Which activity is mentioned as beneficial for dementia residents?", options:["Cooking","Card games","Reading long texts","Music and reminiscence"], answer:"Music and reminiscence" },
  { id:"r3p5q4", type:"mcq", points:1, part:5, passage:"Dementia is a condition that affects memory, thinking, behaviour and the ability to perform everyday tasks. It is most common in people over 65, though it can affect younger people too. Alzheimer's disease is the most common type. Symptoms include forgetting names, repeating questions, confusion about time and place, and sometimes becoming agitated or withdrawn. Caregivers can help by using a calm tone, maintaining routines and offering reassurance. Activities such as music, reminiscence and gentle exercise are also known to be beneficial.", question:"Which behaviour is listed as a symptom of dementia?", options:["Sleeping too much","Speaking very loudly","Refusing all food","Repeating questions"], answer:"Repeating questions" },
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

// ─── SET 4 LISTENING — Medication Safety ─────────────────────────────────────
const set4Listening: ListeningQuestion[] = [
  { id:"l4p1q1", part:1, points:1, type:"mcq", transcript:"Nurse: 'Mr. Kim has been given the wrong dose of his blood thinner this morning. Can you check the medication chart and let me know what it says?'", question:"What is the best reply?", options:["Of course — I'll check the chart straight away and come back to you.", "I didn't give it so it's not my fault.", "Ask the pharmacist.", "I'll check it later."], answer:"Of course — I'll check the chart straight away and come back to you." },
  { id:"l4p1q2", part:1, points:1, type:"mcq", transcript:"Resident: 'These tablets look different from the ones I usually take. Are you sure they're mine?'", question:"What is the best reply?", options:["Thank you for checking. Let me verify your name on the chart before I give them to you.", "They are fine — just take them.", "All tablets look different sometimes.", "Ask the nurse."], answer:"Thank you for checking. Let me verify your name on the chart before I give them to you." },
  { id:"l4p1q3", part:1, points:1, type:"mcq", transcript:"Senior caregiver: 'Have you signed the medication administration record after giving Mrs. Park her morning tablets?'", question:"What is the best reply?", options:["Not yet — I'll sign it right now. Thank you for reminding me.", "I'll sign it at the end of the shift.", "I forgot — does it matter?", "Someone else can sign it."], answer:"Not yet — I'll sign it right now. Thank you for reminding me." },
  { id:"l4p1q4", part:1, points:1, type:"mcq", transcript:"Manager: 'We've had a complaint that a resident's medication was given 45 minutes late today. Can you explain what happened?'", question:"What is the best reply?", options:["I'm sorry — I was covering two wards. I'll document it and make sure it doesn't happen again.", "It was not my fault.", "The resident didn't want it earlier.", "I gave it on time."], answer:"I'm sorry — I was covering two wards. I'll document it and make sure it doesn't happen again." },
  { id:"l4p2q1", part:2, points:5, type:"ordering",
    transcript: "Medication safety training: 'Before giving any medication, always follow these steps. First, wash your hands. Second, check the resident's full name and date of birth against the medication chart. Third, check the medication name, dose, and expiry date. Fourth, explain to the resident what the medication is for. Finally, give the medication, watch the resident take it, and sign the administration record.'",
    question: "Put these medication administration steps in the correct order.",
    items: ["Sign the administration record","Check the resident's name and date of birth","Wash your hands","Explain what the medication is for","Check the medication name and dose"],
    correctOrder: ["Wash your hands","Check the resident's name and date of birth","Check the medication name and dose","Explain what the medication is for","Sign the administration record"],
    options: [], answer: "ordered" },
  { id:"l4p3q1", part:3, points:1, type:"fill", transcript:"Nurse: 'All controlled drugs must be counted and checked by two members of staff at the start and end of every shift. Never give controlled drugs alone.'", question:"Controlled drugs must be counted by ___ members of staff.", options:[], answer:"two" },
  { id:"l4p3q2", part:3, points:1, type:"fill", transcript:"Nurse: 'Mrs. Thompson's antibiotic must be given with food to prevent stomach upset. Please make sure she has eaten before you give it.'", question:"Mrs. Thompson's antibiotic must be given with ___.", options:[], answer:"food" },
  { id:"l4p3q3", part:3, points:1, type:"fill", transcript:"Manager: 'Any medication error — even a near-miss — must be reported immediately to the nurse in charge and recorded on an incident form. Do not wait until the end of the shift.'", question:"A medication error must be reported ___ to the nurse in charge.", options:[], answer:"immediately" },
  { id:"l4p3q4", part:3, points:1, type:"fill", transcript:"Nurse: 'Mr. Patel refused his evening medication today. This must be documented in the medication administration record and the reason noted if he gives one.'", question:"A medication refusal must be recorded in the administration ___.", options:[], answer:"record" },
  { id:"l4p4q1", part:4, points:1, type:"mcq", transcript:"Diabetes Care Briefing: 'For residents with diabetes, check blood sugar levels before meals. A reading below 4 means hypoglycaemia. Give 15 grams of fast-acting sugar — for example, a small glass of fruit juice or three glucose tablets. Wait 15 minutes and check again. If the reading is still below 4, repeat. Always inform the nurse and document the reading and action taken.'", question:"When should blood sugar levels be checked?", options:["After meals","Before meals","At bedtime only","Every two hours"], answer:"Before meals" },
  { id:"l4p4q2", part:4, points:1, type:"mcq", transcript:"Diabetes Care Briefing: 'For residents with diabetes, check blood sugar levels before meals. A reading below 4 means hypoglycaemia. Give 15 grams of fast-acting sugar — for example, a small glass of fruit juice or three glucose tablets. Wait 15 minutes and check again. If the reading is still below 4, repeat. Always inform the nurse and document the reading and action taken.'", question:"What blood sugar reading indicates hypoglycaemia?", options:["Below 6","Below 5","Below 4","Below 3"], answer:"Below 4" },
  { id:"l4p4q3", part:4, points:1, type:"mcq", transcript:"Diabetes Care Briefing: 'For residents with diabetes, check blood sugar levels before meals. A reading below 4 means hypoglycaemia. Give 15 grams of fast-acting sugar — for example, a small glass of fruit juice or three glucose tablets. Wait 15 minutes and check again. If the reading is still below 4, repeat. Always inform the nurse and document the reading and action taken.'", question:"How long should you wait before checking blood sugar again after giving sugar?", options:["5 minutes","10 minutes","15 minutes","30 minutes"], answer:"15 minutes" },
  { id:"l4p4q4", part:4, points:1, type:"mcq", transcript:"Diabetes Care Briefing: 'For residents with diabetes, check blood sugar levels before meals. A reading below 4 means hypoglycaemia. Give 15 grams of fast-acting sugar — for example, a small glass of fruit juice or three glucose tablets. Wait 15 minutes and check again. If the reading is still below 4, repeat. Always inform the nurse and document the reading and action taken.'", question:"What should you always do after treating hypoglycaemia?", options:["Give more sugar","Inform the nurse and document the reading","Ask the family","Wait an hour"], answer:"Inform the nurse and document the reading" },
  { id:"l4p5q1", part:5, points:1, type:"mcq", transcript:"Night Shift Handover: 'Good evening. Key points for tonight: Mrs. Martinez in Room 12 has been started on a new sleep medication — she may be drowsy in the morning, so wake her gently. Mr. Singh in Room 4 had a fall this afternoon — he is on one-hour observations and his call bell must be answered within 2 minutes. Mrs. Obi in Room 7 has refused all food and fluids today — document every offer and refusal on her monitoring sheet. If she still refuses by midnight, call the on-call nurse.'", question:"Why might Mrs. Martinez be drowsy in the morning?", options:["She stayed up late","She has been started on new sleep medication","She refused her dinner","She is unwell"], answer:"She has been started on new sleep medication" },
  { id:"l4p5q2", part:5, points:1, type:"mcq", transcript:"Night Shift Handover: 'Good evening. Key points for tonight: Mrs. Martinez in Room 12 has been started on a new sleep medication — she may be drowsy in the morning, so wake her gently. Mr. Singh in Room 4 had a fall this afternoon — he is on one-hour observations and his call bell must be answered within 2 minutes. Mrs. Obi in Room 7 has refused all food and fluids today — document every offer and refusal on her monitoring sheet. If she still refuses by midnight, call the on-call nurse.'", question:"How quickly must Mr. Singh's call bell be answered?", options:["Within 1 minute","Within 2 minutes","Within 5 minutes","Within 10 minutes"], answer:"Within 2 minutes" },
  { id:"l4p5q3", part:5, points:1, type:"mcq", transcript:"Night Shift Handover: 'Good evening. Key points for tonight: Mrs. Martinez in Room 12 has been started on a new sleep medication — she may be drowsy in the morning, so wake her gently. Mr. Singh in Room 4 had a fall this afternoon — he is on one-hour observations and his call bell must be answered within 2 minutes. Mrs. Obi in Room 7 has refused all food and fluids today — document every offer and refusal on her monitoring sheet. If she still refuses by midnight, call the on-call nurse.'", question:"What should be recorded for Mrs. Obi?", options:["Her blood pressure every hour","Every offer and refusal of food and fluids","Her medication times","Her room temperature"], answer:"Every offer and refusal of food and fluids" },
  { id:"l4p5q4", part:5, points:1, type:"mcq", transcript:"Caregiver report: 'I found Mr. Jackson's medication still in his cup at 9:30 PM. He told me he had hidden it under his tongue earlier and spat it out when I left the room. I informed the nurse immediately and documented the incident. The nurse will review his medication form and may call the GP.'", question:"Why was Mr. Jackson's medication still in his cup?", options:["He forgot to take it","He was asleep","He hid it under his tongue and spat it out","He gave it to another resident"], answer:"He hid it under his tongue and spat it out" },
];

// ─── SET 5 LISTENING — Personal Care & Dignity ───────────────────────────────
const set5Listening: ListeningQuestion[] = [
  { id:"l5p1q1", part:1, points:1, type:"mcq", transcript:"Senior caregiver: 'Mrs. Novak has asked not to be assisted with personal care by male carers. Have you noted this in her care plan?'", question:"What is the best reply?", options:["Yes, it is recorded and I have passed it on to the team.", "That is not possible to accommodate.", "She should not have preferences like that.", "I'll tell her it's not possible."], answer:"Yes, it is recorded and I have passed it on to the team." },
  { id:"l5p1q2", part:1, points:1, type:"mcq", transcript:"Resident: 'I don't want you to open the curtains while you help me get dressed. I like my privacy.'", question:"What is the best reply?", options:["Of course — I'll keep the curtains closed. Your privacy is important to us.", "But we need the light.", "I always open the curtains — it is the rule.", "I'll just be quick."], answer:"Of course — I'll keep the curtains closed. Your privacy is important to us." },
  { id:"l5p1q3", part:1, points:1, type:"mcq", transcript:"Nurse: 'Mr. Dube's skin assessment showed a new pressure sore on his heel. Can you make sure he is repositioned every two hours?'", question:"What is the best reply?", options:["Understood — I'll add him to the repositioning schedule and record each turn.", "I'll do it when I have time.", "He prefers not to be moved.", "Two hours is too frequent."], answer:"Understood — I'll add him to the repositioning schedule and record each turn." },
  { id:"l5p1q4", part:1, points:1, type:"mcq", transcript:"Colleague: 'Mrs. Hassan keeps calling out at night. Her family says she used to listen to music to help her sleep. Should we try that?'", question:"What is the best reply?", options:["That's a good idea — let me check with the nurse and add it to her care plan.", "Music would disturb the other residents.", "Her family should not interfere.", "I'll ask the manager next week."], answer:"That's a good idea — let me check with the nurse and add it to her care plan." },
  { id:"l5p2q1", part:2, points:5, type:"ordering",
    transcript: "Personal care training: 'When assisting a resident with a shower, follow this order. First, explain what you are going to do and ask for their consent. Second, check the water temperature before the resident steps in. Third, close the door to ensure privacy throughout. Fourth, hand the resident items they can manage themselves to promote independence. Finally, help dry and dress them and check their skin for any redness or sores.'",
    question: "Put these shower assistance steps in the correct order.",
    items: ["Close the door to ensure privacy","Explain and ask for consent","Help dry and dress them and check skin","Check the water temperature","Hand the resident items they can manage"],
    correctOrder: ["Explain and ask for consent","Check the water temperature","Close the door to ensure privacy","Hand the resident items they can manage","Help dry and dress them and check skin"],
    options: [], answer: "ordered" },
  { id:"l5p3q1", part:3, points:1, type:"fill", transcript:"Manager: 'Always knock and wait for a response before entering any resident's room. Even if the door is open, this shows respect for their personal space.'", question:"Always knock and ___ for a response before entering.", options:[], answer:"wait" },
  { id:"l5p3q2", part:3, points:1, type:"fill", transcript:"Nurse: 'Mr. Okafor has a tissue viability concern. His sacrum should be checked every four hours and a repositioning chart completed each time he is turned.'", question:"Mr. Okafor's sacrum should be checked every ___ hours.", options:[], answer:"four" },
  { id:"l5p3q3", part:3, points:1, type:"fill", transcript:"Senior caregiver: 'When helping a resident to eat, always sit down at their level. Never stand over them — it can feel disrespectful and may affect how well they eat.'", question:"When helping residents eat, always sit at their ___.", options:[], answer:"level" },
  { id:"l5p3q4", part:3, points:1, type:"fill", transcript:"Manager: 'Any resident who refuses personal care must have their refusal recorded, and the team must try again later and document that attempt too.'", question:"A refusal of personal care must always be ___.", options:[], answer:"recorded" },
  { id:"l5p4q1", part:4, points:1, type:"mcq", transcript:"Dementia Care Briefing: 'Residents with dementia may become confused or anxious, especially in the late afternoon — sometimes called sundowning. Approach calmly, use simple short sentences, and maintain eye contact. Do not argue or correct them if they say something untrue — this increases distress. Use distraction — a familiar activity, music, or a favourite object. If behaviour becomes very challenging, do not restrain — call for support immediately and document the episode.'", question:"What time of day are dementia residents most likely to become confused?", options:["Early morning","Late afternoon","After meals","During the night"], answer:"Late afternoon" },
  { id:"l5p4q2", part:4, points:1, type:"mcq", transcript:"Dementia Care Briefing: 'Residents with dementia may become confused or anxious, especially in the late afternoon — sometimes called sundowning. Approach calmly, use simple short sentences, and maintain eye contact. Do not argue or correct them if they say something untrue — this increases distress. Use distraction — a familiar activity, music, or a favourite object. If behaviour becomes very challenging, do not restrain — call for support immediately and document the episode.'", question:"What should you do if a resident with dementia says something untrue?", options:["Correct them clearly","Argue politely","Do not argue or correct them","Ask another resident"], answer:"Do not argue or correct them" },
  { id:"l5p4q3", part:4, points:1, type:"mcq", transcript:"Dementia Care Briefing: 'Residents with dementia may become confused or anxious, especially in the late afternoon — sometimes called sundowning. Approach calmly, use simple short sentences, and maintain eye contact. Do not argue or correct them if they say something untrue — this increases distress. Use distraction — a familiar activity, music, or a favourite object. If behaviour becomes very challenging, do not restrain — call for support immediately and document the episode.'", question:"Which of these is suggested as a distraction technique?", options:["Medication","A familiar activity, music, or a favourite object","Moving them to a different room","Turning off the lights"], answer:"A familiar activity, music, or a favourite object" },
  { id:"l5p4q4", part:4, points:1, type:"mcq", transcript:"Dementia Care Briefing: 'Residents with dementia may become confused or anxious, especially in the late afternoon — sometimes called sundowning. Approach calmly, use simple short sentences, and maintain eye contact. Do not argue or correct them if they say something untrue — this increases distress. Use distraction — a familiar activity, music, or a favourite object. If behaviour becomes very challenging, do not restrain — call for support immediately and document the episode.'", question:"What must you never do if a resident's behaviour becomes very challenging?", options:["Call for support","Document the episode","Restrain the resident","Use distraction"], answer:"Restrain the resident" },
  { id:"l5p5q1", part:5, points:1, type:"mcq", transcript:"Family Communication Briefing: 'When a resident's family calls, always be warm and professional. If they ask for clinical information — test results, diagnosis changes, or medication updates — you must not share this yourself. Politely explain that only the nurse or doctor in charge can give clinical information. Take the family member's name and phone number and pass the message to the nurse straight away. If a family member becomes angry or upset, remain calm. Do not raise your voice. If the situation escalates, ask a senior colleague to step in.'", question:"What should you do if a family member asks for clinical information?", options:["Give them a brief summary","Tell them only the nurse or doctor can share clinical information","Ask them to call back later","Read from the care notes"], answer:"Tell them only the nurse or doctor can share clinical information" },
  { id:"l5p5q2", part:5, points:1, type:"mcq", transcript:"Family Communication Briefing: 'When a resident's family calls, always be warm and professional. If they ask for clinical information — test results, diagnosis changes, or medication updates — you must not share this yourself. Politely explain that only the nurse or doctor in charge can give clinical information. Take the family member's name and phone number and pass the message to the nurse straight away. If a family member becomes angry or upset, remain calm. Do not raise your voice. If the situation escalates, ask a senior colleague to step in.'", question:"What should you take from a family member who calls?", options:["Their address","Their name and phone number","Their relationship to the resident","Their email address"], answer:"Their name and phone number" },
  { id:"l5p5q3", part:5, points:1, type:"mcq", transcript:"Family Communication Briefing: 'When a resident's family calls, always be warm and professional. If they ask for clinical information — test results, diagnosis changes, or medication updates — you must not share this yourself. Politely explain that only the nurse or doctor in charge can give clinical information. Take the family member's name and phone number and pass the message to the nurse straight away. If a family member becomes angry or upset, remain calm. Do not raise your voice. If the situation escalates, ask a senior colleague to step in.'", question:"What should you do if a family member becomes very angry?", options:["Raise your voice to match theirs","End the call immediately","Ask a senior colleague to step in","Give them the information they want"], answer:"Ask a senior colleague to step in" },
  { id:"l5p5q4", part:5, points:1, type:"mcq", transcript:"Caregiver: 'Mrs. Lee told me today she has been feeling lonely since her roommate left last month. She asked if she could be moved closer to the lounge so she has more company during the day. I've added this to her daily notes and will mention it at the next care review.'", question:"What did Mrs. Lee ask for?", options:["A new roommate","To call her family more often","To move closer to the lounge","To join a different activity"], answer:"To move closer to the lounge" },
];

// ─── SET 6 LISTENING — Emergencies & First Aid ───────────────────────────────
const set6Listening: ListeningQuestion[] = [
  { id:"l6p1q1", part:1, points:1, type:"mcq", transcript:"Colleague: 'Mr. Adeyemi has just choked on his food but he is coughing hard and can still speak. What should we do?'", question:"What is the best reply?", options:["If he can cough and speak, encourage him to keep coughing and stay with him.", "Give him water immediately.", "Turn him upside down.", "Call 999 straight away."], answer:"If he can cough and speak, encourage him to keep coughing and stay with him." },
  { id:"l6p1q2", part:1, points:1, type:"mcq", transcript:"Manager: 'The fire alarm has just been tested. All staff must know the location of the assembly point. Do you know where it is?'", question:"What is the best reply?", options:["Yes — it is in the car park at the front of the building.", "I think it's somewhere outside.", "I've never checked.", "Ask the fire warden."], answer:"Yes — it is in the car park at the front of the building." },
  { id:"l6p1q3", part:1, points:1, type:"mcq", transcript:"Nurse: 'Mrs. Fernandez has pressed her emergency buzzer and says she feels very short of breath. Can you go to her immediately?'", question:"What is the best reply?", options:["I'm on my way — I'll stay with her and call for you if I need support.", "I'll go in a few minutes.", "She often does that.", "Ask another caregiver."], answer:"I'm on my way — I'll stay with her and call for you if I need support." },
  { id:"l6p1q4", part:1, points:1, type:"mcq", transcript:"Senior caregiver: 'We had a near-miss this morning — a wet floor with no warning sign. Did you see who mopped it?'", question:"What is the best reply?", options:["I think it was the cleaner. I'll report it and put up a sign straight away.", "It dries quickly — it's fine.", "It wasn't my area.", "I'll mention it at the next meeting."], answer:"I think it was the cleaner. I'll report it and put up a sign straight away." },
  { id:"l6p2q1", part:2, points:5, type:"ordering",
    transcript: "Falls response training: 'When you find a resident on the floor, always follow these steps. First, stay calm and do not move the resident. Second, check if they are conscious and can respond to you. Third, press the emergency buzzer or call for help. Fourth, stay with the resident and reassure them until help arrives. Finally, once the nurse has assessed the resident, complete an incident report.'",
    question: "Put these steps for responding to a fall in the correct order.",
    items: ["Press the emergency buzzer","Stay calm and do not move the resident","Complete an incident report","Check if the resident is conscious","Stay and reassure the resident"],
    correctOrder: ["Stay calm and do not move the resident","Check if the resident is conscious","Press the emergency buzzer","Stay and reassure the resident","Complete an incident report"],
    options: [], answer: "ordered" },
  { id:"l6p3q1", part:3, points:1, type:"fill", transcript:"Manager: 'All staff must know where the defibrillator is kept. It is located in the reception area next to the main entrance. Please check it every morning.'", question:"The defibrillator is located in the ___ area.", options:[], answer:"reception" },
  { id:"l6p3q2", part:3, points:1, type:"fill", transcript:"Nurse: 'If a resident has a seizure, do not hold them down or put anything in their mouth. Time the seizure and call for help immediately.'", question:"During a seizure, do not ___ the resident down.", options:[], answer:"hold" },
  { id:"l6p3q3", part:3, points:1, type:"fill", transcript:"Fire safety trainer: 'In a fire, remember RACE — Rescue, Alarm, Contain, Evacuate. The most important first step is to rescue any resident in immediate danger.'", question:"The first step in RACE is to ___ any resident in danger.", options:[], answer:"Rescue" },
  { id:"l6p3q4", part:3, points:1, type:"fill", transcript:"Senior caregiver: 'The evacuation chair is stored on the second floor next to the lift. Only trained staff may use it. It is for residents who cannot use the stairs.'", question:"The evacuation chair is for residents who cannot use the ___.", options:[], answer:"stairs" },
  { id:"l6p4q1", part:4, points:1, type:"mcq", transcript:"Choking Response Briefing: 'If a resident is choking and cannot cough, speak, or breathe, act immediately. Stand behind them, lean them slightly forward, and give up to five firm back blows between the shoulder blades. If this does not clear the blockage, perform up to five abdominal thrusts — place your fist above the navel and pull sharply inward and upward. If the blockage is still not cleared, call 999 and continue cycles of five back blows and five abdominal thrusts. Always report and document any choking incident, even if resolved.'", question:"Where should you give back blows?", options:["On the chest","Between the shoulder blades","On the lower back","On the upper arms"], answer:"Between the shoulder blades" },
  { id:"l6p4q2", part:4, points:1, type:"mcq", transcript:"Choking Response Briefing: 'If a resident is choking and cannot cough, speak, or breathe, act immediately. Stand behind them, lean them slightly forward, and give up to five firm back blows between the shoulder blades. If this does not clear the blockage, perform up to five abdominal thrusts — place your fist above the navel and pull sharply inward and upward. If the blockage is still not cleared, call 999 and continue cycles of five back blows and five abdominal thrusts. Always report and document any choking incident, even if resolved.'", question:"Where should you place your fist for abdominal thrusts?", options:["Above the chest","Below the navel","Above the navel","On the lower ribs"], answer:"Above the navel" },
  { id:"l6p4q3", part:4, points:1, type:"mcq", transcript:"Choking Response Briefing: 'If a resident is choking and cannot cough, speak, or breathe, act immediately. Stand behind them, lean them slightly forward, and give up to five firm back blows between the shoulder blades. If this does not clear the blockage, perform up to five abdominal thrusts — place your fist above the navel and pull sharply inward and upward. If the blockage is still not cleared, call 999 and continue cycles of five back blows and five abdominal thrusts. Always report and document any choking incident, even if resolved.'", question:"What should you do if back blows do not clear the blockage?", options:["Call 999 immediately","Give water","Perform abdominal thrusts","Lay the resident down"], answer:"Perform abdominal thrusts" },
  { id:"l6p4q4", part:4, points:1, type:"mcq", transcript:"Choking Response Briefing: 'If a resident is choking and cannot cough, speak, or breathe, act immediately. Stand behind them, lean them slightly forward, and give up to five firm back blows between the shoulder blades. If this does not clear the blockage, perform up to five abdominal thrusts — place your fist above the navel and pull sharply inward and upward. If the blockage is still not cleared, call 999 and continue cycles of five back blows and five abdominal thrusts. Always report and document any choking incident, even if resolved.'", question:"What should you always do after any choking incident?", options:["Give the resident a drink","Move the resident to their room","Report and document it","Complete the fire log"], answer:"Report and document it" },
  { id:"l6p5q1", part:5, points:1, type:"mcq", transcript:"Fire Evacuation Briefing: 'In the event of a fire, do not use the lifts. Assist residents to the nearest fire exit using the posted evacuation route. If a resident cannot walk, use the evacuation chair — only trained staff may do this. Close all doors behind you as you evacuate — this slows the spread of smoke and fire. At the assembly point, account for every resident on your list. Do not re-enter the building until the fire officer gives the all-clear. If you cannot evacuate a resident, move them to a refuge area and contact the fire brigade.'", question:"Why should doors be closed during evacuation?", options:["To protect residents' belongings","To slow the spread of smoke and fire","To prevent residents from going back","To reduce noise"], answer:"To slow the spread of smoke and fire" },
  { id:"l6p5q2", part:5, points:1, type:"mcq", transcript:"Fire Evacuation Briefing: 'In the event of a fire, do not use the lifts. Assist residents to the nearest fire exit using the posted evacuation route. If a resident cannot walk, use the evacuation chair — only trained staff may do this. Close all doors behind you as you evacuate — this slows the spread of smoke and fire. At the assembly point, account for every resident on your list. Do not re-enter the building until the fire officer gives the all-clear. If you cannot evacuate a resident, move them to a refuge area and contact the fire brigade.'", question:"Who may use the evacuation chair?", options:["All care staff","Only senior nurses","Only trained staff","The fire brigade"], answer:"Only trained staff" },
  { id:"l6p5q3", part:5, points:1, type:"mcq", transcript:"Fire Evacuation Briefing: 'In the event of a fire, do not use the lifts. Assist residents to the nearest fire exit using the posted evacuation route. If a resident cannot walk, use the evacuation chair — only trained staff may do this. Close all doors behind you as you evacuate — this slows the spread of smoke and fire. At the assembly point, account for every resident on your list. Do not re-enter the building until the fire officer gives the all-clear. If you cannot evacuate a resident, move them to a refuge area and contact the fire brigade.'", question:"What should you do if you cannot evacuate a resident?", options:["Leave them and come back","Ask another resident to help","Move them to a refuge area and contact the fire brigade","Wait for the fire to pass"], answer:"Move them to a refuge area and contact the fire brigade" },
  { id:"l6p5q4", part:5, points:1, type:"mcq", transcript:"Nurse: 'This afternoon Mr. Wu experienced a sudden drop in blood pressure. He became pale, dizzy and nearly fainted during his walk to the lounge. We helped him safely to the floor, raised his legs, and called the GP. He has now recovered and is resting. Please monitor him every 30 minutes and record his blood pressure on the observation chart.'", question:"How often should Mr. Wu be monitored?", options:["Every 15 minutes","Every 30 minutes","Every hour","Every two hours"], answer:"Every 30 minutes" },
];

// ─── SET 7 LISTENING — End of Life & Professional Development ─────────────────
const set7Listening: ListeningQuestion[] = [
  { id:"l7p1q1", part:1, points:1, type:"mcq", transcript:"Senior caregiver: 'Mr. Gibson is in the final stages of his illness. His family is with him now. How can we best support them?'", question:"What is the best reply?", options:["I'll make sure they have a comfortable space, offer them tea, and let the nurse know they're here.", "Tell them visiting hours are over.", "Ask them to wait outside.", "I'll call the manager."], answer:"I'll make sure they have a comfortable space, offer them tea, and let the nurse know they're here." },
  { id:"l7p1q2", part:1, points:1, type:"mcq", transcript:"Nurse: 'You have a supervision meeting with the manager at 2 PM today. Please bring your reflective journal and any training certificates.'", question:"What is the best reply?", options:["Thank you for reminding me — I'll have everything ready before 2 PM.", "I forgot about that meeting.", "I don't have a reflective journal.", "Can I reschedule?"], answer:"Thank you for reminding me — I'll have everything ready before 2 PM." },
  { id:"l7p1q3", part:1, points:1, type:"mcq", transcript:"Resident's daughter: 'I'm worried that my mother isn't being repositioned often enough. She has marks on her skin.'", question:"What is the best reply?", options:["I'm very sorry to hear that. Let me speak to the nurse right now and review her care plan together.", "She is fine — do not worry.", "That is not my responsibility.", "I'll mention it at the next staff meeting."], answer:"I'm very sorry to hear that. Let me speak to the nurse right now and review her care plan together." },
  { id:"l7p1q4", part:1, points:1, type:"mcq", transcript:"Manager: 'Your probation period ends next month. I'd like to discuss your progress and development goals. Can you prepare a short self-assessment?'", question:"What is the best reply?", options:["Yes — I'll write my self-assessment and bring it to our meeting.", "I don't know what to write.", "Is that necessary?", "I'll do it on the day."], answer:"Yes — I'll write my self-assessment and bring it to our meeting." },
  { id:"l7p2q1", part:2, points:5, type:"ordering",
    transcript: "Handover report training: 'When writing your shift handover report, follow this structure. First, record the date, your name, and the shift time. Second, note any changes in a resident's condition since the last handover. Third, record any medication given, refused, or omitted and the reason. Fourth, note any incidents or near-misses, even if minor. Finally, sign and date the report and hand it to the next shift caregiver in person.'",
    question: "Put the handover report steps in the correct order.",
    items: ["Sign and date the report","Note any incidents or near-misses","Record your name and shift time","Note any changes in residents' conditions","Record any medication given or refused"],
    correctOrder: ["Record your name and shift time","Note any changes in residents' conditions","Record any medication given or refused","Note any incidents or near-misses","Sign and date the report"],
    options: [], answer: "ordered" },
  { id:"l7p3q1", part:3, points:1, type:"fill", transcript:"Training facilitator: 'Every caregiver must complete a mandatory annual appraisal with their line manager. This is your opportunity to discuss your progress, goals, and any training needs.'", question:"The mandatory appraisal must be completed every ___.", options:[], answer:"year" },
  { id:"l7p3q2", part:3, points:1, type:"fill", transcript:"Senior caregiver: 'In palliative care, always follow the resident's advance care plan. If they have a Do Not Resuscitate order in place, this must be respected and clearly documented.'", question:"A Do Not Resuscitate order must be clearly ___.", options:[], answer:"documented" },
  { id:"l7p3q3", part:3, points:1, type:"fill", transcript:"Manager: 'All staff who identify a training need must log it in the training register by the end of the month. This helps us plan the right courses for the team.'", question:"Training needs must be logged in the training ___ by the end of the month.", options:[], answer:"register" },
  { id:"l7p3q4", part:3, points:1, type:"fill", transcript:"Nurse: 'Mrs. Reyes passed away peacefully this morning. Her body must remain undisturbed until the doctor has confirmed the death and the family are ready.'", question:"The body must remain undisturbed until the ___ has confirmed the death.", options:[], answer:"doctor" },
  { id:"l7p4q1", part:4, points:1, type:"mcq", transcript:"Cultural Sensitivity Briefing: 'Every resident comes from a unique cultural background and our care must reflect this. Before carrying out personal care, check the care plan for any religious or cultural preferences — for example, some residents require same-gender carers, specific prayer times must be respected, and some residents follow dietary laws. Never assume — always ask the resident or their family. If you are unsure about a cultural need, speak to your manager rather than guessing. Document any preferences clearly so all staff are aware.'", question:"Where should you check for a resident's cultural preferences?", options:["In the visitor log","In the care plan","At the nurses' station","From other residents"], answer:"In the care plan" },
  { id:"l7p4q2", part:4, points:1, type:"mcq", transcript:"Cultural Sensitivity Briefing: 'Every resident comes from a unique cultural background and our care must reflect this. Before carrying out personal care, check the care plan for any religious or cultural preferences — for example, some residents require same-gender carers, specific prayer times must be respected, and some residents follow dietary laws. Never assume — always ask the resident or their family. If you are unsure about a cultural need, speak to your manager rather than guessing. Document any preferences clearly so all staff are aware.'", question:"What should you do if you are unsure about a cultural need?", options:["Guess and apologise later","Skip the care task","Speak to your manager","Ask other residents"], answer:"Speak to your manager" },
  { id:"l7p4q3", part:4, points:1, type:"mcq", transcript:"Cultural Sensitivity Briefing: 'Every resident comes from a unique cultural background and our care must reflect this. Before carrying out personal care, check the care plan for any religious or cultural preferences — for example, some residents require same-gender carers, specific prayer times must be respected, and some residents follow dietary laws. Never assume — always ask the resident or their family. If you are unsure about a cultural need, speak to your manager rather than guessing. Document any preferences clearly so all staff are aware.'", question:"Why is it important to document cultural preferences?", options:["To reduce paperwork","So all staff are aware","For the inspection report","To share with families only"], answer:"So all staff are aware" },
  { id:"l7p4q4", part:4, points:1, type:"mcq", transcript:"Cultural Sensitivity Briefing: 'Every resident comes from a unique cultural background and our care must reflect this. Before carrying out personal care, check the care plan for any religious or cultural preferences — for example, some residents require same-gender carers, specific prayer times must be respected, and some residents follow dietary laws. Never assume — always ask the resident or their family. If you are unsure about a cultural need, speak to your manager rather than guessing. Document any preferences clearly so all staff are aware.'", question:"What is mentioned as an example of a cultural preference?", options:["Preferred television shows","Specific prayer times","Preferred meal portions","Choice of room colour"], answer:"Specific prayer times" },
  { id:"l7p5q1", part:5, points:1, type:"mcq", transcript:"Staff Development Meeting: 'Welcome everyone. Our medication error rate has reduced by 40% this year, and resident satisfaction scores are the highest since we opened. Several of you have completed your NVQ Level 2 — well done. Looking ahead, we will introduce a new digital care recording system in January. Training will be in December — attendance is mandatory. Please inform your line manager of any scheduling conflicts as soon as possible.'", question:"By how much did medication errors reduce?", options:["20%","30%","40%","50%"], answer:"40%" },
  { id:"l7p5q2", part:5, points:1, type:"mcq", transcript:"Staff Development Meeting: 'Welcome everyone. Our medication error rate has reduced by 40% this year, and resident satisfaction scores are the highest since we opened. Several of you have completed your NVQ Level 2 — well done. Looking ahead, we will introduce a new digital care recording system in January. Training will be in December — attendance is mandatory. Please inform your line manager of any scheduling conflicts as soon as possible.'", question:"What qualification did several staff members complete?", options:["NVQ Level 1","NVQ Level 2","NVQ Level 3","A first aid certificate"], answer:"NVQ Level 2" },
  { id:"l7p5q3", part:5, points:1, type:"mcq", transcript:"Staff Development Meeting: 'Welcome everyone. Our medication error rate has reduced by 40% this year, and resident satisfaction scores are the highest since we opened. Several of you have completed your NVQ Level 2 — well done. Looking ahead, we will introduce a new digital care recording system in January. Training will be in December — attendance is mandatory. Please inform your line manager of any scheduling conflicts as soon as possible.'", question:"When will training for the new system take place?", options:["November","December","January","February"], answer:"December" },
  { id:"l7p5q4", part:5, points:1, type:"mcq", transcript:"Caregiver reflective note: 'Today I made a mistake — I gave Mrs. Afolabi her lunch before confirming her texture-modified diet. Fortunately the food was soft and she was fine. I reported it to the nurse, completed an incident form, and reviewed her care plan carefully. I have learned to always check the care plan before preparing or serving food.'", question:"What did the caregiver do after the mistake?", options:["Said nothing and hoped for the best","Reported it and completed an incident form","Asked a colleague to cover it","Left a note for the next shift"], answer:"Reported it and completed an incident form" },
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
  4: { reading: makeReadingSet(4), writing: makeWritingSet(4), listening: set4Listening, speaking: makeSpeakingSet(4) },
  5: { reading: makeReadingSet(5), writing: makeWritingSet(5), listening: set5Listening, speaking: makeSpeakingSet(5) },
  6: { reading: makeReadingSet(6), writing: makeWritingSet(6), listening: set6Listening, speaking: makeSpeakingSet(6) },
  7: { reading: makeReadingSet(7), writing: makeWritingSet(7), listening: set7Listening, speaking: makeSpeakingSet(7) },
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
