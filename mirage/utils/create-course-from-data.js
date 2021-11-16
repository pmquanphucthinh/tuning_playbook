export default function createCourseFromData(server, courseData) {
  const course = server.create('course', {
    completionPercentage: courseData.completion_percentage,
    descriptionMarkdown: courseData.description_md,
    difficulty: courseData.marketing.difficulty,
    isFree: courseData.slug === 'redis',
    name: courseData.name,
    releaseStatus: courseData.release_status,
    shortDescriptionMarkdown: courseData.short_description_md,
    slug: courseData.slug,
    supportedLanguages: courseData.supported_languages.map((languageSlug) => server.schema.languages.findBy({ slug: languageSlug })),
  });

  let courseStagePosition = 1;

  for (const courseStageData of courseData.stages) {
    server.create('course-stage', {
      course: course,
      name: courseStageData.name,
      position: courseStagePosition++,
      descriptionMarkdownTemplate: courseStageData.description_md,
    });
  }
}
