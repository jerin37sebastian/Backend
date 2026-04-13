require("dotenv").config();
const Celebrity = require("./models/Celebrity");
const connectDB = require("./config/db");
const { getWikipediaPhoto, fallbackAvatar } = require("./utils/photos");

const migrate = async () => {
  await connectDB();

  const all = await Celebrity.find({});
  console.log(`Found ${all.length} celebrities in DB.\n`);

  let updated = 0;
  let skipped = 0;

  for (const celeb of all) {
    const photo = await getWikipediaPhoto(celeb.name);
    const newAvatar = photo || fallbackAvatar(celeb.name);

    if (celeb.avatar === newAvatar) {
      console.log(`⏭  Already up to date: ${celeb.name}`);
      skipped++;
      continue;
    }

    celeb.avatar = newAvatar;
    await celeb.save();

    if (photo) {
      console.log(`✅ Wikipedia photo found: ${celeb.name}`);
    } else {
      console.log(`⚠️  No Wikipedia photo, using placeholder: ${celeb.name}`);
    }
    updated++;
  }

  console.log(`\nDone! ${updated} updated, ${skipped} skipped.`);
  process.exit(0);
};

migrate().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
