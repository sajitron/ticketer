import express from 'express';

const router = express.Router();

router.post('/api/users/signin', (req, res) => {
	res.send({ message: 'Hi there' });
});

export { router as signinRouter };
