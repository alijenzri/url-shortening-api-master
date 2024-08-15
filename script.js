(function () {
    'use strict';

    var form = document.querySelector('.needs-validation');

    form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }

        form.classList.add('was-validated');
    }, false);
})();

async function shortenLink(originalLink) {
    const apiUrl = 'https://api-ssl.bitly.com/v4/shorten';
    const apiKey = '2f246049556e2a5ff87ef40417daac3f3aada50f'; 

    const requestHeaders = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    };

    const requestBody = JSON.stringify({
        long_url: originalLink
    });

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: requestHeaders,
            body: requestBody
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`${response.status} ${response.statusText}: ${errorDetails.message || 'No message provided'}`);
        }

        const jsonResponse = await response.json();
        return jsonResponse.link; 
    } catch (error) {
        console.error('Error:', error.message);
        alert(`Failed to shorten the link: ${error.message}`);
        throw error; 
    }
}

let shortenedLinksArray = [];

document.querySelector('#btn-shorten')
    .addEventListener('click', async (event) => {
        event.preventDefault(); 

        let originalLinkInput = document.getElementById('link-input').value;

        if (originalLinkInput !== '' && !shortenedLinksArray.includes(originalLinkInput)) {
            shortenedLinksArray.push(originalLinkInput);
            console.log(shortenedLinksArray);

            try {
                let shortenedLink = await shortenLink(originalLinkInput); 

                let newShortenedLinkHTML = `
                    <div class="shortened-link-output d-flex align-items-center justify-content-between py-3 px-4 mb-3" data-link-input="${originalLinkInput}">
                        <p class="original-link">${originalLinkInput}</p>
                        <div class="line-separator mx-3"></div>
                        <div class="shortened-link d-flex align-items-center">
                            <p class="hortened-url me-3">${shortenedLink}</p>
                            <button class="btn btn-singUp btn-copy rounded py-2 px-4" data-link="${shortenedLink}">Copy</button>
                        </div>
                    </div>
                `;

                console.log(newShortenedLinkHTML);
                document.querySelector('.shortened-link-section').innerHTML += newShortenedLinkHTML;
            } catch (error) {
                console.error('Error during link shortening:', error.message);
            }
        } else {
            alert('Link is either empty or already shortened');
        }
    });

document.querySelector('.shortened-link-section').addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('btn-copy')) {
        const shortenedLink = event.target.getAttribute('data-link');

        navigator.clipboard.writeText(shortenedLink).then(() => {
            event.target.classList.add('btn-copy-copied');
            event.target.textContent = 'Copied!'; 
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }
});
