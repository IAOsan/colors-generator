import React from 'react';
import { toast } from 'react-toastify';
import { getClasName, rgbToHex } from '../utils';
import { DropIcon, CopyIcon } from '../icons';
import { useColorsContext } from '../context/Colors.context';

function ColorBox({ rgb, type, weight }) {
	const { getBaseType } = useColorsContext();
	const hexCode = rgbToHex(...rgb);
	const baseType = getBaseType(hexCode);
	const className = getClasName(
		'colors__color',
		{
			'colors__color--base': type === 'base',
		},
		{
			'colors__color--tint': baseType === 'tint',
		},
		{
			'colors__color--shade': baseType === 'shade',
		}
	);

	function handleClick(e) {
		const { color } = e.target.closest('button').dataset;
		if (!color) return;

		navigator.clipboard.writeText(color);
		toast('🎉 Color copied to the clipboard!', {
			className: 'toast--dark',
		});
	}

	return (
		<li
			className='col-md-2 col-lg-1'
			style={{
				'--colorBox': `rgb(${rgb})`,
			}}
		>
			<div className={className}>
				<p className='colors__range font-sm letter-sp-xs mr-4'>
					<span>
						<DropIcon className='icon icon--sm mr-4' />
					</span>
					{weight}%
				</p>
				<p className='colors__code pos-abs'>{hexCode}</p>
				<div className='colors__overlay pos-abs'>
					<p className='tooltip tooltip--copy pos-rel'>Copy HEX</p>
					<button
						onClick={handleClick}
						className='colors__copy d-block mx-auto'
						data-color={hexCode}
						type='button'
					>
						<CopyIcon className='icon icon--md d-block mx-auto' />
						<span className='sr-only'>
							Copy color to the clipboard
						</span>
					</button>
				</div>
			</div>
		</li>
	);
}

export default ColorBox;
