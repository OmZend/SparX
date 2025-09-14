// Events Data Configuration
const eventsData = {
    technical: [
        {
            id: 'Code Trace',
            name: 'Code Trace',
            fee: 50,
            time: 'Day 1 - 11:00 AM',
            description: 'Analyze code snippets and predict their output. A true test of your programming logic and debugging skills.',
            rules: [
                'Participants will be given a set of code snippets in various languages.',
                'No compilers or interpreters are allowed.',
                'Scoring is based on the accuracy of the output.',
                'Time limits will be strictly enforced for each question.'
            ],
            coordinator: 'Harshad Dhongade.'
        },
        {
            id: 'Rapid Fire',
            name: 'Rapid Fire',
            fee: 50,
            time: 'Day 1 - 1:00 PM',
            description: 'A fast-paced bot battle where strategy and design determine the winner.',
            rules: [
                'Bots must adhere to specific weight and size limitations.',
                'Each match consists of three rounds.',
                'Destruction of the opponent\'s bot is the primary objective.',
                'A panel of judges will score based on aggression, control, and damage.'
            ],
            coordinator: 'Pallavi Thete.'
        },
        {
            id: 'Technovision',
            name: 'Technovision',
            fee: 50,
            time: 'Day 1 - 3:00 PM',
            description: 'Showcase your creativity by designing and building innovative electronic circuits to solve a given problem.',
            rules: [
                'All necessary components will be provided.',
                'Circuits will be judged on innovation, efficiency, and practical application.',
                'Participants must provide a brief presentation of their design.',
                'Safety guidelines must be followed at all times.'
            ],
            coordinator: 'Yashika Chawla.'
        }
    ],
    nonTechnical: [
        {
            id: 'Scribble',
            name: 'Scribble',
            fee: 50,
            time: 'Day 1 - 2:00 PM',
            description: 'A fun and creative drawing and guessing game that tests your artistic and communication skills.',
            rules: [
                'Teams will consist of 2 or more members.',
                'One member draws while the other guesses.',
                'No verbal or written clues are allowed.',
                'The team with the most correct guesses wins.'
            ],
            coordinator: 'Roshan Pawar.'
        },
        {
            id: 'Dumble Hold',
            name: 'Dumble Hold',
            fee: 50,
            time: 'Day 1 - 3:00 PM & Day 2 - 10:00 AM',
            description: 'A test of strength and endurance. Hold a dumbbell for as long as you can.',
             rules: [
                'Participants must hold the dumbbell with a straight arm.',
                'The arm must remain parallel to the ground.',
                'The longest time wins the competition.',
                'Judges will monitor for proper form.'
            ],
            coordinator: 'Shreehari Joshi.'
        },
        {
            id: 'Treasure Hunt',
            name: 'Treasure Hunt',
            fee: 50,
            time: 'Day 2 - 2:00 PM',
            description: 'Follow the clues, solve the riddles, and race to find the hidden treasure.',
            rules: [
                'Teams of 4-6 members.',
                'The first team to solve all clues and find the treasure wins.',
                'Use of mobile phones is restricted to specific checkpoints.',
                'All team members must be present at the finish line.'
            ],
            coordinator: 'Ayyan Pathan.'
        }
    ]
};

// Schedule Data Configuration
const scheduleData = {
    day1: {
        title: 'Day 1 - Thursday',
        events: [
            {
                time: '10:00 AM',
                title: 'Inauguration Ceremony',
                description: 'Welcome address and event overview'
            },
            {
                time: '11:00 AM',
                title: 'Code Trace',
                description: 'Trace the output of the given code snippets accurately.'
            },
            {
                time: '1:00 PM',
                title: 'Rapid Fire',
                description: 'A fast-paced question-and-answer game played under time pressure.'
            },
            {
                time: '3:00 PM',
                title: 'Technovision',
                description: 'Showcase your creativity by designing and building innovative electronic circuits to solve a given problem.'
            },
            {
                time: '3:00 PM',
                title: 'Dumble Hold',
                description: 'A test of strength and endurance. Hold a dumbbell for as long as you can.'
            }
        ]
    },
    day2: {
        title: 'Day 2 - Friday',
        events: [
            {
                time: '10:00 AM',
                title: 'Dumble Hold',
                description: 'A test of strength and endurance. Hold a dumbbell for as long as you can.'
            },
            {
                time: '1:00 PM',
                title: 'Scribble',
                description: 'A fun and creative drawing and guessing game that tests your artistic and communication skills.'
            },
            {
                time: '2:00 PM',
                title: 'Treasure Hunt',
                description: 'Follow the clues, solve the riddles, and race to find the hidden treasure.'
            }
        ]
    }
};

// Get all event names for registration form
const getAllEventNames = () => {
    const allEvents = [];
    eventsData.technical.forEach(event => allEvents.push(event.name));
    eventsData.nonTechnical.forEach(event => allEvents.push(event.name));
    return allEvents;
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { eventsData, scheduleData, getAllEventNames };
}