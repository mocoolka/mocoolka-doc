export interface GlobalProp extends ColorProp, FontProp {
}
export interface ColorProp {
    color: 'accent' | 'alert' | 'alt' | 'disabled' | 'main' | 'primary' | 'secondary' | 'success' | 'warning' | 'hint' | 'inherit';
    bgColor: 'paper' | 'content' | 'divider' | 'accent' | 'alert' | 'alt' | 'disabled' | 'main' | 'selected' | 'focus' | 'success' | 'warning' | 'transparent' | 'inherit';
}
export interface FontProp {
    fontWeight: 'thin' | 'light' | 'regular' | 'medium' | 'bold' | 'black' | 'inherit';
    fontFamily: 'sansSerif' | 'serif' | 'monospace' | 'inherit';
    fontSize: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle' | 'p' | 'caption' | 'overline' | 'inherit';
}
