declare module '*.svg' {
  import React = require('react');

  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare namespace React {
  interface HTMLAttributes<T> extends HTMLAttributes<T> {
    focused?: string;
  }
}
