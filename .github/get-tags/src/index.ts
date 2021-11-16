import * as core from '@actions/core';
import * as exec from '@actions/exec';

async function run() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  let FROM_TAG = process.env.FROM_TAG;
  const TO_TAG = process.env.TO_TAG ?? 'HEAD';

  if (!GITHUB_TOKEN) {
    throw new Error('Github token missing in action');
  }

  if (!FROM_TAG) {
    let myOutput = '';

    const options: any = {};
    options.listeners = {
      stdout: (data: Buffer) => {
        myOutput = data.toString();
      },
    };

    await exec.exec(
      'git describe --tags $(git rev-list --tags --max-count=1)',
      options
    );
    console.log('1', myOutput);
    await exec.exec(`git describe --abbrev=0 --tags ${myOutput}^`, options);
    console.log('2', myOutput);

    FROM_TAG = myOutput;
  }

  console.log('vat', [FROM_TAG, TO_TAG]);

  core.setOutput('fromTag', FROM_TAG);
  core.setOutput('toTag', TO_TAG);
}

run();
