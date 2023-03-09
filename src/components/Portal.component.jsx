import { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

function createWrapperAndAppendToBody(id) {
	const wrapperElement = document.createElement('div');
	wrapperElement.id = id;
	document.body.appendChild(wrapperElement);
	return wrapperElement;
}

function Portal({ children, id = 'portalRoot' }) {
	const [wrapperElement, setWrapperElement] = useState(null);

	useLayoutEffect(() => {
		let systemCreated = false;
		let wrapper = document.getElementById(id);
		if (!wrapper) {
			systemCreated = true;
			wrapper = createWrapperAndAppendToBody(id);
		}
		setWrapperElement((prevState) => wrapper);
		return () => {
			if (systemCreated && wrapper.parentNode) {
				systemCreated = false;
				wrapper.parentNode.removeChild(wrapper);
			}
		};
	}, [id]);

	if (!wrapperElement) return null;

	return createPortal(children, wrapperElement);
}

export default Portal;
