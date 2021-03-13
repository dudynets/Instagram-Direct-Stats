let textarea = document.getElementById('textarea');
let outputDiv = document.getElementById('stats');
let outputText = '';

function calculate() {
    outputText = '';
    let data = textarea.value;

    if (!data) {
        outputDiv.innerHTML = `
            <h1>Insert your JSON data to get started.</h1>
            <h3>The calculations will be made locally on your device. Your information will not be sent anywhere.</h3>
        `;
        return;
    };

    try {
        let obj = JSON.parse(data);
        outputText = outputText.concat(`
            <h1>Your stats:</h1>
            <h3>
                <b>Total found:</b> <span style="font-weight: normal">${(obj["messages"].length)} messages</span>
            </h3>
            <hr noshade color="black" size="2">
            <h3>Participants:</h3>
            <ul>
        `)

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
                outputText = outputText.concat(`<li><b>${element[0]}</b> sent ${element[1]} messages</li>`);
            }
        });

        outputText = outputText.concat(`</ul>
            <hr noshade color="black" size="2">
            <h3>Detailed stats:</h3>
            <ul>
            <li><b>Messages:</b> ${generic} pcs</li>
            <li><b>Images:</b> ${images} pcs</li>
            <li><b>Shares:</b> ${shares} pcs</li>
            <li><b>Reactions on:</b> <ul><li>${reactionsOnMessages} messages</li><li>${reactionsOnPhotos} photos</li><li>${reactionsOnShares} shares</li></ul></li>
            <li><b>Overall reactions:</b> ${reactionsOnShares 
                        + reactionsOnMessages 
                        + reactionsOnPhotos} pcs</li>
            <li><b>Other types:</b> ${others} pcs</li>         
            </ul>
        `);

        outputDiv.innerHTML = outputText;
    } catch (e) {
        if (e.message == `Cannot read property 'length' of undefined`) {
            outputDiv.innerHTML = outputText.concat(`
                <h1>Error:</h1>
                <h3>Please provide correct Instagram JSON</h3>
            `);
        } else {
            outputDiv.innerHTML = outputText.concat(`
                <h1>Error:</h1>
                <h3>${e.message}</h3>
            `);
        }
        
    }
}

