import React from 'react';
import Portal from '../components/Portal.component';
import Link from './Link.component';

function Modal({ isOpen, onClose }) {
	if (!isOpen) return null;

	return (
		<Portal>
			<div className='modal'>
				<h2 className='h5 mb-16'>About</h2>
				<p className='mb-16'>This is a basic color generator tool</p>
				<ul className='ml-20 list-position-inside mb-16'>
					<li>
						Colors supported
						<ul className='ml-20 list-position-inside'>
							<li>#RGB, #RRGGBB, #RGBA #RRGGBBAA </li>
							<li>RGB/A, HSL/A</li>
							<li>
								One of the
								<Link
									url='https://www.w3.org/wiki/CSS/Properties/color/keywords'
									label='predefined colors keyword'
								/>
							</li>
						</ul>
					</li>
					<li>
						The percentage value goes from 1 to 100. The calculation
						is <b>round(100 / &lt;pecent &gt;)</b>
					</li>
				</ul>
				<h2 className='h5'>This was created with</h2>
				<ul className='ml-20 list-position-inside'>
					<li>
						<Link
							label='values.js'
							url='https://github.com/noeldelgado/values.js'
						/>
						- Js library to get Get tints and shades of a CSS color
					</li>
					<li>
						<Link
							label='react-color'
							url='https://github.com/casesandberg/react-color'
						/>
						- Color Pickers from Sketch, Photoshop, Chrome, Github,
						Twitter & more
					</li>
					<li>
						<Link
							label='color-contrast-checker'
							url='https://github.com/bbc/color-contrast-checker'
						/>
						- An accessibility checker tool for validating the color
						contrast
					</li>
					<li>
						<Link
							label='react-toastify'
							url='https://github.com/fkhadra/react-toastify'
						/>
						- React notifications
					</li>
				</ul>
			</div>
			<div
				role='button'
				tabIndex={0}
				onClick={onClose}
				onKeyDown={onClose}
				className='overlay anima-fade'
			></div>
		</Portal>
	);
}

export default Modal;
