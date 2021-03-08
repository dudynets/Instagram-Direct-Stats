fetch('data.txt')
  .then(response => response.text())
  .then(data => {
  	let obj = JSON.parse(data);
    console.log("*** Total found: " + (obj["messages"].length) + " messages");

    let participants = {}

    obj['participants'].forEach(element => {
        participants[element["name"]] = 0;
    });

    let generic = 0;
    let images = 0;
    let shares = 0;
    let reactionsOnPhotos = 0;
    let reactionsOnMessages = 0;
    let reactionsOnShares = 0;
    let others = 0;

    for (message in obj["messages"]) {
        participants[obj["messages"][message]["sender_name"]]++;

        if (obj["messages"][message].hasOwnProperty("photos")) {
            if (obj["messages"][message].hasOwnProperty("reactions")) {
                reactionsOnPhotos += obj["messages"][message]["reactions"].length;
            }
            images++;
        } else if (obj["messages"][message]["type"] == "Generic") {
            if (obj["messages"][message].hasOwnProperty("reactions")) {
                reactionsOnMessages += obj["messages"][message]["reactions"].length;
            }
            generic++;
        } else if (obj["messages"][message]["type"] == "Share") {
            if (obj["messages"][message].hasOwnProperty("reactions")) {
                reactionsOnShares += obj["messages"][message]["reactions"].length;
            }
            shares++;
        } else {
            others++;
        }
    }

    Object.entries(participants).forEach(element => {
        if (element[1]) {
            console.log(`--> User "${element[0]}" sent ${element[1]} messages`)
        }
    });

    console.log(`- Messages: ${generic}
- Images: ${images}
- Shares: ${shares}
- Other types: ${others}
- Reactions on ${reactionsOnMessages} messages, ${reactionsOnPhotos} photos and ${reactionsOnShares} shares
- Overall reactions: ${reactionsOnShares 
            + reactionsOnMessages 
            + reactionsOnPhotos}`);
});