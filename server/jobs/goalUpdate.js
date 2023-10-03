import { parentPort, workerData } from 'worker_threads';

const goalUpdate = async () => {
    // here we'll initiate a count up to 90. When you hit 90 kill the worker.
    parentPort.postMessage('Hello world!');
    parentPort.postMessage(workerData.kickoff_time);
};

goalUpdate();
