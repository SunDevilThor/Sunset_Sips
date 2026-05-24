# Sunset Sips

A multi-page static website for Sunset Sips, an Arizona mobile bartending business owned by Bree Yates.

## Project Goals

- Showcase past events in a more polished and searchable way than a Facebook timeline.
- Provide an inquiry-first contact flow.
- Keep hosting and maintenance costs at zero or near zero.
- Use no CSS or JavaScript frameworks.
- Keep HTML, CSS, JavaScript, and data separated by concern.
- Link to Facebook Reels instead of self-hosting every video file in the first version.

## Pages

- Home
- About Bree
- Past Events
- Upcoming Events
- Reviews
- Behind the Scenes
- Contact / Inquiries

## Development Notes

- HTML files should only contain page structure and script/link references.
- CSS is split into base, layout, components, themes, and page files.
- JavaScript is split into reusable app modules and page-specific renderers.
- Structured content lives in the `data/` folder.
- Logging should be descriptive and should avoid silent failures.
- Variable names should be descriptive and avoid one-letter names.

## Media Strategy

Facebook Reels should remain outbound links for the first version. This avoids unnecessary repository size growth and avoids bandwidth issues on free static hosting.

## Testing Contact Email

The inquiry form currently uses the project owner's testing email. Replace it with Bree's final inquiry email when the site is ready to present.
