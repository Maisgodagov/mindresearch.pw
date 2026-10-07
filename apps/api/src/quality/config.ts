export const QUALITY_V2_CONFIG = {
  version: '2.0.0', seed: 'mindresearch-quality-v2', epsilon: 1,
  status: { high: 85, acceptable: 70, review: 55 },
  overall: { behavioral: .5, response: .5, partialConfidenceCap: .6 },
  reference: { minQuestionN: 20, minCalibrationN: 50, stableTailN: 100, folds: 5, minFoldTrainingN: 30, highQualityScore: 85, highQualityConfidence: .7, completedConfidence: .8, blockConfidence: .85, typeConfidence: .7, conservativeMadMultiplier: 3, madFloor: .001, tailTransitionFloor: .05 },
  behavior: {
    weights: { pace: .45, bursts: .20, acceleration: .15, duration: .20 },
    offsetSeconds: .5, minCoverage: .5, minQuestions: 10, highCoverage: .9, mediumCoverage: .75,
    fastRatio: .4, fastSeconds: 4, extremeRatio: .25, extremeSeconds: 2,
    pace: { medianWarning: .6, medianCritical: .3, fastWarning: .1, fastCritical: .4, extremeWarning: .02, extremeCritical: .2 },
    bursts: { minRun: 6, warning: 5, critical: 16 },
    acceleration: { minThirdQuestions: 20, coverage: .8, warning: .7, critical: .4 },
    duration: { absoluteCapSeconds: 60, medianMultiplier: 5, warning: .65, critical: .35 },
  },
  response: {
    weights: { rpr: .45, pairs: .30, patterning: .15, attention: .10 },
    minItems: 10, minItemCoverage: .5,
    rpr: { resamples: 25, minScales: 8, minItemsPerScale: 4, halfCoverage: .8, minValidResamples: 15, confidenceScales: 20, clip: .999999 },
    pairs: { minN: 30, rho: .45, maxPerItem: 3, minPairs: 10, confidencePairs: 30 },
    patterning: { minBlockItems: 10, moderatePenalty: 15, maxPenalty: 35, conservativeTailMultiplier: 1.5 },
    attention: { oneFailedScore: 70, multipleFailedScore: 25 },
  },
  flag: { strongSeverity: .85, warningSeverity: .2 },
  diagnostics: { minN: 20, bootstrap: 200, crossPairs: [
    ['test_6:restrained', 'test_5:driveForThinness', 'positive'],
    ['test_6:emotional', 'test_5:bulimia', 'positive'],
    ['test_6:external', 'test_5:bulimia', 'positive'],
    ['test_3:overall', 'test_4:overall', 'negative'],
    ['test_3:overall', 'test_5:ineffectiveness', 'negative'],
  ] },
};
export type QualityConfig = typeof QUALITY_V2_CONFIG;
