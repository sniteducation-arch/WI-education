export type QuestionType = "mcq" | "truefalse" | "short" | "fill";

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
}

export type SpeakingPartType = "interview" | "read_aloud" | "long_turn_topic" | "long_turn_graphic" | "communication";

export interface SpeakingTask {
  id: string;
  part: number;
  partType: SpeakingPartType;
  partLabel: string;
  instruction: string;
  prompt: string;
  guidingPoints?: string[];   // Part 3 â€” 3 bullet guiding points
  graphicUrl?: string;        // Part 4 â€” chart/diagram image
  graphicAlt?: string;        // Part 4 â€” description of graphic for AI
  prepSeconds?: number;       // preparation time before recording
  timeSeconds: number;
  points: number;
}

// â”€â”€â”€ SET 1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const set1Reading: Question[] = [
  // Part 1 â€“ Notices (5 Qs)
  {
    id: "r1p1q1", type: "mcq", points: 1,
    passage: "Notice: 'Hand washing is compulsory before entering the patient's room.'",
    question: "What must visitors do before entering the patient's room?",
    options: ["Remove shoes", "Wash hands", "Wear gloves", "Sign a form"],
    answer: "Wash hands",
  },
  {
    id: "r1p1q2", type: "mcq", points: 1,
    passage: "Sign: 'Staff only â€“ Please knock before entering.'",
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
    passage: "Notice: 'Visiting hours: 10 AM â€“ 12 PM and 4 PM â€“ 6 PM only.'",
    question: "Can you visit a patient at 3 PM?",
    options: ["Yes", "No"],
    answer: "No",
  },
  // Part 2 â€“ Short texts (5 Qs)
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
  // Part 3 â€“ True/False/Doesn't Say (5 Qs)
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
  // Part 4 â€“ Longer passage comprehension (5 Qs)
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
  // Part 5 â€“ Gap fill (5 Qs)
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
    transcript: "Long audio â€“ Health and Safety Briefing: 'Good morning everyone. Today we are going over our infection control policy. The most important thing is hand hygiene. You must wash your hands before and after every patient contact. Use the six-step technique and wash for at least 20 seconds. Alcohol gel is available at every bedside but remember it is not a substitute for soap and water when hands are visibly dirty. If you have any cuts or wounds, please cover them with a waterproof plaster before starting your shift.'",
    question: "How long should you wash your hands for?",
    type: "mcq",
    options: ["10 seconds", "15 seconds", "20 seconds", "30 seconds"],
    answer: "20 seconds",
  },
  {
    id: "l1p4q2", part: 4, points: 1,
    transcript: "Long audio â€“ Health and Safety Briefing: 'Good morning everyone. Today we are going over our infection control policy. The most important thing is hand hygiene. You must wash your hands before and after every patient contact. Use the six-step technique and wash for at least 20 seconds. Alcohol gel is available at every bedside but remember it is not a substitute for soap and water when hands are visibly dirty. If you have any cuts or wounds, please cover them with a waterproof plaster before starting your shift.'",
    question: "When should you use soap and water instead of alcohol gel?",
    type: "mcq",
    options: ["After every contact", "When hands are visibly dirty", "Before meals", "At the end of the shift"],
    answer: "When hands are visibly dirty",
  },
  {
    id: "l1p4q3", part: 4, points: 1,
    transcript: "Long audio â€“ Health and Safety Briefing: 'Good morning everyone. Today we are going over our infection control policy. The most important thing is hand hygiene. You must wash your hands before and after every patient contact. Use the six-step technique and wash for at least 20 seconds. Alcohol gel is available at every bedside but remember it is not a substitute for soap and water when hands are visibly dirty. If you have any cuts or wounds, please cover them with a waterproof plaster before starting your shift.'",
    question: "What should you do if you have a cut before your shift?",
    type: "mcq",
    options: ["Go home", "Tell the manager", "Cover it with a waterproof plaster", "Wear gloves only"],
    answer: "Cover it with a waterproof plaster",
  },
  {
    id: "l1p4q4", part: 4, points: 1,
    transcript: "Long audio â€“ Health and Safety Briefing: 'Good morning everyone. Today we are going over our infection control policy. The most important thing is hand hygiene. You must wash your hands before and after every patient contact. Use the six-step technique and wash for at least 20 seconds. Alcohol gel is available at every bedside but remember it is not a substitute for soap and water when hands are visibly dirty. If you have any cuts or wounds, please cover them with a waterproof plaster before starting your shift.'",
    question: "What hand-washing technique is mentioned?",
    type: "mcq",
    options: ["Three-step", "Four-step", "Six-step", "Eight-step"],
    answer: "Six-step",
  },
  {
    id: "l1p4q5", part: 4, points: 1,
    transcript: "Long audio â€“ Health and Safety Briefing: 'Good morning everyone. Today we are going over our infection control policy. The most important thing is hand hygiene. You must wash your hands before and after every patient contact. Use the six-step technique and wash for at least 20 seconds. Alcohol gel is available at every bedside but remember it is not a substitute for soap and water when hands are visibly dirty. If you have any cuts or wounds, please cover them with a waterproof plaster before starting your shift.'",
    question: "Where is alcohol gel available?",
    type: "mcq",
    options: ["In the office", "At the main entrance", "At every bedside", "In the kitchen"],
    answer: "At every bedside",
  },
  {
    id: "l1p5q1", part: 5, points: 1,
    transcript: "Short clips â€“ Workplace conversations. Clip A: 'Can you help me turn Mrs. Davies? She has been lying on her left side for two hours.' 'Of course, let me get the turning sheet.'",
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
    id: "s1p1", part: 1, partType: "interview", partLabel: "Part 1 â€” Interview",
    instruction: "Answer each question naturally. Speak in complete sentences. You have 15â€“20 seconds per answer.",
    prompt: "1. What is your name and where are you from?\n2. Why did you choose to become a caregiver?\n3. Have you worked in a care setting before? Tell me about it.\n4. What do you think is the most important quality a caregiver should have?",
    prepSeconds: 10, timeSeconds: 80, points: 10,
  },
  {
    id: "s1p2", part: 2, partType: "read_aloud", partLabel: "Part 2 â€” Read Aloud",
    instruction: "Read the following sentences aloud clearly and naturally. Pause at commas. Stop at full stops. Do not rush.",
    prompt: "The patient in Room 3 needs her medication before breakfast.\nPlease record all observations in the daily care log.\nAlways knock before entering a resident's room.\nWash your hands before and after every patient contact.\nReport any changes in a patient's condition to the nurse immediately.",
    prepSeconds: 15, timeSeconds: 90, points: 10,
  },
  {
    id: "s1p3", part: 3, partType: "long_turn_topic", partLabel: "Part 3 â€” Long Turn",
    instruction: "Talk for about one minute on the topic below. Use the three guiding points to help structure your answer. You have 40 seconds to prepare.",
    prompt: "Talk about: The importance of communication in caregiving",
    guidingPoints: ["Why clear communication matters between caregivers and patients", "How poor communication can cause problems or mistakes", "Ways to improve communication skills as a caregiver"],
    prepSeconds: 40, timeSeconds: 70, points: 10,
  },
  {
    id: "s1p4", part: 4, partType: "long_turn_graphic", partLabel: "Part 4 â€” Describe the Graphic",
    instruction: "Look at the chart carefully. Describe what it shows, compare the data, and say what conclusions can be drawn. You have 1 minute to prepare.",
    prompt: "Describe the bar chart showing weekly care task distribution in a care home. Compare the different tasks and explain what the data tells us about how caregivers spend their time.",
    graphicUrl: "/graphics/speaking-graphic-caretasks.png",
    graphicAlt: "Bar chart titled 'Weekly Care Tasks Distribution' showing: Personal Care 35%, Medication 20%, Mobility Support 18%, Meal Assistance 15%, Documentation 12%",
    prepSeconds: 60, timeSeconds: 70, points: 10,
  },
  {
    id: "s1p5", part: 5, partType: "communication", partLabel: "Part 5 â€” Communication Activity",
    instruction: "You will answer 3 questions about the topic below. Read the topic, then answer each question. You have 20 seconds per answer.",
    prompt: "Topic: Keeping elderly residents safe in a care home\n\nQ1: What are two common safety risks for elderly residents in a care home?\nQ2: How would you prevent a resident from falling?\nQ3: What would you do if you found a resident had fallen?",
    prepSeconds: 30, timeSeconds: 75, points: 10,
  },
];


