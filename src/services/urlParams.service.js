function params() {
	return new URLSearchParams(window.location.search);
}

function get(name) {
	const p = params();
	if (name) return p.get(name);
	return p.toString();
}

function append(name, value) {
	const p = params();
	p.append(name, value);
	return p.toString();
}

function remove(name) {
	const p = params();
	p.delete(name);
	return p.toString();
}

function entries() {
	const arr = [];
	for (const [key, value] of params().entries()) {
		arr.push([key, value]);
	}
	return arr;
}

export default (() => ({
	get,
	append,
	remove,
	entries,
}))();
