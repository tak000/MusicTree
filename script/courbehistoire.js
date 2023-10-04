document.addEventListener("DOMContentLoaded", function () {
    // Fetch the JSON data from an external file
    fetch('Json/music.json')
        .then(response => response.json())
        .then(timelineData => {
            const timelineContainer = document.getElementById("timeline");

            // Create an array to hold all entries (genres and subgenres)
            const allEntries = [];

            // Iterate through genres and subgenres, and add them to the array
            for (const genre in timelineData) {
                const data = timelineData[genre];
                const entry = {
                    type: 'genre',
                    name: genre,
                    date: parseInt(data.date),
                    description: data.description,
                };
                allEntries.push(entry);

                if (data.subgenre) {
                    for (const subgenre in data.subgenre) {
                        const subgenreData = data.subgenre[subgenre];
                        const subgenreEntry = {
                            type: 'subgenre',
                            parentGenre: genre,
                            name: subgenre,
                            date: parseInt(subgenreData.date),
                            description: subgenreData.description,
                        };
                        allEntries.push(subgenreEntry);
                    }
                }
            }

            // Sort all entries by date
            allEntries.sort((a, b) => a.date - b.date);

            // Create timeline entries dynamically
            allEntries.forEach(entry => {
                const timelineEntry = document.createElement("div");
                timelineEntry.classList.add("timeline-entry");

                const date = document.createElement("h2");
                date.textContent = entry.date;
                timelineEntry.appendChild(date);

                const title = document.createElement("h2");
                title.textContent = entry.name;
                timelineEntry.appendChild(title);

                const description = document.createElement("p");
                description.textContent = entry.description;
                timelineEntry.appendChild(description);


                if (entry.type === 'subgenre') {
                    const parentGenre = document.createElement("p");
                    parentGenre.textContent = `Parent Genre: ${entry.parentGenre}`;
                    timelineEntry.appendChild(parentGenre);
                }

                timelineContainer.appendChild(timelineEntry);
            });
        })
        .catch(error => console.error('Error fetching JSON data:', error));
});
