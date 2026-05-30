const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const cloudinaryBase = cloudName ? `https://res.cloudinary.com/${cloudName}/image/upload` : "";

export const mediaConfig = {
  cloudName,
  cloudinaryBase,
  rootFolder: "robot-cafe",
  folders: {
    hero: "robot-cafe/hero",
    gallery: "robot-cafe/gallery",
    menu: "robot-cafe/menu",
    offers: "robot-cafe/offers",
    promotions: "robot-cafe/promotions",
    events: "robot-cafe/events",
    holidays: "robot-cafe/holidays",
    valentines: "robot-cafe/holidays/valentines",
    mothersDay: "robot-cafe/holidays/mothers-day",
    fathersDay: "robot-cafe/holidays/fathers-day",
    christmas: "robot-cafe/holidays/christmas",
    easter: "robot-cafe/holidays/easter",
    schoolHoliday: "robot-cafe/holidays/school-holiday",
  },
  transforms: {
    hero: "f_auto,q_auto,w_1800,c_fill,g_auto",
    card: "f_auto,q_auto,w_900,c_fill,g_auto",
    thumbnail: "f_auto,q_auto,w_480,c_fill,g_auto",
    banner: "f_auto,q_auto,w_1400,c_fill,g_auto",
  },
  fallbackImages: {
    hero:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1800&q=85",
    dining:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1400&q=85",
    coffee:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85",
    plates:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85",
    dessert:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=85",
    event:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85",
    holiday:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=85",
  },
};
