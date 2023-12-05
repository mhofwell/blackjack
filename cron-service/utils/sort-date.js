export default function sortByDateAsc(a, b) {
    return new Date(a.kickoff_time) - new Date(b.kickoff_time);
}
