import React from 'react';
import ColorBox from './ColorBox.component';
import { TrashIcon } from '../icons';
import { useColorsContext } from '../context/Colors.context';

function ColorsList({ list, id }) {
	const { removeColor } = useColorsContext();

	if (!list.length) return null;

	return (
		<ul className='colors row list-style-none pos-rel anima-slide-fade-up'>
			{list.map((c) => (
				<ColorBox key={`${c.type}${c.weight}`} {...c} />
			))}
			<div className='colors__remove pos-abs'>
				<button
					onClick={() => removeColor(id)}
					className='colors__remove-button'
					type='button'
				>
					<TrashIcon className='icon mr-12' />
					Remove
				</button>
			</div>
		</ul>
	);
}

export default ColorsList;
