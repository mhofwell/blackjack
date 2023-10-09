const Subscription = {
    updateEntry: {
        subscribe: () => pubsub.asyncIterator(['ENTRY_UPDATED']),
    },
};

export default Subscription;
