import { getCmsContent } from "../_cms.js";
import { defaultMenuContent } from "../_defaultMenu.js";
import { getQrMenuContent } from "../_qrMenu.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const qrContent = await getQrMenuContent();
    if (qrContent.items.length) {
      res.status(200).json(qrContent);
      return;
    }
  } catch (error) {
    console.warn("QR menu source unavailable:", error.message);
  }

  try {
    const content = await getCmsContent("menu");
    res.status(200).json(content || defaultMenuContent);
  } catch (error) {
    console.error(error);
    res.status(200).json(defaultMenuContent);
  }
}
