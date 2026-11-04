/* Speaking module data. Plain arrays/objects; rendering lives in speaking.js */

/* Part 1: questions grouped by topic */
const SP_P1 = {
 "Work & Study":["Do you work or are you a student?","Why did you choose that job or subject?","What do you like most about it?","Would you like to change it in the future?","Do you prefer studying alone or with others?","What is a typical day like for you?"],
 "Home & Hometown":["Where is your hometown?","What do you like about your hometown?","Do you live in a house or a flat?","What is your favourite room at home?","Would you like to live somewhere else one day?","Has your hometown changed much?"],
 "Free time":["What do you usually do on weekends?","Do you have any hobbies?","Do you prefer to relax at home or go out?","Did you have different hobbies as a child?","Do you like reading?","How do you usually spend your evenings?"],
 "Food & Cooking":["Do you enjoy cooking?","What is your favourite food?","Do you prefer eating at home or in restaurants?","Do you like trying new food?","Is there any food you don't like?","Do you prefer tea or coffee?"],
 "Technology":["How often do you use your phone?","What do you use the internet for?","Do you prefer messaging or calling?","Are you good with new technology?","What was your first phone like?","Do you think people use phones too much?"],
 "Travel & Transport":["How do you usually travel to work or school?","Do you like travelling?","Do you prefer buses or trains?","What kind of place would you like to visit?","Do you prefer to travel alone or with others?","Is public transport good where you live?"],
 "Daily life":["Do you prefer mornings or evenings?","What is your favourite season?","Do you like shopping?","How do you keep healthy?","Do you often invite friends to your home?","What kind of music do you listen to?"]
};

/* Part 2: cue cards. f = a likely rounding-off question */
const SP_CUES = [
 {t:"Describe a place you like to visit.",p:["where it is","when you go there","what you do there","and explain why you like it"],f:"Do many people go there?"},
 {t:"Describe a person who has influenced you.",p:["who this person is","how you know them","what they are like","and explain how they influenced you"],f:"Do you still see this person?"},
 {t:"Describe a memorable trip you have taken.",p:["where you went","who you went with","what you did there","and explain why it was memorable"],f:"Would you go there again?"},
 {t:"Describe a skill you would like to learn.",p:["what the skill is","why you want to learn it","how you would learn it","and explain how it would help you"],f:"Is it hard to learn?"},
 {t:"Describe an important decision you made.",p:["what the decision was","when you made it","who helped you","and explain why it was important"],f:"Do you regret it?"},
 {t:"Describe a piece of technology you use often.",p:["what it is","how often you use it","what you use it for","and explain why it is useful"],f:"Could you live without it?"},
 {t:"Describe a book or film that impressed you.",p:["what it was","when you experienced it","what it was about","and explain why it impressed you"],f:"Would you recommend it to others?"},
 {t:"Describe a time you helped someone.",p:["who you helped","when it happened","how you helped","and explain how you felt about it"],f:"Did they thank you?"},
 {t:"Describe a hobby you enjoy.",p:["what the hobby is","when you started it","how often you do it","and explain why you enjoy it"],f:"Is it expensive?"},
 {t:"Describe a goal you want to achieve.",p:["what the goal is","when you set it","what you are doing to achieve it","and explain why it matters to you"],f:"Do you think you will reach it?"},
 {t:"Describe a meal you enjoyed with other people.",p:["what the meal was","who you ate with","where you ate","and explain why you enjoyed it"],f:"Do you often eat with other people?"},
 {t:"Describe a time you were late for something.",p:["what it was","why you were late","what happened","and explain how you felt"],f:"Are you usually on time?"}
];

/* Part 3: abstract questions by theme */
const SP_P3 = {
 "Technology":["Why do people prefer online shopping?","How has technology changed the way people communicate?","Do you think people depend on technology too much?","How might technology change education in the future?"],
 "Education":["Should schools teach more practical skills?","Is it important for young people to learn a second language?","Should university education be free for everyone?","What makes a good teacher?"],
 "Work":["What are the advantages of working from home?","Why do some people change jobs often?","Is job satisfaction more important than salary?","How will jobs change in the next 20 years?"],
 "Society":["How has social media affected personal relationships?","Why do some people prefer living in cities?","Do older and younger people have different values?","How can communities bring people closer together?"],
 "Environment":["How can governments encourage healthier lifestyles?","What can individuals do to protect the environment?","Should companies be responsible for pollution?","Why do people find it hard to change their habits?"],
 "Travel":["Why do people enjoy travelling to other countries?","Does tourism do more good than harm?","How has travel changed in the last few decades?","Is it better to travel alone or in a group?"]
};

