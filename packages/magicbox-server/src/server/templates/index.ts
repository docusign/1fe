import path from 'path';
import fs from 'fs';

const getTemplate = (templateName: string) => {
  const templatePath = path.resolve(
    process.cwd(),
    '../../packages/magicbox-server/src/server/templates',
    templateName,
  );
  return fs.readFileSync(templatePath, 'utf-8');
};

export { getTemplate };
