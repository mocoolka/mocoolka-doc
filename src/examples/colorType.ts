/**
 *
 * Site is a special global definition which includes baseline parameters which all other elements inherit.
 * In addition to providing global variables defaults, site also provides page styling
 * for content that exists outside of interface elements.
 * @header A global property  is a set of global property that define the basic css for all UI elements.
 * @title Global Properties
 * @module
 */

export interface GlobalProp extends ColorProp, FontProp {

}

/**
 * The `ColorProp` type class identifies an associative operation on a type
 * constructor.  It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`, like `Array` or `Option`, rather than concrete types
 * like `string` or `number`.
 *
 * `Alt` instances are required to satisfy the following laws:
 *
 * 1. Associativity: `A.alt(A.alt(fa, ga), ha) = A.alt(fa, A.alt(ga, ha))`
 * 2. Distributivity: `A.map(A.alt(fa, ga), ab) = A.alt(A.map(fa, ab), A.map(ga, ab))`
 * @header Color property define color properties on all element
 * @title Color Properties
 * @propertyinterface
 */
export interface ColorProp {
    /**
     * foreground color
     */
    color: 'accent' | 'alert' | 'alt' | 'disabled'
    | 'main' | 'primary' | 'secondary' | 'success' | 'warning' | 'hint' | 'inherit';
    /**
     * background color
     */
    bgColor: 'paper' | 'content' | 'divider' | 'accent' | 'alert' | 'alt' | 'disabled'
    | 'main' | 'selected' | 'focus' | 'success' | 'warning' | 'transparent' | 'inherit';
}
/**
 * A site can specify styles for page content.
 * @summary The `FontProp` type class identifies an associative css on a font
 * @propertyinterface
 */
export interface FontProp {
    fontWeight: 'thin' | 'light' | 'regular' | 'medium' | 'bold' | 'black' | 'inherit';
    fontFamily: 'sansSerif' | 'serif' | 'monospace' | 'inherit';
    fontSize: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' |
    'subtitle' | 'p' | 'caption' | 'overline' | 'inherit';
}
