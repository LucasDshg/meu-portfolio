/// <reference types="vite/client" />

declare module '*.less' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.pdf' {
  const src: string;
  export default src;
}
