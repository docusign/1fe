import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';
import { getLogger } from '../../../lib/getLogger';
import { apiExtractorConfig } from '../../../configs/apiExtractor/apiExtractor.config';
import { getKnownPaths } from '../../../lib/paths/getKnownPaths';

// TODO - support creating variant contracts
export async function contractsGenerateAction() {
  const logger = getLogger('[contracts][generate]');
  const paths = getKnownPaths();
  logger.info('Generating contracts');

  const config = ExtractorConfig.prepare({
    configObject: {
      ...apiExtractorConfig,
      projectFolder: paths.projectDir,
    },
    configObjectFullPath: paths.virtual.apiExtractorConfig,
    packageJsonFullPath: paths.widgetPackageJson,
  });

  const extractorResult = Extractor.invoke(config, {
    localBuild: false, // Do not update the API snapshot
    showVerboseMessages: true,
  });

  if (extractorResult.succeeded) {
    logger.info('Successfully built contracts');
  } else {
    logger.error('Failed to build contracts');
  }
}
