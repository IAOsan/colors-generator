import React from 'react';
import ColorsList from './ColorsList.component';
import ColorsSkeleton from './ColorsSkeleton.component';
import { useColorsContext } from '../context/Colors.context';
import { EmptyIcon } from '../icons';

function Colors({ isLoading }) {
	const { colorsList } = useColorsContext();

	if (isLoading) return <ColorsSkeleton size={18} />;

	if (!colorsList.length) {
		return (
			<div className='empty-state anima-fade-zoom-in'>
				<EmptyIcon className='icon icon--display-1 d-block mx-auto mb-16' />
				<h2 className='h2 mb-8'>Nothing!</h2>
				<p className='h4'>Your color collection is empty</p>
			</div>
		);
	}

	return colorsList.map((l, idx) => (
		<ColorsList key={`${idx}-${l.length}`} list={l} id={idx} />
	));
}

export default Colors;
