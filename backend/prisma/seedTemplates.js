import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const formsDir = resolve(projectRoot, 'shared', 'forms');
const workflowsDir = resolve(projectRoot, 'shared', 'workflows');

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

try {
  const workflowFiles = (await readdir(workflowsDir)).filter((file) => file.endsWith('.json')).sort();
  const workflows = await Promise.all(workflowFiles.map((file) => readJson(resolve(workflowsDir, file))));
  const formFiles = (await readdir(formsDir)).filter((file) => file.endsWith('.json')).sort();
  const forms = await Promise.all(formFiles.map((file) => readJson(resolve(formsDir, file))));

  await prisma.$transaction(async (tx) => {
    for (const workflow of workflows) {
      await tx.workflowTemplate.upsert({
        where: { code_version: { code: workflow.code, version: workflow.version } },
        update: { steps: workflow },
        create: { code: workflow.code, version: workflow.version, steps: workflow },
      });
    }

    for (const form of forms) {
      await tx.formTemplate.upsert({
        where: { code_version: { code: form.code, version: form.version } },
        update: {
          name: form.name,
          workflowCode: form.workflowCode,
          limit: form.limit,
          sections: form.sections,
          active: true,
        },
        create: {
          code: form.code,
          version: form.version,
          name: form.name,
          workflowCode: form.workflowCode,
          limit: form.limit,
          sections: form.sections,
        },
      });
    }
  });

  console.log(`Seeded ${workflows.length} workflow(s) and ${forms.length} form template(s).`);
} catch (error) {
  console.error('Template seed failed:', error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
