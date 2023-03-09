import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/App.context';
import { useColorsContext } from '../context/Colors.context';
import ColorPicker from './ColorPicker.component';
import { Validator, dataParser } from '../utils';
import { MagicIcon, PercentageIcon } from '../icons';

function ColorForm() {
	const { INITIAL_COLOR, INITIAL_RANGE } = useAppContext();
	const { isValidColor, addColors } = useColorsContext();
	const [formData, setFormData] = useState({
		color: INITIAL_COLOR,
		range: INITIAL_RANGE,
	});
	const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
	const [error, setError] = useState(null);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const colorPreviewRef = useRef(null);

	useEffect(() => {
		if (isSubmitted && !error) {
			addColors(formData.color, formData.range);
			setIsSubmitted(false);
		}
	}, [formData, isSubmitted, error, addColors]);

	function validate(data) {
		const e = {
			color: new Validator(data.color)
				.label('Color')
				.required()
				.custom({
					condition: isValidColor(data.color),
					message: '"Color" must be a valid color',
				}).error,
			range: new Validator(data.range)
				.label('Range')
				.required()
				.number()
				.greater(1)
				.less(100).error,
		};
		return e.color || e.range;
	}

	function handleChangeInput({ target }) {
		setFormData((prevState) => ({
			...prevState,
			[target.name]: target.value,
		}));
	}

	function handleChangePicker(color) {
		setFormData((prevState) => ({
			...prevState,
			color: color.hex,
		}));
	}

	function handleSubmitForm(e) {
		e.preventDefault();

		setFormData((prevState) => {
			for (const key in formData) {
				const { parse } = e.target.elements[key].dataset;
				prevState[key] = dataParser[parse](prevState[key]);
			}
			return { ...prevState };
		});
		setError(validate(formData));
		setIsColorPickerOpen(false);
		setIsSubmitted(true);
	}

	return (
		<form onSubmit={handleSubmitForm} className='form pos-rel'>
			{error && (
				<p className='tooltip tooltip--input-feedback pos-abs anima-slide-fade-up'>
					{error}
				</p>
			)}
			<div className='form__group pos-rel mr-16'>
				<input
					onChange={handleChangeInput}
					className='form__control form__control--color'
					type='text'
					name='color'
					value={formData.color}
					autoComplete='false'
					placeholder='Enter color'
					data-parse='string'
				/>
				<button
					ref={colorPreviewRef}
					onClick={() =>
						setIsColorPickerOpen((prevState) => !prevState)
					}
					className='color-preview color-preview--input pos-abs'
					style={{ '--previewColor': formData.color }}
					type='button'
				>
					<span className='sr-only'>Open color picker</span>
				</button>
			</div>
			<div className='form__group pos-rel mr-md-16'>
				<PercentageIcon className='icon icon--sm icon--input pos-abs' />
				<input
					onChange={handleChangeInput}
					className='form__control form__control--range'
					type='number'
					name='range'
					value={formData.range}
					placeholder='Enter color range'
					data-parse='number'
				/>
			</div>
			<button
				className='button button--orange mt-16 mt-md-0'
				type='submit'
			>
				<b className='mr-16'>Create colors</b>
				<MagicIcon className='icon' />
			</button>
			<ColorPicker
				origin={colorPreviewRef}
				isOpen={isColorPickerOpen}
				color={formData.color}
				onChangeColor={handleChangePicker}
				onClickOutside={() => setIsColorPickerOpen(false)}
			/>
		</form>
	);
}

export default ColorForm;
