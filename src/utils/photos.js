const fetchWikiPhoto = async (title) => {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "FameFinder/1.0 (celebrity-directory)" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.thumbnail?.source || null;
  } catch {
    return null;
  }
};

const getWikipediaPhoto = async (name) => {
  const photo = await fetchWikiPhoto(name);
  if (photo) return photo;
  const firstName = name.split(" ")[0];
  if (firstName !== name) return await fetchWikiPhoto(firstName);
  return null;
};

const fallbackAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=200`;

module.exports = { getWikipediaPhoto, fallbackAvatar };
