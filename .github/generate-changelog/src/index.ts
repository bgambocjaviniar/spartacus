import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';

async function run() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const FROM_TAG = process.env.FROM_TAG;
  const TO_TAG = process.env.TO_TAG;

  if (!GITHUB_TOKEN) {
    throw new Error('Github token missing in action');
  }

  if (!FROM_TAG) {
    throw new Error('From tag is missing');
  }

  if (!TO_TAG) {
    throw new Error('To tag is missing');
  }

  //   const octoKit = github.getOctokit(GITHUB_TOKEN);
  const context = github.context;

  if (!context.payload.pull_request) {
    throw new Error('Not triggered by a pull request');
  }

  await exec.exec('ls -l');
  await exec.exec(`git describe --abbrev=0 --tags HEAD`);
  await exec.exec('ts-node scripts/changelog.ts --verbose --from asm-4.0.0');

  console.log(FROM_TAG);
  console.log(TO_TAG);
  console.log(context.payload.pull_request.base.ref);

  core.setOutput('changelog', 'coolio');
}

run();
