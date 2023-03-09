import React, { useRef, useState } from 'react';
import Link from './Link.component';
import Modal from './Modal.component';
import { InfoIcon, GithubLogo } from '.././icons';
import LogoMobile from '../assets/logo-mobile.png';
import LogoDesktop from '../assets/logo-desktop.png';

function Header() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const infoButtonRef = useRef(null);

	function toggleModal() {
		setIsModalOpen((prevState) => !prevState);
	}

	return (
		<>
			<header className='header'>
				<div className='container h-100 flex flex-ai-c flex-jc-sb'>
					<picture>
						<source
							media='(max-width: 555px)'
							srcSet={LogoMobile}
						/>
						<source
							media='(min-width: 556px)'
							srcSet={LogoDesktop}
						/>
						<img src={LogoDesktop} alt='Colors generator logo' />
					</picture>
					<button
						onClick={toggleModal}
						className='button button--icon ml-auto mr-12 mr-lg-16'
						type='button'
						ref={infoButtonRef}
					>
						<InfoIcon className='icon d-block mx-auto' />
						<span className='sr-only'>
							View project information
						</span>
					</button>
					<Link
						url='https://github.com/IAOsan/colors-generator'
						customClassname='github-source'
						content={() => (
							<>
								<GithubLogo className='github-source__icon' />
								<span className='sr-only'>
									View the source code in github
								</span>
							</>
						)}
					/>
				</div>
			</header>
			<Modal isOpen={isModalOpen} onClose={toggleModal} />
		</>
	);
}

export default Header;
