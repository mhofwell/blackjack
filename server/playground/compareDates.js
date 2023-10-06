const abc = async () => {
    let i = 0;

    setInterval(async () => {
        i++;
        await console.log('sometext');
        if (i === 2) {
            console.log('done');
            process.exit(0);
        }
    }, 1000);
};

abc();
