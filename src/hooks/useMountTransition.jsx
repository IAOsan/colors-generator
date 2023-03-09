import { useEffect, useRef, useState } from 'react';

function useMountTransition(isMounted, unMountDelay = 1000) {
	const [hasTransitionedIn, setHasTransitionedIn] = useState(false);
	const timeoutRef = useRef(null);

	useEffect(() => {
		if (isMounted && !hasTransitionedIn) {
			setHasTransitionedIn(true);
		} else if (!isMounted && hasTransitionedIn) {
			timeoutRef.current = setTimeout(
				() => setHasTransitionedIn(false),
				unMountDelay
			);
		}

		return () => {
			clearTimeout(timeoutRef.current);
		};
	}, [unMountDelay, isMounted, hasTransitionedIn]);

	return hasTransitionedIn;
}

export default useMountTransition;
