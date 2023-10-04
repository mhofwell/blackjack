import { parentPort, workerData } from 'worker_threads';

const updateGoals = async () => {
    let i = 0;
    setInterval(() => {
        i++;
        console.log('Worker: ', workerData.kickoff_time, 'Iteration: ', i);
        if (i === 3) {
            console.log('Inside iterator...');
            if (parentPort) parentPort.postMessage('done');
            else process.exit(0);
        }
    }, 1000);
};

updateGoals();
