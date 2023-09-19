## To aviod Content Security Policy violation

Set security HTTP headers
app.use(helmet());
// Further HELMET configuration for Security Policy (CSP)
const scriptSrcUrls = [
'https://api.tiles.mapbox.com/',
'https://api.mapbox.com/',
'https://cdnjs.cloudflare.com/',
'https://*.stripe.com/',
'https://js.stripe.com/',
];
const styleSrcUrls = [
'https://api.mapbox.com/',
'https://api.tiles.mapbox.com/',
'https://fonts.googleapis.com/',
];
const connectSrcUrls = [
'https://api.mapbox.com/',
'https://a.tiles.mapbox.com/',
'https://b.tiles.mapbox.com/',
'https://events.mapbox.com/',
'https://bundle.js:*',
'ws://127.0.0.1:*/',
];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];
app.use(
helmet.contentSecurityPolicy({
directives: {
defaultSrc: [],
connectSrc: ["'self'", ...connectSrcUrls],
scriptSrc: ["'self'", ...scriptSrcUrls],
styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
workerSrc: ["'self'", 'blob:'],
frameSrc: ["'self'", 'https://*.stripe.com'],
objectSrc: [],
imgSrc: ["'self'", 'blob:', 'data:'],
fontSrc: ["'self'", ...fontSrcUrls],
},
}),
);
