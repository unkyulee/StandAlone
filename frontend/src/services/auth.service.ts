import event from './event.service';

export default {
	client: {},
	isAuthenticated() {
		let isValidAuth = false;
		
		// check if the client is valid
		let client: any = localStorage.getItem('client');
		if(client) {
			try {
				client = JSON.parse(client);
				if (client && client.id) {
					isValidAuth = true;
					this.client = client;
				}
			} catch (ex) {
				localStorage.removeItem("client")
				console.error(ex);
			}
		}

		// if not valid auth then clear localstorage
		if (!isValidAuth) localStorage.removeItem("client");

		return isValidAuth;
	},

	async authenticate(data) {
		let response = {};
		try {
			
		} catch (e) {
			console.error(e);
			return false;
		}

		return response;
	},

	logout() {
		for (let key of Object.keys(this.client)) delete this.client[key];
		localStorage.clear();
		location.reload();
		//
		event.send({name: 'data'});
	},
};
