/*
 * KAVOKA — one place to edit every outbound link.
 * Edit a URL here, commit, and Vercel redeploys automatically. Both the website and the
 * /links page read from this file.
 */
window.KAVOKA_LINKS = {
  // Sales channels
  tiktokShop: "https://www.tiktok.com/@kavoka.chocolate", // TikTok profile (shop tab). Swap in a TikTok Shop product link when you have one
  shopee: "https://id.shp.ee/XAcxPZBT",

  // Social
  tiktok: "https://www.tiktok.com/@kavoka.chocolate",
  instagram: "https://www.instagram.com/kavoka.chocolate/",

  // Direct order / gifting (opens WhatsApp with a pre-filled message)
  whatsapp:
    "https://wa.me/?text=" +
    encodeURIComponent("Hi KAVOKA! I'd like to order the coffee-infused chocolate (Launch Week: buy 2, get Mild free)."),
  corporateEmail:
    "mailto:hello@kavoka.example?subject=" + encodeURIComponent("KAVOKA corporate gifting enquiry"), // TODO: real email

  // Handle shown on the /links page
  handle: "@kavoka.chocolate",
};
