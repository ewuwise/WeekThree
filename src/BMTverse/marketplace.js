document.addEventListener('DOMContentLoaded', () => {
    const marketplaceGrid = document.getElementById('nft-marketplace');

    // Function to load NFTs into the marketplace
    async function loadMarketplaceItems() {
        // Simulated data for demonstration
        const items = [
            { id: 1, name: 'NFT #1', price: '0.1 ETH' },
            { id: 2, name: 'NFT #2', price: '0.2 ETH' },
            { id: 3, name: 'NFT #3', price: '0.3 ETH' },
        ];

        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'marketplace-item';
            itemElement.innerHTML = `
                <h3>${item.name}</h3>
                <p>Price: ${item.price}</p>
                <button class="buy-button" data-id="${item.id}">Buy</button>
            `;
            marketplaceGrid.appendChild(itemElement);
        });
    }

    loadMarketplaceItems();
});
