import prisma from '../prisma/client';

const cleanUp = async () => {
    await prisma.entry.deleteMany();
    await prisma.pool.deleteMany();
    await prisma.user.deleteMany();
    await prisma.player.deleteMany();
    await prisma.club.deleteMany();
    await prisma.fixtures.deleteMany();
    console.log('Completed database cleanup');
};

cleanUp();
