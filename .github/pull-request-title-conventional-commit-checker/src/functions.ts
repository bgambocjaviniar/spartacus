import { Context } from '@actions/github/lib/context';
const COMMENT_HEADER = '## Pull request checker: Conventional commits';

export function checkPullRequestTitle(title: string): {
  isTypeValid: boolean;
  isScopeValid: boolean;
} {
  const commonTypeRegex =
    '^(?<type>feat|fix|perf|refactor|style|test|chore|docs)';
  const typeRegex = new RegExp(`${commonTypeRegex}`);
  const scopeRegex = new RegExp(
    `${commonTypeRegex}(?<scope>:|((@spartacus/core)|(@spartacus/storefront)|(@spartacus/styles)|(@spartacus/assets)|(@spartacus/schematics)|(@spartacus/incubator)|(@spartacus/user)|(@spartacus/cds)|(@spartacus/organization)|(@spartacus/product)|(@spartacus/product-configurator)|(@spartacus/storefinder)|(@spartacus/checkout)|(@spartacus/asm)|(@spartacus/smartedit)|(@spartacus/cdc)|(@spartacus/digital-payments)|(@spartacus/tracking)|(@spartacus/cart)|(@spartacus/order)|(@spartacus/setup)|(@spartacus/core)|(@spartacus/qualtrics))):`
  );

  const isTypeValid = typeRegex.test(title);
  const isScopeValid = scopeRegex.test(title);

  return { isTypeValid, isScopeValid };
}

function generateTextForType(isTypeValid: boolean): string {
  let body: string = '';

  if (isTypeValid) {
    body = `No **type** format error`;
  } else {
    body = `
    :boom: **type** must be one of the following:
      - feat
      - fix
      - perf
      - refactor
      - style
      - test
      - chore
      - docs
    `;
  }

  return `## Is the pull request **type** text valid\n${body}`;
}

function generateTextForScope(isScopeValid: boolean): string {
  let body: string = '';

  if (isScopeValid) {
    body = `No **scope** format error and **scope** is optional`;
  } else {
    body = `
    :boom: **scope** must be one of the following right after the type between (scope):
     - @spartacus/core
     - @spartacus/storefront
     - @spartacus/styles
     - @spartacus/assets
     - @spartacus/schematics
     - @spartacus/incubator
     - @spartacus/user
     - @spartacus/cds
     - @spartacus/organization
     - @spartacus/product
     - @spartacus/product-configurator
     - @spartacus/storefinder
     - @spartacus/checkout
     - @spartacus/asm
     - @spartacus/smartedit
     - @spartacus/qualtrics
     - @spartacus/cdc
     - @spartacus/digital-payments
     - @spartacus/tracking
     - @spartacus/cart
     - @spartacus/order
     - @spartacus/setup
    `;
  }

  return `## Is the pull request **type** text valid\n${body}`;
}

function generateCommentBody(
  isTypeValid: boolean,
  isScopeValid: boolean
): string {
  const content = `
  # Please remember to follow the conventional commits format as explained in here https://sap.github.io/spartacus-docs/commit-guidelines/#commit-message-format
  - Make sure the pull request title and commit header matches as well
  - Do not forget to put meaning commit body messages
  - Do not forgot to put **closes GH-issueNumber** in the pull request body and commit footer 
  - <type>(<scope>): <subject> <----- format for pull request title and commit header. However, scope is optional.
  
  ${generateTextForType(isTypeValid)}
  
  ${generateTextForScope(isScopeValid)}
  `;

  return `${COMMENT_HEADER}\n${content}\n`;
}

async function printReport(
  body: string,
  ghClient: any,
  issueNumber: number,
  context: Context
): Promise<void> {
  if (!context.payload.repository) {
    throw new Error('Missing repository in context!');
  }

  const owner = context.payload.repository.owner.login;
  const repo = context.payload.repository.name;

  const comments = await ghClient.issues.listComments({
    issue_number: issueNumber,
    owner,
    repo,
  });

  const botComment = comments.data.filter(
    (comment: any) =>
      comment.body.includes(COMMENT_HEADER) &&
      comment.user.login === 'github-actions[bot]'
  );

  if (botComment && botComment.length) {
    await ghClient.issues.deleteComment({
      comment_id: botComment[0].id,
      owner,
      repo,
    });
  }
  await ghClient.issues.createComment({
    issue_number: issueNumber,
    owner,
    repo,
    body,
  });
}

export async function addCommentToPR(
  ghClient: any,
  relatedPR: { number: number },
  context: Context,
  isTypeValid: boolean,
  isScopeValid: boolean
): Promise<void> {
  const commentBody = generateCommentBody(isTypeValid, isScopeValid);
  await printReport(commentBody, ghClient, relatedPR.number, context);
}