// ─── SET 2 READING (A1+) ────────────────────────────────────────────────────
export const set2Reading: Question[] = [
  // Part 1 – Notices
  {id:"r2p1q1",part:1,type:"mcq",points:1,passage:"Warning: Wet floor. Please hold the handrail and walk carefully.",question:"What should you do when you see this sign?",options:["Walk quickly","Hold the handrail and walk carefully","Go back","Call for help"],answer:"Hold the handrail and walk carefully"},
  {id:"r2p1q2",part:1,type:"mcq",points:1,passage:"Notice: This medicine must be kept in the refrigerator at all times. Do not freeze.",question:"How should this medicine be stored?",options:["At room temperature","In the freezer","In the refrigerator","In a cupboard"],answer:"In the refrigerator"},
  {id:"r2p1q3",part:1,type:"mcq",points:1,passage:"Staff notice: All residents requiring mobility assistance must be escorted to the dining hall by 12:15 PM.",question:"What time must residents needing help be in the dining hall?",options:["12:00 PM","12:15 PM","12:30 PM","1:00 PM"],answer:"12:15 PM"},
  {id:"r2p1q4",part:1,type:"mcq",points:1,passage:"Reminder: Mobile phones must be stored in your locker and must not be used when working directly with residents.",question:"Where must mobile phones be kept during your shift?",options:["On the desk","In your pocket","In your locker","With the manager"],answer:"In your locker"},
  {id:"r2p1q5",part:1,type:"mcq",points:1,passage:"The passenger lift on Floor 2 is out of service. Please use the staircase in the east wing until further notice.",question:"Which lift is out of service?",options:["Floor 1","Floor 2","Floor 3","The service lift"],answer:"Floor 2"},
  // Part 2 – Short texts
  {id:"r2p2q1",part:2,type:"mcq",points:1,passage:"David has been a care support worker for eighteen months. He works at Maple Residential Home, where he assists residents with personal hygiene, mealtimes and light exercise.",question:"How long has David been a care support worker?",options:["Six months","One year","Eighteen months","Two years"],answer:"Eighteen months"},
  {id:"r2p2q2",part:2,type:"mcq",points:1,passage:"David has been a care support worker for eighteen months. He works at Maple Residential Home, where he assists residents with personal hygiene, mealtimes and light exercise.",question:"What does David assist with?",options:["Medical procedures","Personal hygiene, mealtimes and light exercise","Cooking and cleaning only","Administration"],answer:"Personal hygiene, mealtimes and light exercise"},
  {id:"r2p2q3",part:2,type:"mcq",points:1,passage:"All new residents receive a welcome pack on their first day. It includes the care home rules, a weekly activity timetable and a menu for the coming month. Residents can speak to their key worker about any questions.",question:"What is included in the welcome pack?",options:["A gift and flowers","Rules, activity timetable and monthly menu","A medical history form","A room key only"],answer:"Rules, activity timetable and monthly menu"},
  {id:"r2p2q4",part:2,type:"mcq",points:1,passage:"All new residents receive a welcome pack on their first day. It includes the care home rules, a weekly activity timetable and a menu for the coming month. Residents can speak to their key worker about any questions.",question:"Who should residents speak to if they have questions?",options:["The manager","Their family","Their key worker","The receptionist"],answer:"Their key worker"},
  {id:"r2p2q5",part:2,type:"mcq",points:1,passage:"During a handover, the outgoing caregiver must inform the incoming caregiver about any changes in health, medications given and any incidents that occurred during the shift.",question:"What must be reported during handover?",options:["Staff performance","Health changes, medications and incidents","Personal opinions about residents","Tomorrow's menu"],answer:"Health changes, medications and incidents"},
  // Part 3 – True/False
  {id:"r2p3q1",part:3,type:"truefalse",points:1,passage:"Maria works the night shift at Hillview Care Home. She starts at 10 PM and finishes at 7 AM. During the night, she checks on residents every two hours and helps anyone who needs to use the bathroom.",question:"Maria works a twelve-hour night shift.",answer:false},
  {id:"r2p3q2",part:3,type:"truefalse",points:1,passage:"Maria works the night shift at Hillview Care Home. She starts at 10 PM and finishes at 7 AM. During the night, she checks on residents every two hours and helps anyone who needs to use the bathroom.",question:"Maria checks on residents every hour during the night.",answer:false},
  {id:"r2p3q3",part:3,type:"truefalse",points:1,passage:"Maria works the night shift at Hillview Care Home. She starts at 10 PM and finishes at 7 AM. During the night, she checks on residents every two hours and helps anyone who needs to use the bathroom.",question:"Maria helps residents who need to use the bathroom.",answer:true},
  {id:"r2p3q4",part:3,type:"truefalse",points:1,passage:"Sunrise Care Home has introduced a new sensory room. It has soft lighting, gentle music and comfortable chairs. It is open to all residents and can be booked through the activities coordinator.",question:"The sensory room is only available to residents with dementia.",answer:false},
  {id:"r2p3q5",part:3,type:"truefalse",points:1,passage:"Sunrise Care Home has introduced a new sensory room. It has soft lighting, gentle music and comfortable chairs. It is open to all residents and can be booked through the activities coordinator.",question:"Residents can book the sensory room through the activities coordinator.",answer:true},
  // Part 4 – Longer passage
  {id:"r2p4q1",part:4,type:"mcq",points:1,passage:"Medication management is a key duty for care workers. Before giving any medication, care workers must check the resident's name, the medicine name, the correct dose and the time it should be given. If a resident refuses medication, care workers must not force them. Instead, they should report this to the nurse and record it in the care notes. Medication errors can be very serious and must be avoided at all times.",question:"What should you do if a resident refuses medication?",options:["Give it anyway","Force them gently","Report to the nurse and record it","Contact the family immediately"],answer:"Report to the nurse and record it"},
  {id:"r2p4q2",part:4,type:"mcq",points:1,passage:"Medication management is a key duty for care workers. Before giving any medication, care workers must check the resident's name, the medicine name, the correct dose and the time it should be given. If a resident refuses medication, care workers must not force them. Instead, they should report this to the nurse and record it in the care notes. Medication errors can be very serious and must be avoided at all times.",question:"How many things must you check before giving medication?",options:["Two","Three","Four","Five"],answer:"Four"},
  {id:"r2p4q3",part:4,type:"mcq",points:1,passage:"Medication management is a key duty for care workers. Before giving any medication, care workers must check the resident's name, the medicine name, the correct dose and the time it should be given. If a resident refuses medication, care workers must not force them. Instead, they should report this to the nurse and record it in the care notes. Medication errors can be very serious and must be avoided at all times.",question:"Where must a refused medication be recorded?",options:["On a sticky note","In the care notes","By text to the manager","Only verbally"],answer:"In the care notes"},
  {id:"r2p4q4",part:4,type:"mcq",points:1,passage:"Medication management is a key duty for care workers. Before giving any medication, care workers must check the resident's name, the medicine name, the correct dose and the time it should be given. If a resident refuses medication, care workers must not force them. Instead, they should report this to the nurse and record it in the care notes. Medication errors can be very serious and must be avoided at all times.",question:"Why must medication errors be avoided?",options:["They create extra paperwork","They are very serious","They make residents unhappy","They slow down the shift"],answer:"They are very serious"},
  {id:"r2p4q5",part:4,type:"mcq",points:1,passage:"Medication management is a key duty for care workers. Before giving any medication, care workers must check the resident's name, the medicine name, the correct dose and the time it should be given. If a resident refuses medication, care workers must not force them. Instead, they should report this to the nurse and record it in the care notes. Medication errors can be very serious and must be avoided at all times.",question:"Which of the following is NOT a check before giving medication?",options:["Resident's name","Medicine name","Resident's address","Correct dose"],answer:"Resident's address"},
  // Part 5 – Gap fill
  {id:"r2p5q1",part:5,type:"mcq",points:1,question:"Please ___ the resident's blood pressure and write it in the chart.",options:["check","make","cook","paint"],answer:"check"},
  {id:"r2p5q2",part:5,type:"mcq",points:1,question:"The new resident seems ___ because she does not know anyone here yet.",options:["happy","lonely","healthy","angry"],answer:"lonely"},
  {id:"r2p5q3",part:5,type:"mcq",points:1,question:"Can you ___ Mrs. Park to the physiotherapy room, please?",options:["follow","carry","escort","push"],answer:"escort"},
  {id:"r2p5q4",part:5,type:"mcq",points:1,question:"All accidents must be ___ in the incident report as soon as possible.",options:["deleted","recorded","hidden","shared"],answer:"recorded"},
  {id:"r2p5q5",part:5,type:"mcq",points:1,question:"She cannot ___ well because of her hearing loss, so we use written notes.",options:["see","walk","hear","sleep"],answer:"hear"},
];

