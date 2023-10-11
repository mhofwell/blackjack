const id = 447;

const getPlayer = `query Query($playerId: ID!) {
    player(id: $playerId) {
      id
      net_goals
      own_goals
      goals
    }
  }`;

// get player data from database.
const pObjDb = async () => {
    try {
        const res = await fetch('http://localhost:8080/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: getPlayer,
                variables: {
                    playerId: id,
                },
            }),
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
    }
};

const dbPlayer = await pObjDb();

console.log(dbPlayer);
