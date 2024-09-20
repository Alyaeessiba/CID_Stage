import { useEffect } from 'react';

const PageMeta = ({ title }) => {
    useEffect(() => {
        // Set document title
        document.title = title;

        // Set favicon
        const link = document.querySelector("link[rel='icon']") || document.createElement('link');
        link.rel = 'icon';
        link.href = '/img/logo.png'; // Path relative to the public directory
        document.head.appendChild(link);

        // Cleanup on unmount
        return () => {
            link.remove();
        };
    }, [title]);

    return null;
};

export default PageMeta;