// ─── SET 3 READING (A2) ──────────────────────────────────────────────────────
export const set3Reading: Question[] = [
  // Part 1 – Notices (A2 – more formal language)
  {id:"r3p1q1",part:1,type:"mcq",points:1,passage:"COSHH Warning: This cleaning product contains hazardous chemicals. Wear protective gloves and an apron before use. Store in a locked cupboard away from food areas.",question:"What protective equipment must you wear?",options:["Gloves only","An apron only","Gloves and an apron","A mask and gloves"],answer:"Gloves and an apron"},
  {id:"r3p1q2",part:1,type:"mcq",points:1,passage:"Mandatory Training Notice: All care staff must complete the online safeguarding module by Friday 20th June. Failure to complete may result in removal from the rota.",question:"What may happen if training is not completed?",options:["A warning letter","Extra shifts","Removal from the rota","A pay cut"],answer:"Removal from the rota"},
  {id:"r3p1q3",part:1,type:"mcq",points:1,passage:"Dietary Alert – Room 14: Resident has a severe nut allergy. No nut products are to be served or brought into her room. All food must be checked before delivery.",question:"What must be checked before delivering food to Room 14?",options:["The temperature","All food for nut products","The portion size","The expiry date"],answer:"All food for nut products"},
  {id:"r3p1q4",part:1,type:"mcq",points:1,passage:"Do Not Disturb – Clinical Procedure in Progress. Please wait until the red light above the door goes off before entering.",question:"When is it safe to enter?",options:["After knocking","When the red light goes off","After five minutes","When the nurse calls"],answer:"When the red light goes off"},
  {id:"r3p1q5",part:1,type:"mcq",points:1,passage:"Password Policy: Care system passwords must be changed every 30 days. Do not share your password with any member of staff, including managers.",question:"Who can you share your password with?",options:["Only your manager","Only senior nurses","A trusted colleague","No one"],answer:"No one"},
  // Part 2 – Short texts
  {id:"r3p2q1",part:2,type:"mcq",points:1,passage:"Pressure ulcers develop when constant pressure cuts off blood supply to the skin. They most commonly occur in people who are immobile or confined to bed. Caregivers must regularly reposition residents and check for early signs of redness.",question:"What causes pressure ulcers?",options:["Too much exercise","Constant pressure cutting off blood supply","Eating too much","Drinking too little water"],answer:"Constant pressure cutting off blood supply"},
  {id:"r3p2q2",part:2,type:"mcq",points:1,passage:"Pressure ulcers develop when constant pressure cuts off blood supply to the skin. They most commonly occur in people who are immobile or confined to bed. Caregivers must regularly reposition residents and check for early signs of redness.",question:"What should caregivers check the skin for?",options:["Bruises only","Early signs of redness","Changes in colour only","Temperature"],answer:"Early signs of redness"},
  {id:"r3p2q3",part:2,type:"mcq",points:1,passage:"The Care Quality Commission (CQC) is the independent regulator of health and social care in England. It registers and inspects care homes to ensure they meet national standards. If a care home fails standards, the CQC can restrict or close it.",question:"What is the CQC?",options:["A training organisation","The independent regulator of health and social care","A government minister","A residents' committee"],answer:"The independent regulator of health and social care"},
  {id:"r3p2q4",part:2,type:"mcq",points:1,passage:"The Care Quality Commission (CQC) is the independent regulator of health and social care in England. It registers and inspects care homes to ensure they meet national standards. If a care home fails standards, the CQC can restrict or close it.",question:"What can the CQC do if a care home fails standards?",options:["Give a warning only","Issue a fine","Restrict or close it","Replace the manager"],answer:"Restrict or close it"},
  {id:"r3p2q5",part:2,type:"mcq",points:1,passage:"A skin assessment should be carried out on every new resident within six hours of admission. This identifies any existing pressure areas or wounds before care begins and creates a baseline for future comparisons.",question:"When should a skin assessment be done?",options:["Within 24 hours","Within six hours of admission","On the second day","Before the resident arrives"],answer:"Within six hours of admission"},
  // Part 3 – True/False
  {id:"r3p3q1",part:3,type:"truefalse",points:1,passage:"Under the Care Act 2014, local authorities in England have a legal duty to promote the wellbeing of people in their area. This includes physical and mental health and protection from abuse. Local authorities must assess anyone who appears to need care.",question:"The Care Act 2014 applies to all parts of the United Kingdom.",answer:false},
  {id:"r3p3q2",part:3,type:"truefalse",points:1,passage:"Under the Care Act 2014, local authorities in England have a legal duty to promote the wellbeing of people in their area. This includes physical and mental health and protection from abuse. Local authorities must assess anyone who appears to need care.",question:"Local authorities must assess anyone who appears to need care.",answer:true},
  {id:"r3p3q3",part:3,type:"truefalse",points:1,passage:"Under the Care Act 2014, local authorities in England have a legal duty to promote the wellbeing of people in their area. This includes physical and mental health and protection from abuse. Local authorities must assess anyone who appears to need care.",question:"Mental health is not covered by the Care Act 2014.",answer:false},
  {id:"r3p3q4",part:3,type:"truefalse",points:1,passage:"Handwashing with soap and water is more effective than alcohol gel for removing certain infections, including C. difficile and norovirus. In these situations, alcohol gel alone is not sufficient.",question:"Alcohol gel is always sufficient to remove all infections.",answer:false},
  {id:"r3p3q5",part:3,type:"truefalse",points:1,passage:"Handwashing with soap and water is more effective than alcohol gel for removing certain infections, including C. difficile and norovirus. In these situations, alcohol gel alone is not sufficient.",question:"Soap and water must be used to remove C. difficile and norovirus.",answer:true},
  // Part 4 – Longer passage
  {id:"r3p4q1",part:4,type:"mcq",points:1,passage:"Dementia is not a single disease but a group of symptoms affecting memory, thinking and communication. The most common type is Alzheimer's disease, accounting for 60–80% of all cases. Other types include vascular dementia, which occurs after a stroke or problems with blood supply to the brain. There is currently no cure for dementia, but medication can slow its progression. Key caregiver skills include patience, clear and simple language, and maintaining a consistent daily routine, as familiarity helps reduce confusion and anxiety.",question:"What is the most common type of dementia?",options:["Vascular dementia","Lewy body dementia","Alzheimer's disease","Parkinson's dementia"],answer:"Alzheimer's disease"},
  {id:"r3p4q2",part:4,type:"mcq",points:1,passage:"Dementia is not a single disease but a group of symptoms affecting memory, thinking and communication. The most common type is Alzheimer's disease, accounting for 60–80% of all cases. Other types include vascular dementia, which occurs after a stroke or problems with blood supply to the brain. There is currently no cure for dementia, but medication can slow its progression. Key caregiver skills include patience, clear and simple language, and maintaining a consistent daily routine, as familiarity helps reduce confusion and anxiety.",question:"What percentage of dementia cases does Alzheimer's account for?",options:["40–50%","50–60%","60–80%","80–90%"],answer:"60–80%"},
  {id:"r3p4q3",part:4,type:"mcq",points:1,passage:"Dementia is not a single disease but a group of symptoms affecting memory, thinking and communication. The most common type is Alzheimer's disease, accounting for 60–80% of all cases. Other types include vascular dementia, which occurs after a stroke or problems with blood supply to the brain. There is currently no cure for dementia, but medication can slow its progression. Key caregiver skills include patience, clear and simple language, and maintaining a consistent daily routine, as familiarity helps reduce confusion and anxiety.",question:"What can cause vascular dementia?",options:["Old age","A stroke or blood supply problems","Too much stress","Poor diet"],answer:"A stroke or blood supply problems"},
  {id:"r3p4q4",part:4,type:"mcq",points:1,passage:"Dementia is not a single disease but a group of symptoms affecting memory, thinking and communication. The most common type is Alzheimer's disease, accounting for 60–80% of all cases. Other types include vascular dementia, which occurs after a stroke or problems with blood supply to the brain. There is currently no cure for dementia, but medication can slow its progression. Key caregiver skills include patience, clear and simple language, and maintaining a consistent daily routine, as familiarity helps reduce confusion and anxiety.",question:"Why is a consistent routine helpful for dementia residents?",options:["It saves caregiver time","Familiarity reduces confusion and anxiety","It improves physical health","It helps with medication"],answer:"Familiarity reduces confusion and anxiety"},
  {id:"r3p4q5",part:4,type:"mcq",points:1,passage:"Dementia is not a single disease but a group of symptoms affecting memory, thinking and communication. The most common type is Alzheimer's disease, accounting for 60–80% of all cases. Other types include vascular dementia, which occurs after a stroke or problems with blood supply to the brain. There is currently no cure for dementia, but medication can slow its progression. Key caregiver skills include patience, clear and simple language, and maintaining a consistent daily routine, as familiarity helps reduce confusion and anxiety.",question:"Is there currently a cure for dementia?",options:["Yes, a new drug was approved","No, but medication can slow progression","Yes, for early-stage only","Only for Alzheimer's"],answer:"No, but medication can slow progression"},
  // Part 5 – Gap fill
  {id:"r3p5q1",part:5,type:"mcq",points:1,question:"It is ___ for all care staff to complete moving and handling training before working with residents.",options:["optional","compulsory","helpful","suggested"],answer:"compulsory"},
  {id:"r3p5q2",part:5,type:"mcq",points:1,question:"The nurse asked me to ___ the wound daily and report any changes immediately.",options:["ignore","wash","monitor","hide"],answer:"monitor"},
  {id:"r3p5q3",part:5,type:"mcq",points:1,question:"The resident became very ___ and kept repeating the same question every few minutes.",options:["calm","happy","confused","bored"],answer:"confused"},
  {id:"r3p5q4",part:5,type:"mcq",points:1,question:"Caregivers must always ___ the resident's dignity during personal care tasks.",options:["ignore","protect","report","cancel"],answer:"protect"},
  {id:"r3p5q5",part:5,type:"mcq",points:1,question:"You should ___ to the senior nurse immediately if a resident shows signs of infection.",options:["talk quietly","report","complain","whisper"],answer:"report"},
];

