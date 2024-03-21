import { Factory, trait } from 'miragejs';
import config from 'codecrafters-frontend/config/environment';

function generateRandomAlphanumericString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export default Factory.extend({
  changedFiles: () => {
    return [
      {
        filename: 'README.md',
        diff: `This is the README.md file.

- and this was removed!
+ and this was added!
          `,
      },
      {
        filename: 'server.rb',
        diff: `    end

    def listen
      loop do
        client = @server.accept
+       handle_client(client)
+     end
+   end
+
+   def handle_client(client)
+     loop do
+       client.gets
+
        # TODO: Handle commands other than PING
        client.write("+PONG\\r\\n")
      end
    end
  end`,
      },
    ];
  },

  createdAt: () => new Date(),

  commitSha: () => generateRandomAlphanumericString(40),

  githubStorageHtmlUrl: 'https://github.com',

  withFailureStatus: trait({
    status: 'failure',

    afterCreate(submission, server) {
      server.create('submission-evaluation', {
        submission,
        createdAt: new Date(submission.createdAt.getTime() + 11290), // 11.29s
        logsFileUrl: `${config.x.backendUrl}/api/v1/fake-submission-logs?type=failure`,
      });
    },
  }),

  withStageCompletion: trait({
    status: 'success',

    afterCreate(submission, server) {
      server.create('submission-evaluation', {
        submission,
        createdAt: new Date(submission.createdAt.getTime() + 4219), // 4.219s
        logsFileUrl: `${config.x.backendUrl}/api/v1/fake-submission-logs?type=success`,
      });

      if (!submission.wasSubmittedViaCli) {
        server.create('course-stage-completion', {
          repository: submission.repository,
          courseStage: submission.courseStage,
          completedAt: submission.createdAt,
        });
      }
    },
  }),

  withSuccessStatus: trait({
    status: 'success',

    afterCreate(submission, server) {
      server.create('submission-evaluation', {
        submission,
        createdAt: new Date(submission.createdAt.getTime() + 4219), // 4.219s
        logsFileUrl: `${config.x.backendUrl}/api/v1/fake-submission-logs?type=success`,
      });
    },
  }),

  withEvaluatingStatus: trait({
    status: 'evaluating',
  }),

  afterCreate(submission) {
    submission.repository.update('lastSubmission', submission);
  },
});
