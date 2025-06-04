import {input, select} from '@inquirer/prompts';
import {execSync, spawnSync} from 'child_process';
import {mkdirSync, readFileSync, writeFileSync} from 'fs';
import path from 'path';

function logStep(msg) {
  console.log(`\n🔹 ${msg}`);
}

function exec(command) {
  try {
    console.log(`> ${command}`);
    execSync(command, {stdio: 'inherit'});
  } catch (err) {
    console.error(`❌ Command failed: ${command}\n${err.message}`);
    process.exit(1);
  }
}

function spawnWithOutput(command, args) {
  const result = spawnSync(command, args, {stdio: 'inherit', shell: true});
  if (result.status !== 0) {
    console.error(`❌ Failed to execute ${command} ${args.join(' ')}`);
    process.exit(result.status);
  }
}

function getAngularConfig() {
  try {
    return JSON.parse(readFileSync('angular.json', 'utf8'));
  } catch (err) {
    console.error('❌ Failed to read angular.json:', err.message);
    process.exit(1);
  }
}

async function selectProject(projects) {
  const names = Object.keys(projects);
  if (names.length === 1) return names[0];
  return await select({
    message: 'Select Angular project:',
    choices: names.map((p) => ({name: p, value: p}))
  });
}

async function selectEnvironment(envs) {
  return await select({
    message: 'Select environment:',
    choices: envs.map((e) => ({name: e, value: e}))
  });
}

async function getOrCreateOutputPath(config, project, env) {
  try {
    const outputPath = config.projects[project].architect.build.configurations[env]?.outputPath;
    if (outputPath) return outputPath;

    console.warn(`⚠️ No outputPath found for ${project}/${env}`);
    const userPath = await input({
      message: `Provide outputPath for ${env} (leave blank for default):`
    });

    const newPath = userPath.trim() || `dist/${project}_${env}`;
    config.projects[project].architect.build.configurations[env] = {
      ...(config.projects[project].architect.build.configurations[env] || {}),
      outputPath: newPath
    };
    writeFileSync('angular.json', JSON.stringify(config, null, 2));
    return newPath;
  } catch (err) {
    console.error(`❌ Failed to resolve output path: ${err.message}`);
    process.exit(1);
  }
}

function getCommitHash() {
  return execSync('git rev-parse --short HEAD').toString().trim();
}

function getBuildDate() {
  return new Date().toISOString();
}

function autoIncrementVersion(version) {
  let [major, minor, patch] = version.split('.').map(Number);
  patch++;
  if (patch >= 100) {
    patch = 0;
    minor++;
    if (minor >= 100) {
      minor = 0;
      major++;
    }
  }
  return `${major}.${minor}.${patch}`;
}

function tagExistsRemotely(tagName) {
  try {
    const result = execSync(`git ls-remote --tags origin refs/tags/${tagName}`, {encoding: 'utf-8'});
    return result.trim().length > 0;
  } catch {
    return false;
  }
}

function tagExistsLocally(tagName) {
  try {
    const tags = execSync('git tag', {encoding: 'utf-8'}).split('\n');
    return tags.includes(tagName);
  } catch {
    return false;
  }
}

function tagExists(tagName) {
  return tagExistsLocally(tagName) || tagExistsRemotely(tagName);
}

function getNextVersionFromPackageJson(project, env) {
  const pkgPath = path.resolve('package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

  const key = `${project}__${env}`;
  pkg.buildVersions = pkg.buildVersions || {};

  let version = pkg.buildVersions[key] || '0.0.0';
  let tagName = `${env}-${version}`;

  // Keep incrementing version until the tag doesn't exist
  while (tagExists(tagName)) {
    version = autoIncrementVersion(version);
    tagName = `${env}-${version}`;
  }

  // Save only the clean version to package.json
  pkg.buildVersions[key] = version;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

  return version;
}
function updatePackageJsonVersion(newVersion) {
  const pkgPath = path.resolve('package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  pkg.version = newVersion;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

function createVersionFile(version, buildDate, commitHash, outPath) {
  const versionData = {version, buildDate, commitHash};
  mkdirSync(outPath, {recursive: true});
  writeFileSync(path.join(outPath, 'version.json'), JSON.stringify(versionData, null, 2));
}

function ensureCleanTag(tag) {
  try {
    const existingTags = execSync('git tag', {encoding: 'utf-8'}).split('\n');
    if (existingTags.includes(tag)) {
      console.warn(`⚠️ Tag ${tag} already exists. Removing it...`);
      execSync(`git tag -d "${tag}"`, {stdio: 'inherit'});
      execSync(`git push --delete origin "${tag}"`, {stdio: 'inherit'});
    }
  } catch (err) {
    console.error(`❌ Failed during tag cleanup: ${err.message}`);
    process.exit(1);
  }
}

async function main() {
  logStep('Reading angular.json...');
  const config = getAngularConfig();
  const projects = config.projects;

  logStep('Selecting project...');
  const project = await selectProject(projects);

  const environments = Object.keys(projects[project].architect.build.configurations);
  if (!environments.length) {
    console.error(`❌ No environments found for project ${project}`);
    process.exit(1);
  }

  logStep('Selecting environment...');
  const selectedEnv = await selectEnvironment(environments);

  logStep('Resolving output path...');
  const outputPath = await getOrCreateOutputPath(config, project, selectedEnv);

  logStep('Running build...');
  spawnWithOutput('ng', ['build', `--configuration=${selectedEnv}`]);

  logStep('Reading and incrementing version...');
  const newVersion = getNextVersionFromPackageJson(project, selectedEnv);
  const buildDate = getBuildDate();
  const commitHash = getCommitHash();

  logStep('Creating version.json...');
  createVersionFile(newVersion, buildDate, commitHash, outputPath);

  logStep('Updating package.json version...');
  updatePackageJsonVersion(newVersion);

  const commitMsg = `Build Created ${selectedEnv} ${newVersion} ${buildDate} ${commitHash}`;
  const tagName = `${selectedEnv}-${newVersion}`;

  logStep('Committing and tagging in git...');
  ensureCleanTag(tagName);
  exec('git add -A');
  exec(`git commit -m "${commitMsg}"`);
  exec('git push');
  exec(`git tag -a "${tagName}" -m "${commitMsg}"`);
  exec(`git push origin "${tagName}"`);

  console.log(`\n✅ Build completed successfully: ${newVersion}`);
}

main();
