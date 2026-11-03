/* Writing skills: paraphrase the question + write the overview (Task 1), with a short Task 2 paraphrase section. */

const SK = {1: ["Paraphrase the question", "Write the overview", "Put it together"]};
const SK_TABS = SK[1];

/* Paraphrase lab: each slot cycles through options; option 0 = the original wording. */
const PL = [
  ["The chart below", "The line graph", "The given chart", "The graph provided"],
  ["shows", "illustrates", "depicts", "presents data on", "gives information about"],
  ["the percentage of", "the proportion of", "the share of"],
  ["households with internet access", "homes with an internet connection", "households connected to the internet", "families that use the internet"],
  ["in four countries", "across four countries", "in four different nations"],
  ["between 2000 and 2020", "from 2000 to 2020", "over a 20-year period", "during the period 2000–2020"]
];

const PP = [
  ["Table", "The table below gives information about the number of visitors to five museums in 2019.", "The table presents data on how many people went to five museums in 2019."],
  ["Pie chart", "The pie charts show the ways in which people in Canada spend their free time.", "The pie charts compare how Canadians spend their leisure time."],
  ["Map", "The maps below show changes to the town of Hartley between 1990 and 2020.", "The two maps illustrate how the town of Hartley changed from 1990 to 2020."],
  ["Process", "The diagram below shows how bricks are made.", "The diagram illustrates the stages in the brick-making process."]
];

const PP2 = [
  ["Some people believe that university education should be free for everyone. To what extent do you agree or disagree?",
   "It is argued by some that tertiary education ought to be provided at no cost to all students. I largely agree with this view."],
  ["Nowadays, many people spend a lot of time on social media. Is this a positive or negative development?",
   "In recent years, a growing number of people have devoted considerable time to social networking sites. This essay will argue that this trend is largely negative."]
];

/* Overview recipes by chart type */
const OV = [
  {t: "Line graph", pat: "Overall, A rose / fell …, whereas B … ; A stayed highest throughout.",
   ex: "Overall, internet access rose significantly in both countries, although South Korea stayed ahead throughout.",
   look: ["Direction of each line (up, down, stable)", "Which line is highest at the start and at the end", "Any line that overtakes another"]},
  {t: "Bar chart / table", pat: "Overall, A was the most …, while B was the least …",
   ex: "Overall, rent was the largest expense for every age group, whereas travel accounted for the smallest share.",
   look: ["Biggest and smallest category", "One clear pattern across the groups", "One big difference between groups"]},
  {t: "Pie charts", pat: "Overall, A made up the largest share in both years, although B grew / fell.",
   ex: "Overall, coal remained the main source of energy, although its share fell as renewables grew.",
   look: ["Largest slice in each chart", "Which slice grew or shrank most", "Any slice that stayed the same"]},
  {t: "Process", pat: "Overall, the process has N stages, beginning with X and ending with Y.",
   ex: "Overall, the process consists of six stages, beginning with the picking of the fruit and ending with the bottling of the juice.",
   look: ["Number of stages", "First and last step", "Linear or a cycle; natural or man-made"]},
  {t: "Map", pat: "Overall, the area became more X; A was replaced by B, while C stayed the same.",
   ex: "Overall, the village became far more built-up, with farmland replaced by housing, while the lake remained unchanged.",
   look: ["The biggest change", "What was added or removed", "What stayed the same"]},
  {t: "Two charts", pat: "Overall, [link between the two charts].",
   ex: "Overall, as the number of tourists rose, spending on hotels also increased.",
   look: ["How chart 1 and chart 2 are connected", "One main trend from each chart"]}
];

const OV_STARTERS = ["Overall,", "In general,", "On the whole,", "Generally speaking,", "It is clear that", "The most noticeable feature is that"];

