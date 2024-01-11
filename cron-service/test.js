// new updatePlayerGoals.js

// get all player ids that are playing this game week into an array. 
// Poll API for changes to live scores every two minutes. 
// If someone scores, check if we care about that player against ID's in that array. 
// If yes, 
// // get that player
// // +1 to goals, net_goals of that players stats.
// // get all entries that have that player
// For each entry containing that player
// // +1 to goals, net_goals on entries with that player. 
// // if total of entry > 21 then set entry.OVER = TRUE 
// // save entry

// Re-sort Pool that the entry is in. 

// // // Fetch pool entries
// // // Entries < 24 total && all 4 players have goals > 0 move into an array. 
// // // entries.sort(sortByDesc)
// // // for each entry rank = entry.indexOf(entries) + 1 
// // // Entries with not A4S and < 21 rank = "-"
// // // Entries with OVER = TRUE rank = "BUST!"

