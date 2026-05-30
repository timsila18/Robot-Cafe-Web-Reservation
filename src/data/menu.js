import { getMenuCategories, getMenuItems } from "../services/contentService";

export const menuCategories = getMenuCategories().filter((category) => category !== "All");
export const menuItems = getMenuItems();
