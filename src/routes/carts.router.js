const { Router } = require('express');

const carts = [
	
]

const router = Router();

router.get('/', (_, res) => {
    res.json(carts);
});

router.post('/', (req, res) => {
    carts.push(req.body);
    res.json(req.body);
});

module.exports = router;