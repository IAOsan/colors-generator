import React, { useEffect, useState } from 'react';
import { UpArrowIcon } from '../icons';
import { throttle } from '../utils';

function Fab() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const handleScroll = throttle(() => {
			const form = document.querySelector('form');
			if (window.scrollY > form.offsetTop + form.clientHeight) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		}, 250);

		document.addEventListener('scroll', handleScroll);
		return () => {
			document.removeEventListener('scroll', handleScroll);
		};
	}, []);

	function handleClick() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}

	if (!isVisible) return null;

	return (
		<button
			onClick={handleClick}
			className='button button--fab anima-pop-in'
			type='button'
		>
			<UpArrowIcon className='icon icon--md d-block mx-auto' />
			<span className='sr-only'>Go to top of page</span>
		</button>
	);
}

export default Fab;
