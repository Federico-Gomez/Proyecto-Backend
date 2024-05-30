document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.delete-product-btn').forEach(button => {
        button.addEventListener('click', async function (e) {
            const cartId = this.getAttribute('data-cart-id');
            const productId = this.getAttribute('data-product-id');
            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                Swal.fire(
                    'Deleted!',
                    'Your product has been deleted.',
                    'success'
                ).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire(
                    'Error!',
                    'There was an error deleting the product.',
                    'error'
                );
            }
        });
    });
});