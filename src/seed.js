require("dotenv").config();
const mongoose = require("mongoose");
const Celebrity = require("./models/Celebrity");
const connectDB = require("./config/db");

const seedData = [
  {
    name: "Virat Kohli",
    category: "Cricketer",
    country: "India",
    bio: "Indian cricket legend & former national team captain.",
    avatar: "https://ui-avatars.com/api/?name=Virat+Kohli&background=c0392b&color=fff&size=200",
    totalReach: "340M+",
    isVerified: true,
    platforms: {
      instagram: { handle: "@virat.kohli", followers: "270M", verified: true, url: "https://instagram.com/virat.kohli" },
      twitter:   { handle: "@imVkohli", followers: "54M", verified: true, url: "https://twitter.com/imVkohli" },
      youtube:   { handle: "Virat Kohli", followers: "2.1M", verified: true, url: "https://youtube.com/@viratkohli" },
      facebook:  { handle: "Virat Kohli", followers: "49M", verified: true, url: "https://facebook.com/virat.kohli" },
      threads:   { handle: "@virat.kohli", followers: "8M", verified: false, url: "https://threads.net/@virat.kohli" },
      linkedin:  null,
      naukri:    null,
    },
  },
  {
    name: "Deepika Padukone",
    category: "Actress",
    country: "India",
    bio: "Bollywood superstar, entrepreneur & mental health advocate.",
    avatar: "https://ui-avatars.com/api/?name=Deepika+Padukone&background=16a085&color=fff&size=200",
    totalReach: "90M+",
    isVerified: true,
    platforms: {
      instagram: { handle: "@deepikapadukone", followers: "80M", verified: true, url: "https://instagram.com/deepikapadukone" },
      twitter:   { handle: "@deepikapadukone", followers: "23M", verified: true, url: "https://twitter.com/deepikapadukone" },
      youtube:   { handle: "Deepika Padukone", followers: "900K", verified: true, url: "https://youtube.com/@deepikapadukone" },
      facebook:  { handle: "Deepika Padukone", followers: "40M", verified: true, url: "https://facebook.com/deepikapadukone" },
      threads:   { handle: "@deepikapadukone", followers: "2M", verified: false, url: "https://threads.net/@deepikapadukone" },
      linkedin:  { handle: "Deepika Padukone", followers: "1M", verified: true, url: "https://linkedin.com/in/deepikapadukone" },
      naukri:    null,
    },
  },
  {
    name: "Narendra Modi",
    category: "Politician",
    country: "India",
    bio: "Prime Minister of India & one of the most followed world leaders.",
    avatar: "https://ui-avatars.com/api/?name=Narendra+Modi&background=e67e22&color=fff&size=200",
    totalReach: "280M+",
    isVerified: true,
    platforms: {
      instagram: { handle: "@narendramodi", followers: "90M", verified: true, url: "https://instagram.com/narendramodi" },
      twitter:   { handle: "@narendramodi", followers: "103M", verified: true, url: "https://twitter.com/narendramodi" },
      youtube:   { handle: "Narendra Modi", followers: "24M", verified: true, url: "https://youtube.com/@narendramodi" },
      facebook:  { handle: "Narendra Modi", followers: "60M", verified: true, url: "https://facebook.com/narendramodi" },
      threads:   { handle: "@narendramodi", followers: "5M", verified: true, url: "https://threads.net/@narendramodi" },
      linkedin:  { handle: "Narendra Modi", followers: "9M", verified: true, url: "https://linkedin.com/in/narendramodi" },
      naukri:    null,
    },
  },
  {
    name: "Taylor Swift",
    category: "Musician",
    country: "USA",
    bio: "Grammy-winning singer-songwriter & global pop phenomenon.",
    avatar: "https://ui-avatars.com/api/?name=Taylor+Swift&background=c0392b&color=fff&size=200",
    totalReach: "400M+",
    isVerified: true,
    platforms: {
      instagram: { handle: "@taylorswift", followers: "284M", verified: true, url: "https://instagram.com/taylorswift" },
      twitter:   { handle: "@taylorswift13", followers: "95M", verified: true, url: "https://twitter.com/taylorswift13" },
      youtube:   { handle: "Taylor Swift", followers: "58M", verified: true, url: "https://youtube.com/@taylorswift" },
      facebook:  { handle: "Taylor Swift", followers: "80M", verified: true, url: "https://facebook.com/taylorswift" },
      threads:   { handle: "@taylorswift", followers: "7M", verified: false, url: "https://threads.net/@taylorswift" },
      linkedin:  null,
      naukri:    null,
    },
  },
  {
    name: "Elon Musk",
    category: "Entrepreneur",
    country: "USA",
    bio: "CEO of Tesla, SpaceX & X. The world's most followed entrepreneur.",
    avatar: "https://ui-avatars.com/api/?name=Elon+Musk&background=1a1a2e&color=fff&size=200",
    totalReach: "230M+",
    isVerified: true,
    platforms: {
      instagram: { handle: "@elonmusk", followers: "15M", verified: true, url: "https://instagram.com/elonmusk" },
      twitter:   { handle: "@elonmusk", followers: "195M", verified: true, url: "https://twitter.com/elonmusk" },
      youtube:   { handle: "Elon Musk", followers: "500K", verified: false, url: "https://youtube.com/@elonmusk" },
      facebook:  { handle: "Elon Musk", followers: "5M", verified: false, url: "https://facebook.com/elonmusk" },
      threads:   { handle: "@elonmusk", followers: "2M", verified: false, url: "https://threads.net/@elonmusk" },
      linkedin:  { handle: "Elon Musk", followers: "8M", verified: true, url: "https://linkedin.com/in/elonmusk" },
      naukri:    null,
    },
  },
];

const seed = async () => {
  await connectDB();
  console.log("🌱 Seeding database...");
  await Celebrity.deleteMany({});
  console.log("🗑️ Cleared existing celebrities");
  const created = await Promise.all(seedData.map((d) => new Celebrity(d).save()));
  console.log(`✅ Seeded ${created.length} celebrities!`);
  await mongoose.disconnect();
  console.log("🔌 Done!");
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
