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
  MUSIC_PATH: "./music/hum.mp3",

  // ============================================================
  // COUNTDOWN TIMER GATE — LAYER BEFORE SECRECY CHECK
  // Set targetDate to Amna's birthday date and time (ISO format).
  // Example: "2026-09-04T00:00:00"
  // Set enabled to false to bypass during testing.
  // ============================================================
  COUNTDOWN: {
    enabled: true,
    targetDate: "2026-09-12T00:00:00",
    preTitle: "NOT YET, LOVE",
    titleMain: "The stars are still",
    titleHighlight: "getting ready",
    description: "I've been counting down for weeks. When this reaches zero, the whole sky opens up and everything in it was made for you.",
    stayHint: "stay right here",
    unlockedGraffiti: "Happy Birthday<br>Amna Zafar! 🎉",
    unlockedSub: "The whole sky just opened up for you ❤️",
    // Replay timer duration in seconds. Set to 60s (1 minute).
    // >>> CHANGE THIS TO 120 (2 minutes) BEFORE COMMITTING <<<
    replaySeconds: 60,
    // Fireworks sound downloaded from YouTube (https://www.youtube.com/watch?v=yWqmiOoWBP0)
    fireworksSound: "./music/fireworks.m4a",
  },

  // ============================================================
  // SECRECY CHECK (Love Gate)
  // A romantic verification popup before the hero screen.
  // ============================================================
  SECRECY_CHECK: {
    enabled: true,
    title: "A Little Secret Between Us...",
    subtitle: "Before I show you what I made, I need to make sure it's really you ❤️",
    question: "Which animal did I gift you?",
    placeholder: "Type your answer here...",
    buttonText: "Unlock the Surprise →",
    // Matches any entry containing these words (case-insensitive)
    validAnswers: ["rabbit", "bunny", "rabbits"],
    successMessage: "I knew it was you. Welcome, baby.",
    errorMessage: "Hmm, that doesn't sound right... try again, baby.",
  },

  // ============================================================
  // HER PHOTO — THE MOST IMPORTANT SETTING
  // ============================================================
  // Replace this with the path to Amna's photo.
  // The photo will be the centerpiece of the opening hero.
  // Best results: portrait photo, square or 3:4 ratio.
  // Example: "./img/amna.jpg"
  // ============================================================
  HER_PHOTO: "./img/optimized/img-1.jpg",

  // ============================================================
  // OPENING HERO TEXT
  // Text that appears around her photo.
  // Line 1 is small, above the name. Line 2 is below.
  // ============================================================
  HERO_TAGLINE_ABOVE: "Happy Birthday,",
  HERO_TAGLINE_BELOW: "I made this little world for you.",

  // ============================================================
  // SECTION 2 — HER BIRTHDAY
  // Personal message focused on HER, not the relationship.
  // These lines appear one at a time. Replace with your own.
  // The middle line (index 1) will appear larger.
  // ============================================================
  HER_BIRTHDAY_LINES: [
    "Everyday is yours, even the world is yours.",
    "But today is all about you.",
    "About the most amazing person, who deserves to feel a little extra special today.",
  ],

  // ============================================================
  // SECTION 3 — MEMORIES (Photo Slideshow)
  // 6–10 photos recommended. One at a time, swipeable.
  // Leave photoPath as "" for a styled placeholder.
  // ============================================================
  MEMORIES: [
    {
      date: "01",
      title: "You are the prettiest flower.",
      caption: "You are the prettiest flower.",
      photoPath: "./img/optimized/img-2.JPG",
    },
    {
      date: "02",
      title: "Even the simplest look is the pretiest.",
      caption: "Even the simplest look is the pretiest.",
      photoPath: "./img/optimized/img-3.JPG",
    },
    {
      date: "03",
      title: "The photo that started it all between families.",
      caption: "The photo that started it all between families.",
      photoPath: "./img/optimized/img-4.JPG",
    },
    {
      date: "04",
      title: "The purest sweetest soul ever.",
      caption: "The purest sweetest soul ever.",
      photoPath: "./img/optimized/img-6.jpg",
    },
    {
      date: "05",
      title: "That gentle gaze and playful spark",
      caption: "That gentle gaze and playful spark",
      photoPath: "./img/optimized/img-7.jpg",
    },
    {
      date: "06",
      title: "The hottest photo of yours.",
      caption: "The hottest photo of yours.",
      photoPath: "./img/optimized/img-8.jpg",
    },
    {
      date: "07",
      title: "Golden hour was made just for you",
      caption: "Golden hour was made just for you",
      photoPath: "./img/optimized/img-9.jpg",
    },
    {
      date: "08",
      title: "The drama queen with softest light",
      caption: "The drama queen with softest light",
      photoPath: "./img/optimized/img-1.jpg",
    },
  ],

  // ============================================================
  // SECTION 4 — THINGS I LOVE ABOUT YOU
  // These appear one at a time on a cinematic dark background.
  // Replace with your own words. Add as many as you like.
  // ============================================================
  LOVE_POINTS: [
    "Your smile and when you laugh like a little girl.",
    "Your pretty voice. Music to my years when youre not yelling ofc :)",
    "The way you make every moment special.",
    "Your little habits.",
    "The way you care and create drama out of everything.",
    "The person you are to me to everyone.",
  ],

  // ============================================================
  // SECTION 5 — 24 YEARS OF YOU (8 Years of Us)
  // Celebrating her 24th Birthday and 8 years together.
  // ============================================================
  HER_AGE: 24,
  TWENTYFOUR_YEARS_LINES: [
    "24 years of your light in this world.",
    "24 years of laughter, kindness, and grace.",
    "And out of those 24 years...",
    "I'm the luckiest person because for 8 of them, I got to be with you and wish to be for the rest of our years.",
    "Happy 24th Birthday, baby ❤️",
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
  // ============================================================
  LOVE_LETTER: {
    salutation: "My Baby,",
    paragraphs: [
      "Bht bar bol chuka hun Happy birthday but here we go once again happy birthday meri jaan tumne itna wait kya itni excited thi tou mein koi ordinary cheez nh kr skta tha tumhari birthday k liye. I love you so much, I hope this all makes you realise how much you mean to me. Before you, days happened to me. Now I choose them, because you're in them. I wish in these 8 years I was enough for you.. I wish you were proud of me. Im trying my best to be the best person i can be for you. I hope i can be the perfect guys you keep watching on reels, i hope i can ever do enough for you that you start believing that i love you",
      "You laugh at things nobody else notices. You remember the details I mention once. You make ordinary days feel like something worth keeping. This is your first birthday after our families have been involved officially. I really really hope you like all of this and it was worth the wait and excitement, all Ive done these past few days is to imagine your reaction to this.",
      "Thank you for being born, for being stubborn, for being kind, and for choosing me back. Agr hum laraiyon pe khtm hojatay tou uska yhi mtlb hota k hum kbhi serious thay hee nhi. We are meant to be with each other and always will be because ill always choose you, no matter what."
    ],
    valediction: "Always & Forever yours."
  },

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
    headline: "8 years of us.",
    subline: "So many different versions of you, and ive loved them all.",
    closing: "Happy Birthday, Amna Zafar. ❤️",
  },

  // ============================================================
  // BEHIND THE SCENES VIDEO (Optional)
  // Set enabled to true and place your video file in the /video/ folder
  // e.g. "./video/bts.mp4" (or YouTube / direct MP4 URL).
  // Zero initial load: not a single byte is downloaded until tapped!
  // ============================================================
  BEHIND_THE_SCENES: {
    enabled: true,
    badge: "Special Memory",
    title: "Watch Behind The Scenes ✨",
    description: "A little glimpse of how this whole surprise came to life.",
    videoPath: "./video/bts_.MP4",
  },

};
