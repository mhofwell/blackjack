const users = [
    {
        fn: 'Iyad',
        ln: 'Al-Khatib',
        entry: {
            season: 2023,
            league: 'EPL',
            pool: 'CANADA',
            suit: 'SPADES',
            p1: 5,
            p2: 416,
            p3: 143,
            p4: 309,
        },
    },
    {
        fn: 'Carlo',
        ln: 'Bertelli',
        entry: {
            season: 2023,
            league: 'EPL',
            pool: 'CANADA',
            suit: 'DIAMONDS',
            p1: 290,
            p2: 523,
            p3: 354,
            p4: 416,
        },
    },
    {
        fn: 'Nick',
        ln: 'Billyeald',
        entry: {
            season: 2023,
            league: 'EPL',
            suit: 'CLUBS',
            pool: 'CANADA',
            p1: 436,
            p2: 442,
            p3: 447,
            p4: 450,
        },
    },
    {
        fn: 'Jason',
        ln: 'Botelho',
        entry: {
            season: 2023,
            league: 'EPL',
            pool: 'CANADA',
            suit: 'HEARTS',
            p1: 5,
            p2: 143,
            p3: 209,
            p4: 540,
        },
    },
    {
        fn: 'Brian',
        ln: 'Gaunt',
        entry: {
            season: 2023,
            league: 'EPL',
            pool: 'CANADA',
            suit: 'SPADES',
            p1: 303,
            p2: 225,
            p3: 354,
            p4: 552,
        },
    },
    {
        fn: 'Michael',
        ln: 'Hofweller',
        entry: {
            season: 2023,
            league: 'EPL',
            pool: 'CANADA',
            suit: 'DIAMONDS',
            p1: 526,
            p2: 225,
            p3: 354,
            p4: 6,
        },
    },
    {
        fn: 'Oliver',
        ln: 'McKiernan',
        entry: {
            season: 2023,
            league: 'EPL',
            pool: 'CANADA',
            suit: 'CLUBS',
            p1: 290,
            p2: 376,
            p3: 354,
            p4: 60,
        },
    },
    {
        fn: 'Teddy',
        ln: 'Prosser',
        entry: {
            season: 2023,
            league: 'EPL',
            pool: 'CANADA',
            suit: 'HEARTS',
            p1: 354,
            p2: 376,
            p3: 140,
            p4: 20,
        },
    },
    {
        fn: 'Tommy',
        ln: 'Rose',
        entry: {
            season: 2023,
            league: 'EPL',
            pool: 'CANADA',
            suit: 'SPADES',
            p1: 246,
            p2: 354,
            p3: 259,
            p4: 368,
        },
    },
    {
        fn: 'Saman',
        ln: 'Safari',
        entry: {
            season: 2023,
            league: 'EPL',
            pool: 'CANADA',
            suit: 'DIAMONDS',
            p1: 523,
            p2: 354,
            p3: 210,
            p4: 313,
        },
    },
    {
        fn: 'Marty',
        ln: 'Wertelecki',
        entry: {
            season: 2023,
            league: 'EPL',
            pool: 'CANADA',
            suit: 'CLUBS',
            p1: 5,
            p2: 416,
            p3: 540,
            p4: 85,
        },
    },
    {
        fn: 'Connor',
        ln: 'Brolly',
        entry: {
            season: 2023,
            league: 'EPL',
            pool: 'UK',
            suit: 'SPADES',
            p1: 140,
            p2: 415,
            p3: 20,
            p4: 313,
        },
    },
    {
        fn: 'Kevin',
        ln: 'Brolly',
        entry: {
            season: 2023,
            league: 'EPL',
            pool: 'UK',
            suit: 'DIAMONDS',
            p1: 354,
            p2: 540,
            p3: 265,
            p4: 119,
        },
    },
    {
        fn: 'David',
        ln: 'Bryden',
        entry: {
            season: 2023,
            league: 'EPL',
            suit: 'CLUBS',
            pool: 'UK',
            p1: 354,
            p2: 140,
            p3: 209,
            p4: 216,
        },
    },
    {
        fn: 'Tom',
        ln: 'Chambers',
        entry: {
            season: 2023,
            league: 'EPL',
            pool: 'UK',
            suit: 'HEARTS',
            p1: 195,
            p2: 143,
            p3: 199,
            p4: 416,
        },
    },
    {
        fn: 'Taylor',
        ln: 'Deans',
        entry: {
            season: 2023,
            league: 'EPL',
            pool: 'UK',
            suit: 'SPADES',
            p1: 290,
            p2: 372,
            p3: 354,
            p4: 416,
        },
    },
    {
        fn: 'Alex',
        ln: 'Driver',
        entry: {
            season: 2023,
            league: 'EPL',
            pool: 'UK',
            suit: 'DIAMONDS',
            p1: 99,
            p2: 297,
            p3: 354,
            p4: 231,
        },
    },
    {
        fn: 'Michael',
        ln: "O'Brian",
        entry: {
            season: 2023,
            league: 'EPL',
            pool: 'UK',
            suit: 'CLUBS',
            p1: 353,
            p2: 6,
            p3: 504,
            p4: 209,
        },
    },
    {
        fn: 'Teddy',
        ln: 'Prosser',
        entry: {
            season: 2023,
            league: 'EPL',
            pool: 'UK',
            suit: 'HEARTS',
            p1: 226,
            p2: 5,
            p3: 416,
            p4: 540,
        },
    },
    {
        fn: 'Dominic',
        ln: 'Rice',
        entry: {
            season: 2023,
            league: 'EPL',
            pool: 'UK',
            suit: 'SPADES',
            p1: 226,
            p2: 353,
            p3: 206,
            p4: 313,
        },
    },
    {
        fn: 'Stu',
        ln: 'Ross',
        entry: {
            season: 2023,
            league: 'EPL',
            pool: 'UK',
            suit: 'DIAMONDS',
            p1: 290,
            p2: 140,
            p3: 568,
            p4: 20,
        },
    },
    {
        fn: 'Craig',
        ln: 'Simpson',
        entry: {
            season: 2023,
            league: 'EPL',
            pool: 'UK',
            suit: 'CLUBS',
            p1: 412,
            p2: 616,
            p3: 135,
            p4: 309,
        },
    },
    {
        fn: 'Max',
        ln: 'Williams',
        entry: {
            season: 2023,
            league: 'EPL',
            pool: 'UK',
            suit: 'HEARTS',
            p1: 450,
            p2: 540,
            p3: 368,
            p4: 265,
        },
    },
    {
        fn: 'Ali',
        ln: 'Darke',
        entry: {
            season: 2023,
            league: 'EPL',
            pool: 'UK',
            suit: 'SPADES',
            p1: 270,
            // p2: 354,
            p3: 280,
            p4: 287,
        },
    },
];