// ─── SET 4 READING (A2+) ─────────────────────────────────────────────────────
export const set4Reading: Question[] = [
  // Part 1 – Notices
  {id:"r4p1q1",part:1,type:"mcq",points:1,passage:"Incident Reporting: Any fall, medication error or safeguarding concern must be reported to the duty manager within one hour. Written incident reports must be completed within 24 hours.",question:"Within what time must an incident be verbally reported?",options:["30 minutes","One hour","Two hours","24 hours"],answer:"One hour"},
  {id:"r4p1q2",part:1,type:"mcq",points:1,passage:"Staff Notice: A new electronic care planning system will be introduced on Monday. Training sessions are available Tuesday at 10 AM and Thursday at 2 PM. All caregiving staff are strongly advised to attend one session.",question:"How many training sessions are available?",options:["One","Two","Three","Four"],answer:"Two"},
  {id:"r4p1q3",part:1,type:"mcq",points:1,passage:"Lone Working Policy: If working alone with a resident in a high-risk situation, use the lone worker safety device and ensure the duty manager is aware of your location at all times.",question:"What must you ensure the duty manager knows when lone working?",options:["Your shift times","Your location","Your patient's name","Your break time"],answer:"Your location"},
  {id:"r4p1q4",part:1,type:"mcq",points:1,passage:"Confidentiality Notice: Under GDPR, personal information about residents must not be discussed outside the care setting. Sharing resident information on social media is a serious disciplinary offence.",question:"What is considered a serious disciplinary offence?",options:["Arriving late","Taking a long break","Sharing resident information on social media","Forgetting your ID badge"],answer:"Sharing resident information on social media"},
  {id:"r4p1q5",part:1,type:"mcq",points:1,passage:"Dehydration Alert: In the current warm weather, ensure all residents drink at least 1.5 litres of fluid per day. Offer drinks every two hours and record all fluid intake on the fluid chart.",question:"How often should drinks be offered to residents?",options:["Every hour","Every two hours","Every three hours","Four times a day"],answer:"Every two hours"},
  // Part 2 – Short texts
  {id:"r4p2q1",part:2,type:"mcq",points:1,passage:"Person-centred care means providing care tailored to the individual needs, preferences and values of each person. Rather than following a standard routine, caregivers should ask residents how they prefer to be supported, including preferred wake times, food choices and social activities.",question:"What does person-centred care mean?",options:["Following the same routine for all residents","Care tailored to individual needs and preferences","Doing what the manager decides","Following the care home timetable strictly"],answer:"Care tailored to individual needs and preferences"},
  {id:"r4p2q2",part:2,type:"mcq",points:1,passage:"Person-centred care means providing care tailored to the individual needs, preferences and values of each person. Rather than following a standard routine, caregivers should ask residents how they prefer to be supported, including preferred wake times, food choices and social activities.",question:"Which is an example of person-centred care?",options:["Waking all residents at 7 AM","Asking a resident when they prefer to wake up","Serving the same meals every day","Using the same care plan for everyone"],answer:"Asking a resident when they prefer to wake up"},
  {id:"r4p2q3",part:2,type:"mcq",points:1,passage:"Risk assessments identify potential hazards, evaluate the level of risk and put measures in place to reduce or eliminate it. They should be reviewed regularly and updated whenever circumstances change.",question:"What is the first step in a risk assessment?",options:["Evaluating the risk level","Putting safety measures in place","Identifying potential hazards","Writing a report"],answer:"Identifying potential hazards"},
  {id:"r4p2q4",part:2,type:"mcq",points:1,passage:"Risk assessments identify potential hazards, evaluate the level of risk and put measures in place to reduce or eliminate it. They should be reviewed regularly and updated whenever circumstances change.",question:"When should risk assessments be updated?",options:["Only after an accident","Once a year","When circumstances change","Never unless requested"],answer:"When circumstances change"},
  {id:"r4p2q5",part:2,type:"mcq",points:1,passage:"Whistleblowing means raising concerns about wrongdoing in the workplace. In the UK, care workers are protected by law if they report genuine concerns about abuse, neglect or unsafe practices. It is important to speak up even if it involves reporting a colleague or manager.",question:"What does whistleblowing mean in a care setting?",options:["Reporting a fire","Raising concerns about wrongdoing","Making a complaint about your pay","Informing a resident's family"],answer:"Raising concerns about wrongdoing"},
  // Part 3 – True/False
  {id:"r4p3q1",part:3,type:"truefalse",points:1,passage:"Dignity in care means treating people as individuals and respecting their choices, even when those choices may not seem the best from a medical perspective. If a resident chooses to eat unhealthy food occasionally, this is their right. Caregivers should provide advice but ultimately respect the person's autonomy.",question:"Caregivers should always override a resident's food choices for health reasons.",answer:false},
  {id:"r4p3q2",part:3,type:"truefalse",points:1,passage:"Dignity in care means treating people as individuals and respecting their choices, even when those choices may not seem the best from a medical perspective. If a resident chooses to eat unhealthy food occasionally, this is their right. Caregivers should provide advice but ultimately respect the person's autonomy.",question:"Dignity means treating people as individuals and respecting their choices.",answer:true},
  {id:"r4p3q3",part:3,type:"truefalse",points:1,passage:"Dignity in care means treating people as individuals and respecting their choices, even when those choices may not seem the best from a medical perspective. If a resident chooses to eat unhealthy food occasionally, this is their right. Caregivers should provide advice but ultimately respect the person's autonomy.",question:"Caregivers are not permitted to give residents any health advice.",answer:false},
  {id:"r4p3q4",part:3,type:"truefalse",points:1,passage:"According to the Health and Safety at Work Act 1974, employers have a duty to ensure the health, safety and welfare of all employees. Employees also have responsibilities — they must take reasonable care for their own health and safety and that of others affected by their actions.",question:"Only employers have responsibilities under the Health and Safety at Work Act 1974.",answer:false},
  {id:"r4p3q5",part:3,type:"truefalse",points:1,passage:"According to the Health and Safety at Work Act 1974, employers have a duty to ensure the health, safety and welfare of all employees. Employees also have responsibilities — they must take reasonable care for their own health and safety and that of others affected by their actions.",question:"Employees must take care for their own safety and the safety of others.",answer:true},
  // Part 4 – Longer passage
  {id:"r4p4q1",part:4,type:"mcq",points:1,passage:"Falls are the most common cause of injury among elderly people in care homes. A fall can lead to broken bones, loss of confidence in walking and a general decline in health. Caregivers play an important role in fall prevention by carrying out regular risk assessments, ensuring floors are free of clutter, making sure residents wear well-fitting footwear, and responding promptly to call bells, as residents often fall when trying to reach something without calling for help. When a fall occurs, care workers must not lift the resident immediately. Instead, stay with the resident, carry out a basic check for injury and call for a nurse.",question:"What is the most common cause of injury among elderly care home residents?",options:["Medication errors","Infections","Falls","Burns"],answer:"Falls"},
  {id:"r4p4q2",part:4,type:"mcq",points:1,passage:"Falls are the most common cause of injury among elderly people in care homes. A fall can lead to broken bones, loss of confidence in walking and a general decline in health. Caregivers play an important role in fall prevention by carrying out regular risk assessments, ensuring floors are free of clutter, making sure residents wear well-fitting footwear, and responding promptly to call bells, as residents often fall when trying to reach something without calling for help. When a fall occurs, care workers must not lift the resident immediately. Instead, stay with the resident, carry out a basic check for injury and call for a nurse.",question:"What should a care worker do immediately when a resident falls?",options:["Lift them immediately","Call the family first","Stay with them, check for injury and call for a nurse","Leave to find a colleague"],answer:"Stay with them, check for injury and call for a nurse"},
  {id:"r4p4q3",part:4,type:"mcq",points:1,passage:"Falls are the most common cause of injury among elderly people in care homes. A fall can lead to broken bones, loss of confidence in walking and a general decline in health. Caregivers play an important role in fall prevention by carrying out regular risk assessments, ensuring floors are free of clutter, making sure residents wear well-fitting footwear, and responding promptly to call bells, as residents often fall when trying to reach something without calling for help. When a fall occurs, care workers must not lift the resident immediately. Instead, stay with the resident, carry out a basic check for injury and call for a nurse.",question:"Why do some residents fall when trying to reach something?",options:["They are confused","They did not call for help","The floor is slippery","Their footwear is too tight"],answer:"They did not call for help"},
  {id:"r4p4q4",part:4,type:"mcq",points:1,passage:"Falls are the most common cause of injury among elderly people in care homes. A fall can lead to broken bones, loss of confidence in walking and a general decline in health. Caregivers play an important role in fall prevention by carrying out regular risk assessments, ensuring floors are free of clutter, making sure residents wear well-fitting footwear, and responding promptly to call bells, as residents often fall when trying to reach something without calling for help. When a fall occurs, care workers must not lift the resident immediately. Instead, stay with the resident, carry out a basic check for injury and call for a nurse.",question:"What type of footwear should residents wear to prevent falls?",options:["Any comfortable shoes","Slippers only","Well-fitting footwear","Bare feet indoors"],answer:"Well-fitting footwear"},
  {id:"r4p4q5",part:4,type:"mcq",points:1,passage:"Falls are the most common cause of injury among elderly people in care homes. A fall can lead to broken bones, loss of confidence in walking and a general decline in health. Caregivers play an important role in fall prevention by carrying out regular risk assessments, ensuring floors are free of clutter, making sure residents wear well-fitting footwear, and responding promptly to call bells, as residents often fall when trying to reach something without calling for help. When a fall occurs, care workers must not lift the resident immediately. Instead, stay with the resident, carry out a basic check for injury and call for a nurse.",question:"What effect can a fall have on a resident's confidence?",options:["It improves confidence","It has no effect","They may lose confidence in walking","They become more active"],answer:"They may lose confidence in walking"},
  // Part 5 – Gap fill
  {id:"r4p5q1",part:5,type:"mcq",points:1,question:"The care worker wrote a detailed ___ of the incident in the accident book.",options:["song","account","number","request"],answer:"account"},
  {id:"r4p5q2",part:5,type:"mcq",points:1,question:"You must ___ with the resident's family before making major changes to the care plan.",options:["argue","compete","consult","ignore"],answer:"consult"},
  {id:"r4p5q3",part:5,type:"mcq",points:1,question:"The CQC inspector said the care home was fully ___ with the current national standards.",options:["behind","compliant","against","unaware"],answer:"compliant"},
  {id:"r4p5q4",part:5,type:"mcq",points:1,question:"Care workers have a legal ___ to report any suspected abuse of a vulnerable person.",options:["choice","option","duty","freedom"],answer:"duty"},
  {id:"r4p5q5",part:5,type:"mcq",points:1,question:"The manager asked all staff to ___ the new safe lifting procedures immediately.",options:["question","adopt","ignore","delay"],answer:"adopt"},
];

