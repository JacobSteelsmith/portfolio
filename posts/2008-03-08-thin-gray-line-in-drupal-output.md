---
title: "Thin gray line in Drupal output"
date: 2008-03-08
---

Sometimes when using empty table cells and images in a Drupal website, a thin gray line can appear above and below the images, or on the top and bottom of the table cells.
I finally figured out what caused this today. In the system file defaults.css, there is the following declaration:
table {
border-collapse: collapse;
}
This tells the browser to create one border for two adjacent table cells that have borders. If you add the same declaration to your theme's style sheet, except using the value 'separate' the gray lines should disappear. 