import { Router } from 'express';

const router = Router();

router.get(`${BASE_PATH}`, (req, res) => {
        res.render('index');
});

module.exports = router;