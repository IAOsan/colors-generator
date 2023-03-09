function update(params) {
	const { pathname } = window.location;
	const relativePath = pathname + (params ? `?${params}` : '');
	window.history.replaceState(null, '', relativePath);
}

export default (() => ({
	update,
}))();
