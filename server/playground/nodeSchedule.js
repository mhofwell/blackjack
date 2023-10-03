import schedule from 'node-schedule';
import pkg from 'worker_threads';

const { Worker, isMainThread, parentPort, workerData } = pkg;

const job = schedule.scheduleJob('*/10 * * * * *', () => {
    console.log('Hello!');

    const job2 = schedule.scheduleJob('*/2 * * * * * ', () => {
        if (isMainThread) {
            const worker = new Worker('/Users/bigviking/Documents/GitHub/Projects/blackjack/server/playground/nodeSchedule.js', {
                workerData: { msg: 'hello', date: '12:00 ZTP00:00' },
            });
            worker.on('message', (msg) =>
                console.log(`Worker message recieved: ${msg}`)
            );
            worker.on('error', (err) => console.error(err));
            worker.on('message', (code) =>
                console.log(`Worker exit message recieved: ${code}`)
            );
        } else {
            const data = workerData;
            parentPort.postMessage(`Message: ${data.msg}, date: ${data.date}`);
        }
    });
});
