/**
 * Chill Express — shared data
 * Single source of truth for business info, menu items, testimonials.
 * Loaded before app.js on every page.
 */
(function (window) {
  'use strict';

  var CONFIG = {
    brandName: 'Chill Express',
    tagline: 'Shawarma & Burgers',
    whatsappNumber: '2347062764237',
    phoneNumber: '07062764237',
    phoneDisplay: '0706 276 4237',
    address: 'Jakana Plaza B, Lagos Street, Maiduguri, Near Zara Plaza',
    city: 'Maiduguri, Borno State',
    lat: 11.8311,
    lng: 13.151,
    hours: '12:00 PM – 11:00 PM',
    hoursDays: 'Monday – Sunday',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    siteUrl: 'https://www.chillexpress.ng'
  };

  // Category -> icon id (from /assets/icons/icons.svg) + css tint class
  var CATEGORY_META = {
    Shawarma: { icon: 'icon-wrap', tint: 'cat-shawarma' },
    Burgers: { icon: 'icon-burger', tint: 'cat-burgers' },
    Sides: { icon: 'icon-fries', tint: 'cat-sides' },
    Drinks: { icon: 'icon-drink', tint: 'cat-drinks' },
    'Ice Cream': { icon: 'icon-icecream', tint: 'cat-icecream' }
  };

  var CATEGORIES = ['All', 'Shawarma', 'Burgers', 'Sides', 'Drinks', 'Ice Cream'];

  // Each item has an `image` field — just the filename, for a photo placed
  // in assets/images/menu/. Every item currently points at one shared photo
  // per category (a quick visual upgrade); swap any item to its own unique
  // filename any time by editing the field below and adding the new file.
  // Recommended: square photo, at least 600x600px, JPG or WebP, under ~150KB.
  // If a file is ever missing or fails to load, the item silently falls
  // back to its category icon — nothing breaks.
  //
  // The 5 starter photos are free CC0 photos from foodiesfeed.com (no
  // attribution required) — see PHOTOS.md for direct download links.
  var MENU_ITEMS = [
    { id: 'm1', name: 'Chicken Shawarma', category: 'Shawarma', image: 'grilled-meat-platter.jpg', description: 'Tender grilled chicken strips with garlic sauce and pickled veggies, wrapped in soft Lebanese bread.', featured: true, popular: true, price: 1500 },
    { id: 'm2', name: 'Beef Shawarma', category: 'Shawarma', image: 'grilled-meat-platter.jpg', description: 'Juicy marinated beef slices with our signature spices and fresh vegetables.', featured: true, popular: true, price: 1800 },
    { id: 'm3', name: 'Mixed Shawarma', category: 'Shawarma', image: 'grilled-meat-platter.jpg', description: 'Best of both worlds — chicken and beef combined in one loaded wrap.', featured: false, popular: true, price: 2000 },
    { id: 'm4', name: 'XL Special Shawarma', category: 'Shawarma', image: 'grilled-meat-platter.jpg', description: 'Our king-size wrap loaded to the max — triple filling, double satisfaction.', featured: true, popular: false, price: 2500 },
    { id: 'm5', name: 'Classic Beef Burger', category: 'Burgers', image: 'burger-with-melted-cheese.jpg', description: 'Flame-grilled beef patty with fresh lettuce, tomato, and our secret sauce.', featured: true, popular: true, price: 2000 },
    { id: 'm6', name: 'Crispy Chicken Burger', category: 'Burgers', image: 'burger-with-melted-cheese.jpg', description: 'Golden fried chicken fillet with coleslaw and spicy mayo on a brioche bun.', featured: false, popular: true, price: 1800 },
    { id: 'm7', name: 'Double Stack Burger', category: 'Burgers', image: 'burger-with-melted-cheese.jpg', description: 'Two juicy patties, double cheese, caramelized onions — the ultimate bite.', featured: true, popular: false, price: 2800 },
    { id: 'm8', name: 'Spicy Inferno Burger', category: 'Burgers', image: 'burger-with-melted-cheese.jpg', description: 'Fiery jalapeño sauce, pepper jack cheese, and habanero beef patty.', featured: false, popular: false, price: 2200 },
    { id: 'm9', name: 'Crispy Fries', category: 'Sides', image: 'loaded-cheesy-bacon-fries.jpg', description: 'Golden shoestring fries seasoned with our house spice blend.', featured: false, popular: true, price: 700 },
    { id: 'm10', name: 'Loaded Fries', category: 'Sides', image: 'loaded-cheesy-bacon-fries.jpg', description: 'Fries topped with melted cheese, diced chicken, and jalapeño sauce.', featured: true, popular: true, price: 1200 },
    { id: 'm11', name: 'Onion Rings', category: 'Sides', image: 'loaded-cheesy-bacon-fries.jpg', description: 'Thick-cut onion rings in a golden crunchy batter, served with dip.', featured: false, popular: false, price: 800 },
    { id: 'm12', name: 'Coleslaw Cup', category: 'Sides', image: 'loaded-cheesy-bacon-fries.jpg', description: 'House-made creamy coleslaw with a hint of sweet and tang.', featured: false, popular: false, price: 500 },
    { id: 'm13', name: 'Strawberry Slush', category: 'Drinks', image: 'strawberry-smoothie.jpg', description: 'Freshly blended strawberry slush with a tangy fruity burst.', featured: true, popular: true, price: 900 },
    { id: 'm14', name: 'Mango Slush', category: 'Drinks', image: 'strawberry-smoothie.jpg', description: 'Tropical mango slush blended fresh — thick, cold and irresistible.', featured: false, popular: true, price: 900 },
    { id: 'm15', name: 'Blueberry Slush', category: 'Drinks', image: 'strawberry-smoothie.jpg', description: 'Vibrant blueberry slush with a deep berry flavor and refreshing chill.', featured: false, popular: false, price: 900 },
    { id: 'm16', name: 'Chilled Juice', category: 'Drinks', image: 'strawberry-smoothie.jpg', description: 'Fresh seasonal fruit juice served ice cold.', featured: false, popular: false, price: 600 },
    { id: 'm17', name: 'Vanilla Scoop', category: 'Ice Cream', image: 'bowl-of-ice-cream-with-chocolate.jpg', description: 'Creamy Madagascar vanilla ice cream in a waffle cone or cup.', featured: false, popular: true, price: 600 },
    { id: 'm18', name: 'Chocolate Scoop', category: 'Ice Cream', image: 'bowl-of-ice-cream-with-chocolate.jpg', description: 'Rich Belgian chocolate ice cream — smooth, indulgent and cold.', featured: false, popular: false, price: 600 },
    { id: 'm19', name: 'Mixed Delight Scoop', category: 'Ice Cream', image: 'bowl-of-ice-cream-with-chocolate.jpg', description: 'Vanilla and chocolate swirled together for the perfect combination.', featured: true, popular: true, price: 700 },
    { id: 'm20', name: 'Ice Cream Sundae', category: 'Ice Cream', image: 'bowl-of-ice-cream-with-chocolate.jpg', description: 'Three scoops topped with chocolate syrup, nuts, and a cherry.', featured: false, popular: false, price: 1200 }
  ];

  var TESTIMONIALS = [
    { id: 't1', name: 'Amina K.', initials: 'AK', text: 'Best shawarma in Maiduguri, hands down. The chicken is always fresh and the garlic sauce is addictive. I order three times a week.' },
    { id: 't2', name: 'Ibrahim M.', initials: 'IM', text: 'I drove from Gwange just for the XL Special. Worth every kilometer. My whole family loves Chill Express.' },
    { id: 't3', name: 'Fatima A.', initials: 'FA', text: 'The Double Stack Burger is insane. Service is super fast, food is always hot. My go-to spot after work.' },
    { id: 't4', name: 'Yusuf B.', initials: 'YB', text: 'Ordered via WhatsApp and my shawarma was ready in under five minutes. These guys are serious about fast food.' },
    { id: 't5', name: 'Zainab H.', initials: 'ZH', text: 'The mango slush and loaded fries combo is everything. Clean spot, great vibes, excellent food. Highly recommend.' }
  ];

  var FEATURES = [
    { icon: 'icon-flash', title: 'Ready in 5 Min', sub: 'From order to your hands — fastest in the city' },
    { icon: 'icon-fire', title: 'Always Fresh', sub: 'Ingredients prepped hourly, never frozen' },
    { icon: 'icon-star', title: 'Premium Quality', sub: 'Restaurant-grade ingredients, street prices' },
    { icon: 'icon-chat', title: 'WhatsApp Orders', sub: 'Order in seconds, ready when you arrive' }
  ];

  function formatNaira(amount) {
    return '\u20A6' + Number(amount).toLocaleString('en-NG');
  }

  function getItemById(id) {
    for (var i = 0; i < MENU_ITEMS.length; i++) {
      if (MENU_ITEMS[i].id === id) return MENU_ITEMS[i];
    }
    return null;
  }

  window.ChillExpress = window.ChillExpress || {};
  window.ChillExpress.CONFIG = CONFIG;
  window.ChillExpress.CATEGORY_META = CATEGORY_META;
  window.ChillExpress.CATEGORIES = CATEGORIES;
  window.ChillExpress.MENU_ITEMS = MENU_ITEMS;
  window.ChillExpress.TESTIMONIALS = TESTIMONIALS;
  window.ChillExpress.FEATURES = FEATURES;
  window.ChillExpress.formatNaira = formatNaira;
  window.ChillExpress.getItemById = getItemById;
})(window);