// ─── SET 5 READING (B1-) ─────────────────────────────────────────────────────
export const set5Reading: Question[] = [
  // Part 1 – Notices (B1- – requires more inference)
  {id:"r5p1q1",part:1,type:"mcq",points:1,passage:"Safeguarding Alert: Any caregiver who witnesses or suspects physical, emotional or financial abuse of a resident must report it without delay. Failure to act is itself a safeguarding failure and may result in disciplinary action.",question:"What happens if a caregiver fails to report suspected abuse?",options:["Nothing, if they were not sure","They receive a verbal warning only","It may result in disciplinary action","They must write a report within a week"],answer:"It may result in disciplinary action"},
  {id:"r5p1q2",part:1,type:"mcq",points:1,passage:"Infection Control Update: Following the recent norovirus outbreak on Ward B, all non-essential visits are suspended for 72 hours. Staff must use full PPE including gloves, apron and surgical mask when entering the ward.",question:"What triggered the suspension of visits?",options:["A fire drill","A staffing shortage","A norovirus outbreak","A scheduled inspection"],answer:"A norovirus outbreak"},
  {id:"r5p1q3",part:1,type:"mcq",points:1,passage:"Care Plan Review Notice: Under the Care Standards Act, each resident's care plan must be formally reviewed at least every three months or sooner if there is a significant change in the resident's condition or wishes.",question:"When must a care plan be reviewed before the three-month interval?",options:["If the resident asks politely","After a complaint from the family","If there is a significant change in condition or wishes","At the start of each month"],answer:"If there is a significant change in condition or wishes"},
  {id:"r5p1q4",part:1,type:"mcq",points:1,passage:"Restraint Policy: Physical restraint may only be used as a last resort, when a resident poses an immediate risk of harm to themselves or others. It must never be used as a form of punishment or for the convenience of staff.",question:"When is physical restraint permitted?",options:["Whenever a resident is agitated","When the manager approves it","As a last resort when there is immediate risk of harm","When a resident refuses medication"],answer:"As a last resort when there is immediate risk of harm"},
  {id:"r5p1q5",part:1,type:"mcq",points:1,passage:"Do Not Attempt Resuscitation (DNAR) orders must be signed by a senior doctor and documented clearly in the resident's care notes. Care staff must familiarise themselves with each resident's DNAR status at the start of every shift.",question:"Who must sign a DNAR order?",options:["A care worker","The resident's family","A senior doctor","The care home manager"],answer:"A senior doctor"},
  // Part 2 – Short texts
  {id:"r5p2q1",part:2,type:"mcq",points:1,passage:"The Mental Capacity Act 2005 protects the rights of people who may lack the capacity to make certain decisions. Under this Act, care workers must always assume a person has capacity unless it has been assessed and proven otherwise. If a person is found to lack capacity, decisions must be made in their best interests, taking into account their known wishes and values.",question:"What must care workers assume about a person's capacity by default?",options:["They lack capacity","They have partial capacity","They have capacity unless proven otherwise","Their family decides"],answer:"They have capacity unless proven otherwise"},
  {id:"r5p2q2",part:2,type:"mcq",points:1,passage:"The Mental Capacity Act 2005 protects the rights of people who may lack the capacity to make certain decisions. Under this Act, care workers must always assume a person has capacity unless it has been assessed and proven otherwise. If a person is found to lack capacity, decisions must be made in their best interests, taking into account their known wishes and values.",question:"If a person lacks capacity, how must decisions be made?",options:["By the care home manager alone","By the family only","In the person's best interests, considering their known wishes","By majority vote of the care team"],answer:"In the person's best interests, considering their known wishes"},
  {id:"r5p2q3",part:2,type:"mcq",points:1,passage:"Palliative care focuses on improving quality of life for patients with serious, life-limiting illness. It addresses physical symptoms such as pain and breathlessness, and also emotional, social and spiritual needs. Palliative care can begin at diagnosis and does not mean giving up — it can be provided alongside active treatment.",question:"When can palliative care begin?",options:["Only in the final weeks of life","Only after all other treatment has failed","At diagnosis, alongside active treatment","Only in a hospital setting"],answer:"At diagnosis, alongside active treatment"},
  {id:"r5p2q4",part:2,type:"mcq",points:1,passage:"Palliative care focuses on improving quality of life for patients with serious, life-limiting illness. It addresses physical symptoms such as pain and breathlessness, and also emotional, social and spiritual needs. Palliative care can begin at diagnosis and does not mean giving up — it can be provided alongside active treatment.",question:"What types of needs does palliative care address?",options:["Physical needs only","Physical, emotional, social and spiritual needs","Medical and legal needs","Financial and housing needs"],answer:"Physical, emotional, social and spiritual needs"},
  {id:"r5p2q5",part:2,type:"mcq",points:1,passage:"A Lasting Power of Attorney (LPA) is a legal document that allows a person to appoint someone to make decisions on their behalf if they lose capacity. There are two types: one for health and welfare decisions and one for property and financial decisions. An LPA must be registered with the Office of the Public Guardian before it can be used.",question:"Where must an LPA be registered before it can be used?",options:["At the care home","With the local council","With the Office of the Public Guardian","At the GP surgery"],answer:"With the Office of the Public Guardian"},
  // Part 3 – True/False
  {id:"r5p3q1",part:3,type:"truefalse",points:1,passage:"Advocacy means supporting a person to express their own wishes, feelings and needs, or speaking on their behalf when they cannot do so themselves. Independent advocates are available to residents who have no family or friends to support them and who lack capacity to make certain decisions.",question:"Advocacy is only available to residents who have family support.",answer:false},
  {id:"r5p3q2",part:3,type:"truefalse",points:1,passage:"Advocacy means supporting a person to express their own wishes, feelings and needs, or speaking on their behalf when they cannot do so themselves. Independent advocates are available to residents who have no family or friends to support them and who lack capacity to make certain decisions.",question:"An advocate can speak on behalf of a person who cannot express their own wishes.",answer:true},
  {id:"r5p3q3",part:3,type:"truefalse",points:1,passage:"Advocacy means supporting a person to express their own wishes, feelings and needs, or speaking on their behalf when they cannot do so themselves. Independent advocates are available to residents who have no family or friends to support them and who lack capacity to make certain decisions.",question:"Independent advocates are paid by the resident's family.",answer:false},
  {id:"r5p3q4",part:3,type:"truefalse",points:1,passage:"The six principles of the Care Act 2014 safeguarding framework are: empowerment, prevention, proportionality, protection, partnership and accountability. These principles guide all safeguarding decisions and actions in health and social care.",question:"Accountability is one of the six principles of the Care Act safeguarding framework.",answer:true},
  {id:"r5p3q5",part:3,type:"truefalse",points:1,passage:"The six principles of the Care Act 2014 safeguarding framework are: empowerment, prevention, proportionality, protection, partnership and accountability. These principles guide all safeguarding decisions and actions in health and social care.",question:"There are eight principles in the Care Act safeguarding framework.",answer:false},
  // Part 4 – Longer passage
  {id:"r5p4q1",part:4,type:"mcq",points:1,passage:"Effective communication is central to high-quality care. Care workers communicate with residents, families, colleagues and other professionals every day. Good communication involves not only speaking clearly but also listening actively, observing non-verbal cues and adapting your style to the individual. Some residents may have communication difficulties due to stroke, dementia or hearing loss, requiring the use of alternative methods such as picture boards, simple written messages or sign language. Poor communication in care settings can lead to misunderstandings, medication errors, missed signs of deterioration and increased anxiety in residents. Documenting all relevant conversations and observations in care notes is essential for continuity of care.",question:"What can result from poor communication in care settings?",options:["Faster care delivery","Medication errors and missed signs of deterioration","Better resident outcomes","Shorter shift handovers"],answer:"Medication errors and missed signs of deterioration"},
  {id:"r5p4q2",part:4,type:"mcq",points:1,passage:"Effective communication is central to high-quality care. Care workers communicate with residents, families, colleagues and other professionals every day. Good communication involves not only speaking clearly but also listening actively, observing non-verbal cues and adapting your style to the individual. Some residents may have communication difficulties due to stroke, dementia or hearing loss, requiring the use of alternative methods such as picture boards, simple written messages or sign language. Poor communication in care settings can lead to misunderstandings, medication errors, missed signs of deterioration and increased anxiety in residents. Documenting all relevant conversations and observations in care notes is essential for continuity of care.",question:"Why is documenting conversations in care notes essential?",options:["To meet legal requirements only","To avoid complaints from families","For continuity of care","To monitor staff performance"],answer:"For continuity of care"},
  {id:"r5p4q3",part:4,type:"mcq",points:1,passage:"Effective communication is central to high-quality care. Care workers communicate with residents, families, colleagues and other professionals every day. Good communication involves not only speaking clearly but also listening actively, observing non-verbal cues and adapting your style to the individual. Some residents may have communication difficulties due to stroke, dementia or hearing loss, requiring the use of alternative methods such as picture boards, simple written messages or sign language. Poor communication in care settings can lead to misunderstandings, medication errors, missed signs of deterioration and increased anxiety in residents. Documenting all relevant conversations and observations in care notes is essential for continuity of care.",question:"What alternative communication method is mentioned for residents with communication difficulties?",options:["Shouting more clearly","Picture boards and simple written messages","Video calls only","Asking family to translate"],answer:"Picture boards and simple written messages"},
  {id:"r5p4q4",part:4,type:"mcq",points:1,passage:"Effective communication is central to high-quality care. Care workers communicate with residents, families, colleagues and other professionals every day. Good communication involves not only speaking clearly but also listening actively, observing non-verbal cues and adapting your style to the individual. Some residents may have communication difficulties due to stroke, dementia or hearing loss, requiring the use of alternative methods such as picture boards, simple written messages or sign language. Poor communication in care settings can lead to misunderstandings, medication errors, missed signs of deterioration and increased anxiety in residents. Documenting all relevant conversations and observations in care notes is essential for continuity of care.",question:"What does good communication involve beyond speaking clearly?",options:["Speaking louder","Listening actively and observing non-verbal cues","Using formal medical language","Avoiding difficult topics"],answer:"Listening actively and observing non-verbal cues"},
  {id:"r5p4q5",part:4,type:"mcq",points:1,passage:"Effective communication is central to high-quality care. Care workers communicate with residents, families, colleagues and other professionals every day. Good communication involves not only speaking clearly but also listening actively, observing non-verbal cues and adapting your style to the individual. Some residents may have communication difficulties due to stroke, dementia or hearing loss, requiring the use of alternative methods such as picture boards, simple written messages or sign language. Poor communication in care settings can lead to misunderstandings, medication errors, missed signs of deterioration and increased anxiety in residents. Documenting all relevant conversations and observations in care notes is essential for continuity of care.",question:"What should a care worker do to communicate with a resident who has hearing loss?",options:["Speak very fast","Use alternative methods such as written messages","Ask the family to be present always","Avoid talking to them"],answer:"Use alternative methods such as written messages"},
  // Part 5 – Gap fill
  {id:"r5p5q1",part:5,type:"mcq",points:1,question:"The care team must ___ all relevant information before making a best-interests decision for a resident who lacks capacity.",options:["ignore","gather","delete","guess"],answer:"gather"},
  {id:"r5p5q2",part:5,type:"mcq",points:1,question:"A resident's ___ must be respected even when they are no longer able to express it themselves.",options:["salary","autonomy","schedule","appearance"],answer:"autonomy"},
  {id:"r5p5q3",part:5,type:"mcq",points:1,question:"The physiotherapist recommended a ___ exercise programme to improve the resident's strength and balance.",options:["dangerous","tailored","random","strict"],answer:"tailored"},
  {id:"r5p5q4",part:5,type:"mcq",points:1,question:"All safeguarding concerns must be ___ to the local authority safeguarding team without delay.",options:["hidden","referred","ignored","questioned"],answer:"referred"},
  {id:"r5p5q5",part:5,type:"mcq",points:1,question:"The manager stressed that good documentation is ___ for ensuring continuity of care across different shifts.",options:["optional","essential","unlikely","challenging"],answer:"essential"},
];

