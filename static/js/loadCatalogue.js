async function loadCatalogueItems() {
    const catalogueContainer = document.getElementById('catalogueGrid');

    try {
        const response = await fetch('/posts');
        const fileNames = await response.json();

        for (const fileName of fileNames) {
            // Skip files starting with ._
            if (fileName.startsWith('._')) {
                continue;
            }

            try {
                const postResponse = await fetch(`/posts/${fileName}`);
                const text = await postResponse.text();
                catalogueContainer.innerHTML += generateCatalogueItemHTML(text, fileName);
            } catch (error) {
                console.error('Error loading catalogue item:', error);
            }
        }
    } catch (error) {
        console.error('Error fetching post list:', error);
    }
}
  
  function generateCatalogueItemHTML(itemText, fileName) {
    let displayFileName = fileName.split('_').join(' ').split('.')[0]; // Clean up the file name for display
    return `
        <div class="catalogue-item">
            <h3>${displayFileName}</h3>
            <p>${itemText.replace(/\n/g, '<br>')}</p>
        </div>
    `;
  }
  
  document.addEventListener('DOMContentLoaded', loadCatalogueItems);