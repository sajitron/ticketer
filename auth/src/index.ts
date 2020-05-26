import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/users/currentuser', (req, res) => {
	res.send('Hi there');
});

const port = 8000;

app.listen(port, () => console.log('App listening on ' + port));
