export const natsWrapper = {
	client: {
		publish: jest.fn().mockImplementation((subject: string, data: string, callback: () => void) => {
			callback();
		})
	}
};

// * mockImplementation will always call a function with *subject* and *data* as arguments
