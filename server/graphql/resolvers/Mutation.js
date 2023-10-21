const Mutation = {
    updateEntry: async (parent, { input }, { prisma, pubsub }) => {
        const entry = await prisma.entry.update({
            where: {
                id: input.id,
            },
            data: input,
            include: {
                players: true,
            },
        });
        console.log('Entry:', entry);
        pubsub.publish('ENTRY_UPDATED', { entryUpdated: entry });
        return entry;
    },
    updatePlayer: async (parent, { input }, { prisma, pubsub }) => {
        const player = await prisma.player.update({
            where: {
                id: input.id,
            },
            data: input,
        });
        return player;
    },
};

export default Mutation;
