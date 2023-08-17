const getPlayerdata = async () => {
    try {
        const res = await fetch(
            'https://fantasy.premierleague.com/api/bootstrap-static'
        );
        const data = await res.json();
        const payload = {
            data: data,
            status: res.status,
        };
        return payload;
    } catch (err) {
        console.error(err);
    }
};

export default getPlayerdata;
