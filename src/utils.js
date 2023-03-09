function componentToHex(c) {
	let hex = c.toString(16);
	return hex.length === 1 ? '0' + hex : hex;
}

export function rgbToHex(r, g, b) {
	return `#` + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function getClasName(...str) {
	return str
		.reduce((acc, s) => {
			if (!s) return acc;

			const isAnString = typeof s === 'string' && isNaN(s);
			const isANumber = typeof s === 'number' && !isNaN(s);
			const isAnObject = typeof s === 'object' && !!Object.keys(s).length;

			if (isAnString || isANumber) {
				acc.push(s);
			}

			if (isAnObject) {
				const [key, value] = Object.entries(s)[0];
				acc = acc.concat(!!value ? key : []);
			}

			return acc;
		}, [])
		.join(' ');
}

export class Validator {
	constructor(value) {
		this.value = value;
		this._label = '';
		this.error = null;
	}
	label(name) {
		this._label = name;
		return this;
	}
	required() {
		if (!this.value !== 0 && !this.value && !this.error) {
			this.error = `"${this._label}" is not allowed to be empty`;
		}
		return this;
	}
	number() {
		if (isNaN(this.value) && !this.error) {
			this.error = `"${this._label}" must be a number`;
		}
		return this;
	}
	greater(number) {
		if (Number(this.value) < number && !this.error) {
			this.error = `"${this._label}" must be greater than or equal to "${number}"`;
		}
		return this;
	}
	less(number) {
		if (Number(this.value) > number && !this.error) {
			this.error = `"${this._label}" must be less than or equal to "${number}"`;
		}
		return this;
	}
	custom(validation) {
		if (!validation.condition && !this.error) {
			this.error = validation.message;
		}
		return this;
	}
}

export const dataParser = {
	hex(code) {
		return `#${code}`;
	},
	string(value) {
		return String(value.trim());
	},
	number(value) {
		return Number(value);
	},
};
