import React, { useEffect, useRef } from 'react';
import { ChromePicker } from 'react-color';

function ColorPicker({ origin, isOpen, color, onChangeColor, onClickOutside }) {
	const pickerRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			const condition =
				origin.current &&
				!origin.current.contains(event.target) &&
				pickerRef.current &&
				!pickerRef.current.contains(event.target);

			if (condition) onClickOutside && onClickOutside();
		};
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [origin, onClickOutside]);

	if (!isOpen) return null;

	return (
		<div
			ref={pickerRef}
			className='color-picker pos-abs anima-slide-fade-up'
		>
			<ChromePicker
				color={color}
				disableAlpha={true}
				onChangeComplete={onChangeColor}
			/>
		</div>
	);
}

export default ColorPicker;
