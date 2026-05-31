export type QuestionType = "mcq" | "truefalse" | "short" | "fill";

export interface Question {
  id: string;
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
}

export interface SpeakingTask {
  id: string;
  part: number;
  instruction: string;
  prompt: string;
  timeSeconds: number;
  points: number;
}

// ─── SET 1 ───────────────────────────────────────────────────────────────────

export const set1Reading: Question[] = [
  // Part 1 – Notices (5 Qs)
  {
    id: "r1p1q1", type: "mcq", points: 1,
    passage: "Notice: 'Hand washing is compulsory before entering the patient's room.'",
    question: "What must visitors do before entering the patient's room?",
    options: ["Remove shoes", "Wash hands", "Wear gloves", "Sign a form"],
    answer: "Wash hands",
  },
  {
    id: "r1p1q2", type: "mcq", points: 1,
    passage: "Sign: 'Staff only – Please knock before entering.'",
    question: "Who is allowed in this area without knocking?",
    options: ["Visitors", "Patients", "No one", "Staff"],
    answer: "No one",
  },
  {
    id: "r1p1q3", type: "mcq", points: 1,
    passage: "Notice: 'Please keep noise to a minimum in this area. Patients are resting.'",
    question: "Why should people be quiet here?",
    options: ["Staff are working", "Patients are sleeping", "There is a meeting", "Recording is in progress"],
    answer: "Patients are sleeping",
  },
  {
    id: "r1p1q4", type: "mcq", points: 1,
    passage: "Sign: 'No mobile phones allowed in the ICU.'",
    question: "What item is not permitted in the ICU?",
    options: ["Food", "Mobile phones", "Visitors", "Books"],
    answer: "Mobile phones",
  },
  {
    id: "r1p1q5", type: "mcq", points: 1,
    passage: "Notice: 'Visiting hours: 10 AM – 12 PM and 4 PM – 6 PM only.'",
    question: "Can you visit a patient at 3 PM?",
    options: ["Yes", "No"],
    answer: "No",
  },
  // Part 2 – Short texts (5 Qs)
  {
    id: "r1p2q1", type: "mcq", points: 1,
    passage: "Emma works as a caregiver in a nursing home in London. She helps elderly residents with bathing, dressing and eating. She works the morning shift from 7 AM to 3 PM.",
    question: "What time does Emma finish work?",
    options: ["7 AM", "12 PM", "3 PM", "6 PM"],
    answer: "3 PM",
  },
  {
    id: "r1p2q2", type: "mcq", points: 1,
    passage: "Emma works as a caregiver in a nursing home in London. She helps elderly residents with bathing, dressing and eating. She works the morning shift from 7 AM to 3 PM.",
    question: "Where does Emma work?",
    options: ["A hospital", "A school", "A nursing home", "A clinic"],
    answer: "A nursing home",
  },
  {
    id: "r1p2q3", type: "mcq", points: 1,
    passage: "The care home provides meals three times a day. Breakfast is served at 8 AM, lunch at 12:30 PM, and dinner at 6 PM. Special dietary needs must be reported to the kitchen team.",
    question: "When is lunch served?",
    options: ["8 AM", "12 PM", "12:30 PM", "6 PM"],
    answer: "12:30 PM",
  },
  {
    id: "r1p2q4", type: "mcq", points: 1,
    passage: "The care home provides meals three times a day. Breakfast is served at 8 AM, lunch at 12:30 PM, and dinner at 6 PM. Special dietary needs must be reported to the kitchen team.",
    question: "Who should you tell about a special diet?",
    options: ["The doctor", "The kitchen team", "The manager", "The family"],
    answer: "The kitchen team",
  },
  {
    id: "r1p2q5", type: "mcq", points: 1,
    passage: "Caregivers must complete a daily report for each resident. This includes any changes in health, behaviour or mood. Reports are checked by the senior nurse every evening.",
    question: "Who reviews the daily reports?",
    options: ["The caregiver", "The resident", "The senior nurse", "The family"],
    answer: "The senior nurse",
  },
  // Part 3 – True/False/Doesn't Say (5 Qs)
  {
    id: "r1p3q1", type: "truefalse", points: 1,
    passage: "Mary is a care worker from the Philippines. She has been working at Sunrise Care Home for three years. She says the most rewarding part of her job is helping residents feel comfortable and happy.",
    question: "Mary has worked at Sunrise Care Home for five years.",
    answer: false,
  },
  {
    id: "r1p3q2", type: "truefalse", points: 1,
    passage: "Mary is a care worker from the Philippines. She has been working at Sunrise Care Home for three years. She says the most rewarding part of her job is helping residents feel comfortable and happy.",
    question: "Mary finds her job rewarding.",
    answer: true,
  },
  {
    id: "r1p3q3", type: "truefalse", points: 1,
    passage: "The care home has 45 residents. All rooms have a window and a private bathroom. Residents can personalise their rooms with their own furniture.",
    question: "The care home has 50 residents.",
    answer: false,
  },
  {
    id: "r1p3q4", type: "truefalse", points: 1,
    passage: "The care home has 45 residents. All rooms have a window and a private bathroom. Residents can personalise their rooms with their own furniture.",
    question: "Each room has its own bathroom.",
    answer: true,
  },
  {
    id: "r1p3q5", type: "truefalse", points: 1,
    passage: "The care home has 45 residents. All rooms have a window and a private bathroom. Residents can personalise their rooms with their own furniture.",
    question: "Residents must use the care home's furniture only.",
    answer: false,
  },
  // Part 4 – Longer passage comprehension (5 Qs)
  {
    id: "r1p4q1", type: "mcq", points: 1,
    passage: "Being a caregiver in the UK requires patience, empathy and good communication. Caregivers often work with elderly or disabled people who need help with daily tasks. Good caregivers listen carefully to what their patients need and respond in a calm and friendly manner. Many caregivers also need to keep accurate records of medicines given and any changes in the patient's condition. Training is important, and most employers require caregivers to have a basic first aid certificate.",
    question: "What quality is most important for a caregiver according to the passage?",
    options: ["Speed", "Strength", "Patience and empathy", "Cooking skills"],
    answer: "Patience and empathy",
  },
  {
    id: "r1p4q2", type: "mcq", points: 1,
    passage: "Being a caregiver in the UK requires patience, empathy and good communication. Caregivers often work with elderly or disabled people who need help with daily tasks. Good caregivers listen carefully to what their patients need and respond in a calm and friendly manner. Many caregivers also need to keep accurate records of medicines given and any changes in the patient's condition. Training is important, and most employers require caregivers to have a basic first aid certificate.",
    question: "What must caregivers keep records of?",
    options: ["Working hours", "Medicines and condition changes", "Food eaten", "Visitor names"],
    answer: "Medicines and condition changes",
  },
  {
    id: "r1p4q3", type: "mcq", points: 1,
    passage: "Being a caregiver in the UK requires patience, empathy and good communication. Caregivers often work with elderly or disabled people who need help with daily tasks. Good caregivers listen carefully to what their patients need and respond in a calm and friendly manner. Many caregivers also need to keep accurate records of medicines given and any changes in the patient's condition. Training is important, and most employers require caregivers to have a basic first aid certificate.",
    question: "What certificate do most employers require?",
    options: ["Driving licence", "Basic first aid", "Food hygiene", "English language"],
    answer: "Basic first aid",
  },
  {
    id: "r1p4q4", type: "mcq", points: 1,
    passage: "Being a caregiver in the UK requires patience, empathy and good communication. Caregivers often work with elderly or disabled people who need help with daily tasks. Good caregivers listen carefully to what their patients need and respond in a calm and friendly manner. Many caregivers also need to keep accurate records of medicines given and any changes in the patient's condition. Training is important, and most employers require caregivers to have a basic first aid certificate.",
    question: "How should a caregiver respond to a patient's needs?",
    options: ["Quickly and quietly", "Calmly and friendly", "Firmly and formally", "Loudly and clearly"],
    answer: "Calmly and friendly",
  },
  {
    id: "r1p4q5", type: "mcq", points: 1,
    passage: "Being a caregiver in the UK requires patience, empathy and good communication. Caregivers often work with elderly or disabled people who need help with daily tasks. Good caregivers listen carefully to what their patients need and respond in a calm and friendly manner. Many caregivers also need to keep accurate records of medicines given and any changes in the patient's condition. Training is important, and most employers require caregivers to have a basic first aid certificate.",
    question: "Who do caregivers mainly work with?",
    options: ["Children", "Doctors", "Elderly or disabled people", "Office workers"],
    answer: "Elderly or disabled people",
  },
  // Part 5 – Gap fill (5 Qs)
  {
    id: "r1p5q1", type: "mcq", points: 1,
    question: "I need to ___ my hands before touching the patient.",
    options: ["wash", "dry", "shake", "glove"],
    answer: "wash",
  },
  {
    id: "r1p5q2", type: "mcq", points: 1,
    question: "The nurse asked me to ___ the medicine at 8 AM.",
    options: ["give", "cook", "write", "remove"],
    answer: "give",
  },
  {
    id: "r1p5q3", type: "mcq", points: 1,
    question: "Please ___ the door when you leave the room.",
    options: ["open", "break", "close", "paint"],
    answer: "close",
  },
  {
    id: "r1p5q4", type: "mcq", points: 1,
    question: "The patient is ___ comfortable now after her bath.",
    options: ["feel", "felt", "feeling", "feels"],
    answer: "feeling",
  },
  {
    id: "r1p5q5", type: "mcq", points: 1,
    question: "We must ___ any changes in the patient's condition.",
    options: ["report", "ignore", "celebrate", "delay"],
    answer: "report",
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
  {
    id: "l1p1q1", part: 1, points: 1,
    transcript: "[Phone rings] Receptionist: 'Good morning, Sunrise Care Home. How can I help?' Caller: 'Hello, I'd like to book an appointment to visit my mother. Is Saturday morning available?' Receptionist: 'Let me check... Yes, Saturday at 10 AM is free.'",
    question: "What time is the appointment booked for?",
    type: "mcq",
    options: ["9 AM Saturday", "10 AM Saturday", "10 AM Sunday", "11 AM Saturday"],
    answer: "10 AM Saturday",
  },
  {
    id: "l1p1q2", part: 1, points: 1,
    transcript: "[At work] Manager: 'Today we have a new resident joining us, Mrs. Patel. She needs help with meals and walking. Please make her feel welcome.'",
    question: "What does Mrs. Patel need help with?",
    type: "mcq",
    options: ["Sleeping and bathing", "Meals and walking", "Reading and writing", "Dressing and cooking"],
    answer: "Meals and walking",
  },
  {
    id: "l1p1q3", part: 1, points: 1,
    transcript: "Caregiver: 'Mr. Brown, would you like tea or coffee this morning?' Mr. Brown: 'Coffee please, but no sugar.' Caregiver: 'Of course. I'll bring it right away.'",
    question: "How does Mr. Brown want his coffee?",
    type: "mcq",
    options: ["With milk", "With sugar", "Without sugar", "Without milk"],
    answer: "Without sugar",
  },
  {
    id: "l1p1q4", part: 1, points: 1,
    transcript: "Nurse: 'Remember, Mrs. Jones needs her blood pressure medication at noon and her vitamins in the evening.'",
    question: "When does Mrs. Jones take her blood pressure medication?",
    type: "mcq",
    options: ["Morning", "Noon", "Afternoon", "Evening"],
    answer: "Noon",
  },
  {
    id: "l1p1q5", part: 1, points: 1,
    transcript: "Manager: 'Fire drill will be held this Thursday at 2 PM. All staff must participate and guide residents to the assembly point outside.'",
    question: "What will happen on Thursday at 2 PM?",
    type: "mcq",
    options: ["A staff meeting", "A fire drill", "A health check", "A visitor day"],
    answer: "A fire drill",
  },
  {
    id: "l1p2q1", part: 2, points: 1,
    transcript: "Interview recording: 'My name is Ana. I have been a caregiver for four years. I previously worked in a hospital in Manila before moving to the UK. I enjoy helping the elderly feel comfortable and I always try to communicate clearly with their families.'",
    question: "How many years of experience does Ana have?",
    type: "mcq",
    options: ["Two years", "Three years", "Four years", "Five years"],
    answer: "Four years",
  },
  {
    id: "l1p2q2", part: 2, points: 1,
    transcript: "Interview recording: 'My name is Ana. I have been a caregiver for four years. I previously worked in a hospital in Manila before moving to the UK. I enjoy helping the elderly feel comfortable and I always try to communicate clearly with their families.'",
    question: "Where did Ana work before the UK?",
    type: "mcq",
    options: ["A school in Manila", "A care home in Manila", "A hospital in Manila", "A clinic in London"],
    answer: "A hospital in Manila",
  },
  {
    id: "l1p2q3", part: 2, points: 1,
    transcript: "Announcement: 'Attention all staff. The canteen will be closed for cleaning tomorrow from 12 PM to 1:30 PM. Please plan your lunch break accordingly. Vending machines in the ground floor corridor will be available.'",
    question: "What time will the canteen reopen tomorrow?",
    type: "mcq",
    options: ["12 PM", "1 PM", "1:30 PM", "2 PM"],
    answer: "1:30 PM",
  },
  {
    id: "l1p2q4", part: 2, points: 1,
    transcript: "Announcement: 'Attention all staff. The canteen will be closed for cleaning tomorrow from 12 PM to 1:30 PM. Please plan your lunch break accordingly. Vending machines in the ground floor corridor will be available.'",
    question: "Where are the vending machines?",
    type: "mcq",
    options: ["First floor", "Ground floor corridor", "Basement", "Near reception"],
    answer: "Ground floor corridor",
  },
  {
    id: "l1p2q5", part: 2, points: 1,
    transcript: "Resident: 'Could you open the window a little? It's quite warm in here.' Caregiver: 'Of course Mrs. Lee. Is this better?' Resident: 'Yes, perfect, thank you.'",
    question: "Why does the resident want the window open?",
    type: "mcq",
    options: ["She wants fresh air", "It is too warm", "She can hear birds", "She feels cold"],
    answer: "It is too warm",
  },
  {
    id: "l1p3q1", part: 3, points: 1,
    transcript: "Training session audio: 'When moving a patient from bed to wheelchair, always lock the wheelchair brakes first. Then help the patient to the edge of the bed. Place a transfer belt around their waist. Ask them to push up with their hands, then stand and pivot to sit in the chair.'",
    question: "What is the first step when moving a patient to a wheelchair?",
    type: "mcq",
    options: ["Put on the transfer belt", "Lock the wheelchair brakes", "Help patient to edge of bed", "Ask patient to stand"],
    answer: "Lock the wheelchair brakes",
  },
  {
    id: "l1p3q2", part: 3, points: 1,
    transcript: "Training session audio: 'When moving a patient from bed to wheelchair, always lock the wheelchair brakes first. Then help the patient to the edge of the bed. Place a transfer belt around their waist. Ask them to push up with their hands, then stand and pivot to sit in the chair.'",
    question: "Where is the transfer belt placed?",
    type: "mcq",
    options: ["Around the chest", "Around the waist", "Around the legs", "Around the arm"],
    answer: "Around the waist",
  },
  {
    id: "l1p3q3", part: 3, points: 1,
    transcript: "Doctor on phone: 'Please make sure Mr. Sharma takes his antibiotics three times a day with food. He should complete the full 7-day course even if he feels better.'",
    question: "How many times a day should Mr. Sharma take his antibiotics?",
    type: "mcq",
    options: ["Once", "Twice", "Three times", "Four times"],
    answer: "Three times",
  },
  {
    id: "l1p3q4", part: 3, points: 1,
    transcript: "Doctor on phone: 'Please make sure Mr. Sharma takes his antibiotics three times a day with food. He should complete the full 7-day course even if he feels better.'",
    question: "How long should Mr. Sharma take the antibiotics?",
    type: "mcq",
    options: ["3 days", "5 days", "7 days", "10 days"],
    answer: "7 days",
  },
  {
    id: "l1p3q5", part: 3, points: 1,
    transcript: "Caregiver report: 'Mrs. Chen was upset this morning. She cried during breakfast and said she missed her family. I sat with her for 20 minutes and she felt calmer afterwards. I have noted this in her daily report.'",
    question: "What did the caregiver do to help Mrs. Chen?",
    type: "mcq",
    options: ["Called her family", "Gave her medicine", "Sat with her for 20 minutes", "Moved her to another room"],
    answer: "Sat with her for 20 minutes",
  },
  {
    id: "l1p4q1", part: 4, points: 1,
    transcript: "Long audio – Health and Safety Briefing: 'Good morning everyone. Today we are going over our infection control policy. The most important thing is hand hygiene. You must wash your hands before and after every patient contact. Use the six-step technique and wash for at least 20 seconds. Alcohol gel is available at every bedside but remember it is not a substitute for soap and water when hands are visibly dirty. If you have any cuts or wounds, please cover them with a waterproof plaster before starting your shift.'",
    question: "How long should you wash your hands for?",
    type: "mcq",
    options: ["10 seconds", "15 seconds", "20 seconds", "30 seconds"],
    answer: "20 seconds",
  },
  {
    id: "l1p4q2", part: 4, points: 1,
    transcript: "Long audio – Health and Safety Briefing: 'Good morning everyone. Today we are going over our infection control policy. The most important thing is hand hygiene. You must wash your hands before and after every patient contact. Use the six-step technique and wash for at least 20 seconds. Alcohol gel is available at every bedside but remember it is not a substitute for soap and water when hands are visibly dirty. If you have any cuts or wounds, please cover them with a waterproof plaster before starting your shift.'",
    question: "When should you use soap and water instead of alcohol gel?",
    type: "mcq",
    options: ["After every contact", "When hands are visibly dirty", "Before meals", "At the end of the shift"],
    answer: "When hands are visibly dirty",
  },
  {
    id: "l1p4q3", part: 4, points: 1,
    transcript: "Long audio – Health and Safety Briefing: 'Good morning everyone. Today we are going over our infection control policy. The most important thing is hand hygiene. You must wash your hands before and after every patient contact. Use the six-step technique and wash for at least 20 seconds. Alcohol gel is available at every bedside but remember it is not a substitute for soap and water when hands are visibly dirty. If you have any cuts or wounds, please cover them with a waterproof plaster before starting your shift.'",
    question: "What should you do if you have a cut before your shift?",
    type: "mcq",
    options: ["Go home", "Tell the manager", "Cover it with a waterproof plaster", "Wear gloves only"],
    answer: "Cover it with a waterproof plaster",
  },
  {
    id: "l1p4q4", part: 4, points: 1,
    transcript: "Long audio – Health and Safety Briefing: 'Good morning everyone. Today we are going over our infection control policy. The most important thing is hand hygiene. You must wash your hands before and after every patient contact. Use the six-step technique and wash for at least 20 seconds. Alcohol gel is available at every bedside but remember it is not a substitute for soap and water when hands are visibly dirty. If you have any cuts or wounds, please cover them with a waterproof plaster before starting your shift.'",
    question: "What hand-washing technique is mentioned?",
    type: "mcq",
    options: ["Three-step", "Four-step", "Six-step", "Eight-step"],
    answer: "Six-step",
  },
  {
    id: "l1p4q5", part: 4, points: 1,
    transcript: "Long audio – Health and Safety Briefing: 'Good morning everyone. Today we are going over our infection control policy. The most important thing is hand hygiene. You must wash your hands before and after every patient contact. Use the six-step technique and wash for at least 20 seconds. Alcohol gel is available at every bedside but remember it is not a substitute for soap and water when hands are visibly dirty. If you have any cuts or wounds, please cover them with a waterproof plaster before starting your shift.'",
    question: "Where is alcohol gel available?",
    type: "mcq",
    options: ["In the office", "At the main entrance", "At every bedside", "In the kitchen"],
    answer: "At every bedside",
  },
  {
    id: "l1p5q1", part: 5, points: 1,
    transcript: "Short clips – Workplace conversations. Clip A: 'Can you help me turn Mrs. Davies? She has been lying on her left side for two hours.' 'Of course, let me get the turning sheet.'",
    question: "Why does Mrs. Davies need turning?",
    type: "mcq",
    options: ["She is in pain", "She has been on one side for two hours", "She wants to see the window", "She is getting a bath"],
    answer: "She has been on one side for two hours",
  },
  {
    id: "l1p5q2", part: 5, points: 1,
    transcript: "Clip B: 'The new resident in Room 12 doesn't speak much English. His family says he understands simple words and responds well to pictures.'",
    question: "How does the resident in Room 12 best understand communication?",
    type: "mcq",
    options: ["Through music", "Through simple words and pictures", "Through writing only", "Through another resident"],
    answer: "Through simple words and pictures",
  },
  {
    id: "l1p5q3", part: 5, points: 1,
    transcript: "Clip C: 'I noticed Mr. Ali hasn't eaten much today. He only had half a bowl of soup and refused the main meal.' 'That's unlike him. Please document it and I'll speak to the dietitian.'",
    question: "What will the caregiver do after this conversation?",
    type: "mcq",
    options: ["Call Mr. Ali's family", "Offer more food", "Document it", "Move Mr. Ali to another room"],
    answer: "Document it",
  },
  {
    id: "l1p5q4", part: 5, points: 1,
    transcript: "Clip D: 'Your shift ends at 3 PM today. Make sure you hand over to Jenny and give her the updated medication list.'",
    question: "What must be handed over at the end of the shift?",
    type: "mcq",
    options: ["The room keys", "The updated medication list", "The food menu", "The visitor log"],
    answer: "The updated medication list",
  },
  {
    id: "l1p5q5", part: 5, points: 1,
    transcript: "Clip E: 'We have a family meeting for Mrs. Thompson's care plan this Friday at 10 AM. Her daughter and son will both be attending.'",
    question: "Who is attending the care plan meeting?",
    type: "mcq",
    options: ["Mrs. Thompson's friends", "Her son only", "Her daughter and son", "The whole family"],
    answer: "Her daughter and son",
  },
];

export const set1Speaking: SpeakingTask[] = [
  {
    id: "s1p1", part: 1, timeSeconds: 60,
    instruction: "Answer the examiner's questions about yourself.",
    prompt: "Tell me your name. Where are you from? What do you do for work or study?",
    points: 10,
  },
  {
    id: "s1p2", part: 2, timeSeconds: 90,
    instruction: "Look at the picture and describe what you see.",
    prompt: "Describe this scene: A caregiver is helping an elderly woman walk down a hospital corridor. The caregiver is smiling and holding the woman's arm gently.",
    points: 10,
  },
  {
    id: "s1p3", part: 3, timeSeconds: 120,
    instruction: "Answer the following question with 2–3 sentences.",
    prompt: "Why is it important to wash your hands regularly when working as a caregiver?",
    points: 10,
  },
  {
    id: "s1p4", part: 4, timeSeconds: 90,
    instruction: "React to this situation.",
    prompt: "A patient tells you they are feeling lonely and sad. What do you say to them?",
    points: 10,
  },
  {
    id: "s1p5", part: 5, timeSeconds: 120,
    instruction: "Give your opinion on this topic.",
    prompt: "Some people say caregivers need to be strict with patients. Others say they should be very gentle. What do you think? Give reasons.",
    points: 10,
  },
];

// ─── SETS 2–7: ABBREVIATED (same structure, different topics) ────────────────

const makeReadingSet = (setNum: number): Question[] => {
  const topics = [
    { passage: "A care worker must always respect the dignity of their clients. This means knocking before entering a room, using the client's preferred name and ensuring privacy during personal care.", q: "What should a care worker do before entering a room?", a: "Knock", opts: ["Knock", "Enter quietly", "Wait outside", "Call the client's name"] },
    { passage: "Medication errors are serious in care settings. Always check the patient's name, the medicine name, the dose, the time and the route before administering any medication.", q: "How many things should you check before giving medicine?", a: "Five", opts: ["Three", "Four", "Five", "Six"] },
    { passage: "A fall prevention plan includes keeping floors dry, ensuring good lighting, using non-slip mats and checking that the resident is wearing appropriate footwear.", q: "Which of the following helps prevent falls?", a: "Non-slip mats", opts: ["Wet floors", "Dim lighting", "Non-slip mats", "Socks only"] },
    { passage: "Dementia is a condition that affects memory, thinking and behaviour. People with dementia may repeat questions, get confused about time and place, and need reassurance from caregivers.", q: "What is one common symptom of dementia?", a: "Repeating questions", opts: ["Good memory", "Repeating questions", "Clear speech", "Strong appetite"] },
    { passage: "End of life care focuses on comfort, dignity and quality of life. Caregivers should follow the care plan, support the family, and ensure the patient is not in pain.", q: "What is the focus of end-of-life care?", a: "Comfort and dignity", opts: ["Cure", "Comfort and dignity", "Exercise", "Recovery"] },
    { passage: "Personal protective equipment (PPE) includes gloves, aprons and face masks. It is used to protect both the caregiver and the patient from infection.", q: "What does PPE stand for?", a: "Personal Protective Equipment", opts: ["Patient Protection Equipment", "Personal Protective Equipment", "Personal Prevention Equipment", "Patient Preventive Equipment"] },
    { passage: "A healthy diet for elderly residents includes plenty of vegetables, fruit, whole grains and protein. Hydration is also essential — residents should drink 6–8 glasses of water daily.", q: "How much water should elderly residents drink daily?", a: "6–8 glasses", opts: ["2–3 glasses", "4–5 glasses", "6–8 glasses", "10 glasses"] },
  ];
  const t = topics[setNum - 2];
  return Array.from({ length: 25 }, (_, i) => ({
    id: `r${setNum}q${i + 1}`,
    type: i % 5 === 2 ? "truefalse" : "mcq" as QuestionType,
    points: 1,
    passage: t.passage,
    question: i % 5 === 2 ? `${t.q} (True or False)` : t.q,
    options: t.opts,
    answer: i % 5 === 2 ? true : t.a,
  }));
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

const makeSpeakingSet = (setNum: number): SpeakingTask[] => {
  const prompts = [
    ["Describe your typical working day as a caregiver.", "What do you enjoy most about working with elderly people?"],
    ["Look at the picture: A caregiver is giving a resident a bath safely. Describe the scene.", "Why is it important to maintain a resident's dignity during personal care?"],
    ["What would you do if a resident fell and could not get up?", "How do you handle a situation when a resident refuses to take their medicine?"],
    ["Describe the most challenging part of being a caregiver.", "How do you keep yourself motivated during difficult shifts?"],
    ["What skills do you think are most important for a caregiver?", "How would you comfort a resident who is upset about leaving their home?"],
    ["Describe a time you worked as part of a team.", "What would you do if you made a mistake with a resident's care?"],
  ];
  const p = prompts[setNum - 2] || prompts[0];
  return [
    { id: `s${setNum}p1`, part: 1, timeSeconds: 60, instruction: "Introduce yourself.", prompt: "Tell me your name, where you are from, and why you want to work as a caregiver.", points: 10 },
    { id: `s${setNum}p2`, part: 2, timeSeconds: 90, instruction: "Describe the picture.", prompt: p[0], points: 10 },
    { id: `s${setNum}p3`, part: 3, timeSeconds: 120, instruction: "Answer the question.", prompt: p[1], points: 10 },
    { id: `s${setNum}p4`, part: 4, timeSeconds: 90, instruction: "React to the situation.", prompt: "A resident's family member becomes very upset and starts shouting at you. How do you respond?", points: 10 },
    { id: `s${setNum}p5`, part: 5, timeSeconds: 120, instruction: "Give your opinion.", prompt: "Do you think caregivers in Nepal are well-prepared for working abroad? Give reasons.", points: 10 },
  ];
};

export const testSets: Record<number, {
  reading: Question[];
  writing: WritingPrompt[];
  listening: ListeningQuestion[];
  speaking: SpeakingTask[];
}> = {
  1: { reading: set1Reading, writing: set1Writing, listening: set1Listening, speaking: set1Speaking },
  2: { reading: makeReadingSet(2), writing: makeWritingSet(2), listening: set1Listening, speaking: makeSpeakingSet(2) },
  3: { reading: makeReadingSet(3), writing: makeWritingSet(3), listening: set1Listening, speaking: makeSpeakingSet(3) },
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

  if (percentage >= 75) {
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
