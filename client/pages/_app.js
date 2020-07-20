import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
	return (
		<div>
			<Header currentUser={currentUser} />
			<div className="container">
				<Component currentUser={currentUser} {...pageProps} />
			</div>
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
		pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
	}

	return {
		pageProps,
		...data // * contains currentUser data
	};
};

export default AppComponent;
