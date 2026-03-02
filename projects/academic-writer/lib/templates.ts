/**
 * Academic Study Type Templates & Reporting Guidelines
 * Based on EQUATOR Network reporting guidelines
 */

export interface StudyTemplate {
  id: string;
  name: string;
  shortName: string;
  guideline: string;
  guidelineUrl: string;
  description: string;
  sections: TemplateSection[];
  checklist: ChecklistItem[];
  searchFilters: string[]; // PubMed search filters for this type
}

export interface TemplateSection {
  id: string;
  name: string;
  required: boolean;
  description: string;
  subsections?: string[];
  tips: string[];
}

export interface ChecklistItem {
  id: string;
  section: string;
  item: string;
  description: string;
  checked: boolean;
}

export const STUDY_TEMPLATES: StudyTemplate[] = [
  // ─── Randomized Controlled Trial (RCT) ────────────────────────
  {
    id: 'rct',
    name: 'Randomized Controlled Trial',
    shortName: 'RCT',
    guideline: 'CONSORT 2010',
    guidelineUrl: 'http://www.consort-statement.org/',
    description: 'Gold standard for evaluating interventions. Random allocation of participants to groups with controlled comparison.',
    sections: [
      {
        id: 'title', name: 'Title', required: true,
        description: 'Identify as a randomised trial in the title',
        tips: ['Include "randomized controlled trial" or "RCT" in title', 'Follow: Intervention vs Comparator for Condition: A Randomized Controlled Trial'],
      },
      {
        id: 'abstract', name: 'Structured Abstract', required: true,
        description: 'Structured summary of trial design, methods, results, and conclusions',
        subsections: ['Background', 'Methods', 'Results', 'Conclusions', 'Trial Registration'],
        tips: ['Use structured format', 'Include primary outcome with effect size and CI', 'State trial registration number'],
      },
      {
        id: 'introduction', name: 'Introduction', required: true,
        description: 'Scientific background, rationale, and objectives',
        subsections: ['Background and rationale', 'Objectives', 'Hypotheses'],
        tips: ['State specific objectives or hypotheses', 'Include PICO framework', 'Justify sample size rationale'],
      },
      {
        id: 'methods', name: 'Methods', required: true,
        description: 'Trial design, participants, interventions, outcomes, randomisation',
        subsections: [
          'Trial design', 'Participants (eligibility criteria)', 'Setting and locations',
          'Interventions', 'Outcomes (primary & secondary)', 'Sample size',
          'Randomisation (sequence, allocation concealment)', 'Blinding',
          'Statistical methods'
        ],
        tips: [
          'Describe trial design (parallel, crossover, factorial)',
          'Define primary outcome clearly',
          'Describe randomization method in detail',
          'State who was blinded',
          'Pre-specify statistical analysis plan',
          'Include ITT vs per-protocol analysis'
        ],
      },
      {
        id: 'results', name: 'Results', required: true,
        description: 'Participant flow, baseline data, outcomes, harms',
        subsections: [
          'Participant flow (CONSORT diagram)', 'Baseline demographics',
          'Numbers analysed', 'Primary outcome', 'Secondary outcomes',
          'Ancillary analyses', 'Harms'
        ],
        tips: [
          'Include CONSORT flow diagram',
          'Report effect sizes with 95% CI',
          'Report both absolute and relative measures',
          'Report all pre-specified outcomes',
          'Report adverse events'
        ],
      },
      {
        id: 'discussion', name: 'Discussion', required: true,
        description: 'Limitations, generalisability, interpretation',
        subsections: ['Key findings', 'Limitations', 'Generalisability', 'Interpretation', 'Comparison with other studies'],
        tips: ['Address all limitations honestly', 'Discuss both internal and external validity', 'Avoid over-interpretation'],
      },
      {
        id: 'other', name: 'Other Information', required: true,
        description: 'Registration, protocol, funding',
        subsections: ['Registration number', 'Protocol access', 'Funding'],
        tips: ['Include trial registry (e.g., ClinicalTrials.gov)', 'State funding sources and role of funder'],
      },
    ],
    checklist: [
      { id: 'c1', section: 'Title', item: 'Identified as randomised trial in title', description: 'CONSORT 1a', checked: false },
      { id: 'c2', section: 'Abstract', item: 'Structured abstract with trial design, methods, results, conclusions', description: 'CONSORT 1b', checked: false },
      { id: 'c3', section: 'Methods', item: 'Eligibility criteria for participants', description: 'CONSORT 4a', checked: false },
      { id: 'c4', section: 'Methods', item: 'Settings and locations of data collection', description: 'CONSORT 4b', checked: false },
      { id: 'c5', section: 'Methods', item: 'Interventions described with sufficient detail', description: 'CONSORT 5', checked: false },
      { id: 'c6', section: 'Methods', item: 'Primary and secondary outcomes defined', description: 'CONSORT 6a', checked: false },
      { id: 'c7', section: 'Methods', item: 'Sample size determination explained', description: 'CONSORT 7a', checked: false },
      { id: 'c8', section: 'Methods', item: 'Randomisation sequence generation described', description: 'CONSORT 8a', checked: false },
      { id: 'c9', section: 'Methods', item: 'Allocation concealment mechanism described', description: 'CONSORT 9', checked: false },
      { id: 'c10', section: 'Methods', item: 'Blinding described (who was blinded)', description: 'CONSORT 11a', checked: false },
      { id: 'c11', section: 'Results', item: 'CONSORT flow diagram included', description: 'CONSORT 13a', checked: false },
      { id: 'c12', section: 'Results', item: 'Baseline demographic table', description: 'CONSORT 15', checked: false },
      { id: 'c13', section: 'Results', item: 'Primary outcome with effect size and CI', description: 'CONSORT 17a', checked: false },
      { id: 'c14', section: 'Results', item: 'Harms/adverse events reported', description: 'CONSORT 19', checked: false },
      { id: 'c15', section: 'Other', item: 'Trial registration number and registry name', description: 'CONSORT 23', checked: false },
    ],
    searchFilters: ['randomized controlled trial[pt]', 'clinical trial[pt]'],
  },

  // ─── Non-Randomized Controlled Trial (nRCT) ───────────────────
  {
    id: 'nrct',
    name: 'Non-Randomized Controlled Trial',
    shortName: 'nRCT',
    guideline: 'TREND 2004',
    guidelineUrl: 'https://www.cdc.gov/trendstatement/',
    description: 'Intervention study without random allocation. Uses TREND guidelines for transparent reporting.',
    sections: [
      {
        id: 'title', name: 'Title', required: true,
        description: 'Identify study design in the title',
        tips: ['Indicate non-randomized design clearly', 'Include intervention and population'],
      },
      {
        id: 'abstract', name: 'Structured Abstract', required: true,
        description: 'Structured summary including design, methods, results',
        subsections: ['Background', 'Objectives', 'Design', 'Setting', 'Participants', 'Intervention', 'Main outcome measures', 'Results', 'Conclusions'],
        tips: ['Clearly state non-randomized design', 'Report primary outcome with effect estimate'],
      },
      {
        id: 'introduction', name: 'Introduction', required: true,
        description: 'Background, rationale for non-randomized design, objectives',
        subsections: ['Scientific background', 'Rationale for non-randomized design', 'Objectives'],
        tips: ['Justify why randomization was not used', 'State theoretical framework'],
      },
      {
        id: 'methods', name: 'Methods', required: true,
        description: 'Design, participants, intervention, outcomes, allocation method',
        subsections: [
          'Study design', 'Participants and eligibility', 'Setting',
          'Intervention and comparison', 'Allocation method',
          'Outcomes', 'Sample size', 'Statistical methods',
          'Methods to address confounding'
        ],
        tips: [
          'Describe how groups were assigned',
          'Detail methods to control confounding (matching, regression, propensity scores)',
          'Describe any blinding used',
          'Pre-specify primary analysis'
        ],
      },
      {
        id: 'results', name: 'Results', required: true,
        description: 'Flow, baseline characteristics, outcomes, sensitivity analyses',
        subsections: ['Participant flow', 'Baseline characteristics', 'Outcomes', 'Sensitivity analyses'],
        tips: ['Include flow diagram', 'Compare groups at baseline', 'Report adjusted and unadjusted results'],
      },
      {
        id: 'discussion', name: 'Discussion', required: true,
        description: 'Interpretation, limitations related to non-randomization, generalizability',
        subsections: ['Key findings', 'Limitations (especially confounding)', 'Generalizability', 'Implications'],
        tips: ['Explicitly discuss residual confounding', 'Compare with RCT evidence if available'],
      },
    ],
    checklist: [
      { id: 'n1', section: 'Title', item: 'Study design identified in title', description: 'TREND 1', checked: false },
      { id: 'n2', section: 'Methods', item: 'Allocation method described', description: 'TREND 6', checked: false },
      { id: 'n3', section: 'Methods', item: 'Methods to address confounding specified', description: 'TREND 8', checked: false },
      { id: 'n4', section: 'Results', item: 'Baseline equivalence of groups assessed', description: 'TREND 12', checked: false },
      { id: 'n5', section: 'Results', item: 'Adjusted analyses reported', description: 'TREND 16', checked: false },
    ],
    searchFilters: ['controlled clinical trial[pt]', 'non-randomized[tiab]'],
  },

  // ─── Systematic Review ─────────────────────────────────────────
  {
    id: 'systematic-review',
    name: 'Systematic Review',
    shortName: 'SR',
    guideline: 'PRISMA 2020',
    guidelineUrl: 'http://www.prisma-statement.org/',
    description: 'Systematic identification, appraisal, and synthesis of all relevant studies on a specific question.',
    sections: [
      {
        id: 'title', name: 'Title', required: true,
        description: 'Identify as a systematic review',
        tips: ['Include "systematic review" in title', 'Consider: "A systematic review of [intervention] for [condition]"'],
      },
      {
        id: 'abstract', name: 'Structured Abstract', required: true,
        description: 'Structured abstract following PRISMA for Abstracts',
        subsections: ['Background', 'Objectives', 'Data sources', 'Study selection', 'Data extraction', 'Results', 'Limitations', 'Conclusions', 'Registration'],
        tips: ['Include number of studies and participants', 'State main finding with quantitative data if possible'],
      },
      {
        id: 'introduction', name: 'Introduction', required: true,
        description: 'Rationale and objectives with explicit review question',
        subsections: ['Rationale', 'Objectives'],
        tips: ['Use PICO/PECO to frame the question', 'Reference existing reviews and gaps'],
      },
      {
        id: 'methods', name: 'Methods', required: true,
        description: 'Protocol, eligibility, search strategy, selection, data extraction, quality assessment, synthesis',
        subsections: [
          'Protocol and registration', 'Eligibility criteria (PICO)',
          'Information sources', 'Search strategy (full electronic search)',
          'Selection process', 'Data collection process',
          'Data items', 'Risk of bias assessment',
          'Effect measures', 'Synthesis methods',
          'Certainty assessment (GRADE)'
        ],
        tips: [
          'Register protocol on PROSPERO before starting',
          'Search at least 2 databases (e.g., PubMed, CENTRAL)',
          'Include full search strategy for at least one database',
          'Use validated risk of bias tool (RoB 2, ROBINS-I, Newcastle-Ottawa)',
          'Describe synthesis approach (narrative, meta-analysis)',
          'Plan sensitivity and subgroup analyses a priori'
        ],
      },
      {
        id: 'results', name: 'Results', required: true,
        description: 'Study selection, characteristics, risk of bias, synthesis results',
        subsections: [
          'Study selection (PRISMA flow diagram)',
          'Study characteristics',
          'Risk of bias within studies',
          'Results of individual studies',
          'Results of syntheses',
          'Risk of bias across studies (publication bias)',
          'Certainty of evidence'
        ],
        tips: [
          'Include PRISMA 2020 flow diagram',
          'Present characteristics of all included studies (table)',
          'Show forest plots for meta-analyses',
          'Report I-squared and heterogeneity',
          'Use GRADE Summary of Findings table'
        ],
      },
      {
        id: 'discussion', name: 'Discussion', required: true,
        description: 'Summary, limitations, interpretation, implications',
        subsections: ['Summary of evidence', 'Limitations', 'Implications for practice', 'Implications for research'],
        tips: ['Discuss quality of evidence using GRADE language', 'Address limitations at study and review level'],
      },
    ],
    checklist: [
      { id: 'sr1', section: 'Title', item: 'Identified as systematic review in title', description: 'PRISMA 1', checked: false },
      { id: 'sr2', section: 'Methods', item: 'Protocol registered (e.g., PROSPERO)', description: 'PRISMA 5', checked: false },
      { id: 'sr3', section: 'Methods', item: 'PICO eligibility criteria specified', description: 'PRISMA 6', checked: false },
      { id: 'sr4', section: 'Methods', item: 'Full search strategy for at least one database', description: 'PRISMA 8', checked: false },
      { id: 'sr5', section: 'Methods', item: 'Risk of bias assessment tool specified', description: 'PRISMA 11', checked: false },
      { id: 'sr6', section: 'Results', item: 'PRISMA flow diagram included', description: 'PRISMA 16', checked: false },
      { id: 'sr7', section: 'Results', item: 'Study characteristics table', description: 'PRISMA 18', checked: false },
      { id: 'sr8', section: 'Results', item: 'Risk of bias results reported', description: 'PRISMA 19', checked: false },
      { id: 'sr9', section: 'Results', item: 'Certainty of evidence assessed (GRADE)', description: 'PRISMA 22', checked: false },
    ],
    searchFilters: ['systematic review[pt]', 'systematic review[tiab]'],
  },

  // ─── Meta-Analysis ─────────────────────────────────────────────
  {
    id: 'meta-analysis',
    name: 'Meta-Analysis',
    shortName: 'MA',
    guideline: 'PRISMA 2020 + MOOSE',
    guidelineUrl: 'http://www.prisma-statement.org/',
    description: 'Statistical combination of results from multiple studies. Builds on systematic review with quantitative synthesis.',
    sections: [
      {
        id: 'title', name: 'Title', required: true,
        description: 'Identify as meta-analysis (and systematic review)',
        tips: ['Include "systematic review and meta-analysis" in title'],
      },
      {
        id: 'abstract', name: 'Structured Abstract', required: true,
        description: 'Include pooled estimates, heterogeneity, and number of studies',
        subsections: ['Background', 'Methods', 'Results (with pooled estimates)', 'Conclusions'],
        tips: ['Report pooled effect with CI', 'State heterogeneity (I-squared)', 'Report number of studies and total participants'],
      },
      {
        id: 'introduction', name: 'Introduction', required: true,
        description: 'Rationale for quantitative synthesis',
        subsections: ['Background', 'Rationale for meta-analysis', 'Objectives'],
        tips: ['Justify why meta-analysis is appropriate', 'State pre-specified hypothesis about heterogeneity'],
      },
      {
        id: 'methods', name: 'Methods', required: true,
        description: 'Full systematic review methods plus statistical synthesis plan',
        subsections: [
          'Systematic review methods (as per PRISMA)',
          'Effect measures (OR, RR, MD, SMD)',
          'Statistical model (fixed vs random effects)',
          'Heterogeneity assessment (I-squared, Q-test, tau-squared)',
          'Subgroup analyses',
          'Sensitivity analyses',
          'Publication bias assessment (funnel plot, Egger test)',
          'Software used'
        ],
        tips: [
          'Pre-specify random or fixed effects model with justification',
          'Plan subgroup and sensitivity analyses a priori',
          'Specify effect measure (OR, RR, HR, MD, SMD)',
          'Describe method for handling missing data',
          'Name statistical software (RevMan, R meta, Stata)'
        ],
      },
      {
        id: 'results', name: 'Results', required: true,
        description: 'Forest plots, pooled estimates, heterogeneity, publication bias',
        subsections: [
          'Study selection and characteristics',
          'Forest plot(s) for primary outcome',
          'Pooled effect estimates with CI',
          'Heterogeneity (I-squared, prediction interval)',
          'Subgroup analyses',
          'Sensitivity analyses',
          'Publication bias (funnel plot)',
          'GRADE assessment'
        ],
        tips: [
          'Forest plot is mandatory for each meta-analysis',
          'Report I-squared with interpretation',
          'Include funnel plot if >= 10 studies',
          'Report prediction interval alongside CI',
          'Trial Sequential Analysis if applicable'
        ],
      },
      {
        id: 'discussion', name: 'Discussion', required: true,
        description: 'Interpretation of pooled results, heterogeneity, certainty',
        subsections: ['Summary of findings', 'Heterogeneity explanation', 'Certainty of evidence', 'Limitations', 'Implications'],
        tips: ['Interpret I-squared in clinical context', 'Use GRADE language for certainty', 'Discuss potential sources of heterogeneity'],
      },
    ],
    checklist: [
      { id: 'ma1', section: 'Title', item: 'Identified as systematic review and meta-analysis', description: 'PRISMA 1', checked: false },
      { id: 'ma2', section: 'Methods', item: 'Effect measure specified (OR/RR/MD/SMD)', description: 'PRISMA 12', checked: false },
      { id: 'ma3', section: 'Methods', item: 'Statistical model justified (fixed/random)', description: 'PRISMA 13d', checked: false },
      { id: 'ma4', section: 'Methods', item: 'Heterogeneity assessment methods described', description: 'PRISMA 13e', checked: false },
      { id: 'ma5', section: 'Methods', item: 'Publication bias assessment planned', description: 'PRISMA 13f', checked: false },
      { id: 'ma6', section: 'Results', item: 'Forest plot included', description: 'PRISMA 20', checked: false },
      { id: 'ma7', section: 'Results', item: 'I-squared and heterogeneity reported', description: 'PRISMA 21', checked: false },
      { id: 'ma8', section: 'Results', item: 'Funnel plot if >= 10 studies', description: 'PRISMA 22', checked: false },
    ],
    searchFilters: ['meta-analysis[pt]', 'meta-analysis[tiab]'],
  },

  // ─── Scoping Review ────────────────────────────────────────────
  {
    id: 'scoping-review',
    name: 'Scoping Review',
    shortName: 'ScR',
    guideline: 'PRISMA-ScR 2018',
    guidelineUrl: 'http://www.prisma-statement.org/Extensions/ScopingReviews',
    description: 'Maps the existing evidence on a topic to identify key concepts, gaps, and types of evidence. Broader than systematic review.',
    sections: [
      {
        id: 'title', name: 'Title', required: true,
        description: 'Identify as a scoping review',
        tips: ['Include "scoping review" in title'],
      },
      {
        id: 'abstract', name: 'Structured Abstract', required: true,
        description: 'Summary of the scoping review',
        subsections: ['Objectives', 'Design', 'Data sources', 'Eligibility criteria', 'Results', 'Conclusions'],
        tips: ['State the broad question being addressed', 'Describe the scope of evidence found'],
      },
      {
        id: 'introduction', name: 'Introduction', required: true,
        description: 'Rationale for scoping approach, broad objectives',
        subsections: ['Rationale', 'Objectives', 'Research questions'],
        tips: ['Justify scoping vs systematic review', 'Use PCC (Population, Concept, Context) framework'],
      },
      {
        id: 'methods', name: 'Methods', required: true,
        description: 'Protocol, eligibility, sources, search, selection, charting',
        subsections: [
          'Protocol and registration',
          'Eligibility criteria (PCC)',
          'Information sources',
          'Search strategy',
          'Selection of sources',
          'Data charting process',
          'Data items',
          'Synthesis of results'
        ],
        tips: [
          'Use JBI (Joanna Briggs Institute) methodology',
          'Register protocol on OSF or PROSPERO',
          'Include grey literature if relevant',
          'Data charting = data extraction in scoping reviews',
          'Quality assessment is optional but recommended'
        ],
      },
      {
        id: 'results', name: 'Results', required: true,
        description: 'Selection, characteristics, charted data, synthesis',
        subsections: [
          'Selection of sources (PRISMA-ScR flow diagram)',
          'Characteristics of sources',
          'Results of charting',
          'Mapping of evidence'
        ],
        tips: [
          'Include PRISMA-ScR flow diagram',
          'Present evidence map (tables, charts)',
          'Descriptive numerical summary of studies',
          'Thematic analysis of results'
        ],
      },
      {
        id: 'discussion', name: 'Discussion', required: true,
        description: 'Summary of evidence, gaps identified, implications',
        subsections: ['Summary', 'Gaps in evidence', 'Limitations', 'Implications for future research'],
        tips: ['Focus on identifying gaps and future directions', 'Do not make clinical recommendations (mapping, not judging)'],
      },
    ],
    checklist: [
      { id: 'sc1', section: 'Title', item: 'Identified as scoping review', description: 'PRISMA-ScR 1', checked: false },
      { id: 'sc2', section: 'Methods', item: 'PCC eligibility criteria', description: 'PRISMA-ScR 6', checked: false },
      { id: 'sc3', section: 'Methods', item: 'Full search strategy provided', description: 'PRISMA-ScR 8', checked: false },
      { id: 'sc4', section: 'Results', item: 'PRISMA-ScR flow diagram', description: 'PRISMA-ScR 14', checked: false },
      { id: 'sc5', section: 'Results', item: 'Evidence map presented', description: 'PRISMA-ScR 17', checked: false },
    ],
    searchFilters: ['scoping review[tiab]'],
  },

  // ─── Narrative Review ──────────────────────────────────────────
  {
    id: 'narrative-review',
    name: 'Narrative Review',
    shortName: 'NR',
    guideline: 'SANRA Scale',
    guidelineUrl: 'https://doi.org/10.1186/s12874-020-00972-7',
    description: 'Comprehensive summary and interpretation of the literature on a topic. Less structured than systematic review but provides expert synthesis.',
    sections: [
      {
        id: 'title', name: 'Title', required: true,
        description: 'Clear, descriptive title indicating a review',
        tips: ['Include "review", "narrative review", or "overview"', 'Specify the topic clearly'],
      },
      {
        id: 'abstract', name: 'Abstract', required: true,
        description: 'Summary of the review scope and key findings',
        subsections: ['Purpose', 'Recent findings', 'Summary'],
        tips: ['State the purpose and scope', 'Highlight key recent advances or controversies'],
      },
      {
        id: 'introduction', name: 'Introduction', required: true,
        description: 'Importance of the topic, scope of the review',
        subsections: ['Importance/relevance', 'Scope', 'Aim of the review'],
        tips: ['Clearly state what the review covers and why', 'Acknowledge this is a narrative (not systematic) review'],
      },
      {
        id: 'methods', name: 'Literature Search Description', required: true,
        description: 'Describe how literature was identified (even if not systematic)',
        subsections: ['Databases searched', 'Time period', 'Key search terms', 'Selection approach'],
        tips: [
          'Even for narrative reviews, describe your search strategy',
          'State databases and time period covered',
          'This increases transparency and reproducibility',
          'SANRA scale rewards this section'
        ],
      },
      {
        id: 'body', name: 'Main Body (Thematic Sections)', required: true,
        description: 'Organized thematic discussion of the evidence',
        subsections: ['Organized by themes/subtopics', 'Current evidence', 'Controversies', 'Recent developments'],
        tips: [
          'Organize logically by theme, not just chronologically',
          'Present balanced view including contradictory evidence',
          'Support all claims with citations',
          'Distinguish between strong and weak evidence'
        ],
      },
      {
        id: 'discussion', name: 'Discussion/Conclusions', required: true,
        description: 'Synthesis, expert interpretation, future directions',
        subsections: ['Synthesis of key points', 'Clinical implications', 'Research gaps', 'Future directions'],
        tips: ['Provide your expert synthesis', 'Identify unanswered questions', 'Suggest future research priorities'],
      },
    ],
    checklist: [
      { id: 'nr1', section: 'General', item: 'Justification of the article\'s importance', description: 'SANRA 1', checked: false },
      { id: 'nr2', section: 'General', item: 'Statement of concrete aims or questions', description: 'SANRA 2', checked: false },
      { id: 'nr3', section: 'Methods', item: 'Description of literature search', description: 'SANRA 3', checked: false },
      { id: 'nr4', section: 'Body', item: 'Appropriate referencing (evidence-based)', description: 'SANRA 4', checked: false },
      { id: 'nr5', section: 'Body', item: 'Scientific reasoning in the review', description: 'SANRA 5', checked: false },
      { id: 'nr6', section: 'Body', item: 'Appropriate presentation of data', description: 'SANRA 6', checked: false },
    ],
    searchFilters: ['review[pt]'],
  },

  // ─── Cohort Study ──────────────────────────────────────────────
  {
    id: 'cohort',
    name: 'Cohort Study',
    shortName: 'Cohort',
    guideline: 'STROBE 2007',
    guidelineUrl: 'https://www.strobe-statement.org/',
    description: 'Observational study following a group over time to assess exposures and outcomes. Can be prospective or retrospective.',
    sections: [
      {
        id: 'title', name: 'Title and Abstract', required: true,
        description: 'Indicate study design with commonly used term',
        tips: ['Include "cohort study", "prospective", or "retrospective" in title', 'Structured or informative abstract'],
      },
      {
        id: 'introduction', name: 'Introduction', required: true,
        description: 'Background, rationale, and objectives',
        subsections: ['Background/rationale', 'Objectives', 'Hypothesis'],
        tips: ['State specific objectives including pre-specified hypotheses'],
      },
      {
        id: 'methods', name: 'Methods', required: true,
        description: 'Study design, setting, participants, variables, data, bias, study size, statistics',
        subsections: [
          'Study design (prospective/retrospective)',
          'Setting (time period, locations)',
          'Participants (eligibility, sources, follow-up)',
          'Variables (exposures, outcomes, confounders)',
          'Data sources/measurement',
          'Bias (efforts to address)',
          'Study size',
          'Quantitative variables',
          'Statistical methods (confounding strategies)'
        ],
        tips: [
          'Clearly state prospective vs retrospective',
          'Describe cohort assembly and follow-up',
          'Define all exposures, outcomes, confounders',
          'Describe how loss to follow-up was handled',
          'Describe methods to handle confounding (multivariable regression, propensity scores)',
          'State sensitivity analyses planned'
        ],
      },
      {
        id: 'results', name: 'Results', required: true,
        description: 'Participants, descriptive data, outcome data, main results, other analyses',
        subsections: [
          'Participant numbers at each stage (flow diagram)',
          'Descriptive data (demographics, exposures)',
          'Outcome data (number of events, follow-up time)',
          'Main results (unadjusted and adjusted)',
          'Other analyses (subgroup, sensitivity)'
        ],
        tips: [
          'Report numbers at each stage of study',
          'Give characteristics of study population',
          'Report both unadjusted and adjusted estimates',
          'Report absolute risk alongside relative risk',
          'Give precision (95% CI)'
        ],
      },
      {
        id: 'discussion', name: 'Discussion', required: true,
        description: 'Key results, limitations, interpretation, generalisability',
        subsections: ['Key results', 'Limitations (bias, confounding)', 'Interpretation', 'Generalisability'],
        tips: [
          'Discuss potential for selection bias, information bias, confounding',
          'Discuss direction and magnitude of potential bias',
          'Compare with other studies'
        ],
      },
    ],
    checklist: [
      { id: 'co1', section: 'Title', item: 'Study design indicated in title/abstract', description: 'STROBE 1', checked: false },
      { id: 'co2', section: 'Methods', item: 'Eligibility criteria and sources described', description: 'STROBE 6', checked: false },
      { id: 'co3', section: 'Methods', item: 'Outcomes, exposures, confounders defined', description: 'STROBE 7', checked: false },
      { id: 'co4', section: 'Methods', item: 'Statistical methods for confounding described', description: 'STROBE 12', checked: false },
      { id: 'co5', section: 'Results', item: 'Flow of participants reported', description: 'STROBE 13', checked: false },
      { id: 'co6', section: 'Results', item: 'Unadjusted and adjusted estimates reported', description: 'STROBE 16', checked: false },
      { id: 'co7', section: 'Discussion', item: 'Limitations including bias discussed', description: 'STROBE 19', checked: false },
    ],
    searchFilters: ['cohort studies[MeSH Terms]', 'cohort[tiab]'],
  },

  // ─── Case Report ───────────────────────────────────────────────
  {
    id: 'case-report',
    name: 'Case Report',
    shortName: 'CR',
    guideline: 'CARE 2013',
    guidelineUrl: 'https://www.care-statement.org/',
    description: 'Detailed description of an individual patient case with a unique or instructive presentation, diagnosis, or management.',
    sections: [
      {
        id: 'title', name: 'Title', required: true,
        description: 'Identify as a case report with key clinical finding',
        tips: [
          'Include "case report" in title',
          'Highlight the unique or novel aspect',
          'Format: "[Key finding/diagnosis]: A case report"'
        ],
      },
      {
        id: 'abstract', name: 'Abstract', required: true,
        description: 'Brief summary: introduction, case, and conclusion',
        subsections: ['Introduction', 'Case presentation', 'Conclusions'],
        tips: ['200-250 words typically', 'Include keywords for indexing'],
      },
      {
        id: 'introduction', name: 'Introduction', required: true,
        description: 'Brief background on the condition and why this case is reportable',
        subsections: ['Background', 'Rationale for reporting'],
        tips: [
          'Keep brief (1-2 paragraphs)',
          'State what makes this case unique/instructive',
          'Reference relevant literature on the condition'
        ],
      },
      {
        id: 'case-presentation', name: 'Case Presentation', required: true,
        description: 'Detailed chronological case description',
        subsections: [
          'Patient information (demographics, relevant history)',
          'Clinical findings (symptoms, signs)',
          'Timeline (key dates and events)',
          'Diagnostic assessment (investigations, results)',
          'Therapeutic intervention',
          'Follow-up and outcomes',
          'Patient perspective (if available)'
        ],
        tips: [
          'Present chronologically',
          'Include a timeline figure',
          'Report relevant positive AND negative findings',
          'Include relevant images (with consent)',
          'Use diagnostic reasoning transparently',
          'Report what was done AND why',
          'Include patient consent statement'
        ],
      },
      {
        id: 'discussion', name: 'Discussion', required: true,
        description: 'Analysis of the case in context of medical literature',
        subsections: [
          'Key findings from this case',
          'Comparison with literature',
          'Strengths and limitations',
          'Relevant medical literature'
        ],
        tips: [
          'Compare with similar published cases',
          'Discuss pathophysiology',
          'Discuss differential diagnosis',
          'State limitations clearly',
          'What can clinicians learn from this case?'
        ],
      },
      {
        id: 'conclusion', name: 'Conclusion', required: true,
        description: 'Key learning points and take-home message',
        subsections: ['Main lesson', 'Clinical implications'],
        tips: ['Keep brief', 'State the take-home message clearly', 'Avoid over-generalizing from a single case'],
      },
    ],
    checklist: [
      { id: 'cr1', section: 'Title', item: 'Identified as case report with key finding', description: 'CARE 1', checked: false },
      { id: 'cr2', section: 'Case', item: 'Patient demographics and history', description: 'CARE 5a', checked: false },
      { id: 'cr3', section: 'Case', item: 'Clinical findings described', description: 'CARE 5b', checked: false },
      { id: 'cr4', section: 'Case', item: 'Timeline of key events', description: 'CARE 5c', checked: false },
      { id: 'cr5', section: 'Case', item: 'Diagnostic assessment detailed', description: 'CARE 5d', checked: false },
      { id: 'cr6', section: 'Case', item: 'Therapeutic interventions described', description: 'CARE 5e', checked: false },
      { id: 'cr7', section: 'Case', item: 'Follow-up and outcomes reported', description: 'CARE 5f', checked: false },
      { id: 'cr8', section: 'Other', item: 'Patient consent obtained and stated', description: 'CARE 7', checked: false },
    ],
    searchFilters: ['case reports[pt]'],
  },
];

/**
 * Get a template by ID
 */
export function getTemplate(id: string): StudyTemplate | undefined {
  return STUDY_TEMPLATES.find((t) => t.id === id);
}

/**
 * Get all template options for selection
 */
export function getTemplateOptions(): { id: string; name: string; shortName: string; guideline: string }[] {
  return STUDY_TEMPLATES.map((t) => ({
    id: t.id,
    name: t.name,
    shortName: t.shortName,
    guideline: t.guideline,
  }));
}
