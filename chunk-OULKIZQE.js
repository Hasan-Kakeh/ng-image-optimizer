import{a as p}from"./chunk-Q6JJTWIX.js";import{Aa as m,Ja as i,Ka as t,La as o,Ma as r,Wa as e,na as n}from"./chunk-YUK3KRHO.js";var c=class d{basicCode='<img ngSrc="/hero.jpg" width="1200" height="600" alt="Hero" />';fillCode=`<div style="height: 300px; position: relative;">
  <img ngSrc="/background.jpg" fill style="object-fit: cover;" alt="Background" />
</div>`;priorityCode='<img ngSrc="/logo.png" width="200" height="50" priority alt="Logo" />';qualityCode=`<img
  ngSrc="/photo.jpg"
  width="800"
  height="400"
  [loaderParams]="{ quality: 80 }"
  alt="Custom quality"
/>`;sizesCode=`<img
  ngSrc="/responsive.jpg"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt="Responsive"
/>`;placeholderCode=`<img
  ngSrc="/nature.jpg"
  width="800"
  height="600"
  placeholder
  alt="With placeholder"
/>`;static \u0275fac=function(l){return new(l||d)};static \u0275cmp=m({type:d,selectors:[["app-ssr-examples"]],decls:32,vars:6,consts:[["language","html",3,"code"]],template:function(l,a){l&1&&(t(0,"h1"),e(1,"SSR / Dynamic \u2014 Examples"),o(),t(2,"p"),e(3,"Common "),t(4,"code"),e(5,"NgOptimizedImage"),o(),e(6," patterns with the dynamic loader."),o(),t(7,"h2"),e(8,"Basic local image"),o(),r(9,"app-code-block",0),t(10,"h2"),e(11,"Fill layout"),o(),t(12,"p"),e(13,"The parent must have "),t(14,"code"),e(15,"position: relative"),o(),e(16," (or fixed/absolute)."),o(),r(17,"app-code-block",0),t(18,"h2"),e(19,"Priority (LCP)"),o(),r(20,"app-code-block",0),t(21,"h2"),e(22,"Custom quality"),o(),r(23,"app-code-block",0),t(24,"h2"),e(25,"Responsive "),t(26,"code"),e(27,"sizes"),o()(),r(28,"app-code-block",0),t(29,"h2"),e(30,"Blur placeholder"),o(),r(31,"app-code-block",0)),l&2&&(n(9),i("code",a.basicCode),n(8),i("code",a.fillCode),n(3),i("code",a.priorityCode),n(3),i("code",a.qualityCode),n(5),i("code",a.sizesCode),n(3),i("code",a.placeholderCode))},dependencies:[p],styles:["ul[_ngcontent-%COMP%], ol[_ngcontent-%COMP%]{margin-bottom:24px;padding-left:20px;color:var(--text-secondary)}li[_ngcontent-%COMP%]{margin-bottom:8px}strong[_ngcontent-%COMP%]{color:var(--text-primary);font-weight:600}hr[_ngcontent-%COMP%]{margin:32px 0;border:0;border-top:1px solid var(--border-color);opacity:.5}h3.option-title[_ngcontent-%COMP%]{font-family:var(--font-mono);font-size:1.1rem}.callout[_ngcontent-%COMP%]{padding:16px 20px;border-radius:var(--radius-md);border:1px solid var(--border-color);background:var(--bg-secondary);margin-bottom:24px;color:var(--text-secondary)}.callout[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{display:block;margin-bottom:8px;color:var(--text-primary)}.mode-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:32px}@media(max-width:768px){.mode-grid[_ngcontent-%COMP%]{grid-template-columns:1fr}}.mode-card[_ngcontent-%COMP%]{padding:20px;border-radius:var(--radius-md);border:1px solid var(--border-color);background:var(--bg-secondary)}.mode-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin-top:0;font-size:1.1rem}.mode-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]:last-child{margin-bottom:0}.mode-card[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:var(--accent-secondary)}"]})};export{c as SsrExamplesComponent};
