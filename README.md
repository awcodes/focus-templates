# focus-templates

Share-image templates for awcodes packages, rendered by [Focus](https://github.com/awcodes/focus) cards. Ported from Thumbtack.

This repository is personal to the awcodes brand. It is public only as an example of a Focus template repository.

## Templates

Each layout comes in two canvases. Focus lays a template out at its canvas and scales it to each card size, cropping the centre when the aspect ratio differs, so pick the canvas closest to the sizes you publish.

| Template | Canvas | Screenshots | Layout | Use for |
|---|---|---|---|---|
| `default` | 2560x1440 | 0 | Logo, title, description, and install command, centered | 16:9 (YouTube, 1920x1080) |
| `default-wide` | 2400x1260 | 0 | Same | Open Graph, GitHub social |
| `one-up` | 2560x1440 | 1 | Title and description above one screenshot | 16:9 |
| `one-up-wide` | 2400x1260 | 1 | Same, smaller screenshot | Open Graph, GitHub social |
| `two-up` | 2560x1440 | 2 | Title and description top left; the light screenshot large at the back, the dark one in front at the lower left | 16:9 |
| `two-up-wide` | 2400x1260 | 2 | Same, smaller screenshots | Open Graph, GitHub social |
| `two-up-plain` | 2560x1440 | 2 | The two-up screenshots, larger, with no title, description or logo | 16:9, for sites that caption the image themselves |
| `two-up-plain-wide` | 2400x1260 | 2 | Same | Open Graph ratio |
| `code-plain` | 2560x1440 | 0 | A light editor showing the card's `code` value, and a dark terminal in front showing the install command; no title or logo. Keep the snippet to 7 lines. | 16:9, for packages without a UI |
| `logo-plain` | 2560x1440 | 0 | The logo centred on a neutral grey version of the background | A fixed fallback image |

The wide canvas is Open Graph's exact ratio. GitHub social (2:1) crops 30px from its top and bottom, inside the 70px margins every layout keeps, and Focus reports that crop as a warning.

## Using them from a package

```php
use Awcodes\Focus\Card;
use Awcodes\Focus\Enums\Size;

return ScreenshotSuite::make()
    ->cardTemplates('https://github.com/awcodes/focus-templates/tree/v2.0.0/dist')
    ->screenshots([/* ... */])
    ->cards([
        Card::make('social')
            ->template('two-up-wide')
            ->screenshots(['editor', 'picker'])
            ->sizes([Size::OpenGraph, Size::GitHubSocial]),

        Card::make('video')
            ->template('two-up')
            ->screenshots(['editor', 'picker'])
            ->sizes([[1920, 1080]]),
    ]);
```

While working on the templates, point a package at the local build instead: `->cardTemplates('../../focus-templates/dist')`.

## How the templates work

Focus fills elements that have a `data-focus` attribute:

| Key | Filled with |
|---|---|
| `title`, `description`, `package` | Text from the package's `composer.json`, or the card's `title()` and `description()` |
| `install` | `composer require {package}`; override it per card, e.g. `->with(['install' => 'composer require --dev awcodes/focus'])` |
| `code` | `code-plain` only: the snippet, from `->with(['code' => $snippet])` |
| `screenshot.1`, `screenshot.2` | The card's screenshots, on `<img>` elements |

Everything inside those elements is sample content, so `npm run dev` shows a realistic preview at `/default/`, `/two-up-wide/`, and so on.

Templates are fixed-size, not responsive. The layout declares its canvas with `<meta name="focus:canvas" content="2560x1440">` (the `width` and `height` props of `src/layouts/Card.astro`), and pages are designed in plain pixels at that size with ordinary Tailwind utilities. Focus draws the page at the device scale factor that fits each card size, so output stays sharp without resampling.

Fonts are bundled from Fontsource. Focus blocks network requests while rendering, so anything loaded from a CDN would be missing.

## Releasing

Focus reads the committed build, not the source:

1. `npm run build`
2. Commit `src/` and `dist/` together.
3. Tag a release (`git tag v1.0.0`) and push the tag.
4. Point packages at the new tag.

`dist/` must not be listed in `.gitignore` or marked `export-ignore` in `.gitattributes`: GitHub leaves export-ignored paths out of the archives Focus downloads.
