import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    'João Pedro',
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
    { fn: 'Dan', ln: 'James' },
];

const getPlayerdata = async () => {
    try {
        let players = [];

        await prisma.player.deleteMany();
        await prisma.club.deleteMany();

        const res = await fetch(
            'https://fantasy.premierleague.com/api/bootstrap-static'
        );
        const eplData = await res.json();
        // console.log(eplData.elements[1]);
        await eplData.elements.map((player) => {
            picks.forEach((pick) => {
                if (pick === player.second_name) {
                    players.push({
                        id: player.id,
                        avatar: null,
                        fn: player.first_name,
                        ln: player.second_name,
                        team_id: player.team,
                        goals: player.goals_scored,
                        own_goals: player.own_goals,
                        net_goals: player.goals_scored - player.own_goals,
                    });
                }
            });
        });
        const clubArray = await eplData.teams.map((club) => {
            return {
                id: club.id,
                name: club.name,
                logo: null,
            };
        });

        await players.map((player) => {
            clubArray.forEach((club) => {
                if (player.team_id === club.id) {
                    player.club_name = club.name;
                    player.club_logo = club.logo;
                }
            });
        });

        const player = players[1];
        console.log('First Player ', player);

        for (const player of players) {
            // we have to handle duplicate clubs and not create a new one.
            const club = await prisma.club.findUnique({
                where: {
                    id: player.team_id,
                },
            });

            let data = {};

            if (!club) {
                data = {
                    id: player.id,
                    avatar: player.avatar,
                    fn: player.fn,
                    ln: player.ln,
                    team_id: player.team_id,
                    club: {
                        create: {
                            id: player.team_id,
                            name: player.club_name,
                            logo: player.club_logo,
                        },
                    },
                    goals: player.goals,
                    own_goals: player.own_goals,
                    net_goals: player.goals - player.own_goals,
                };
            } else if (club) {
                data = {
                    id: player.id,
                    avatar: player.avatar,
                    fn: player.fn,
                    ln: player.ln,
                    team_id: player.team_id,
                    club: {
                        connect: {
                            id: player.team_id,
                        },
                    },
                    // club_id: player.team_id,
                    goals: player.goals,
                    own_goals: player.own_goals,
                    net_goals: player.goals - player.own_goals,
                };
            }

            const user = await prisma.player.create({
                data,
                // select: {
                //     id: true,
                //     fn: true,
                //     club: { select: { name: true } },
                // },
            });
            // this prints out the select. Probably the whole object if no user
            console.log(user);
        }
    } catch (err) {
        console.error(err);
    }
};

getPlayerdata();
