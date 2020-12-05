import obj from 'object-path';
let _event = {}

export default {

	// subscribe to an event that corresponds to the name
	subscribe(subscriber, event, callback) {		
		obj.ensureExists(_event, event, {});
		_event[event][subscriber] = callback;
    },
    
	unsubscribe(subscriber, event) {		
		// remove subscriber from the event
		if (_event[event] && _event[event][subscriber]) {
			delete _event[event][subscriber];
		}
    },
    
	unsubscribe_all(subscriber) {
		for (let event of Object.keys(_event)) {
			// remove subscriber from all events
			this.unsubscribe(subscriber, event);
		}
    },
    
	send(event) {
		let subscribers = obj.get(_event, event.name, {});
		for (let sub of Object.keys(subscribers)) {
			setTimeout(() => {
				if (subscribers[sub]) {
					try {
						subscribers[sub](event);
					} catch (ex) {
						console.error(subscribers[sub], sub, event);
						console.error(ex);
					}
				}
			});
		}
	}
}
