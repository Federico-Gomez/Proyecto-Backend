document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.querySelector('.checkout-btn');

    checkoutBtn.addEventListener('click', async () => {
        try {

            const cartId = checkoutBtn.getAttribute('data-cart-id'); // Get cart ID from the data attribute
            console.log('Cart ID:', cartId);

            const response = await fetch(`/api/carts/${cartId}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Assuming your React app is served from the same domain
                // Redirect to the React app's TicketInfo component
                const result = await response.json();
                console.log('Response:', result);

                if (result.success) {
                    const ticketId = result.ticket._id; // Extract ticket ID from response
                    const ticketInfoUrl = `http://localhost:5173/ticket-info/${ticketId}`;
                    window.location.href = ticketInfoUrl; // Redirect to React app
                } else {
                    // Render purchase result with insufficient stock details
                    renderInsufficientStock(result.insufficientStockProducts);
                }

            } else {
                // Handle error response
                console.error('Error during purchase:', response.statusText);
            }
        } catch (error) {
            console.error('Error during purchase:', error);
        }
    });

    function renderInsufficientStock(insufficientStockProducts) {
        // Create a Handlebars-like template in JS for insufficient stock
        const insufficientStockHtml = `
            <h2>Insufficient Stock for the Following Products</h2>
            <ul>
                ${insufficientStockProducts.map(product => `
                    <li>
                        ${product.product} - Requested: ${product.requested}, Available: ${product.available}
                    </li>
                `).join('')}
            </ul>
            <a href="/carts">Back to Carts</a>
        `;

        document.body.innerHTML = insufficientStockHtml;
    }
});