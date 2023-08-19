import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cleanUp = async () => {
    await prisma.player.deleteMany();
    await prisma.entry.deleteMany();
    await prisma.club.deleteMany();
    await prisma.user.deleteMany();
    console.log('Completed database cleanup');
};

cleanUp();
