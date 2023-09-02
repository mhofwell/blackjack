import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cleanUp = async () => {
    await prisma.entry.deleteMany();
    await prisma.pool.deleteMany();
    await prisma.user.deleteMany();
    await prisma.player.deleteMany();
    await prisma.club.deleteMany();
    console.log('Completed database cleanup');
};

cleanUp();