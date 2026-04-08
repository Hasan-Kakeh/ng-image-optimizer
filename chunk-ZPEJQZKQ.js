import{a as s}from"./chunk-CJ3XHCR2.js";import{Ga as r,Ha as t,Ia as i,Ja as n,Ta as e,ma as o,xa as p}from"./chunk-DMYT7VPL.js";var d=class l{appConfigCode=`import { ApplicationConfig } from '@angular/core';
import { provideImageOptimizerLoader } from 'ng-image-optimizer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideImageOptimizerLoader({
      routePrefix: '/_ng/image' // Optional, matches server configuration
    })
  ]
};`;serverCode=`import express from 'express';
import { imageOptimizerHandler } from 'ng-image-optimizer/server';

const app = express();

// Set up the optimizer middleware BEFORE Angular SSR handlers
app.get('/_ng/image', imageOptimizerHandler(browserDistFolder, {
  // Optional custom configuration overrides
  minimumCacheTTL: 60 * 60 * 24 // 24 hours
}));`;static \u0275fac=function(a){return new(a||l)};static \u0275cmp=p({type:l,selectors:[["app-installation"]],decls:44,vars:2,consts:[["language","bash","code","ng add ng-image-optimizer"],["language","bash","code","npm install ng-image-optimizer sharp"],["language","typescript",3,"code"]],template:function(a,m){a&1&&(t(0,"h1"),e(1,"Installation"),i(),t(2,"h2"),e(3,"Prerequisites"),i(),t(4,"ul")(5,"li"),e(6,"Node.js (v18+)"),i(),t(7,"li"),e(8,"Angular CLI"),i(),t(9,"li"),e(10,"Angular SSR"),i()(),t(11,"h2"),e(12,"Quick Start"),i(),t(13,"p"),e(14,"The fastest way to get started is using our automated schematic:"),i(),n(15,"app-code-block",0),t(16,"h2"),e(17,"Manual Setup"),i(),t(18,"p"),e(19," If you prefer to configure things manually, first install the library and its peer dependencies: "),i(),n(20,"app-code-block",1),t(21,"h2"),e(22,"2. Verify Configuration"),i(),t(23,"p"),e(24," The schematic automatically configures the Angular Application and your Express server. However, you can verify it manually: "),i(),t(25,"h3"),e(26,"Application Configuration ("),t(27,"code"),e(28,"app.config.ts"),i(),e(29,")"),i(),t(30,"p"),e(31," Ensure the provider function is added to your app config to register the custom optimized image loader: "),i(),n(32,"app-code-block",2),t(33,"h3"),e(34,"Server Middleware ("),t(35,"code"),e(36,"server.ts"),i(),e(37,")"),i(),t(38,"p"),e(39," The optimizer works as an Express middleware intercepting paths (defaulting to "),t(40,"code"),e(41,"/_ng/image"),i(),e(42,"). "),i(),n(43,"app-code-block",2)),a&2&&(o(32),r("code",m.appConfigCode),o(11),r("code",m.serverCode))},dependencies:[s],styles:["ul[_ngcontent-%COMP%]{margin-bottom:24px;padding-left:20px;color:var(--text-secondary)}li[_ngcontent-%COMP%]{margin-bottom:8px}"]})};export{d as InstallationComponent};
