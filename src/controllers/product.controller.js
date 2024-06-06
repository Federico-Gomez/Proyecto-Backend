const { productServices } = require('../services');

module.exports = {

    createMockProducts: async (req, res) => {
        // const mockProductsNumber = req.body;
        const mockProducts = await productServices.createMockProducts(100);
        
        res.sendSuccess(mockProducts).json();
    }
}