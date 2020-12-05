import obj from 'object-path';

// get config from index.html
declare var window: any;
obj.ensureExists(window, '__CONFIG__', {});

export default {
	get(name, def_value?) {
		let v = null;
		if (window.__CONFIG__) v = obj.get(window.__CONFIG__, name, def_value);
		return v;
	},

	set(name, value) {
		// set default if it doesn't exists
		if (!window.__CONFIG__) window.__CONFIG__ = {};
		obj.set(window.__CONFIG__, name, value);
	}
}
