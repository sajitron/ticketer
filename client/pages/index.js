import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
	return currentUser ? <h1>You are signed in</h1> : <h1>You are not signed in</h1>;
};

// * we do not utilize the use-request hook bcos it can only be used within a React component.

// * however, we cannot fetch data during SSR in the React component above hence ⏬

// * below we fetch data during SSR

// * the host IP is different between making requests from the browser & the server. kubernetes is funny yea
LandingPage.getInitialProps = async (context) => {
	// * context holds the req property which holds data like cookies and host
	// * we are on the server
	const { data } = await buildClient(context).get('/api/users/currentuser');

	// * whatever we return here is accessible in the component above as a prop
	return data;
};

export default LandingPage;
