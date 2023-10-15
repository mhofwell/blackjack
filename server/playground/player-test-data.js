const gameWeekId = 9;
const kickoffTime = new Date('2023-10-21T14:00:00Z').toString();
console.log('kickoffTime ', kickoffTime);
const numberOfFixtures = 5;

const players = [
    { id: 353, goals: 0, own_goals: 0, net_goals: 0 },
    { id: 354, goals: 0, own_goals: 0, net_goals: 0 },
    { id: 368, goals: 0, own_goals: 0, net_goals: 0 },
    { id: 616, goals: 1, own_goals: 0, net_goals: 2 },
];

const data = {
    elements: [
        { id: 353, stats: { goals_scored: 2, own_goals: 0, net_goals: 0 } },
        { id: 354, stats: { goals_scored: 0, own_goals: 1, net_goals: 0 } },
        { id: 368, stats: { goals_scored: 0, own_goals: 0, net_goals: 0 } },
        { id: 616, stats: { goals_scored: 1, own_goals: 0, net_goals: 0 } },
    ],
};

export { gameWeekId, kickoffTime, numberOfFixtures, players, data };