/* Openers / closers / thinking time, grouped */
const SP_PHRASES = {
 p1:[
  ["Open the answer",["To be honest, …","Well, it depends, but generally …","I'd say yes, mainly because …","Not really, to be fair, because …","Actually, I'm quite into …"]],
  ["Close the answer",["… and that's pretty much it.","… so yeah, that's how I feel about it.","… which is why I keep doing it."]],
  ["Need time to think",["Let me think for a second …","Hmm, that's a good question …","Actually, what I mean is …"]]
 ],
 p3:[
  ["Speculate",["I suppose it could be because …","Perhaps one explanation is …","It might have something to do with …"]],
  ["Compare",["Compared to the past, …","Whereas younger people tend to …","Unlike in the past, people now …"]],
  ["Close in a balanced way",["Having said that, …","That said, I still believe …","On balance, though, I'd say …"]]
 ]
};

/* Basic word -> better word */
const SP_UP = [
 ["good","beneficial · worthwhile · impressive"],
 ["bad","harmful · disappointing · ineffective"],
 ["very","extremely · particularly · really"],
 ["I think","I'd say · I reckon · from my point of view"],
 ["a lot of","plenty of · a great deal of · many"],
 ["important","crucial · vital · significant"],
 ["nice","pleasant · lovely · enjoyable"],
 ["big","huge · massive · considerable"]
];

/* Complex structures with an example */
const SP_STRUCT = [
 ["Relative clause","It's a place <b>which</b> I visit every year."],
 ["Conditional","If I had more time, I <b>would</b> travel more."],
 ["Participle clause","<b>Having lived</b> abroad, I understand other cultures better."],
 ["Present perfect","I <b>have been learning</b> English for five years."],
 ["Used to","I <b>used to</b> play football every weekend."],
 ["Contrast","<b>Although</b> it is expensive, it's worth it."]
];

/* Band 6 vs band 7 wording per criterion (kept short, for self-rating) */
const SP_BANDS = [
 ["Fluency & Coherence","6: you keep going but sometimes stop to find words, and you repeat yourself.","7: you speak at length without effort, and use linking words naturally."],
 ["Lexical Resource","6: enough words for most topics, with some mistakes in word choice.","7: you use less common words and collocations, and paraphrase when you forget a word."],
 ["Grammar","6: a mix of simple and complex sentences, with some errors.","7: you use complex sentences often, and most are error-free."],
 ["Pronunciation","6: mostly clear, but some words are hard to understand.","7: easy to understand throughout, with natural stress and intonation."]
];

const SP_MISTAKES = [
 ["Too many “eee…”","Use a natural filler: “Well, …”, “Let me think…”."],
 ["Repeating the question word for word","Paraphrase it: “Do you like reading?” → “I'm quite into reading.”"],
 ["One-sentence answers","Extend with Answer + Reason + Detail."],
 ["Memorised answers with flat tone","Practise ideas, not scripts. Vary your intonation."],
 ["Mixing past and present tense","Past for stories, present for facts. Check it when you listen back."],
 ["Hard words used wrongly","A simple word used correctly beats a fancy one used wrongly."]
];

const SP_CHECK = [
 "Part 1: I answered with Answer + Reason + Detail, not one sentence.",
 "Part 1: I used a natural filler instead of “eee”.",
 "Part 2: I followed the 5 blocks (Opening, What, When, Why, Closing).",
 "Part 2: I spoke for the full 2 minutes without a long stop.",
 "Part 2: I wrote keywords, not full sentences.",
 "Part 3: I used AREA (Answer, Reason, Example, Alternative).",
 "Part 3: I included a speculation and the other side.",
 "I used at least 2 complex structures.",
 "My tenses were consistent.",
 "I recorded myself and listened back."
];

const SP_ROUTINE = [
 ["10 min","Shadowing: listen to a podcast and repeat it exactly."],
 ["10 min","Record one Part 2 answer, then listen back."],
 ["5 min","One random topic: speak for 1 minute non-stop."],
 ["5 min","Replace 3 basic words with better ones."],
 ["5 min","One Part 3 question with AREA."],
 ["5 min","Review the checklist and note your mistakes."]
];
