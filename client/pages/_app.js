import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';

const AppComponent = ({ Component, pageProps, currentUser }) => {
	return (
		<div>
			<h1>{currentUser.email}</h1>
			<Component {...pageProps} />
		</div>
	);
};

// * get initialProps component for a Page Component is different from that of an App component
AppComponent.getInitialProps = async (appContext) => {
	const client = buildClient(appContext.ctx);
	const { data } = await client.get('/api/users/currentuser');
	// * this is how we handle multiple getInitialProps

	let pageProps = {};
	if (appContext.Component.getInitialProps) {
		pageProps = await appContext.Component.getInitialProps(appContext.ctx);
	}

	return {
		pageProps,
		...data // * contains currentUser data
	};
};

export default AppComponent;
