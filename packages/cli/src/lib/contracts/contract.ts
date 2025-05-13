import { takeWhile } from 'lodash';
import type { ContractFileHeader, WidgetId } from './types';

/**
 * Turns a contract file into a ContractFileHeader object if it has a valid source header
 */
export function parseHeader(
  contractContent: string,
): ContractFileHeader | undefined {
  const frontMatter = takeWhile(contractContent.split('\n'), isComment);

  for (const line of frontMatter) {
    const sourceMatch = line.match(sourceMatcher);
    if (!sourceMatch) continue;

    const url = sourceMatch[1];
    const cdnUrlMatch = url.match(cdnUrlMatcher);
    if (cdnUrlMatch) {
      // examples: contract, variant1Contract
      const variantId = cdnUrlMatch[4].replace(/[cC]ontract/, '');
      return {
        url,
        environment: cdnUrlMatch[1],
        widgetId: cdnUrlMatch[2] as WidgetId,
        version: cdnUrlMatch[3],
        variantId,
      };
    }
  }

  return;
}

export function buildContractFile(cdnUrl: string, content: string): string {
  const header = buildContractFileHeader(cdnUrl);

  return `${header}\n\n${content}`;
}

export function buildContractFileHeader(cdnUrl: string): string {
  return `// Warning: This file is managed by 1ds-cli's 'contracts' command
// Any changes will be overwritten
// source: ${cdnUrl}
// Contracts are linted in their respective projects, and should not be included
// in this project's linting rules.
/* eslint-disable @eslint-community/eslint-comments/no-restricted-disable */
/* eslint-disable @eslint-community/eslint-comments/no-unlimited-disable */
/* eslint-disable */
`;
}

const sourceMatcher = /source: (https:\/\/.*)\s*/;
// Match groups: environment, widgetId, version,variantId
const cdnUrlMatcher =
  /https:\/\/(.*)\/widgets\/(.+)\/([\d.-]+)\/types\/(?:contracts\/)?([a-zA-Z0-9-]+)\.rolledUp\.d\.ts/;

function isComment(line: string): boolean {
  return line.startsWith('//');
}