const OV_Q = [
  {d: "Line graph, 2000–2020: car use rose from 30% to 60%, train use fell from 50% to 20%, bus use stayed at 15%.",
   o: ["Car use rose from 30% to 60%, train use fell from 50% to 20%, and bus use stayed at 15%.",
       "Overall, car use increased while train use declined, and bus use stayed stable.",
       "Overall, cars are better than trains, so people should drive."],
   a: 1, x: "B gives the main trends with no numbers and no opinion. A is detail (it belongs in the body). C is an opinion."},
  {d: "Process diagram: juice is made in six stages, from picking the fruit to bottling.",
   o: ["Overall, the process has six stages, beginning with picking and ending with bottling.",
       "First, fruit is picked. Then it is washed.",
       "Overall, juice is healthy and tasty."],
   a: 0, x: "A states the number of stages and the start and end. B starts the detail. C is an opinion."},
  {d: "Map of a village, 1990 and 2020: farmland became houses, a new road appeared, the lake did not change.",
   o: ["Overall, the village became more built-up, with farmland replaced by housing, while the lake stayed the same.",
       "In 1990 there was farmland in the north and in 2020 there were 30 houses.",
       "Overall, the changes were bad for nature."],
   a: 0, x: "A summarises the main change and what stayed the same. B is detail. C is an opinion."}
];

const sst = {tab: SK_TABS[0], slots: [0, 0, 0, 0, 0, 0], ov: 0, picks: {}};

/* ===== Task 2 data ===== */
const QT = [
  {t: "Opinion", cue: "“To what extent do you agree or disagree?”",
   flow: ["Intro: paraphrase + your opinion", "Body 1: your main reason", "Body 2: a second reason (or a counter-argument you reject)", "Conclusion: restate your opinion"],
   thesis: "I strongly agree / partly agree / disagree that … because …",
   q: "Some people believe that university education should be free for everyone. To what extent do you agree or disagree?",
   ex: "I largely agree with this view, because it creates fairer opportunities and benefits society."},
  {t: "Discussion", cue: "“Discuss both views and give your opinion.”",
   flow: ["Intro: paraphrase + say which view you prefer", "Body 1: view A with reasons", "Body 2: view B with reasons", "Conclusion: your opinion"],
   thesis: "While some argue …, others believe … In my view, …",
   q: "Some people think the government should spend money on public transport. Others believe building more roads is a better use of funds. Discuss both views and give your own opinion.",
   ex: "While some argue that roads are a better investment, I believe that public transport deserves priority."},
  {t: "Advantages / disadvantages", cue: "“Do the advantages outweigh the disadvantages?”",
   flow: ["Intro: paraphrase + your answer (outweigh or not)", "Body 1: advantages", "Body 2: disadvantages", "Conclusion: restate your answer"],
   thesis: "This essay will argue that the advantages outweigh / do not outweigh …",
   q: "More people now work from home. Do the advantages of this trend outweigh the disadvantages?",
   ex: "Although working from home has drawbacks, I believe the advantages outweigh them."},
  {t: "Problem & solution", cue: "“What are the causes? What can be done?”",
   flow: ["Intro: paraphrase + outline", "Body 1: causes or problems", "Body 2: solutions (link each to a problem)", "Conclusion: summary"],
   thesis: "This essay will examine the main causes of … and suggest some solutions.",
   q: "Obesity is rising in many countries. What are the causes of this, and what can be done?",
   ex: "This essay will examine the main causes of rising obesity and suggest practical solutions."},
  {t: "Two-part question", cue: "“Why is this? Is it positive or negative?”",
   flow: ["Intro: paraphrase + a short answer to both parts", "Body 1: answer question 1", "Body 2: answer question 2", "Conclusion: summarise both answers"],
   thesis: "This is mainly because … and I believe this is a positive / negative development.",
   q: "Fewer people read books today. Why is this? Is it a positive or negative development?",
   ex: "This is mainly because of digital entertainment, and I believe it is a negative development."}
];

