import { outputFile } from 'fs-extra';
import { camelCase, dropWhile, upperFirst } from 'lodash';
import path from 'node:path';
import { FileSystem } from './files';
import type { ContractFile, WidgetId } from './types';

/**
 * Updates the global registry (widgets/index.d.ts) with installed contracts
 * @param fileSystem A contracts filesystem instance
 * @returns Resolved promise on completed write
 */
export async function updateKnownWidgetsFile(
  fileSystem: FileSystem,
): Promise<void> {
  const contracts = await fileSystem.readWidgetContracts();
  const content = generateContractIndexFileContent(contracts);

  return outputFile(fileSystem.widgetGlobalsPath, content, {
    encoding: 'utf-8',
    flag: 'w',
  });
}

/**
 * Creates a react-friendly widgetId
 */
function createFriendlyName(widgetId: WidgetId): string {
  const parts = widgetId.split('/').map((part) => upperFirst(camelCase(part)));
  const friendlyName = `${parts.join('')}Props`;
  // Component names should not start with a number
  if (/^\d/.test(friendlyName)) {
    return `_${friendlyName}`;
  }
  return friendlyName;
}

/**
 * Given a full path to a contract file, returns a relative import path
 */
export function getImportPath(fullPath: string): string {
  const parsed = path.parse(fullPath);
  const portions = parsed.dir.split(path.sep);
  const relative = dropWhile(portions, (p) => p !== 'src');
  return path.posix.join(...relative, `${parsed.name}${parsed.ext}`);
}

/**
 * Generates the content for the global registry file
 */
function generateContractIndexFileContent(contracts: ContractFile[]): string {
  // Consider AST creation? Templating file? Prettier matching...

  const createImportLine = ({
    path,
    header: { widgetId, variantId },
  }: ContractFile) => {
    const friendlyName = createFriendlyName(`${widgetId}/${variantId}`);
    const importPath = getImportPath(path);

    return `import type { HostPropsContract as ${friendlyName} } from '${importPath}';`;
  };

  /**
   * Creates the relationship between widgetId and type for known widgets. Does not handle variants
   */
  const createKnownWidgetsMapping = ({
    header: { widgetId, variantId },
  }: ContractFile) => {
    const isVariant = variantId !== '';
    if (!isVariant) {
      return `${' '.repeat(4)}'${widgetId}': ${createFriendlyName(
        widgetId,
      )};\n`;
    }
  };

  /**
   * Creates the mapping for known Variants
   */
  const createKnownVariantsMapping = (
    contractFiles: ContractFile[],
  ): string[] => {
    const knownVariants: Record<WidgetId, string[]> = {};
    contractFiles.forEach(({ header: { widgetId, variantId } }) => {
      const isVariant = variantId !== '';
      if (isVariant) {
        const line = `        '${variantId}': ${createFriendlyName(
          `${widgetId}/${variantId}`,
        )};`;

        if (!knownVariants[widgetId]) {
          knownVariants[widgetId] = [line];
        } else {
          knownVariants[widgetId].push(line);
        }
      }
    });

    return Object.keys(knownVariants).map((id) => {
      const variants = knownVariants[id as WidgetId].join('\n');
      return `${' '.repeat(4)}'${id}': {\n${variants}\n${' '.repeat(4)}};`;
    });
  };

  /**
   * Creates the declaration for the known widgets and variants
   */
  const createKnownDeclaration = (contracts: ContractFile[]) =>
    contracts.length > 0
      ? `declare module '@devhub/1fe-shell' {
  interface KnownWidgets {
${contracts.map(createKnownWidgetsMapping).join('')}  }
  interface KnownVariants {
${createKnownVariantsMapping(contracts)}
  }
}`
      : '';

  return `// Warning: This file is managed by the 1ds-cli contracts command
// This is a managed dependency, and excluded from project-specific linting rules
/* eslint-disable @eslint-community/eslint-comments/no-restricted-disable */
/* eslint-disable @eslint-community/eslint-comments/no-unlimited-disable */
/* eslint-disable */
${contracts.map(createImportLine).join('\n')}

${createKnownDeclaration(contracts)}`;
}
