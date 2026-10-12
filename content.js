/*
 * Sport Within — content layer
 * ------------------------------------------------------------------
 * Edit this file to update the homepage without touching layout code.
 * Fields mirror the CMS model in the developer brief (§16), so this file
 * can later be swapped for a headless CMS (Sanity, Contentful, Decap…)
 * that returns the same shape.
 *
 * Rule from the brief: never link to something that isn't live.
 * Leave a URL as "" and the site shows "Soon" instead of a link.
 */
window.SW_CONTENT = {
  site: {
    // Branded address for guest and collaboration enquiries.
    // TODO: replace with the real Sport Within address before launch.
    email: "hello@sportwithin.com",
    // Optional form backend (e.g. Formspree, Basin, Netlify Forms URL).
    // When empty, the contact form opens the visitor's email client instead.
    formEndpoint: "",
  },

  /*
   * Photography — all from Unsplash (free for commercial use, no attribution
   * required; credited in the footer anyway). Served from Unsplash's image CDN
   * at the right size for each screen, up to 3840px (4K).
   * `id` is the path segment from images.unsplash.com/<id>.
   */
  photos: {
    hero:       { id: "photo-1679391029864-d46f366a456b", by: "Howard Bouchevereau", alt: "A floodlit stadium at night, packed with supporters" },
    crowd:      { id: "photo-1537228783107-df09e892bdbb", by: "CHUTTERSNAP", alt: "A dense crowd of spectators in stadium seating" },
    boards:     { id: "photo-1590459243251-d3e42c3dd700", by: "Guido Coppa", alt: "A stadium bowl lined with advertising boards" },
    fans:       { id: "photo-1558151748-f2621b5e52f0", by: "Hanson Lu", alt: "Supporters celebrating with arms raised" },
    aerialLit:  { id: "photo-1520470082789-e347ad8b1944", by: "Willian Justen de Vasconcellos", alt: "Aerial view of a lit stadium at night" },
    seats:      { id: "photo-1782130056480-4523a350028e", by: "Deny Hill", alt: "Rows of empty red stadium seats" },
    data:       { id: "photo-1551288049-bebda4e38f71", by: "Luke Chesser", alt: "Performance analytics dashboard on a screen" },
    rugby:      { id: "photo-1529663297269-6d349ec39b57", by: "Thomas Serer", alt: "Rugby posts inside a full stadium" },
    stadium:    { id: "photo-1610201417828-29dd1173d62f", by: "Samuel Regan-Asante", alt: "A football stadium under lights" },
    scrum:      { id: "photo-1480099225005-2513c8947aec", by: "Olga Guryanova", alt: "Rugby players locked in a scrum" },
    meeting:    { id: "photo-1517048676732-d65bc937f952", by: "Dylan Gillis", alt: "A team working around a meeting table" },
    camera:     { id: "photo-1634949858593-c2279ffaffe1", by: "Taiki Ishikawa", alt: "A camera operator filming inside a stadium" },
    filming:    { id: "photo-1752166672729-3f4adf6d35b0", by: "Luke Miller", alt: "A videographer filming courtside" },
    pitch:      { id: "photo-1729843352938-0e10fbf96585", by: "Charles Kitenge", alt: "Top-down view of a football pitch" },
    floodlight: { id: "photo-1782130056357-3339bb395a7a", by: "Deny Hill", alt: "A stadium floodlight tower against the sky" },
    aerial:     { id: "photo-1516242981651-2ee338449dea", by: "Pedro Menezes", alt: "Aerial view of a stadium in the city" },
    fog:        { id: "photo-1709078477781-3f885189ecbf", by: "Young Jeffrey", alt: "Floodlights cutting through fog at night" },
  },

  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/company/sport-within/" },
    { label: "Instagram", url: "https://www.instagram.com/sportwithin_/" },
    { label: "Newsletter", url: "https://www.linkedin.com/newsletters/sport-within-7512761404760702976", title: "Sport Within Brief — weekly on LinkedIn" },
    { label: "YouTube", url: "" },
    { label: "Email", url: "mailto:" }, // filled from site.email
  ],

  // The latest live episode is featured; otherwise the first upcoming one.
  episodes: [
    {
      number: 1,
      status: "coming-soon", // "coming-soon" | "live"
      title: "When does a sports club become more than a sports club?",
      description:
        "A conversation about how a modern sports organisation expands beyond the game through commercial strategy, partnerships, experiences, community and new revenue opportunities.",
      guest: { name: "Robert Oates", role: "Managing Director", organisation: "Leeds Rhinos" },
      topic: "Clubs",
      publishDate: "",
      cover: "rugby", // key from `photos`, or a URL to a real thumbnail once live
      videoUrl: "", // YouTube
      audioUrl: "", // Spotify / Apple Podcasts
    },
  ],

  questions: [
    { text: "Is sport becoming too commercial?", category: "Commercialisation", photo: "boards", episode: null },
    { text: "Who really owns the fan?", category: "Fans & Media", photo: "fans", episode: null },
    { text: "Why do brands invest millions in sport?", category: "Sponsorship", photo: "aerialLit", episode: null },
    { text: "What is a sports club actually selling?", category: "Clubs", photo: "seats", episode: 1 },
    { text: "How is technology changing the business of sport?", category: "Technology", photo: "data", episode: null },
  ],

  categories: [
    { number: "01", name: "Clubs", descriptors: ["Commercial", "Operations", "Leadership"], photo: "stadium", url: "" },
    { number: "02", name: "Brands", descriptors: ["Partnerships", "Marketing", "Strategy"], photo: "scrum", url: "" },
    { number: "03", name: "Agencies", descriptors: ["Sponsorship", "Creative", "Activation"], photo: "meeting", url: "" },
    { number: "04", name: "Media", descriptors: ["Broadcast", "Publishing", "Digital"], photo: "camera", url: "" },
    { number: "05", name: "Technology", descriptors: ["Data", "AI", "Fan Experience", "Innovation"], photo: "filming", url: "" },
    { number: "06", name: "Governance", descriptors: ["Federations", "Policy", "Development"], photo: "pitch", url: "" },
  ],

  // Long-term vision. Only the first stage is "now"; the rest are intentions.
  vision: ["Conversations", "Media", "Network", "Community", "Events", "Industry Platform"],

  // Newsletter editions and guests are modelled for later (P2) but not rendered yet.
  newsletter: [],
  guests: [],
};
