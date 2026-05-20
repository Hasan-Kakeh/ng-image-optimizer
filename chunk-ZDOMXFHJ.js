import{a as l}from"./chunk-W3M2473M.js";import{Ca as p,Na as r,Oa as o,Pa as t,Qa as a,ab as e,pa as i}from"./chunk-2GHM7QQN.js";var c=class m{appConfigCode=`import { ApplicationConfig } from '@angular/core';
import { provideAotImageLoader } from 'ng-image-optimizer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAotImageLoader({
      format: 'webp',
      quality: 90,
    }),
  ],
};`;cliCode=`ng-image-optimizer-aot \\
  --dist ./dist/my-app/browser \\
  --paths "assets/**" \\
  --format webp \\
  --quality 90`;scriptsCode=`{
  "scripts": {
    "build": "ng build",
    "build:prod": "ng build && npm run optimize:image",
    "optimize:image": "ng-image-optimizer-aot --dist dist/my-app/browser"
  }
}`;static \u0275fac=function(n){return new(n||m)};static \u0275cmp=p({type:m,selectors:[["app-aot-setup"]],decls:52,vars:3,consts:[["language","typescript",3,"code"],["language","bash",3,"code"],["language","json",3,"code"],[1,"callout"]],template:function(n,d){n&1&&(o(0,"h1"),e(1,"AOT / Build \u2014 Setup"),t(),o(2,"p"),e(3," AOT mode pre-generates optimized variants at build time. At runtime the loader resolves directly to static files \u2014 no Sharp, no middleware. "),t(),o(4,"h2"),e(5,"1. Application provider"),t(),a(6,"app-code-block",0),o(7,"p"),e(8," In development ("),o(9,"code"),e(10,"isDevMode()"),t(),e(11,"), the loader returns the original "),o(12,"code"),e(13,"src"),t(),e(14," so you can work without running the CLI on every save. "),t(),o(15,"h2"),e(16,"2. Postbuild CLI"),t(),o(17,"p"),e(18,"Run after "),o(19,"code"),e(20,"ng build"),t(),e(21," so variants exist in the dist folder:"),t(),a(22,"app-code-block",1),o(23,"h2"),e(24,"3. Wire into package.json"),t(),o(25,"p"),e(26,"The "),o(27,"code"),e(28,"ng add --mode=AOT"),t(),e(29," schematic adds an "),o(30,"code"),e(31,"optimize:image"),t(),e(32," script. A typical production pipeline:"),t(),a(33,"app-code-block",2),o(34,"div",3)(35,"strong"),e(36,"Match options"),t(),o(37,"code"),e(38,"format"),t(),e(39," and "),o(40,"code"),e(41,"quality"),t(),e(42," in "),o(43,"code"),e(44,"provideAotImageLoader"),t(),e(45," must match the CLI "),o(46,"code"),e(47,"--format"),t(),e(48," and "),o(49,"code"),e(50,"--quality"),t(),e(51," flags, or URLs will 404. "),t()),n&2&&(i(6),r("code",d.appConfigCode),i(16),r("code",d.cliCode),i(11),r("code",d.scriptsCode))},dependencies:[l],styles:["ul[_ngcontent-%COMP%], ol[_ngcontent-%COMP%]{margin-bottom:24px;padding-left:20px;color:var(--text-secondary)}li[_ngcontent-%COMP%]{margin-bottom:8px}strong[_ngcontent-%COMP%]{color:var(--text-primary);font-weight:600}hr[_ngcontent-%COMP%]{margin:32px 0;border:0;border-top:1px solid var(--border-color);opacity:.5}h3.option-title[_ngcontent-%COMP%]{font-family:var(--font-mono);font-size:1.1rem}.callout[_ngcontent-%COMP%]{padding:16px 20px;border-radius:var(--radius-md);border:1px solid var(--border-color);background:var(--bg-secondary);margin-bottom:24px;color:var(--text-secondary)}.callout[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{display:block;margin-bottom:8px;color:var(--text-primary)}.mode-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:32px}@media(max-width:768px){.mode-grid[_ngcontent-%COMP%]{grid-template-columns:1fr}}.mode-card[_ngcontent-%COMP%]{padding:20px;border-radius:var(--radius-md);border:1px solid var(--border-color);background:var(--bg-secondary)}.mode-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin-top:0;font-size:1.1rem}.mode-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]:last-child{margin-bottom:0}.mode-card[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:var(--accent-secondary)}"]})};export{c as AotSetupComponent};
