const eventsData = {
  technical: [
    {
      id: "Code Trace",
      name: "Code Trace",
      fee: 50,
      time: "Sep 18 - 11:00 AM",
      description: "Crack the code! Predict outputs of C snippets using logic, precision, and debugging—no compiler needed.",
      rules: [
        "1.Individual participation only",
        "2.Pen & paper mode – no compilers, IDEs, or devices",
        "3.One attempt per question.",
        "4.Copying / malpractice = disqualification.",
        "5.Judges' decision is final."
      ],
      coordinator: "Harshad Dhongade"
    },
    {
      id: "Rapid Fire",
      name: "Rapid Fire",
      fee: 50,
      time: "Sep 18 - 1:00 PM",
      description: "Think fast, act faster! A thrilling time-bound quiz testing knowledge, speed & reflexes with technical, trivia, and logo-guessing challenges.",
      rules: [
        "30–60 sec per question | +1 point each | No negatives",
        "First buzzer = first chance",
        "Wrong → Opponent's turn | \"Pass\" allowed",
        "No mobiles, no discussions",
        "Tie-breaker → Bonus question",
        "Judges' decision is final"
      ],
      coordinator: "Pallavi Thete"
    },
    {
      id: "Technovision",
      name: "Technovision",
      fee: 50,
      time: "Sep 18 - 3:00 PM",
      description: "A creative poster competition where students design tech-themed posters using free AI tools. Submit your prompt, follow the theme, and showcase originality. Judging is based on creativity, relevance, appeal, clarity, and tool usage.",
      rules: [
        "Choose a Theme – Your poster must match one of the given themes.",
        "Free AI Tools Only – Use only free tools (Canva Free, Bing Image Creator, DALL·E Free, Adobe Firefly Free). Paid tools not allowed.",
        "Submit Prompt – Write the exact AI prompt you used (at the back of the poster or separately).",
        "Tool Proof – Be ready to tell/show which free tool you used.",
        "Size – Poster must be A4 (portrait or landscape).",
        "Content – No offensive, political, or inappropriate content.",
        "Original Work – Poster must be freshly made; copied/downloaded designs are not allowed"
      ],
      coordinator: "Yashika Chawla"
    }
  ],
  nonTechnical: [
    {
      id: "Scribble",
      name: "Scribble",
      fee: 50,
      time: "Sep 18 - 2:00 PM",
      description: "A fun and creative drawing and guessing game that tests your artistic and communication skills.",
      rules: [
        "Skribbl is a fun online multiplayer game where players take turns drawing a secret word while others guess what it is. The faster you guess correctly, the more points you earn! Each player gets a chance to draw, and after all rounds, the highest scorer win"
      ],
      coordinator: "Roshan Pawar"
    },
    {
      id: "Dumbbell Hold",
      name: "Dumbbell Hold",
      fee: 50,
      time: "Sep 18 - 3:00 PM & Sep 19 - 10:00 AM",
      description: "Test your power in this one-arm dumbbell holding contest! Hold a dumbbell straight in front with one arm. Progress through rounds (2.5kg → 5kg → 7.5kg → 10kg). The longer you hold, the further you go. Winner = Highest weight held (and longest time if tied)",
      rules: [
        "1.Same arm throughout.",
        "2.No support, no bending.",
        "3.One attempt per round.",
        "4.Dropping = elimination.",
        "5.Show your strength. Be the last one standing!"
      ],
      coordinator: "Shreehari Joshi"
    },
    {
      id: "Treasure Hunt",
      name: "Treasure Hunt",
      fee: 50,
      time: "Sep 19 - 2:00 PM",
      description: "Follow the clues, solve the riddles, and race to find the hidden treasure.",
      rules: [
        "Solve clues step by step to reach the final treasure.",
        "Team communication allowed only at checkpoints.",
        "Entire hunt restricted to the IOT building.",
        "No tampering, cheating, or foul play allowed.",
        "The first team to find the treasure wins!",
        "Safety Note: Follow coordinators' instructions and respect the venue."
      ],
      coordinator: "Ayyan Pathan"
    },
    {
      id: "BGMI",
      name: "BGMI",
      fee: 200,
      time: "Sep 19 - 2:00 PM",
      description: "Battlegrounds Mobile India (BGMI) is an action-packed battle royale game where players fight for survival using strategy, skill, and teamwork in intense battlegrounds.",
      rules: [
        "Squad of 4, mobile only",
        "No hacks/cheats",
        "Join lobby on time",
        "Points = kills + placement",
        "Organizer's decision is final"
      ],
      coordinator: "Roshan Pawar"
    }
  ]
};

const scheduleData = {
  day1: {
    title: "Sep 18, 2025 - Thursday",
    events: [
      {
        time: "10:00 AM",
        title: "Inauguration Ceremony",
        description: "Welcome address and event overview"
      },
      {
        time: "11:00 AM",
        title: "Code Trace",
        description: "Trace the output of the given code snippets accurately."
      },
      {
        time: "1:00 PM",
        title: "Rapid Fire",
        description: "A fast-paced question-and-answer game played under time pressure."
      },
      {
        time: "3:00 PM",
        title: "Technovision",
        description: "Showcase your creativity by designing and building innovative electronic circuits to solve a given problem."
      },
      {
        time: "3:00 PM",
        title: "Dumbbell Hold",
        description: "A test of strength and endurance. Hold a dumbbell for as long as you can."
      }
    ]
  },
  day2: {
    title: "Sep 19, 2025 - Friday",
    events: [
      {
        time: "10:00 AM",
        title: "Dumbbell Hold",
        description: "A test of strength and endurance. Hold a dumbbell for as long as you can."
      },
      {
        time: "1:00 PM",
        title: "Scribble",
        description: "A fun and creative drawing and guessing game that tests your artistic and communication skills."
      },
      {
        time: "2:00 PM",
        title: "Treasure Hunt",
        description: "Follow the clues, solve the riddles, and race to find the hidden treasure."
      }
    ]
  }
};

const getAllEventNames = () => {
  const allEvents = [];
  eventsData.technical.forEach(event => allEvents.push(event.name));
  eventsData.nonTechnical.forEach(event => allEvents.push(event.name));
  return allEvents;
};

export { eventsData, scheduleData, getAllEventNames };