import React from 'react';

function ColorsSkeleton({ size = 12 }) {
	return (
		<ul
			className='colors row list-style-none pos-rel'
			data-testid='skeleton'
		>
			{Array.from({ length: size }, (_, idx) => idx + 1).map((n) => (
				<li key={n} className='col-md-2 col-lg-1'>
					<div className='skeleton skeleton__box'></div>
				</li>
			))}
			<button className='colors__remove pos-abs' type='button'>
				<span className='skeleton skeleton__icon mr-12'></span>
				<span className='skeleton skeleton__text skeleton__text--wordx6'></span>
			</button>
		</ul>
	);
}

export default ColorsSkeleton;
