import prisma from './prisma/client.js';

const players = await prisma.entry.findUnique({
    where: {
        id: '2f8a66f5-ad62-4623-801b-6baece42fb6a',
    },
    include: {
        players: true,
    },
});

console.log(players);
