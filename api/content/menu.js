import { getCmsContent } from "../_cms.js";
import { defaultMenuContent } from "../_defaultMenu.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const content = await getCmsContent("menu");
    res.status(200).json(content || defaultMenuContent);
  } catch (error) {
    console.error(error);
    res.status(200).json(defaultMenuContent);
  }
}
