# Adding real food photos

I can't download files directly from foodiesfeed.com into this project from
where I'm running (it's outside the small list of domains my file tools are
allowed to reach) — so here's the fast manual version. Five photos, one per
category, gets every item on the menu illustrated in about two minutes.

All five are **CC0** on foodiesfeed.com — free for personal and commercial
use, no attribution required.

## Download these 5, save with these exact filenames

Save every file into `assets/images/menu/` using the filename shown — the
code already expects them there, so nothing else needs to change.

| Category | Foodiesfeed photo | Save as |
|---|---|---|
| Shawarma | [Grilled Meat Platter with Fresh Vegetables](https://www.foodiesfeed.com/free-food-photo/grilled-meat-platter-with-fresh-vegetables/) | `grilled-meat-platter.jpg` |
| Burgers | [Burger with Melted Cheese](https://www.foodiesfeed.com/free-food-photo/burger-with-melted-cheese/) | `burger-with-melted-cheese.jpg` |
| Sides | [Loaded Cheesy Bacon Fries](https://www.foodiesfeed.com/free-food-photo/loaded-cheesy-bacon-fries-for-every-craving/) | `loaded-cheesy-bacon-fries.jpg` |
| Drinks | [Creamy Strawberry Smoothie Delight](https://www.foodiesfeed.com/free-food-photo/creamy-strawberry-smoothie-delight) | `strawberry-smoothie.jpg` |
| Ice Cream | [Bowl of Ice Cream with Chocolate](https://www.foodiesfeed.com/free-food-photo/bowl-of-ice-cream-with-chocolate/) | `bowl-of-ice-cream-with-chocolate.jpg` |

On each page: click **Download Free**, save it, rename it to the filename in
the table, drop it into `assets/images/menu/`. The site will pick it up
automatically — no code changes needed. If a file is missing or still hasn't
been added, that item just quietly shows its category icon instead, so
nothing breaks while you're adding these one at a time.

A couple of notes on the photos themselves:

- These came up as the best matches I could find on foodiesfeed.com for
  *shawarma* — they don't have that exact dish, so the wrap/burger photos are
  close stand-ins for now. Swap in better matches whenever you like.
- Several of foodiesfeed's newer photos (including the ones above) are
  AI-generated rather than traditional photography — still real CC0 images,
  just worth knowing if that matters to you.
- Right now every item in a category shares one photo. To give an item its
  own unique photo: download a different one, save it under a new filename,
  and change that one item's `image:` value in `assets/js/data.js` to match.

## Recommended specs

- Square photo, at least 600×600px
- JPG or WebP
- Under ~150KB if you can (resize/compress first — foodiesfeed's downloads
  are print-resolution and much bigger than a website needs)
