import path from 'path';
import fs from 'fs';

const getTemplate = (templateName: string) => {
  const templatePath = path.resolve(__dirname, templateName);
  return fs.readFileSync(templatePath, 'utf-8');
};

export { getTemplate };
