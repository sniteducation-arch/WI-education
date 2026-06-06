/**
 * Generates MP3 audio for ALL listening questions (Sets 1–3) using OpenAI TTS.
 * Run once from the project root:  node scripts/generate-listening-audio.mjs
 *
 * Output:  public/audio/listening/<id>.mp3
 * Skips files that already exist (safe to re-run).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

// ── Load OPENAI_API_KEY from .env.local ────────────────────────────────────────
const envContent = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
const OPENAI_API_KEY = envContent.match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim();
if (!OPENAI_API_KEY) { console.error("OPENAI_API_KEY not found in .env.local"); process.exit(1); }

const OUTPUT_DIR = path.join(ROOT, "public", "audio", "listening");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ── Unique transcripts to generate ────────────────────────────────────────────
// Questions sharing the same transcript reuse the same file (see URL_MAP below).
const TRANSCRIPTS = {

  // ════════════════════════════════════════════════════════
  // SET 1
  // ════════════════════════════════════════════════════════

  // Part 1 — Chat with a colleague (choose the correct reply)
  "l1p1q1": "Colleague: Good morning! Could you help me turn Mrs. Davies? She's been on her left side for too long.",
  "l1p1q2": "Manager: Have you completed the handover notes before your shift ends?",
  "l1p1q3": "Nurse: Mrs. Jones hasn't eaten her lunch today. Have you noticed anything unusual?",
  "l1p1q4": "Family member: Excuse me, can you tell me how my father has been today?",

  // Part 2 — Order the information (one ordering question)
  "l1p2q1": "Before we start the morning round, let me go over the patient admission steps. First, we welcome the new resident and show them to their room. Then we complete the initial health assessment. After that, we create the care plan together with the resident and family. The next step is a family meeting to discuss the care plan. Finally, the resident settles in and regular care begins.",

  // Part 3 — Fill in the gap
  "l1p3q1": "Manager: Fire drill will be held this Thursday at 2 PM. All staff must participate and guide residents to the assembly point outside.",
  "l1p3q2": "Nurse: Remember, Mrs. Jones needs her blood pressure medication at noon and her vitamins in the evening.",
  "l1p3q3": "Caregiver: Mr. Brown, would you like tea or coffee this morning? Mr. Brown: Coffee please, but no sugar. Caregiver: Of course. I'll bring it right away.",
  "l1p3q4": "Manager: Today we have a new resident joining us, Mrs. Patel. She needs help with meals and walking. Please make her feel welcome.",

  // Part 4 — Choose the correct answer (short recordings)
  "l1p4q1": "Training session: When moving a patient from bed to wheelchair, always lock the wheelchair brakes first. Then help the patient to the edge of the bed. Place a transfer belt around their waist. Ask them to push up with their hands, then stand and pivot to sit in the chair.",
  "l1p4q2": "Doctor on phone: Please make sure Mr. Sharma takes his antibiotics three times a day with food. He should complete the full 7-day course even if he feels better.",
  "l1p4q3": "Caregiver report: Mrs. Chen was upset this morning. She cried during breakfast and said she missed her family. I sat with her for 20 minutes and she felt calmer afterwards.",
  "l1p4q4": "Phone rings. Receptionist: Good morning, Sunrise Care Home. How can I help? Caller: I would like to book an appointment to visit my mother. Is Saturday morning available? Receptionist: Yes, Saturday at 10 AM is free.",

  // Part 5 — Choose the correct answer (extended, longer recordings)
  // l1p5q1, l1p5q2, l1p5q3 share the Health & Safety briefing audio
  "l1p5q1": "Health and Safety Briefing: Good morning everyone. Today we are going over our infection control policy. The most important thing is hand hygiene. You must wash your hands before and after every patient contact. Use the six-step technique and wash for at least 20 seconds. Alcohol gel is available at every bedside, but remember it is not a substitute for soap and water when hands are visibly dirty. If you have any cuts or wounds, please cover them with a waterproof plaster before starting your shift.",
  // l1p5q2 → shares l1p5q1
  // l1p5q3 → shares l1p5q1
  "l1p5q4": "End of life care briefing: When a resident enters the end-of-life stage, we focus on comfort, dignity and supporting the family rather than curative treatment. Pain management becomes the priority. Always follow the care plan and the advance directive if there is one. Family should be contacted promptly and allowed flexible visiting. Create a calm, peaceful environment and offer emotional support to both the resident and the family.",

  // ════════════════════════════════════════════════════════
  // SET 2
  // ════════════════════════════════════════════════════════

  // Part 1 — Chat with a colleague
  "l2p1q1": "Manager: All care plans for residents on your ward need to be reviewed and updated by Friday afternoon. Can you do that?",
  "l2p1q2": "Resident: Excuse me, could you help me put on my cardigan? My shoulder is a bit stiff today.",
  "l2p1q3": "Nurse: Mrs. Okafor's new medication must be taken 30 minutes before her meal. Can you make sure that happens?",
  "l2p1q4": "Senior caregiver: Before you go home, make sure you have handed over the medication keys to Jenny.",

  // Part 2 — Order the information
  "l2p2q1": "PPE training: When entering an isolation room, the order is very important. First, wash your hands thoroughly. Then put on the apron. After that, put on your gloves. Next, put on the mask. Finally, you may enter the room. Remember this order every time.",

  // Part 3 — Fill in the gap
  "l2p3q1": "Nurse to caregiver: Please check on Mr. Peters in room 8. He pressed his call bell 20 minutes ago and nobody has responded. This is unacceptable. Call bells must be answered within five minutes.",
  "l2p3q2": "Job interview recording: My name is Priya. I have been working in elderly care for five years — two years in India and three years in the UK.",
  "l2p3q3": "Staff meeting: All staff must keep personal mobile phones stored in lockers during working hours. You may check them during your break.",
  "l2p3q4": "Nurse briefing: We have a new resident coming in tomorrow — Mrs. Begum. She has high blood pressure and is allergic to penicillin. Please make a note of this.",

  // Part 4 — Choose the correct answer
  // l2p4q2, l2p4q3, l2p4q4 share the Moving & Handling briefing
  "l2p4q1": "Moving and Handling Briefing: The most important rule is never to lift a resident alone. All manual lifts require two members of staff. Before any transfer, always introduce yourself to the resident and explain what you are going to do. If the resident is in pain or refuses, do not proceed — inform the nurse immediately. After the transfer, always record it in the care notes.",

  // Part 5 — Choose the correct answer (extended)
  "l2p5q1": "Caregiver report: Mrs. Diaz had a small accident in her room this morning. She needs help to the bathroom and her bedding needs changing. I have informed the nurse and completed the incident form.",
  "l2p5q2": "Staff announcement: The activity coordinator has set up a sing-along session in the lounge at 2 PM today. Please encourage residents to attend, especially those who seem withdrawn or low in mood. Their participation will improve their wellbeing.",
  "l2p5q3": "Caregiver: The shower in Room 5 is still not working. Maintenance was called yesterday but nobody came. Mrs. Wright needs her shower this morning. Can we use the accessible bathroom on the second floor?",
  "l2p5q4": "Nurse: The GP is visiting this Wednesday at 11 AM to review medication for residents in the Bluebell wing. Please make sure all relevant care files and medication records are available at the nurses' station before 10:30 AM.",

  // ════════════════════════════════════════════════════════
  // SET 3
  // ════════════════════════════════════════════════════════

  // Part 1 — Chat with a colleague
  "l3p1q1": "Caregiver to nurse: I just noticed that Mr. Collins has a new reddening on his lower back. I have repositioned him. Should I complete an incident report?",
  "l3p1q2": "Manager: We have a mandatory fire safety training on Monday at 9 AM. All care staff must attend. Please arrange cover for your residents first.",
  "l3p1q3": "Resident: I am feeling a bit dizzy today. I nearly fell when I stood up too fast.",
  "l3p1q4": "Colleague: Mrs. Abbott will not eat her lunch. The food is too hard for her teeth. What should we do?",

  // Part 2 — Order the information
  "l3p2q1": "Falls prevention training: Before you help a resident to walk, always follow these steps in order. First, check that they are wearing non-slip footwear. Second, make sure their walking aid is within reach. Third, check that the path ahead is clear of any obstacles. Fourth, tell the resident what you are going to do. Finally, begin walking with them slowly.",

  // Part 3 — Fill in the gap
  "l3p3q1": "Interview recording: My name is Roberto. I moved to the UK three years ago and I have been working in care since I arrived.",
  "l3p3q2": "End-of-life care briefing: When a resident enters the end-of-life stage, pain management becomes the priority. Always follow the care plan and contact the family promptly.",
  "l3p3q3": "Nurse to caregiver: Mrs. Huang has been refusing her evening medication for three days. Document each refusal clearly in her medication record.",
  "l3p3q4": "Manager: A family member complained that the rooms are not clean enough. Please ensure all rooms are checked at the start of every shift and cleaning issues are reported to housekeeping immediately.",

  // Part 4 — Choose the correct answer
  // l3p4q2, l3p4q3, l3p4q4 share the Safeguarding briefing
  "l3p4q1": "Safeguarding Briefing: Good morning. Today's session covers safeguarding adults. Safeguarding means protecting people from abuse, neglect and harm. As a caregiver, you have a duty to report any concerns about a resident's wellbeing. Types of abuse include physical, emotional, financial and sexual abuse. Signs include unexplained bruises, withdrawal, sudden changes in behaviour, or a resident appearing frightened around a certain person. If you suspect abuse, do not investigate yourself — report your concerns immediately to the manager or the designated safeguarding lead. All concerns must be documented, regardless of how minor they seem.",

  // Part 5 — Choose the correct answer (extended)
  "l3p5q1": "Caregiver report: Mrs. Reid has been very tearful today. She told me she is worried about her son who has not visited for three weeks. I sat with her for a while and she felt better. I have made a note in her daily report.",
  "l3p5q2": "I have just checked on Mr. Vasquez and found him on the floor next to his bed. He seems confused but is conscious and says his hip hurts. I have not moved him. I have pressed the emergency buzzer and I am staying with him until the nurse arrives.",
  "l3p5q3": "The dietitian has left a note saying that three residents need to be encouraged to eat more protein. Please offer them cheese, eggs or meat with every meal and record how much they eat on the nutrition monitoring sheet.",
  "l3p5q4": "A reminder that tomorrow's morning medication round will start at 7:30 AM instead of 8 AM because the pharmacist is coming early to audit the controlled drugs cabinet. Please make sure all night staff have updated the medication records before handing over.",

  // ════════════════════════════════════════════════════════
  // SET 4 — Medication Safety
  // ════════════════════════════════════════════════════════
  "l4p1q1": "Nurse: Mr. Kim has been given the wrong dose of his blood thinner this morning. Can you check the medication chart and let me know what it says?",
  "l4p1q2": "Resident: These tablets look different from the ones I usually take. Are you sure they are mine?",
  "l4p1q3": "Senior caregiver: Have you signed the medication administration record after giving Mrs. Park her morning tablets?",
  "l4p1q4": "Manager: We have had a complaint that a resident's medication was given 45 minutes late today. Can you explain what happened?",
  "l4p2q1": "Medication safety training: Before giving any medication, always follow these steps. First, wash your hands. Second, check the resident's full name and date of birth against the medication chart. Third, check the medication name, dose, and expiry date. Fourth, explain to the resident what the medication is for. Finally, give the medication, watch the resident take it, and sign the administration record.",
  "l4p3q1": "Nurse: All controlled drugs must be counted and checked by two members of staff at the start and end of every shift. Never give controlled drugs alone.",
  "l4p3q2": "Nurse: Mrs. Thompson's antibiotic must be given with food to prevent stomach upset. Please make sure she has eaten before you give it.",
  "l4p3q3": "Manager: Any medication error, even a near-miss, must be reported immediately to the nurse in charge and recorded on an incident form. Do not wait until the end of the shift.",
  "l4p3q4": "Nurse: Mr. Patel refused his evening medication today. This must be documented in the medication administration record and the reason noted if he gives one.",
  "l4p4q1": "Diabetes Care Briefing: For residents with diabetes, check blood sugar levels before meals. A reading below 4 means hypoglycaemia. Give 15 grams of fast-acting sugar, for example a small glass of fruit juice or three glucose tablets. Wait 15 minutes and check again. If the reading is still below 4, repeat. Always inform the nurse and document the reading and action taken.",
  "l4p5q1": "Night Shift Handover: Good evening. Key points for tonight. Mrs. Martinez in Room 12 has been started on a new sleep medication. She may be drowsy in the morning, so wake her gently. Mr. Singh in Room 4 had a fall this afternoon. He is on one-hour observations and his call bell must be answered within 2 minutes. Mrs. Obi in Room 7 has refused all food and fluids today. Document every offer and refusal on her monitoring sheet. If she still refuses by midnight, call the on-call nurse.",
  "l4p5q4": "Caregiver report: I found Mr. Jackson's medication still in his cup at 9:30 PM. He told me he had hidden it under his tongue earlier and spat it out when I left the room. I informed the nurse immediately and documented the incident. The nurse will review his medication form and may call the GP.",

  // ════════════════════════════════════════════════════════
  // SET 5 — Personal Care & Dignity
  // ════════════════════════════════════════════════════════
  "l5p1q1": "Senior caregiver: Mrs. Novak has asked not to be assisted with personal care by male carers. Have you noted this in her care plan?",
  "l5p1q2": "Resident: I don't want you to open the curtains while you help me get dressed. I like my privacy.",
  "l5p1q3": "Nurse: Mr. Dube's skin assessment showed a new pressure sore on his heel. Can you make sure he is repositioned every two hours?",
  "l5p1q4": "Colleague: Mrs. Hassan keeps calling out at night. Her family says she used to listen to music to help her sleep. Should we try that?",
  "l5p2q1": "Personal care training: When assisting a resident with a shower, follow this order. First, explain what you are going to do and ask for their consent. Second, check the water temperature before the resident steps in. Third, close the door to ensure privacy throughout. Fourth, hand the resident items they can manage themselves to promote independence. Finally, help dry and dress them and check their skin for any redness or sores.",
  "l5p3q1": "Manager: Always knock and wait for a response before entering any resident's room. Even if the door is open, this shows respect for their personal space.",
  "l5p3q2": "Nurse: Mr. Okafor has a tissue viability concern. His sacrum should be checked every four hours and a repositioning chart completed each time he is turned.",
  "l5p3q3": "Senior caregiver: When helping a resident to eat, always sit down at their level. Never stand over them. It can feel disrespectful and may affect how well they eat.",
  "l5p3q4": "Manager: Any resident who refuses personal care must have their refusal recorded, and the team must try again later and document that attempt too.",
  "l5p4q1": "Dementia Care Briefing: Residents with dementia may become confused or anxious, especially in the late afternoon, sometimes called sundowning. Approach calmly, use simple short sentences, and maintain eye contact. Do not argue or correct them if they say something untrue, as this increases distress. Use distraction, such as a familiar activity, music, or a favourite object. If behaviour becomes very challenging, do not restrain the resident. Call for support immediately and document the episode.",
  "l5p5q1": "Family Communication Briefing: When a resident's family calls, always be warm and professional. If they ask for clinical information such as test results, diagnosis changes, or medication updates, you must not share this yourself. Politely explain that only the nurse or doctor in charge can give clinical information. Take the family member's name and phone number and pass the message to the nurse straight away. If a family member becomes angry or upset, remain calm. Do not raise your voice. If the situation escalates, ask a senior colleague to step in.",
  "l5p5q4": "Caregiver: Mrs. Lee told me today she has been feeling lonely since her roommate left last month. She asked if she could be moved closer to the lounge so she has more company during the day. I have added this to her daily notes and will mention it at the next care review.",

  // ════════════════════════════════════════════════════════
  // SET 6 — Emergencies & First Aid
  // ════════════════════════════════════════════════════════
  "l6p1q1": "Colleague: Mr. Adeyemi has just choked on his food but he is coughing hard and can still speak. What should we do?",
  "l6p1q2": "Manager: The fire alarm has just been tested. All staff must know the location of the assembly point. Do you know where it is?",
  "l6p1q3": "Nurse: Mrs. Fernandez has pressed her emergency buzzer and says she feels very short of breath. Can you go to her immediately?",
  "l6p1q4": "Senior caregiver: We had a near-miss this morning. A wet floor with no warning sign. Did you see who mopped it?",
  "l6p2q1": "Falls response training: When you find a resident on the floor, always follow these steps. First, stay calm and do not move the resident. Second, check if they are conscious and can respond to you. Third, press the emergency buzzer or call for help. Fourth, stay with the resident and reassure them until help arrives. Finally, once the nurse has assessed the resident, complete an incident report.",
  "l6p3q1": "Manager: All staff must know where the defibrillator is kept. It is located in the reception area next to the main entrance. Please check it every morning.",
  "l6p3q2": "Nurse: If a resident has a seizure, do not hold them down or put anything in their mouth. Time the seizure and call for help immediately.",
  "l6p3q3": "Fire safety trainer: In a fire, remember RACE. Rescue, Alarm, Contain, Evacuate. The most important first step is to rescue any resident in immediate danger.",
  "l6p3q4": "Senior caregiver: The evacuation chair is stored on the second floor next to the lift. Only trained staff may use it. It is for residents who cannot use the stairs.",
  "l6p4q1": "Choking Response Briefing: If a resident is choking and cannot cough, speak, or breathe, act immediately. Stand behind them, lean them slightly forward, and give up to five firm back blows between the shoulder blades. If this does not clear the blockage, perform up to five abdominal thrusts. Place your fist above the navel and pull sharply inward and upward. If the blockage is still not cleared, call 999 and continue cycles of five back blows and five abdominal thrusts. Always report and document any choking incident, even if resolved.",
  "l6p5q1": "Fire Evacuation Briefing: In the event of a fire, do not use the lifts. Assist residents to the nearest fire exit using the posted evacuation route. If a resident cannot walk, use the evacuation chair. Only trained staff may do this. Close all doors behind you as you evacuate. This slows the spread of smoke and fire. At the assembly point, account for every resident on your list. Do not re-enter the building until the fire officer gives the all-clear. If you cannot evacuate a resident, move them to a refuge area and contact the fire brigade.",
  "l6p5q4": "Nurse: This afternoon Mr. Wu experienced a sudden drop in blood pressure. He became pale, dizzy, and nearly fainted during his walk to the lounge. We helped him safely to the floor, raised his legs, and called the GP. He has now recovered and is resting. Please monitor him every 30 minutes and record his blood pressure on the observation chart.",

  // ════════════════════════════════════════════════════════
  // SET 7 — End of Life & Professional Development
  // ════════════════════════════════════════════════════════
  "l7p1q1": "Senior caregiver: Mr. Gibson is in the final stages of his illness. His family is with him now. How can we best support them?",
  "l7p1q2": "Nurse: You have a supervision meeting with the manager at 2 PM today. Please bring your reflective journal and any training certificates.",
  "l7p1q3": "Resident's daughter: I am worried that my mother is not being repositioned often enough. She has marks on her skin.",
  "l7p1q4": "Manager: Your probation period ends next month. I would like to discuss your progress and development goals. Can you prepare a short self-assessment?",
  "l7p2q1": "Handover report training: When writing your shift handover report, follow this structure. First, record the date, your name, and the shift time. Second, note any changes in a resident's condition since the last handover. Third, record any medication given, refused, or omitted and the reason. Fourth, note any incidents or near-misses, even if minor. Finally, sign and date the report and hand it to the next shift caregiver in person.",
  "l7p3q1": "Training facilitator: Every caregiver must complete a mandatory annual appraisal with their line manager. This is your opportunity to discuss your progress, goals, and any training needs.",
  "l7p3q2": "Senior caregiver: In palliative care, always follow the resident's advance care plan. If they have a Do Not Resuscitate order in place, this must be respected and clearly documented.",
  "l7p3q3": "Manager: All staff who identify a training need must log it in the training register by the end of the month. This helps us plan the right courses for the team.",
  "l7p3q4": "Nurse: Mrs. Reyes passed away peacefully this morning. Her body must remain undisturbed until the doctor has confirmed the death and the family are ready.",
  "l7p4q1": "Cultural Sensitivity Briefing: Every resident comes from a unique cultural background and our care must reflect this. Before carrying out personal care, check the care plan for any religious or cultural preferences. For example, some residents require same-gender carers, specific prayer times must be respected, and some residents follow dietary laws. Never assume. Always ask the resident or their family. If you are unsure about a cultural need, speak to your manager rather than guessing. Document any preferences clearly so all staff are aware.",
  "l7p5q1": "Staff Development Meeting: Welcome everyone. Our medication error rate has reduced by 40 percent this year, and resident satisfaction scores are the highest since we opened. Several of you have completed your NVQ Level 2. Well done. Looking ahead, we will introduce a new digital care recording system in January. Training will be in December and attendance is mandatory. Please inform your line manager of any scheduling conflicts as soon as possible.",
  "l7p5q4": "Caregiver reflective note: Today I made a mistake. I gave Mrs. Afolabi her lunch before confirming her texture-modified diet. Fortunately the food was soft and she was fine. I reported it to the nurse, completed an incident form, and reviewed her care plan carefully. I have learned to always check the care plan before preparing or serving food.",
};

// ── Question ID → audio file ID (shared transcripts reuse the same file) ──────
const URL_MAP = {
  // Set 1
  l1p1q1:"l1p1q1", l1p1q2:"l1p1q2", l1p1q3:"l1p1q3", l1p1q4:"l1p1q4",
  l1p2q1:"l1p2q1",
  l1p3q1:"l1p3q1", l1p3q2:"l1p3q2", l1p3q3:"l1p3q3", l1p3q4:"l1p3q4",
  l1p4q1:"l1p4q1", l1p4q2:"l1p4q2", l1p4q3:"l1p4q3", l1p4q4:"l1p4q4",
  l1p5q1:"l1p5q1", l1p5q2:"l1p5q1", l1p5q3:"l1p5q1",
  l1p5q4:"l1p5q4",
  // Set 2
  l2p1q1:"l2p1q1", l2p1q2:"l2p1q2", l2p1q3:"l2p1q3", l2p1q4:"l2p1q4",
  l2p2q1:"l2p2q1",
  l2p3q1:"l2p3q1", l2p3q2:"l2p3q2", l2p3q3:"l2p3q3", l2p3q4:"l2p3q4",
  l2p4q1:"l2p4q1", l2p4q2:"l2p4q1", l2p4q3:"l2p4q1", l2p4q4:"l2p4q1",
  l2p5q1:"l2p5q1", l2p5q2:"l2p5q2", l2p5q3:"l2p5q3", l2p5q4:"l2p5q4",
  // Set 3
  l3p1q1:"l3p1q1", l3p1q2:"l3p1q2", l3p1q3:"l3p1q3", l3p1q4:"l3p1q4",
  l3p2q1:"l3p2q1",
  l3p3q1:"l3p3q1", l3p3q2:"l3p3q2", l3p3q3:"l3p3q3", l3p3q4:"l3p3q4",
  l3p4q1:"l3p4q1", l3p4q2:"l3p4q1", l3p4q3:"l3p4q1", l3p4q4:"l3p4q1",
  l3p5q1:"l3p5q1", l3p5q2:"l3p5q2", l3p5q3:"l3p5q3", l3p5q4:"l3p5q4",
  // Set 4
  l4p1q1:"l4p1q1", l4p1q2:"l4p1q2", l4p1q3:"l4p1q3", l4p1q4:"l4p1q4",
  l4p2q1:"l4p2q1",
  l4p3q1:"l4p3q1", l4p3q2:"l4p3q2", l4p3q3:"l4p3q3", l4p3q4:"l4p3q4",
  l4p4q1:"l4p4q1", l4p4q2:"l4p4q1", l4p4q3:"l4p4q1", l4p4q4:"l4p4q1",
  l4p5q1:"l4p5q1", l4p5q2:"l4p5q1", l4p5q3:"l4p5q1", l4p5q4:"l4p5q4",
  // Set 5
  l5p1q1:"l5p1q1", l5p1q2:"l5p1q2", l5p1q3:"l5p1q3", l5p1q4:"l5p1q4",
  l5p2q1:"l5p2q1",
  l5p3q1:"l5p3q1", l5p3q2:"l5p3q2", l5p3q3:"l5p3q3", l5p3q4:"l5p3q4",
  l5p4q1:"l5p4q1", l5p4q2:"l5p4q1", l5p4q3:"l5p4q1", l5p4q4:"l5p4q1",
  l5p5q1:"l5p5q1", l5p5q2:"l5p5q1", l5p5q3:"l5p5q1", l5p5q4:"l5p5q4",
  // Set 6
  l6p1q1:"l6p1q1", l6p1q2:"l6p1q2", l6p1q3:"l6p1q3", l6p1q4:"l6p1q4",
  l6p2q1:"l6p2q1",
  l6p3q1:"l6p3q1", l6p3q2:"l6p3q2", l6p3q3:"l6p3q3", l6p3q4:"l6p3q4",
  l6p4q1:"l6p4q1", l6p4q2:"l6p4q1", l6p4q3:"l6p4q1", l6p4q4:"l6p4q1",
  l6p5q1:"l6p5q1", l6p5q2:"l6p5q1", l6p5q3:"l6p5q1", l6p5q4:"l6p5q4",
  // Set 7
  l7p1q1:"l7p1q1", l7p1q2:"l7p1q2", l7p1q3:"l7p1q3", l7p1q4:"l7p1q4",
  l7p2q1:"l7p2q1",
  l7p3q1:"l7p3q1", l7p3q2:"l7p3q2", l7p3q3:"l7p3q3", l7p3q4:"l7p3q4",
  l7p4q1:"l7p4q1", l7p4q2:"l7p4q1", l7p4q3:"l7p4q1", l7p4q4:"l7p4q1",
  l7p5q1:"l7p5q1", l7p5q2:"l7p5q1", l7p5q3:"l7p5q1", l7p5q4:"l7p5q4",
};

// ── Generate one audio file ────────────────────────────────────────────────────
async function generateOne(id, text) {
  const outPath = path.join(OUTPUT_DIR, `${id}.mp3`);
  if (fs.existsSync(outPath)) {
    console.log(`  ✓ ${id}.mp3 already exists — skipping`);
    return;
  }
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "tts-1", input: text, voice: "nova", speed: 0.88 }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`  ✗ ${id} — ${err}`);
    return;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
  console.log(`  ✓ ${id}.mp3  (${(buf.length / 1024).toFixed(0)} KB)`);
}

// ── Rewrite listening-audio-urls.ts ──────────────────────────────────────────
function writeUrlFile() {
  const urlsPath = path.join(ROOT, "lib", "listening-audio-urls.ts");
  const entries = Object.entries(URL_MAP)
    .map(([qId, fileId]) => `  "${qId}": "/audio/listening/${fileId}.mp3"`)
    .join(",\n");
  const content = `// Auto-generated by scripts/generate-listening-audio.mjs — do not edit manually\nexport const listeningAudioUrls: Record<string, string> = {\n${entries}\n};\n`;
  fs.writeFileSync(urlsPath, content);
  console.log("\n✓ lib/listening-audio-urls.ts rewritten");
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const total = Object.keys(TRANSCRIPTS).length;
  console.log(`\nGenerating ${total} unique audio files → public/audio/listening/\n`);

  let i = 0;
  for (const [id, text] of Object.entries(TRANSCRIPTS)) {
    i++;
    process.stdout.write(`[${i}/${total}] `);
    await generateOne(id, text);
    // Small delay to stay within rate limits
    await new Promise(r => setTimeout(r, 300));
  }

  writeUrlFile();
  console.log(`\nAll done. Run 'npm run dev' to serve the new audio files.\n`);
}

main().catch((err) => { console.error(err); process.exit(1); });
