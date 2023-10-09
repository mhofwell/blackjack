const Mutation = {
    // add redisPubSub here for the entry mutations when goals are scored.
    updateEntry: async (parent, { input }, { prisma, pubsub }) => {
        const entry = await prisma.entry.update({
            where: {
                id: input.id,
            },
            data: input,
        });

        // pubsub.publish('ENTRY_UPDATED');

        return entry;
    },
};

export default Mutation;