const picks = [
    'Alexander-Arnold',
    'Antonio', // *
    'dos Santos', //Antony,
    'Aurier', // *
    'Calvert-Lewin', // *
    'Chilwell', // *
    'dos Santos de Oliveira', //Danilo
    'Dasilva', // *
    'Fernández', // *
    'Gakpo', // *
    'Gibbs-White', // *
    'Gordon', // *
    'Grealish', // *
    'Gvardiol', // *
    'Isak', // *
    'Jackson', // *
    'Apolinário de Lira', //Joelinton
    'Lerma Solís',
    'dos Santos Magalhães',
    'March', // *
    'McNeil', // *
    'Mitoma', // *
    'Mount', // *
    'Mudryk', // *
    'Junqueira de Jesus', // João Pedro
    'Castelo Podence',
    'Rice', // *
    'Saliba', // *
    'Solanke', // *
    'Sterling', // *
    'Stones', // *
    'Szoboszlai', // *
    'Tarkowski', // *
    'van Dijk',
    'Wissa', // *
    'Havertz', // *
    'Edouard', // *
    'Bowen', // *
    'Watkins', // *
    'Casimiro', //Casemiro
    'Silva', // *
    'Díaz', // *
    'Foden', // *
    'Eze', // *
    'Maddison', // *
    'Alves Morais', // Carlos Vinícius
    'De Cordova-Reid', // *
    'Palhinha Gonçalves', // Palhinha
];
const fnln = [
    { fn: 'Reece', ln: 'James' },
    { fn: 'Brennan', ln: 'Johnson' },
];

export { picks, users, fnln };
