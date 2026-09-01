// ================================================================
// CONTENT.JS — Personal content for Amna's Birthday Experience
// ================================================================
// This is the ONLY file you need to edit to personalize the site.
// Find each section below, update the text/paths, and save.
// ================================================================

const CONTENT = {

  // ============================================================
  // BASIC INFO
  // ============================================================
  HER_NAME: "Amna",
  HER_FULL_NAME: "Amna Zafar",
  RELATIONSHIP_YEARS: 8,

  // ============================================================
  // MUSIC
  // Replace the filename with your chosen song.
  // Place the audio file in the /music/ folder.
  // ============================================================
  MUSIC_PATH: "./music/hum.webm",

  // ============================================================
  // SECRECY CHECK (Love Gate)
  // A romantic verification popup before the hero screen.
  // ============================================================
  SECRECY_CHECK: {
    enabled: true,
    title: "A Little Secret Between Us...",
    subtitle: "Before I show you what I made, I need to make sure it's really you. ❤️",
    question: "Where did we meet for the first time?",
    placeholder: "Type your answer here...",
    buttonText: "Unlock My Surprise →",
    // Matches any entry containing these words (case-insensitive)
    validAnswers: ["giga", "giga mall"],
    successMessage: "I knew it was you. Welcome, my love. ❤️",
    errorMessage: "Hmm, that doesn't sound right... try again, my love 💕",
  },

  // ============================================================
  // HER PHOTO — THE MOST IMPORTANT SETTING
  // ============================================================
  // Replace this with the path to Amna's photo.
  // The photo will be the centerpiece of the opening hero.
  // Best results: portrait photo, square or 3:4 ratio.
  // Example: "./img/amna.jpg"
  // ============================================================
  HER_PHOTO: "./img/sia.jpg",

  // ============================================================
  // OPENING HERO TEXT
  // Text that appears around her photo.
  // Line 1 is small, above the name. Line 2 is below.
  // ============================================================
  HERO_TAGLINE_ABOVE: "Happy Birthday,",
  HERO_TAGLINE_BELOW: "I made this little world for you. ❤️",

  // ============================================================
  // SECTION 2 — HER BIRTHDAY
  // Personal message focused on HER, not the relationship.
  // These lines appear one at a time. Replace with your own.
  // The middle line (index 1) will appear larger.
  // ============================================================
  HER_BIRTHDAY_LINES: [
    "Today isn't about our story.",
    "It's about you.",
    "About the person who deserves to feel a little extra special today.",
  ],

  // ============================================================
  // SECTION 3 — MEMORIES (Photo Slideshow)
  // 6–10 photos recommended. One at a time, swipeable.
  // Leave photoPath as "" for a styled placeholder.
  // ============================================================
  MEMORIES: [
    {
      date: "— Add a date —",
      title: "[ Memory 01 ]",
      caption: "Replace this with a caption for this memory.",
      photoPath: "",
    },
    {
      date: "— Add a date —",
      title: "[ Memory 02 ]",
      caption: "Replace this with a caption for this memory.",
      photoPath: "",
    },
    {
      date: "— Add a date —",
      title: "[ Memory 03 ]",
      caption: "Replace this with a caption for this memory.",
      photoPath: "",
    },
    {
      date: "— Add a date —",
      title: "[ Memory 04 ]",
      caption: "Replace this with a caption for this memory.",
      photoPath: "",
    },
    {
      date: "— Add a date —",
      title: "[ Memory 05 ]",
      caption: "Replace this with a caption for this memory.",
      photoPath: "",
    },
    {
      date: "— Add a date —",
      title: "[ Memory 06 ]",
      caption: "Replace this with a caption for this memory.",
      photoPath: "",
    },
  ],

  // ============================================================
  // SECTION 4 — THINGS I LOVE ABOUT YOU
  // These appear one at a time on a cinematic dark background.
  // Replace with your own words. Add as many as you like.
  // ============================================================
  LOVE_POINTS: [
    "Your smile.",
    "Your voice.",
    "The way you make ordinary moments feel different.",
    "The little things you do.",
    "The way you care.",
    "The person you are.",
  ],

  // ============================================================
  // SECTION 5 — 8 YEARS (brief, poetic)
  // Not a list of chapters — just a beautiful moment.
  // Replace with your own words.
  // ============================================================
  EIGHT_YEARS_LINES: [
    "Somehow...",
    "8 years happened.",
    "Eight years of ordinary days.",
    "Eight years of growing.",
    "Eight years of being each other's.",
    "And somehow...",
    "we're still here.",
  ],

  // ============================================================
  // SECTION 6 — GIFT MESSAGE
  // The message revealed when she opens the gift.
  // A promise, a plan, something personal.
  // ============================================================
  GIFT_MESSAGE: "[ Write what's inside the gift here. A promise, a plan, a memory — your choice. ]",

  // ============================================================
  // SECTION 8 — FIREWORKS TEXT
  // Text that appears over the fireworks climax.
  // ============================================================
  FIREWORKS_LINES: [
    "Happy Birthday, My Cutu Baby ❤️",
    "I wish I get to celebrate all your birthdays with you.",
  ],

  // ============================================================
  // SECTION 9 — LOVE LETTER
  // Written in the letter paper after the envelope opens.
  // Use line breaks freely. This is the emotional heart of the site.
  // ============================================================
  LOVE_LETTER: `[ Write your personal birthday letter here.

This is the emotional peak of the experience.
Take your time with it. Make it yours.

— Your name ]`,

  // ============================================================
  // SECTION 10 — FINAL SURPRISE
  // type: "message"  → text only (works immediately)
  //       "photo"    → displays a photo
  //       "video"    → displays a video
  // content: path to your file (e.g. "./img/final.jpg")
  // ============================================================
  FINAL_SURPRISE: {
    type: "message",
    content: "",
    headline: "8 years.",
    subline: "Still you.",
    closing: "Happy Birthday, Amna. ❤️",
  },

};
