/** allows imports of CSS form TS/TSX */
declare module '*.css' {
  const value: any;
  export default value;
}

declare module '*.scss' {
  const content: {[className: string]: string};
  export = content;
}

declare module '@vestico/common/lib/components/*.css' {
  const value: any;
  export default value;
}

declare module '@vestico/common/lib/components/*.scss' {
  const content: {[className: string]: string};
  export = content;
}