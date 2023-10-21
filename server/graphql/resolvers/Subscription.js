const Subscription = {
    entryUpdated: {
        subscribe: (_, __, { pubsub }) =>
            // pubsub passed through contextValue to subscription
            pubsub.asyncIterator('ENTRY_UPDATED'),
    },
    playerUpdated: {
        subscribe: (_, __, { pubsub }) =>
            // pubsub passed through contextValue to subscription
            pubsub.asyncIterator('PLAYER_UPDATED'),
    },
    poolUpdated: {
        subscribe: (_, __, { pubsub }) =>
            // pubsub passed through contextValue to subscription
            pubsub.asyncIterator('POOL_UPDATED'),
    },
    hi: {
        subscribe: (_, __, { pubsub }) =>
            // pubsub passed through contextValue to subscription
            pubsub.asyncIterator('HI'),
    },
};

export default Subscription;