const QT_Q = [
  {d: "Some people think the government should fund public transport. Others think building roads is better. Discuss both views and give your opinion.", o: ["Opinion", "Discussion", "Two-part question"], a: 1},
  {d: "More people work from home. Do the advantages of this trend outweigh the disadvantages?", o: ["Advantages / disadvantages", "Problem & solution", "Opinion"], a: 0},
  {d: "Obesity is rising in many countries. What are the causes, and what can be done?", o: ["Discussion", "Problem & solution", "Two-part question"], a: 1},
  {d: "Fewer people read books. Why is this happening? Is it a positive or negative development?", o: ["Two-part question", "Opinion", "Advantages / disadvantages"], a: 0}
];

const PL2 = [
  ["Some people believe that", "It is argued by some that", "Many people claim that"],
  ["university education", "tertiary education", "higher education"],
  ["should be free", "ought to be free of charge", "should be provided at no cost"],
  ["for everyone.", "for all students.", "to every student."]
];

const TH = [
  ["Fully agree", "I strongly agree with this view, because it would give everyone an equal chance to succeed and benefit society as a whole."],
  ["Partly agree", "I partly agree: free tuition would improve fairness, but it should be limited to students who cannot afford fees."],
  ["Disagree", "I disagree with this view, because the cost to taxpayers is high and the money could be better spent on schools."]
];

const TOPIC_S = ["Firstly,", "One key reason is that", "Another important point is that", "Furthermore,", "On the other hand,", "Admittedly,"];
const LINK_S = ["This is because", "As a result,", "This means that", "For example,", "For instance,", "Therefore,"];

const BODY_Q = [
  {d: "Which is the best topic sentence?", o: ["Free education is good.", "Firstly, free tuition would give everyone an equal chance to attend university.", "According to a 2020 survey, 91% of students want free tuition."], a: 1,
   x: "B states one clear idea. A is too vague. C is an invented statistic, not an idea."},
  {d: "Idea: many students cannot afford fees. Which sentence explains it best?", o: ["This is bad.", "As a result, talented students from poor families may never go to university, which wastes their potential.", "Also, university is a place."], a: 1,
   x: "B explains the effect. A and C add nothing."}
];

const CON_Q = [
  {d: "Which belongs in a conclusion?", o: ["Also, another reason is that tuition is expensive in many cities.", "To sum up, free tuition would promote equality and support growth, so governments should adopt it.", "In this essay I am going to say that free tuition is good."], a: 1,
   x: "B restates the position and the main reasons. A adds a new idea. C announces instead of concluding."}
];

Object.assign(sst, {task: 1, s2: PL2.map(() => 0), th: 0, qt: 0, p: {}});
SK[2] = ["Question types", "Introduction", "Body paragraphs", "Conclusion", "Put it together"];

