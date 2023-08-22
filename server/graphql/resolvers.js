import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resolvers = {
    Query: {
        entries: () => {
            const entries = prisma.entry.findMany({
                include: {
                    user: true,
                    players: true,
                },
            });
            console.log(entries);
            return entries;
        },
    },
};

export default resolvers;
