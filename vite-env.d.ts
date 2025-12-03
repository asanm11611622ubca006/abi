/// <reference types="vite/client" />

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'ion-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { name?: string; src?: string; size?: string; color?: string; };
        }
    }
}
