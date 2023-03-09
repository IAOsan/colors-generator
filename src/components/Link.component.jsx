import React from 'react';
import { getClasName } from '../utils';
import { LinkIcon } from '../icons';

function Link({ url, label, icon = true, customClassname, content }) {
	const className = getClasName(
		{ link: !customClassname },
		{ [customClassname]: !!customClassname }
	);
	const textClassName = getClasName({ 'mr-4': !!icon });

	return (
		<a href={url} className={className} target='_blank' rel='noreferrer'>
			{content ? (
				content()
			) : (
				<>
					<span className={textClassName}>{label}</span>
					{icon && <LinkIcon className='icon' />}
				</>
			)}
		</a>
	);
}

export default Link;