function skills() {
  const mk = (m, c, h) => `<div class="row ${c}"><i class="m">${m}</i><span>${h}</span></div>`;
  const card = (h, p, inner) => `<section class="group gcard"><h3 class="gh">${h}</h3>${p ? `<p class="gp">${p}</p>` : ""}${inner}</section>`;
  let body = "";

  if (sst.tab === SK_TABS[0]) {
    const sent = PL.map((o, i) => `<button class="slotbtn" data-sl="${i}">${o[sst.slots[i]]}</button>`).join(" ") + ".";
    const changed = sst.slots.filter(v => v > 0).length;
    body += card("Why paraphrase?",
      "Copying the question word for word gives you no credit. Rewrite it in your own words to make your <b>introduction</b>. Change the words, but never the meaning, numbers, years, units or place names.",
      mk("1", "ok", "<b>Synonyms:</b> shows → illustrates, depicts") +
      mk("2", "ok", "<b>Word class:</b> changes in prices → how prices <b>changed</b>") +
      mk("3", "ok", "<b>Structure:</b> The table shows the figures for 2010. → The figures for 2010 <b>are shown in</b> the table.") +
      mk("4", "ok", "<b>Small words:</b> below → <b>given</b> / <b>provided</b>"));
    body += card("Try it: tap the underlined parts",
      "Each tap swaps one part for a different wording. Aim to change at least 3 parts.",
      `<div class="lab">Question</div><div class="orig">${PL.map(o => o[0]).join(" ")}.</div>
       <div class="lab" style="margin-top:10px">Your introduction</div><div class="sent">${sent}</div>
       <div class="qfoot"><span>Changed ${changed} of ${PL.length} parts${changed >= 3 ? " ✓" : ""}</span><button class="next" data-sr>Reset</button></div>
       <p class="gp" style="margin:10px 0 0">Use the real chart name: line graph, bar chart, pie chart, table, map or diagram.</p>`);
    body += card("More examples", "",
      PP.map(p => `<div class="pp"><span class="tg">${p[0]}</span><span class="orig">${p[1]}</span></div><div class="pp a"><span class="tg">Intro</span><span>${p[2]}</span></div>`).join('<div style="height:8px"></div>'));
    body += card("Word bank for the question", "Only swap a word if the meaning stays exactly the same (“people” is not the same as “adults”).",
      mk("→", "ok", "<b>show</b> → illustrate · depict · present · give information about · compare (two things)") +
      mk("→", "ok", "<b>percentage</b> → proportion · share") +
      mk("→", "ok", "<b>the number of</b> → how many · the figure for") +
      mk("→", "ok", "<b>between 2000 and 2020</b> → from 2000 to 2020 · over a 20-year period") +
      mk("→", "ok", "<b>changes</b> → how … changed · developments") +
      mk("→", "ok", "<b>money spent</b> → expenditure · spending") +
      mk("→", "ok", "<b>free time</b> → leisure time") +
      mk("→", "ok", "<b>people in Canada</b> → Canadians · the Canadian population"));
    body += card("Avoid these", "",
      mk("✗", "no", "Copying the question: <i>The chart below shows the percentage of households with internet access…</i>") +
      mk("✗", "no", "Changing the facts: <i>four countries</i> → <i>several countries</i>") +
      mk("✗", "no", "Adding your opinion: <i>The graph shows a worrying rise…</i>") +
      mk("✗", "no", "Using the wrong chart name: <i>The pie chart</i> for a line graph"));
  }

  if (sst.tab === SK_TABS[1]) {
    const o = OV[sst.ov];
    body += card("What is an overview?",
      "A short summary (1–2 sentences) of the <b>main trends or features</b>. It has no detailed numbers, no opinions and no prediction (unless the chart is a forecast). It is required for a good Task 1 score. Put it <b>right after the introduction</b>.",
      mk("✓", "ok", "<b>Overall,</b> internet access rose in both countries.") +
      mk("✗", "no", "Overall, access rose from 40% to 98% in Korea and 5% to 75% in Brazil. <em>(too much detail)</em>") +
      mk("✗", "no", "In conclusion, the internet is very useful. <em>(opinion)</em>") +
      mk("✗", "no", "Overall, the chart shows the percentage of households with internet access. <em>(repeats the intro)</em>"));
    body += card("Pick your chart type",
      "Choose the type to see the pattern, an example and what to look for.",
      `<div class="chips">${OV.map((x, i) => `<button class="chip ${i === sst.ov ? "open" : ""}" data-sov="${i}">${x.t}</button>`).join("")}</div>
       <div style="margin-top:14px"><div class="pat">${o.pat}</div>
       ${mk("✓", "ok", o.ex)}
       <div class="lab" style="margin:10px 0 4px">Look for</div>
       ${o.look.map(l => mk("•", "ok", l)).join("")}</div>`);
    body += card("Ways to start", "Add a comma after Overall, In general, On the whole.",
      `<div class="chips">${OV_STARTERS.map(s => `<span class="chip" style="cursor:default">${s}</span>`).join("")}</div>`);
    body += card("Which is the best overview?", "",
      OV_Q.map((q, i) => {
        const pk = sst.picks[i], done = pk !== undefined;
        return `<div class="gq" style="${i ? "" : "border:0;padding:0;margin:0"}"><p>${q.d}</p><div class="gopts" style="flex-direction:column;align-items:stretch">${q.o.map((t, j) => {
          const c = done ? (j === q.a ? "right" : j === pk ? "wrong" : "") : "";
          return `<button class="opt ${c}" data-sq="${i}|${j}" ${done ? "disabled" : ""}>${t}</button>`;
        }).join("")}</div>${done ? `<p class="gp" style="margin:8px 0 0">${q.x}</p>` : ""}</div>`;
      }).join(""));
  }

  if (sst.tab === SK_TABS[2]) {
    const step = (n, h, t) => `<div class="step"><span class="n">${n}</span><div><div class="lab">${h}</div><p class="samp">${t}</p></div></div>`;
    body += card("A 4-paragraph Task 1 answer",
      "Question (example): <i>The line graph shows the percentage of households with internet access in South Korea and Brazil between 2000 and 2020.</i><br><small>The data below is invented for practice.</small>",
      step(1, "Introduction · paraphrase", "The line graph compares the proportion of homes with an internet connection in South Korea and Brazil over a 20-year period.") +
      step(2, "Overview · main trends, no numbers", "Overall, internet access rose significantly in both countries, although South Korea stayed ahead throughout, with Brazil gradually closing the gap.") +
      step(3, "Detail 1 · first key point, with data", "In 2000, around 40% of South Korean households were online, compared with only 5% in Brazil. By 2010, the figure for South Korea had climbed to 90%, before levelling off at about 98% in 2020.") +
      step(4, "Detail 2 · second key point, with data", "Brazil, in contrast, grew steadily from a very low base, passing 50% in 2015 and reaching 75% by the end of the period."));
    body += card("Checklist", "",
      mk("✓", "ok", "At least <b>150 words</b>, about 20 minutes") +
      mk("✓", "ok", "Intro is <b>paraphrased</b>, not copied") +
      mk("✓", "ok", "Overview comes <b>right after</b> the intro and has <b>no detailed numbers</b>") +
      mk("✓", "ok", "Two body paragraphs, each <b>grouping</b> related data and <b>comparing</b>") +
      mk("✓", "ok", "Numbers have the right <b>units</b> and the right <b>tense</b>") +
      mk("✓", "ok", "No opinions and no “In conclusion”"));
  }

  const T2T = SK[2];
  const mkp = (key, q, extra) => { /* multiple-choice block with feedback */
    const pk = sst.p[key], done = pk !== undefined;
    return `<div class="gq" style="border:0;padding:0;margin:0 0 14px"><p>${q.d}</p><div class="gopts" style="flex-direction:column;align-items:stretch">${q.o.map((t, j) => {
      const c = done ? (j === q.a ? "right" : j === pk ? "wrong" : "") : "";
      return `<button class="opt ${c}" data-sp="${key}:${j}" ${done ? "disabled" : ""}>${t}</button>`;
    }).join("")}</div>${done && q.x ? `<p class="gp" style="margin:8px 0 0">${q.x}</p>` : ""}</div>`;
  };
  const stp = (n, h, t) => `<div class="step"><span class="n">${n}</span><div><div class="lab">${h}</div><p class="samp">${t}</p></div></div>`;
  const chipsOf = a => `<div class="chips">${a.map(x => `<span class="chip" style="cursor:default">${x}</span>`).join("")}</div>`;

  if (sst.task === 2 && sst.tab === T2T[0]) {
    const q = QT[sst.qt];
    body += card("Spot the question type first",
      "The question type decides your structure. Find the key phrase, then follow the plan. Answer <b>every part</b> of the question.",
      `<div class="chips">${QT.map((x, i) => `<button class="chip ${i === sst.qt ? "open" : ""}" data-qt="${i}">${x.t}</button>`).join("")}</div>
       <div style="margin-top:14px"><div class="lab">Key phrase</div><div class="orig" style="margin-bottom:10px">${q.cue}</div>
       <div class="lab">Example question</div><div class="orig" style="margin-bottom:10px">${q.q}</div>
       <div class="lab">Plan</div>${q.flow.map((f, i) => mk(i + 1, "ok", f)).join("")}
       <div class="lab" style="margin:10px 0 4px">Thesis pattern</div><div class="pat">${q.thesis}</div>
       ${mk("✓", "ok", q.ex)}</div>`);
    body += card("Which type is it?", "", QT_Q.map((q2, i) => mkp("qt-" + i, q2)).join(""));
  }

  if (sst.task === 2 && sst.tab === T2T[1]) {
    const sent = PL2.map((o, i) => `<button class="slotbtn" data-sl2="${i}">${o[sst.s2[i]]}</button>`).join(" ");
    const changed = sst.s2.filter(v => v > 0).length;
    body += card("Introduction = 2 sentences",
      "<b>1.</b> Paraphrase the question. <b>2.</b> Give your answer (thesis). Skip memorised openings like “Nowadays, technology is developing quickly.”",
      mk("✓", "ok", "<b>It is argued by some that</b> tertiary education ought to be free. <b>I largely agree</b>, because it is fairer and benefits society.") +
      mk("✗", "no", "In this essay I am going to talk about free education. <em>(announces, no answer)</em>") +
      mk("✗", "no", "Nowadays, the world is changing fast. <em>(generic, not about the question)</em>") +
      mk("✗", "no", "Some people believe that university education should be free for everyone. <em>(copied)</em>"));
    body += card("Step 1 · paraphrase", "Question: <i>Some people believe that university education should be free for everyone. To what extent do you agree or disagree?</i>",
      `<div class="lab">Your paraphrase</div><div class="sent">${sent}</div>
       <div class="qfoot"><span>Changed ${changed} of ${PL2.length} parts${changed >= 3 ? " ✓" : ""}</span><button class="next" data-sr2>Reset</button></div>`);
    body += card("Step 2 · your answer", "Pick a position to see a thesis sentence.",
      `<div class="chips">${TH.map((x, i) => `<button class="chip ${i === sst.th ? "open" : ""}" data-th="${i}">${x[0]}</button>`).join("")}</div>
       <div class="lab" style="margin-top:14px">Your introduction</div><div class="sent" style="font-size:17px">${PL2.map((o, i) => o[sst.s2[i]]).join(" ")} ${TH[sst.th][1]}</div>`);
    body += card("Thesis starters", "", chipsOf(["I strongly believe that", "I partly agree that", "This essay will argue that", "While some argue …, I believe …", "This essay will examine"]));
  }

  if (sst.task === 2 && sst.tab === T2T[2]) {
    body += card("One idea per paragraph: P · E · E · L",
      "<b>Point</b> (topic sentence) → <b>Explain</b> → <b>Example</b> → <b>Link</b> back to the question. About 100–120 words each.",
      stp("P", "Point", "Firstly, free university education would give everyone an equal chance to succeed.") +
      stp("E", "Explain", "Students from low-income families often cannot afford tuition fees, so many talented people never reach higher education.") +
      stp("E", "Example", "For instance, in Norway, where public universities charge no tuition fees, graduates do not begin their careers burdened with large debts.") +
      stp("L", "Link", "Therefore, removing fees would make society fairer and more productive."));
    body += card("Starters for each part", "", `<div class="lab">Topic sentence</div>${chipsOf(TOPIC_S)}<div class="lab" style="margin-top:12px">Explain, example, link</div>${chipsOf(LINK_S)}`);
    body += card("Handle the other side", "Show you understand the opposite view, then answer it.",
      mk("✓", "ok", "<b>Admittedly,</b> free tuition would need large public funding; <b>however,</b> this cost is outweighed by long-term gains.") +
      mk("✓", "ok", "<b>Although</b> some argue that it is too expensive, it would pay for itself through a more skilled workforce."));
    body += card("Examples that work", "Be specific, but do not invent statistics or studies. General, realistic examples are safer and sound more natural.",
      mk("✓", "ok", "<b>In countries such as</b> Norway or Finland …") +
      mk("✓", "ok", "<b>For instance,</b> a student from a poor family may …") +
      mk("✗", "no", "According to a 2019 study, 87% of students … <em>(invented)</em>") +
      mk("✗", "no", "Free education is good. It is good for people. <em>(no explanation)</em>"));
    body += card("Practice", "", BODY_Q.map((q, i) => mkp("bd-" + i, q)).join(""));
  }

  if (sst.task === 2 && sst.tab === T2T[3]) {
    body += card("Conclusion = 2–3 sentences",
      "Signal + restate your position in new words + summarise the main reasons. <b>No new ideas.</b>",
      mk("✓", "ok", "<b>In conclusion,</b> free university education would promote equality and support economic growth. Although costly, I believe governments <b>should adopt</b> this policy.") +
      mk("✗", "no", "Also, another reason is that tuition is expensive in cities. <em>(new idea)</em>") +
      mk("✗", "no", "I strongly agree that university education should be free for everyone. <em>(copy of the intro)</em>") +
      mk("✗", "no", "In my conclusion, I am going to say … <em>(announcing)</em>"));
    body += card("Ways to start", "", chipsOf(["In conclusion,", "To sum up,", "To conclude,", "Overall,", "All things considered,"]));
    body += card("Practice", "", CON_Q.map((q, i) => mkp("cn-" + i, q)).join(""));
  }

  if (sst.task === 2 && sst.tab === T2T[4]) {
    body += card("A complete Task 2 essay",
      "Question: <i>Some people believe that university education should be free for everyone. To what extent do you agree or disagree?</i>",
      stp(1, "Introduction · paraphrase + answer", "It is argued by some that tertiary education ought to be free of charge for every student. I largely agree with this view, because it creates fairer opportunities and benefits society as a whole.") +
      stp(2, "Body 1 · reason 1", "Firstly, free university education would give everyone an equal chance to succeed. Students from low-income families often cannot afford tuition fees, so many talented people never reach higher education. For instance, in Norway, where public universities charge no tuition fees, graduates do not begin their careers burdened with large debts. Therefore, removing fees would make society fairer.") +
      stp(3, "Body 2 · reason 2 + the other side", "Furthermore, a better-educated population strengthens the economy. When more people graduate, employers can fill skilled jobs more easily, and the country becomes more competitive. Admittedly, free tuition would require substantial public funding; however, this cost is outweighed by the long-term gains in productivity and tax revenue.") +
      stp(4, "Conclusion · restate, no new idea", "In conclusion, free university education would promote equality and support economic growth. Although it would be costly, I believe governments should adopt this policy."));
    body += card("Checklist", "",
      mk("✓", "ok", "At least <b>250 words</b>, about <b>40 minutes</b> (5 plan · 30 write · 5 check). Task 2 counts <b>more</b> than Task 1 in the Writing score") +
      mk("✓", "ok", "<b>Every part</b> of the question is answered") +
      mk("✓", "ok", "A <b>clear position</b> in the intro and the conclusion") +
      mk("✓", "ok", "<b>One main idea</b> per body paragraph, with explanation and an example") +
      mk("✓", "ok", "Formal tone, no contractions, no “I think” repeated") +
      mk("✓", "ok", "Check: tenses, articles, subject–verb agreement, commas before linkers"));
  }

  const tools = `<div class="tools"><button class="pill ${sst.task === 1 ? "on" : ""}" data-st="1">Task 1</button><button class="pill ${sst.task === 2 ? "on" : ""}" data-st="2">Task 2</button></div>`;
  return `<div class="bar"><div class="wrap"><div class="tabs">${SK[sst.task].map(t => `<button class="tab ${t === sst.tab ? "on" : ""}" data-sk="${t}">${t}</button>`).join("")}</div>${tools}</div></div>
  <div class="wrap"><div class="ph"><div class="eyebrow">Writing skills · Task ${sst.task}</div><h2>${sst.task === 1 ? "Paraphrase it. Then summarise it." : "Plan it. Argue it. Wrap it up."}</h2></div>${body}</div>`;
}
