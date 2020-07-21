import axios from 'axios';

export default ({ req }) => {
	if (typeof window === 'undefined') {
		// * we are on the server
		// return axios.create({
		// 	baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
		// 	headers: req.headers // * needed by nginx
		// });
		return axios.create({
			baseURL: 'http://www.adams-ticketing-app-prod.xyz',
			headers: req.headers // * needed by nginx
		});
	} else {
		// * we are on the browser
		return axios.create({
			baseURL: '/'
		});
	}
};
