import { readFile, remove, ensureFile, pathExists } from 'fs-extra';
import { camelCase, initial } from 'lodash';
import { resolve } from 'node:path';
import { getFiles } from '../fs';
import { parseHeader } from './contract';
import type { ContractFile, WidgetId } from './types';

export class FileSystem {
  public readonly widgetTypesPath: string;
  public readonly widgetGlobalsPath: string;

  constructor(private projectSrcTypesPath: string) {
    this.widgetTypesPath = resolve(this.projectSrcTypesPath, 'widgets');
    this.widgetGlobalsPath = resolve(this.widgetTypesPath, 'index.d.ts');
  }

  /**
   * Resolves path to a widget's contract file
   * @param widgetId WidgetId
   * @returns A resolved path
   */
  public resolveWidgetContractPath(widgetId: WidgetId): string {
    const nameParts = widgetId.split('/').map(camelCase);
    const directories = initial(nameParts);
    const name = `${nameParts.at(-1)}.d.ts`;

    return resolve(this.widgetTypesPath, ...directories, name);
  }

  /**
   * Resolves path to a widget's contract directory
   *  @param widgetId WidgetId
   * @returns A resolved path
   * @example /path/to/project/src/types/widgets/test/widget
   */
  public resolveWidgetContractDirPath(widgetId: WidgetId): string {
    return resolve(this.widgetTypesPath, ...widgetId.split('/').map(camelCase));
  }

  public async readWidgetContract(
    widgetId: WidgetId,
  ): Promise<ContractFile | null> {
    try {
      const path = this.resolveWidgetContractPath(widgetId);
      const content = await readFile(path, { encoding: 'utf-8' });
      const header = parseHeader(content);

      if (!header) {
        // Contract file is in unexpected format
        return null;
      }

      return {
        path,
        header,
      };
    } catch (e) {
      return null;
    }
  }

  public async removeWidgetContract(widgetId: WidgetId): Promise<boolean> {
    const contractPath = this.resolveWidgetContractPath(widgetId);
    const contractDirPath = this.resolveWidgetContractDirPath(widgetId);

    try {
      const removableContractPath = (await pathExists(contractPath))
        ? contractPath
        : contractDirPath;
      await remove(removableContractPath);
      return true;
    } catch (e) {}

    return false;
  }

  /**
   * Iterates all widget files in project
   */
  public async *iterateWidgetContracts(): AsyncGenerator<ContractFile> {
    for await (const path of getFiles(this.widgetTypesPath)) {
      const content = await readFile(path, { encoding: 'utf-8' });
      const header = parseHeader(content);

      if (content && header) {
        yield { path, header };
      }
    }
  }

  /**
   * Creates necessary directories and files for widget contracts if they do not exist
   */
  public async ensureWidgetContractsFiles() {
    await ensureFile(this.widgetGlobalsPath);
  }

  /**
   * Reads all widget files in project
   */
  public async readWidgetContracts(): Promise<ContractFile[]> {
    return await arrayFromAsync(this.iterateWidgetContracts());
  }
}

// TODO: Replace with Array.fromAsync (ES22)
async function arrayFromAsync<T>(generator: AsyncGenerator<T>): Promise<T[]> {
  const items: T[] = [];

  for await (const item of generator) {
    items.push(item);
  }

  return items;
}
