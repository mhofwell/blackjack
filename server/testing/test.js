import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getPlayerdata = async () => {
    // await prisma.player.deleteMany();
    // await prisma.entry.deleteMany();
    // await prisma.club.deleteMany();
    // await prisma.user.deleteMany();
    try {
        const entries = await prisma.entry.findMany({
            include: {
                user: {
                    select: {
                        fn: true,
                    },
                },
                players: {
                    select: {
                        fn: true,
                        ln: true,
                    },
                },
            },
        });

        entries.forEach((entry) => {
            console.log(entry.players);
        });
    } catch (err) {
        console.log(err);
    }

    const players = await prisma.player.findMany({
        include: {
            entry: {
                include: {
                    user: {
                        select: {
                            fn: true,
                        },
                    },
                },
            },
        },
    });
    console.log(players[0].entry[0].user.fn);
};

getPlayerdata();
