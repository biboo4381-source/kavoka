/*
 * KAVOKA — one place to edit every outbound link.
 * Replace the placeholder URLs below with your real shop / social links,
 * commit, and Vercel redeploys automatically. Both the website and the
 * /links page read from this file.
 */
window.KAVOKA_LINKS = {
  // Sales channels
  tiktokShop: "https://www.tiktok.com/search?q=kavoka%20chocolate", // TODO: your TikTok Shop product link
  shopee: "https://shopee.sg/search?keyword=kavoka%20chocolate",     // TODO: your Shopee product link

  // Social
  tiktok: "https://www.tiktok.com/search?q=kavoka",                   // TODO: https://www.tiktok.com/@yourhandle
  instagram: "https://www.instagram.com/explore/search/keyword/?q=kavoka", // TODO: https://www.instagram.com/yourhandle

  // Direct order / gifting (opens WhatsApp with a pre-filled message)
  whatsapp:
    "https://wa.me/?text=" +
    encodeURIComponent("Hi KAVOKA! I'd like to order the coffee-infused chocolate (Launch Week: buy 2, get Mild free)."),
  corporateEmail:
    "mailto:hello@kavoka.example?subject=" + encodeURIComponent("KAVOKA corporate gifting enquiry"), // TODO: real email

  // Handle shown on the /links page
  handle: "@kavoka.id",
};
