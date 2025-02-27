export type SystemImportMap = System.ImportMap;

/**
 * A module specifier is a string used as keys within an import map
 */
export type ModuleSpecifier = string;

/**
 * An import source is a string used as values within an import map
 */
export type ImportSource = string;

/**
 * An import map is a record of module specifiers to import sources
 * {@link https://github.com/WICG/import-maps}
 */
export type ImportMap = Record<ModuleSpecifier, ImportSource>;
