const ages = [32, 33, 16, 40];
const result = ages.filter(checkAdult);

function checkAdult(age) {
    return age >= 18;
}

console.log(result);

function filterGoalStats(stat) {
    const players = [362, 208, 123];
    console.log(stat.element);

    return players.indexOf(stat.element) > -1;

    console.log(a);
}

const goalStats = [
    { value: 2, element: 362 },
    { value: 1, element: 208 },
    { value: 1, element: 314 },
    { value: 1, element: 630 },
];

const results = goalStats.filter(filterGoalStats);

console.log(results);
