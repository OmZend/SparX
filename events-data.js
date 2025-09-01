// Events Data Configuration
const eventsData = {
    technical: [
        {
            id: 'codeSprint',
            name: 'Code Sprint',
            fee: 300,
            time: 'Day 1 - 10:00 AM',
            description: 'Competitive programming challenge'
        },
        {
            id: 'roboWars',
            name: 'Robo Wars',
            fee: 500,
            time: 'Day 2 - 2:00 PM',
            description: 'Battle of the bots'
        },
        {
            id: 'circuitDesign',
            name: 'Circuit Design',
            fee: 400,
            time: 'Day 3 - 9:00 AM',
            description: 'Design innovative electronic circuits'
        },
        {
            id: 'webDev',
            name: 'Web Development',
            fee: 300,
            time: 'Day 3 - 1:00 PM',
            description: 'Build stunning web applications'
        },
        {
            id: 'aimlChallenge',
            name: 'AI/ML Challenge',
            fee: 400,
            time: 'Day 4 - 10:00 AM',
            description: 'Solve real-world problems with AI'
        }
    ],
    nonTechnical: [
        {
            id: 'techQuiz',
            name: 'Technical Quiz',
            fee: 200,
            time: 'Day 1 - 2:00 PM',
            description: 'Test your engineering knowledge'
        },
        {
            id: 'posterPresentation',
            name: 'Poster Presentation',
            fee: 250,
            time: 'Day 2 - 10:00 AM',
            description: 'Present your innovative ideas'
        },
        {
            id: 'photography',
            name: 'Photography Contest',
            fee: 200,
            time: 'Day 2 - 4:00 PM',
            description: 'Capture the perfect moment'
        },
        {
            id: 'debate',
            name: 'Debate Competition',
            fee: 250,
            time: 'Day 4 - 2:00 PM',
            description: 'Engage in intellectual discourse'
        },
        {
            id: 'culturalShow',
            name: 'Cultural Show',
            fee: 300,
            time: 'Day 5 - 6:00 PM',
            description: 'Entertainment and farewell'
        }
    ]
};

// Schedule Data Configuration
const scheduleData = {
    day1: {
        title: 'Day 1 - Monday',
        events: [
            {
                time: '9:00 AM',
                title: 'Opening Ceremony',
                description: 'Welcome address and event overview'
            },
            {
                time: '10:00 AM',
                title: 'Code Sprint',
                description: 'Competitive programming challenge'
            },
            {
                time: '2:00 PM',
                title: 'Technical Quiz',
                description: 'Test your engineering knowledge'
            }
        ]
    },
    day2: {
        title: 'Day 2 - Tuesday',
        events: [
            {
                time: '10:00 AM',
                title: 'Poster Presentation',
                description: 'Present your innovative ideas'
            },
            {
                time: '2:00 PM',
                title: 'Robo Wars',
                description: 'Battle of the bots'
            },
            {
                time: '4:00 PM',
                title: 'Photography Contest',
                description: 'Capture the perfect moment'
            }
        ]
    },
    day3: {
        title: 'Day 3 - Wednesday',
        events: [
            {
                time: '9:00 AM',
                title: 'Circuit Design',
                description: 'Design innovative electronic circuits'
            },
            {
                time: '1:00 PM',
                title: 'Web Development',
                description: 'Build stunning web applications'
            }
        ]
    },
    day4: {
        title: 'Day 4 - Thursday',
        events: [
            {
                time: '10:00 AM',
                title: 'AI/ML Challenge',
                description: 'Solve real-world problems with AI'
            },
            {
                time: '2:00 PM',
                title: 'Debate Competition',
                description: 'Engage in intellectual discourse'
            }
        ]
    },
    day5: {
        title: 'Day 5 - Friday',
        events: [
            {
                time: '2:00 PM',
                title: 'Prize Distribution',
                description: 'Celebrating our winners'
            },
            {
                time: '6:00 PM',
                title: 'Cultural Show & Closing',
                description: 'Entertainment and farewell'
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
