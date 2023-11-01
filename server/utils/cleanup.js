import prisma from '../prisma/client.js';
import getLogger from '../logging/logger.js';

const logger = getLogger('server');

const cleanUp = async () => {
    await prisma.entry.deleteMany();
    await prisma.pool.deleteMany();
    await prisma.user.deleteMany();
    await prisma.player.deleteMany();
    await prisma.club.deleteMany();
    await prisma.fixtures.deleteMany();
    logger.info('Completed database cleanup.');
};

cleanUp();
