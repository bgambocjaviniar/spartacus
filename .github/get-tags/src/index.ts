import * as core from '@actions/core';
import * as exec from '@actions/exec';

async function run() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  let FROM_TAG = process.env.FROM_TAG;
  const TO_TAG = process.env.TO_TAG ?? 'HEAD';

  if (!GITHUB_TOKEN) {
    throw new Error('Github token missing in action');
  }

  console.log('FNMIWRMGIO', [FROM_TAG, TO_TAG]);

  if (!FROM_TAG) {
    let myOutput = '';
    let myError = '';

    const options: any = {};
    options.listeners = {
      stdout: (data: Buffer) => {
        myOutput = data.toString();
      },
      stderr: (data: Buffer) => {
        myError += data.toString();
      },
    };

    await exec.exec(
      `git describe --tags $(git rev-list --tags --max-count=1)`,
      options
    );
    console.log('1', [myOutput, myError]);
    await exec.exec(`git describe --abbrev=0 --tags ${myOutput}^`, options);
    console.log('2', [myOutput, myError]);

    FROM_TAG = myOutput;
  }

  console.log('vat', [FROM_TAG, TO_TAG]);

  core.setOutput('fromTag', FROM_TAG);
  core.setOutput('toTag', TO_TAG);
}

run();
