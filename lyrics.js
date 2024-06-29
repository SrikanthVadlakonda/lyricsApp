const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");

const apiURL = "https://api.lyrics.ovh";

form.addEventListener("submit", e => {
    e.preventDefault();
    const searchValue = search.value.trim(); // Added const declaration

    if (!searchValue) {
        alert("Please enter an artist or song to search for.");
    } else {
        beginSearch(searchValue);
    }
});

async function beginSearch(searchValue) {
    try {
        const response = await fetch(`${apiURL}/suggest/${searchValue}`);
        const data = await response.json();
        displayData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch search results. Please try again later.');
    }
}

function displayData(data) {
    result.innerHTML = `
        <ul class="songs">
            ${data.data.map(song => `
                <li>
                    <div>
                        <strong>${song.artist.name}</strong> - ${song.title}
                    </div>
                    <span data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</span>
                </li>
            `).join('')}
        </ul>
    `;
}

result.addEventListener('click', async e => {
    const clickedElement = e.target;

    if (clickedElement.tagName === 'SPAN') {
        const artist = clickedElement.getAttribute('data-artist');
        const songTitle = clickedElement.getAttribute('data-songtitle');

        try {
            const response = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
            const data = await response.json();
            const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

            // Display lyrics in a new container or append it to result
            result.innerHTML = `
                <h2><strong>${artist}</strong> - ${songTitle}</h2>
                <p>${lyrics}</p>
            `;
        } catch (error) {
            console.error('Error fetching lyrics:', error);
            alert('Failed to fetch lyrics. Please try again later.');
        }
    }
});
