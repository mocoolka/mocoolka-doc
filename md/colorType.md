MODULE [colorType](https://github.com/mocoolka/mocoolka-ts/blob/master/src/colorType.ts)

# Global Properties

## A global property is a set of global property that define the basic css for all UI elements.

Site is a special global definition which includes baseline parameters which all other elements inherit.
In addition to providing global variables defaults, site also provides page styling
for content that exists outside of interface elements.

## Color Properties

### Color property define color properties on all element

The `ColorProp` type class identifies an associative operation on a type
constructor. It is similar to `Semigroup`, except that it applies to
types of kind `* -> *`, like `Array` or `Option`, rather than concrete types
like `string` or `number`.

`Alt` instances are required to satisfy the following laws:

1.  Associativity: `A.alt(A.alt(fa, ga), ha) = A.alt(fa, A.alt(ga, ha))`
2.  Distributivity: `A.map(A.alt(fa, ga), ab) = A.alt(A.map(fa, ab), A.map(ga, ab))`

| Name    | Type                                                                                                                                | Description      |
| :------ | :---------------------------------------------------------------------------------------------------------------------------------- | :--------------- |
| color   | 'accent','alert','alt','disabled','main','primary','secondary','success','warning','hint','inherit'                                 | foreground color | , |
| bgColor | 'accent','alert','alt','disabled','main','success','warning','inherit','paper','content','divider','selected','focus','transparent' | background color |

## FontProp

A site can specify styles for page content.

| Name       | Type                                                                        | Description |
| :--------- | :-------------------------------------------------------------------------- | :---------- |
| fontWeight | 'inherit','thin','light','regular','medium','bold','black'                  | undefined   | , |
| fontFamily | 'inherit','sansSerif','serif','monospace'                                   | undefined   | , |
| fontSize   | 'inherit','h1','h2','h3','h4','h5','h6','subtitle','p','caption','overline' | undefined   |
