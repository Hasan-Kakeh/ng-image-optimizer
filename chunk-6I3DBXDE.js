import{a as s}from"./chunk-CJ3XHCR2.js";import{Ga as o,Ha as t,Ia as i,Ja as a,Ta as e,ma as n,xa as d}from"./chunk-DMYT7VPL.js";var p=class m{basicCode=`<img [ngSrc]="'/hero.webp'" width="1200" height="600" alt="Hero image" />`;fillCode=`<div style="height: 300px; position: relative;">
  <img [ngSrc]="'/background.avif'" fill style="object-fit: cover;" alt="Background" />
</div>`;priorityCode=`<img [ngSrc]="'/logo.png'" width="200" height="50" priority alt="Brand logo" />`;qualityCode=`<img 
  [ngSrc]="'/photo.jpg'" 
  width="800" 
  height="400" 
  [loaderParams]="{ quality: 80 }" 
  alt="Custom quality" 
/>`;sizesCode=`<img 
  [ngSrc]="'/responsive.jpg'" 
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt="Responsive grid image" 
/>`;placeholderCode=`<img 
  [ngSrc]="'/nature.webp'"
  width="800"
  height="600"
  placeholder
  alt="Placeholder example"
/>`;static \u0275fac=function(r){return new(r||m)};static \u0275cmp=d({type:m,selectors:[["app-examples"]],decls:85,vars:6,consts:[["language","html",3,"code"]],template:function(r,l){r&1&&(t(0,"h1"),e(1,"Examples"),i(),t(2,"p"),e(3," Here are some common use cases for using the "),t(4,"code"),e(5,"NgOptimizedImage"),i(),e(6," directive with "),t(7,"code"),e(8,"ng-image-optimizer"),i(),e(9,". "),i(),t(10,"h2"),e(11,"Basic Usage"),i(),t(12,"p"),e(13," Provide "),t(14,"code"),e(15,"width"),i(),e(16," and "),t(17,"code"),e(18,"height"),i(),e(19," to prevent cumulative layout shift (CLS). The optimizer will automatically scale the image to these dimensions while preserving aspect ratio. "),i(),a(20,"app-code-block",0),t(21,"h2"),e(22,"Fill Mode"),i(),t(23,"p"),e(24," When you don't know the exact dimensions beforehand (e.g., responsive grids or hero sections), use the "),t(25,"code"),e(26,"fill"),i(),e(27," attribute. The parent container "),t(28,"strong"),e(29,"must"),i(),e(30," have "),t(31,"code"),e(32,"position: relative"),i(),e(33,", "),t(34,"code"),e(35,"position: fixed"),i(),e(36,", or "),t(37,"code"),e(38,"position: absolute"),i(),e(39,". "),i(),a(40,"app-code-block",0),t(41,"h2"),e(42,"Priority Loading"),i(),t(43,"p"),e(44," For Above the Fold (LCP) images, always add the "),t(45,"code"),e(46,"priority"),i(),e(47," attribute. This ensures the optimizer processes the image synchronously if necessary or queues it first, and Angular adds "),t(48,"code"),e(49,'fetchpriority="high"'),i(),e(50," to the DOM. "),i(),a(51,"app-code-block",0),t(52,"h2"),e(53,"Custom Quality"),i(),t(54,"p"),e(55," Adjust the compression quality (1-100) via "),t(56,"code"),e(57,"loaderParams"),i(),e(58," to override the server's default quality settings for a specific image. "),i(),a(59,"app-code-block",0),t(60,"h2"),e(61,"Responsive Sizes"),i(),t(62,"p"),e(63," Use the "),t(64,"code"),e(65,"sizes"),i(),e(66," attribute to generate responsive "),t(67,"code"),e(68,"srcset"),i(),e(69," values. The optimizer integrates with the server config's "),t(70,"code"),e(71,"deviceSizes"),i(),e(72," and "),t(73,"code"),e(74,"imageSizes"),i(),e(75,". "),i(),a(76,"app-code-block",0),t(77,"h2"),e(78,"Blur Placeholder"),i(),t(79,"p"),e(80," Use the "),t(81,"code"),e(82,"placeholder"),i(),e(83," attribute to display a small, heavily blurred version of the image while the full-resolution image is loading. The server will automatically generate a highly compressed base64 string for this inline placeholder. "),i(),a(84,"app-code-block",0)),r&2&&(n(20),o("code",l.basicCode),n(20),o("code",l.fillCode),n(11),o("code",l.priorityCode),n(8),o("code",l.qualityCode),n(17),o("code",l.sizesCode),n(8),o("code",l.placeholderCode))},dependencies:[s],styles:["h2[_ngcontent-%COMP%]{margin-top:2rem}"]})};export{p as ExamplesComponent};
