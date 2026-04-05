import {
  Rule,
  Tree,
  SchematicContext,
  chain,
  SchematicsException,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addPackageJsonDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { addRootProvider } from '@schematics/angular/utility';

const SHARP_VERSION = '^0.34.5';
// const LRU_CACHE_VERSION = '^11.2.7';

export function ngAdd(options: { project: string }): Rule {
  return async (tree: Tree) => {
    const workspace = await getWorkspace(tree);

    if (!options.project) {
      options.project = Array.from(workspace.projects.entries()).find(
        ([_, project]) => project.extensions['projectType'] === 'application',
      )?.[0] as string;
    }

    if (!options.project) {
      options.project = workspace.projects.keys().next().value as string;
    }

    if (!options.project) {
      throw new SchematicsException('No project found in the workspace.');
    }

    return chain([
      addDependencies(),
      addProviderToAppConfig(options.project),
      addMiddlewareToServer(options.project),
    ]);
  };
}

function addDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const dependencies = [
      { name: 'sharp', version: SHARP_VERSION },
      // { name: 'lru-cache', version: LRU_CACHE_VERSION },
    ];

    dependencies.forEach((dep) => {
      addPackageJsonDependency(tree, {
        type: NodeDependencyType.Default,
        name: dep.name,
        version: dep.version,
        overwrite: false,
      });
      context.logger.info(`✅ Added ${dep.name} to dependencies`);
    });

    context.addTask(new NodePackageInstallTask());
  };
}

function addProviderToAppConfig(projectName: string): Rule {
  return async (tree: Tree) => {
    const workspace = await getWorkspace(tree);
    const project = workspace.projects.get(projectName);

    if (!project) {
      throw new SchematicsException(`Project "${projectName}" not found.`);
    }

    return addRootProvider(projectName, ({ code, external }: any) => {
      return code`${external('provideImageOptimizerLoader', 'ng-image-optimizer')}()`;
    });
  };
}

function addMiddlewareToServer(projectName: string): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const workspace = await getWorkspace(tree);
    const project = workspace.projects.get(projectName);

    if (!project) {
      return;
    }

    const buildTarget = project.targets.get('build');
    if (!buildTarget || !buildTarget.options) {
      return;
    }

    const ssrEntry = (buildTarget.options as any).ssr?.entry;
    if (!ssrEntry || !tree.exists(ssrEntry)) {
      context.logger.warn(
        `Could not find server entry file (ssr.entry) to add image optimizer middleware.`,
      );
      return;
    }

    let serverContent = tree.readText(ssrEntry);
    if (serverContent.includes('imageOptimizerHandler')) {
      context.logger.info(`✅ Image optimizer middleware already present in ${ssrEntry}`);
      return;
    }

    // Add import
    if (!serverContent.includes("from 'ng-image-optimizer/server'")) {
      const importStatement = `import { imageOptimizerHandler } from 'ng-image-optimizer/server';\n`;
      serverContent = importStatement + serverContent;
    }

    // Ensure join is imported if we need to define browserDistFolder
    if (
      !serverContent.includes('const browserDistFolder') &&
      !serverContent.includes("import { join } from 'node:path'") &&
      !serverContent.includes('import { join } from "node:path"')
    ) {
      serverContent = `import { join } from 'node:path';\n` + serverContent;
    }

    // In Angular 21, the server.ts usually has `const app = express();`
    // We want to add the middleware after that.
    const expressAppMatch = serverContent.match(/const\s+app\s+=\s+express\(\);/);
    if (expressAppMatch) {
      const insertionPoint = expressAppMatch.index! + expressAppMatch[0].length;

      // Check if browserDistFolder is already defined
      if (serverContent.includes('const browserDistFolder')) {
        serverContent = serverContent.replace(
          /const\s+app\s+=\s+express\(\);/,
          `const app = express();\napp.use('/_ng/image', imageOptimizerHandler(browserDistFolder, {}));`,
        );
      } else {
        const middlewareCode = `\n\nconst browserDistFolder = join(import.meta.dirname, '../browser');\napp.use('/_ng/image', imageOptimizerHandler(browserDistFolder, {}));`;
        serverContent =
          serverContent.slice(0, insertionPoint) +
          middlewareCode +
          serverContent.slice(insertionPoint);
      }

      tree.overwrite(ssrEntry, serverContent);
      context.logger.info(`✅ Added image optimizer middleware to ${ssrEntry}`);
    } else {
      context.logger.warn(
        `Could not find "const app = express();" in ${ssrEntry} to auto-inject middleware.`,
      );
    }
  };
}
