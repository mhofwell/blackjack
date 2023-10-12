const fetchGQL = async (query, variables) => {
    try {
        const res = await fetch("http://localhost:8080/graphql", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables,
            }),
        });
        const obj = await res.json();
        return obj.data;
    } catch (err) {
        console.error(err);
    }
};

export default fetchGQL;
