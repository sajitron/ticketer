import axios from 'axios';

const LandingPage = ({ currentUser }) => {
	console.log(currentUser);
	return <h1>Landing</h1>;
};

// * we do not utilize the use-request hook bcos it can only be used within a React component.

// * however, we cannot fetch data during SSR in the React component above hence ⏬

// * below we fetch data during SSR

// * the host IP is different between making requests from the browser & the server. kubernetes is funny yea
LandingPage.getInitialProps = async ({ req }) => {
	if (typeof window === 'undefined') {
		// * we are on the server
		const {
			data
		} = await axios.get('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
			headers: req.headers // * needed by nginx
		});

		// * whatever we return here is accessible in the component above as a prop
		return data;
	} else {
		// * we are on the browser

		const { data } = await axios.get('/api/users/currentuser');

		// * whatever we return here is accessible in the component above as a prop
		return data;
	}

	return {};
};

export default LandingPage;
