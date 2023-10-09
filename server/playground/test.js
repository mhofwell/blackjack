const updateEntryInput = {
    id: '0752d106-14fe-44c0-a058-382a25077089',
    goals: 5,
    own_goals: 5,
    net_goals: 5,
};

const query = `mutation Mutation($input: updateEntryInput!) {
    updateEntry(input: $input) {
      id
      net_goals
      own_goals
      goals
    }
}`;

const submit = async () => {
    try {
        const res = await fetch('http://localhost:8080/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: {
                    input: updateEntryInput,
                },
            }),
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
    }
};

console.log(await submit());
