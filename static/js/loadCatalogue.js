async function loadCatalogueItems() {
    const catalogueContainer = document.getElementById('catalogueGrid');

    // Check if catalogueContainer exists before proceeding
    if (!catalogueContainer) {
        console.log('Catalogue container not found, skipping catalogue items loading.');
        return; // Exit the function early if the element is not found
    }

    try {
        const response = await fetch('/posts');
        const fileNames = await response.json();

        for (const fileName of fileNames) {
            if (fileName.startsWith('._')) {
                continue;
            }

            try {
                const postResponse = await fetch(`/posts/${fileName}`);
                let text = await postResponse.text();
                const fullTextNeeded = text.split(/\s+/).length > 100; // Check if the full text exceeds 100 words
                text = truncateToFirst100Words(text);
                catalogueContainer.innerHTML += generateCatalogueItemHTML(text, fileName, fullTextNeeded);
            } catch (error) {
                console.error('Error loading catalogue item:', error);
            }
        }
        attachClickListeners(); // Attach listeners after all items have been loaded
    } catch (error) {
        console.error('Error fetching post list:', error);
    }
}

function truncateToFirst100Words(text) {
    const words = text.split(/\s+/);
    if (words.length > 100) {
        const first100Words = words.slice(0, 100).join(' ') + '...'; // Append '...' for texts longer than 100 words
        return first100Words;
    }
    return text;
}

function generateCatalogueItemHTML(itemText, fileName, fullTextNeeded) {
    let displayFileName = fileName.split('_').join(' ').split('.')[0];
    let fullTextIndicator = fullTextNeeded ? ' data-full-text="true"' : ''; // Indicate whether the full text is needed
    return `
        <div class="catalogue-item"${fullTextIndicator} data-file-name="${fileName}">
            <h3>${displayFileName}</h3>
            <p>${itemText.replace(/\n/g, '<br>')}</p>
        </div>
    `;
}

function attachClickListeners() {
    const items = document.querySelectorAll('.catalogue-item[data-full-text="true"]'); // Select items needing full text on click
    items.forEach(item => {
        item.addEventListener('click', async function() {
            const fileName = this.getAttribute('data-file-name');
            try {
                const response = await fetch(`/posts/${fileName}`);
                const text = await response.text();
                this.querySelector('p').innerHTML = text.replace(/\n/g, '<br>'); // Replace the content with the full text
                this.removeAttribute('data-full-text'); // Remove the attribute to indicate full text is loaded
            } catch (error) {
                console.error('Error loading full text for item:', error);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', loadCatalogueItems);