import { Context } from '@actions/github/lib/context';
import { EntryPoints, Status } from './api-extractor';
import { REPORT_DIR } from './const';

const diff = require('diff-lines');
const normalizeNewline = require('normalize-newline');

const COMMENT_HEADER = '## Pull request checker: Conventional commits';

function generateBody(isTypeValid, isScopeValid): string {
  if (isTypeValid) {
    return `### :green_heart: T`;
  } else {
  }

  if (
    entry.head.status === Status.Success &&
    entry.base.status === Status.Success
  ) {
    const diff = getDiff(entry.file);
    if (diff.length) {
      return `### :warning: ${entry.name}\n\`\`\`diff\n${diff}\n\`\`\``;
    }
    // No changes. Don't report anything.
    return '';
  } else if (
    entry.head.status === Status.Failed &&
    entry.base.status === Status.Success
  ) {
    return `### :boom: ${entry.name}
Library no longer can be analyzed with api-extractor. Please check the errors:
\`\`\`
${entry.head.errors.join('\n')}
\`\`\``;
  } else if (
    entry.head.status === Status.Success &&
    entry.base.status === Status.Failed
  ) {
    return `### :green_heart: ${entry.name}\nLibrary can now by analyzed with api-extractor.`;
  } else if (
    entry.head.status === Status.Failed &&
    entry.base.status === Status.Failed
  ) {
    if (entry.head.errors?.[0] !== entry.base.errors?.[0]) {
      return `### :boom: ${entry.name}
Previous error: \`${entry.base.errors[0]}\`
New error: \`${entry.head.errors[0]}\``;
    }
  } else if (entry.head.status === Status.Unknown) {
    return `### :boom: ${entry.name}\nEntry point removed. Are you sure it was intentional?`;
  } else if (
    entry.base.status === Status.Unknown &&
    entry.head.status === Status.Success
  ) {
    const publicApi = extractSnippetFromFile(`${REPORT_DIR}/${entry.file}`);
    return `### :warning: ${entry.name}
New entry point. Initial public api:
\`\`\`ts
${publicApi}
\`\`\``;
  } else if (
    entry.base.status === Status.Unknown &&
    entry.head.status === Status.Failed
  ) {
    return `### :boom: ${entry.name}
New entry point that can't be analyzed with api-extractor. Please check the errors:
\`\`\`
${entry.head.errors.join('\n')}
\`\`\``;
  }
  return '';
}

/**
 * Update or create comment in the PR with API extractor result.
 *
 * @param body Content of the comment
 * @param ghClient Github client
 * @param issueNumber PR number
 * @param context Context of the github action
 */
async function printReport(
  body: string,
  ghClient: any,
  issueNumber: number,
  context: Context
) {
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
  entryPoints: EntryPoints,
  ghClient: any,
  relatedPR: { number: number },
  context: Context
) {
  const commentsForEntryPoints = Object.values(entryPoints).map(
    generateCommentForEntryPoint
  );

  const notAnalyzedEntryPoints = extractListOfNotAnalyzedEntryPoints(
    Object.values(entryPoints)
  );

  const commentBody = generateCommentBody(
    commentsForEntryPoints,
    notAnalyzedEntryPoints
  );
  await printReport(commentBody, ghClient, relatedPR.number, context);
}
