import createCourseStageSolution from './create-course-stage-solution';

export default function createCourseFromData(server, courseData) {
  const course = server.create('course', {
    completionPercentage: courseData.completion_percentage,
    descriptionMarkdown: courseData.description_md,
    difficulty: courseData.marketing.difficulty,
    name: courseData.name,
    releaseStatus: courseData.release_status,
    sampleExtensionIdeaTitle: courseData.marketing.sample_extension_idea_title,
    sampleExtensionIdeaDescription: courseData.marketing.sample_extension_idea_description,
    shortName: courseData.name.replace(/Build your own /i, ''),
    shortDescriptionMarkdown: courseData.short_description_md,
    slug: courseData.slug,
    testimonials: courseData.marketing.testimonials,
  });

  let courseStagePosition = 1;

  for (const courseStageData of courseData.stages) {
    server.create('course-stage', {
      course: course,
      name: courseStageData.name,
      marketingMarkdown: courseStageData.marketing_md,
      position: courseStagePosition,
      slug: courseStageData.slug,
      descriptionMarkdownTemplate: courseStageData.description_md,
      difficulty: courseStageData.difficulty,
      testerSourceCodeUrl: courseStageData.tester_source_code_url,
      isPaid: courseStagePosition > 3,
    });

    courseStagePosition++;
  }

  for (const languageConfigurationData of courseData.languages) {
    const language = server.schema.languages.findBy({ slug: languageConfigurationData.slug });
    server.create('course-language-configuration', {
      course: course,
      language: language,
      releaseStatus: languageConfigurationData.release_status || 'live',
      starterRepositoryUrl: languageConfigurationData.starter_repository_url,
      alphaTesterUsernames: languageConfigurationData.alphaTesterUsernames || [],
    });

    createCourseStageSolution(server, course, 1, language);
  }

  return course;
}
