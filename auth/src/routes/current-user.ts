import express from 'express';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
	res.send({ message: 'Hi there' });
});

export { router as currentUserRouter };
