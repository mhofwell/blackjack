    // const subscribeToEntries = () =>
    //     subscribeToMore({
    //         document: GOAL_SUB,
    //         updateQuery: (prev, { subscriptionData }) => {
    //             if (!subscriptionData.data) return prev;

    //             console.log('Prev: ', prev);
    //             console.log('Subscription Data: ', subscriptionData);

    //             const updatedEntry = subscriptionData.data.entryUpdated;

    //             console.log(`Updated Entry: `, updatedEntry);

    //             prev.pools.forEach((pool) => {
    //                 const i = pool.entries.findIndex(
    //                     (entry) => entry.id === updatedEntry.id
    //                 );
    //                 console.log('i: ', i);

    //                 if (i > -1) {
    //                     console.log(
    //                         'FOUND > Index: ',
    //                         i,
    //                         'Pool: ',
    //                         pool,
    //                         'Entry: ',
    //                         pool.entries[i]
    //                     );
    //                 }
    //                 console.log('Changed data: ', pool.entries[i]);
    //                 return prev;
    //             });
    //         },
    // });