// ─── SET 6 READING (B1) ──────────────────────────────────────────────────────
export const set6Reading: Question[] = [
  // Part 1 – Notices (B1 – complex inference required)
  {id:"r6p1q1",part:1,type:"mcq",points:1,passage:"Deprivation of Liberty Safeguards (DoLS): Any restriction placed on a resident's freedom of movement that they would object to, including locked doors or bed rails, requires a formal DoLS authorisation. Unauthorised restrictions constitute unlawful deprivation of liberty.",question:"What is required before placing any restriction on a resident's freedom?",options:["Verbal approval from a nurse","A formal DoLS authorisation","Permission from the family","A doctor's note"],answer:"A formal DoLS authorisation"},
  {id:"r6p1q2",part:1,type:"mcq",points:1,passage:"Nutrition Alert: Three residents on this floor have been identified as at risk of malnutrition following their MUST screening scores. Please ensure meals are fortified, portion sizes are appropriate and fluid intake is documented every two hours.",question:"What does a MUST score identify?",options:["Risk of falls","Risk of malnutrition","Risk of infection","Risk of social isolation"],answer:"Risk of malnutrition"},
  {id:"r6p1q3",part:1,type:"mcq",points:1,passage:"Medicines Reconciliation Notice: On admission, a full medicines reconciliation must be completed within 24 hours, comparing the medicines the patient was taking at home against those prescribed in the care home. Any discrepancies must be reported to the prescribing clinician immediately.",question:"What is the purpose of medicines reconciliation?",options:["To reduce the number of medicines","To compare home medicines with those prescribed in the care home","To check the cost of medicines","To update the care plan"],answer:"To compare home medicines with those prescribed in the care home"},
  {id:"r6p1q4",part:1,type:"mcq",points:1,passage:"Advance Care Planning Notice: Residents should be offered the opportunity to document their wishes about future care, including preferred place of death and resuscitation decisions, in an Advance Care Plan. These documents must be honoured by all staff.",question:"What should staff do with a resident's Advance Care Plan?",options:["File it and review it annually","Follow it only if the family agrees","Honour it","Ask the manager first"],answer:"Honour it"},
  {id:"r6p1q5",part:1,type:"mcq",points:1,passage:"Equality Act 2010 Notice: All residents have the right to receive care without discrimination based on age, disability, gender, race, religion or belief, or sexual orientation. Any discriminatory behaviour by staff will be treated as a serious conduct matter.",question:"Which of the following is NOT listed as a protected characteristic in this notice?",options:["Age","Disability","Income level","Religion or belief"],answer:"Income level"},
  // Part 2 – Short texts
  {id:"r6p2q1",part:2,type:"mcq",points:1,passage:"End-of-life care aims to ensure that people who are approaching death can live as well as possible and die with dignity. It involves managing pain and other distressing symptoms, supporting emotional and spiritual needs, and enabling people to make choices about their care. Research shows that many people prefer to die at home or in a familiar care setting rather than in hospital, but this requires careful planning and coordination between health and social care services.",question:"Where do research findings suggest many people prefer to die?",options:["In a hospital","In a hospice","At home or in a familiar care setting","In a specialist centre"],answer:"At home or in a familiar care setting"},
  {id:"r6p2q2",part:2,type:"mcq",points:1,passage:"End-of-life care aims to ensure that people who are approaching death can live as well as possible and die with dignity. It involves managing pain and other distressing symptoms, supporting emotional and spiritual needs, and enabling people to make choices about their care. Research shows that many people prefer to die at home or in a familiar care setting rather than in hospital, but this requires careful planning and coordination between health and social care services.",question:"What does end-of-life care involve beyond pain management?",options:["Financial planning","Supporting emotional and spiritual needs","Organising the funeral","Legal advice"],answer:"Supporting emotional and spiritual needs"},
  {id:"r6p2q3",part:2,type:"mcq",points:1,passage:"Reflective practice is the process of thinking carefully about your experiences at work in order to learn from them and improve your practice. It involves asking questions such as: What happened? Why did I respond that way? What could I do differently? Regular reflection helps care workers identify their strengths and areas for development, ultimately leading to better outcomes for residents.",question:"What is the primary purpose of reflective practice?",options:["To write reports for the CQC","To learn from experience and improve practice","To identify colleagues who are underperforming","To document errors for the record"],answer:"To learn from experience and improve practice"},
  {id:"r6p2q4",part:2,type:"mcq",points:1,passage:"Reflective practice is the process of thinking carefully about your experiences at work in order to learn from them and improve your practice. It involves asking questions such as: What happened? Why did I respond that way? What could I do differently? Regular reflection helps care workers identify their strengths and areas for development, ultimately leading to better outcomes for residents.",question:"According to the text, what is an outcome of regular reflective practice?",options:["Higher pay","Better outcomes for residents","Faster promotion","Fewer shift hours"],answer:"Better outcomes for residents"},
  {id:"r6p2q5",part:2,type:"mcq",points:1,passage:"Cultural competence in care means understanding and respecting the cultural, religious and personal backgrounds of residents. It requires care workers to adapt their approach to meet the values and beliefs of each individual, for example by respecting dietary restrictions, prayer times or cultural practices around death and dying.",question:"What does cultural competence require care workers to do?",options:["Follow the same routine for all residents","Adapt their approach to respect individual values and beliefs","Learn every resident's language","Avoid discussing cultural differences"],answer:"Adapt their approach to respect individual values and beliefs"},
  // Part 3 – True/False
  {id:"r6p3q1",part:3,type:"truefalse",points:1,passage:"The Francis Report (2013) followed an inquiry into serious failings at Mid Staffordshire NHS Foundation Trust, where hundreds of patients were harmed due to poor care, understaffing and a culture that prioritised targets over patient welfare. Its recommendations led to major reforms in how health and social care organisations are regulated and held accountable.",question:"The Francis Report was published after an inquiry into a housing authority.",answer:false},
  {id:"r6p3q2",part:3,type:"truefalse",points:1,passage:"The Francis Report (2013) followed an inquiry into serious failings at Mid Staffordshire NHS Foundation Trust, where hundreds of patients were harmed due to poor care, understaffing and a culture that prioritised targets over patient welfare. Its recommendations led to major reforms in how health and social care organisations are regulated and held accountable.",question:"The failings included understaffing and prioritising targets over patient welfare.",answer:true},
  {id:"r6p3q3",part:3,type:"truefalse",points:1,passage:"The Francis Report (2013) followed an inquiry into serious failings at Mid Staffordshire NHS Foundation Trust, where hundreds of patients were harmed due to poor care, understaffing and a culture that prioritised targets over patient welfare. Its recommendations led to major reforms in how health and social care organisations are regulated and held accountable.",question:"The Francis Report had no impact on how care organisations are regulated.",answer:false},
  {id:"r6p3q4",part:3,type:"truefalse",points:1,passage:"Compassion fatigue is a state of exhaustion and reduced empathy that can affect care workers who regularly support people in pain or distress. It can lead to mistakes, poor communication and eventually burnout. Employers have a responsibility to support staff wellbeing through supervision, rest breaks and access to counselling services.",question:"Compassion fatigue can lead to mistakes and poor communication.",answer:true},
  {id:"r6p3q5",part:3,type:"truefalse",points:1,passage:"Compassion fatigue is a state of exhaustion and reduced empathy that can affect care workers who regularly support people in pain or distress. It can lead to mistakes, poor communication and eventually burnout. Employers have a responsibility to support staff wellbeing through supervision, rest breaks and access to counselling services.",question:"Staff are solely responsible for managing their own compassion fatigue.",answer:false},
  // Part 4 – Longer passage
  {id:"r6p4q1",part:4,type:"mcq",points:1,passage:"The concept of personalisation in care means that individuals should have choice and control over the care and support they receive. This approach recognises that each person has unique goals, values and circumstances that should shape their care. Personalisation has led to the development of personal budgets, which allow eligible individuals to receive a sum of money to purchase their own care and support services rather than receiving services arranged by the local authority. Critics of personalisation argue that it places too much burden on individuals and families, particularly those who lack the knowledge or confidence to navigate complex social care markets. Supporters, however, maintain that it empowers people and promotes independence and dignity.",question:"What is a personal budget in the context of personalisation?",options:["A monthly allowance for entertainment","Money allocated to purchase one's own care and support","A savings account for retirement","Funding from a private insurer"],answer:"Money allocated to purchase one's own care and support"},
  {id:"r6p4q2",part:4,type:"mcq",points:1,passage:"The concept of personalisation in care means that individuals should have choice and control over the care and support they receive. This approach recognises that each person has unique goals, values and circumstances that should shape their care. Personalisation has led to the development of personal budgets, which allow eligible individuals to receive a sum of money to purchase their own care and support services rather than receiving services arranged by the local authority. Critics of personalisation argue that it places too much burden on individuals and families, particularly those who lack the knowledge or confidence to navigate complex social care markets. Supporters, however, maintain that it empowers people and promotes independence and dignity.",question:"What do critics of personalisation argue?",options:["It costs too much","It places too much burden on individuals and families","It reduces care quality","It is only available in cities"],answer:"It places too much burden on individuals and families"},
  {id:"r6p4q3",part:4,type:"mcq",points:1,passage:"The concept of personalisation in care means that individuals should have choice and control over the care and support they receive. This approach recognises that each person has unique goals, values and circumstances that should shape their care. Personalisation has led to the development of personal budgets, which allow eligible individuals to receive a sum of money to purchase their own care and support services rather than receiving services arranged by the local authority. Critics of personalisation argue that it places too much burden on individuals and families, particularly those who lack the knowledge or confidence to navigate complex social care markets. Supporters, however, maintain that it empowers people and promotes independence and dignity.",question:"According to supporters, what does personalisation promote?",options:["Cost savings for the government","Independence and dignity","Faster discharge from hospital","Reduced paperwork"],answer:"Independence and dignity"},
  {id:"r6p4q4",part:4,type:"mcq",points:1,passage:"The concept of personalisation in care means that individuals should have choice and control over the care and support they receive. This approach recognises that each person has unique goals, values and circumstances that should shape their care. Personalisation has led to the development of personal budgets, which allow eligible individuals to receive a sum of money to purchase their own care and support services rather than receiving services arranged by the local authority. Critics of personalisation argue that it places too much burden on individuals and families, particularly those who lack the knowledge or confidence to navigate complex social care markets. Supporters, however, maintain that it empowers people and promotes independence and dignity.",question:"What shapes care under the personalisation approach?",options:["The care home manager's preference","Government policy alone","Each person's unique goals, values and circumstances","The national average care standard"],answer:"Each person's unique goals, values and circumstances"},
  {id:"r6p4q5",part:4,type:"mcq",points:1,passage:"The concept of personalisation in care means that individuals should have choice and control over the care and support they receive. This approach recognises that each person has unique goals, values and circumstances that should shape their care. Personalisation has led to the development of personal budgets, which allow eligible individuals to receive a sum of money to purchase their own care and support services rather than receiving services arranged by the local authority. Critics of personalisation argue that it places too much burden on individuals and families, particularly those who lack the knowledge or confidence to navigate complex social care markets. Supporters, however, maintain that it empowers people and promotes independence and dignity.",question:"Who traditionally arranges services when personalisation is not used?",options:["The care home","The local authority","The family","The GP"],answer:"The local authority"},
  // Part 5 – Gap fill
  {id:"r6p5q1",part:5,type:"mcq",points:1,question:"The senior nurse ___ the incident thoroughly before submitting the safeguarding referral.",options:["ignored","investigated","cancelled","delayed"],answer:"investigated"},
  {id:"r6p5q2",part:5,type:"mcq",points:1,question:"Person-centred care requires caregivers to ___ their communication style to the individual needs of each resident.",options:["standardise","adapt","copy","reduce"],answer:"adapt"},
  {id:"r6p5q3",part:5,type:"mcq",points:1,question:"The residents in the palliative care unit are ___ supported with pain management and emotional needs.",options:["rarely","never","holistically","occasionally"],answer:"holistically"},
  {id:"r6p5q4",part:5,type:"mcq",points:1,question:"Following the CQC inspection, the home was required to ___ its medication administration procedures within 28 days.",options:["abandon","overhaul","celebrate","ignore"],answer:"overhaul"},
  {id:"r6p5q5",part:5,type:"mcq",points:1,question:"The care plan clearly ___ that the resident has previously expressed a wish not to be resuscitated.",options:["denies","stipulates","questions","deletes"],answer:"stipulates"},
];
