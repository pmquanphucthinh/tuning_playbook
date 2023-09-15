import { Factory } from 'miragejs';
import syncRepositoryStageLists from '../utils/sync-repository-stage-lists';

export default Factory.extend({
  afterCreate(courseStageCompletion, server) {
    let leaderboardEntry = server.schema.leaderboardEntries.findOrCreateBy({
      userId: courseStageCompletion.repository.user.id,
      languageId: courseStageCompletion.repository.language.id,
    });

    let completedStagePosition = courseStageCompletion.courseStage.position;
    let nextStage = courseStageCompletion.repository.course.stages.models.find((x) => x.position === completedStagePosition + 1);

    leaderboardEntry.update({
      lastAttemptAt: courseStageCompletion.completedAt,
      currentCourseStage: nextStage || courseStageCompletion.courseStage,
      status: nextStage ? 'idle' : 'completed',
    });

    syncRepositoryStageLists(server, courseStageCompletion.repository);
  },
});
