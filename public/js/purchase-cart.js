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
                const result = await response.json();
                console.log('Response:', result);

                if (result.success) {
                    window.location.href = `/${result.ticket._id}`; // Redirect to ticket view
                } else {
                    // Handle the case where products could not be purchased
                    document.body.innerHTML = `<h1>No products could be purchased due to insufficient stock</h1>`;
                }

            } else {
                // Handle non-OK response
                const htmlResponse = await response.text();
                document.body.innerHTML = htmlResponse;
            }

        } catch (error) {
            console.error('Error during purchase:', error);
        }
    });
});
