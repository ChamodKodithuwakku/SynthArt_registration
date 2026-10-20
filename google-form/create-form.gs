/*************************************************************************
 * SynthArt Synergy 2.0 — Organizing Committee application form
 * -----------------------------------------------------------------------
 * HOW TO USE (2 minutes)
 *   1. Go to https://script.google.com  →  New project
 *   2. Delete the sample code, paste this whole file
 *   3. Pick "createCommitteeForm" in the toolbar and press ▷ Run
 *   4. Approve the permission prompt (it only creates a Google Form)
 *   5. Open View → Logs (or the Execution log) and copy the two links
 *      • EDIT link      → to change questions later
 *      • PUBLISHED link → the one applicants use (paste into main.js)
 * -----------------------------------------------------------------------
 * Design decisions
 *   • Matches the website: the same seven committees and the same
 *     three-tier structure (Chair → management → members).
 *   • Five pages with a progress bar, 26 questions, ~6 minutes.
 *   • Batches are the same three groups used for the 15 core seats
 *     (Orientation / 1Y·1S / 1Y·2S), so seat balance can be checked
 *     straight from the responses sheet.
 *   • Nothing is collected that the committee won't actually use.
 *************************************************************************/

function createCommitteeForm() {
  var COMMITTEES = [
    'Event Coordination & Hospitality',
    'Competition',
    'Media & Compering',
    'Decoration',
    'Gifts & Souvenirs',
    'Game Zone',
    'Exhibition'
  ];

  var LEADERSHIP = [
    'Chairperson',
    'Vice Chairperson',
    'Secretary',
    'Assistant Secretary',
    'Finance Manager',
    'Operations Manager',
    'PR Manager',
    'Marketing & Media Manager'
  ];

  var SKILLS = [
    'Graphic design (Canva / Figma / Illustrator)',
    'Video editing',
    'Photography',
    'Social media management',
    'Compering / public speaking',
    'Event planning & scheduling',
    'Logistics & venue setup',
    'Budgeting & spreadsheets',
    'Illustration & painting',
    'Front-end / web development',
    'Game development',
    '3D / VR / AR',
    'Hardware & electronics',
    'Scriptwriting',
    'Sound & AV',
    'Sponsorship & PR'
  ];

  /* ---------- form shell -------------------------------------------- */
  var form = FormApp.create('SynthArt Synergy 2.0 — Organizing Committee Application');

  form.setDescription(
    'SynthArt Synergy 2.0 — where art meets technology.\n\n' +
    'The Faculty of Computing is assembling the organizing committee for the second edition of ' +
    'SynthArt Synergy at SLIIT Kandy UNI, Pallekele.\n\n' +
    'Fifteen core seats are open across seven working committees. Tell us who you are, which ' +
    'committee you want, and what you would bring to it. This takes about 6 minutes.\n\n' +
    'Applications close 29 October 2026.'
  );
  form.setProgressBar(true);
  form.setCollectEmail(false);
  form.setAllowResponseEdits(true);
  form.setConfirmationMessage(
    'Thank you — your application has been recorded.\n\n' +
    'What happens next:\n' +
    '1. Short screening (about a week)\n' +
    '2. A short 10-minute conversation with the leadership team\n' +
    '3. The committee is announced and onboarding begins\n\n' +
    'You will be contacted on the email and mobile number you gave. ' +
    'Log in with the same account to edit this response before the deadline.'
  );

  /* ---------- helpers ------------------------------------------------ */
  function page(title, help) {
    var p = form.addPageBreakItem().setTitle(title);
    if (help) p.setHelpText(help);
    return p;
  }

  function text(title, help, required, pattern, patternHelp) {
    var item = form.addTextItem().setTitle(title);
    if (help) item.setHelpText(help);
    if (required) item.setRequired(true);
    if (pattern) {
      item.setValidation(
        FormApp.createTextValidation()
          .requireTextMatchesPattern(pattern)
          .setHelpText(patternHelp || 'Please check this answer.')
          .build()
      );
    }
    return item;
  }

  function para(title, help, required) {
    var item = form.addParagraphTextItem().setTitle(title);
    if (help) item.setHelpText(help);
    if (required) item.setRequired(true);
    return item;
  }

  function pick(title, help, options, required) {
    var item = form.addMultipleChoiceItem().setTitle(title);
    if (help) item.setHelpText(help);
    item.setChoiceValues(options);
    if (required) item.setRequired(true);
    return item;
  }

  function list(title, help, options, required) {
    var item = form.addListItem().setTitle(title);
    if (help) item.setHelpText(help);
    item.setChoiceValues(options);
    if (required) item.setRequired(true);
    return item;
  }

  function checks(title, help, options, required) {
    var item = form.addCheckboxItem().setTitle(title);
    if (help) item.setHelpText(help);
    item.setChoiceValues(options);
    if (required) item.setRequired(true);
    return item;
  }

  /* ================================================================ *
   * PAGE 1 — About you
   * ================================================================ */
  form.addSectionHeaderItem()
    .setTitle('About you')
    .setHelpText('Exactly as it appears in the student register — we use these details to contact you.');

  text('Full name', 'First name and last name.', true);

  text(
    'Student registration number',
    'For example IT23141988. This is how we match your application to the student register.',
    true,
    '^[A-Za-z]{2}[0-9]{8}$',
    'Use your SLIIT registration number — two letters and eight digits, e.g. IT23141988'
  );

  text(
    'University email',
    'Use your @my.sliit.lk address if you have one — that is where the shortlist is sent.',
    true,
    '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$',
    'Enter a valid email address.'
  );

  text(
    'Mobile / WhatsApp number',
    'Ten digits, starting with 0. Example 0771234567.',
    true,
    '^0[0-9]{9}$',
    'Enter a 10-digit Sri Lankan mobile number starting with 0.'
  );

  pick('Faculty', null,
    ['Faculty of Computing', 'School of Business'], true);

  list('Degree programme', null, [
    'BSc (Hons) Information Technology',
    'BSc (Hons) Software Engineering',
    'BSc (Hons) Data Science',
    'BSc (Hons) Computer Systems & Network Engineering',
    'BSc (Hons) Information Systems Engineering',
    'BSc (Hons) Cyber Security',
    'Other'
  ], true);

  pick('Academic batch', 'Seats are balanced across the three groups.', [
    'Orientation batch',
    '1st Year — 1st Semester',
    '1st Year — 2nd Semester'
  ], true);

  /* ================================================================ *
   * PAGE 2 — Committee preference
   * ================================================================ */
  page('Your committee', 'Seven committees do the work. Pick where you would like to be placed.');

  list('First choice — primary committee', null, COMMITTEES, true);

  list('Second choice — secondary committee',
    'You are placed in one of the two, so it is not double work.', COMMITTEES, true);

  para('Why this committee?',
    'Around 150 words. What draws you to it, and what would you take responsibility for?', true);

  para('What would you like to build or run, if you had the freedom?',
    'Optional — one idea is enough. A stall, a reel series, a game, a judging rubric, anything.', false);

  /* ================================================================ *
   * PAGE 3 — Skills and experience
   * ================================================================ */
  page('Skills and experience', 'This decides the placement. No experience is a perfectly normal answer.');

  pick('Have you served on a committee before?', null, [
    'No, this would be my first',
    'Yes — school society or event',
    'Yes — university society',
    'Yes — SynthArt Synergy 1.0',
    'Yes — another capacity'
  ], true);

  para('Previous roles or projects', 'Optional. Committee role, event, number of people, what you owned.', false);

  checks('Skills you can bring to the committee',
    'Tick everything that applies — you are not expected to have all of them.', SKILLS, true);

  text('Portfolio or work link', 'Optional. Behance, GitHub, Drive folder, Instagram — anything that shows your work.', false);

  /* ================================================================ *
   * PAGE 4 — Commitment and leadership
   * ================================================================ */
  page('Commitment', 'Be realistic here — it is how we plan the workload.');

  pick('Hours per week you can realistically give', null, [
    '2 – 4 hours',
    '5 – 8 hours',
    '9 – 12 hours',
    '13+ hours'
  ], true);

  pick('Can you attend a weekly committee meeting?', 'Usually one evening a week, on campus or online.', [
    'Yes, consistently',
    'Most weeks',
    'Only occasionally'
  ], true);

  pick('Are you available on 27 and 28 June 2027?', 'These are the event days — every committee member is on the floor.', [
    'Yes, both days',
    'One of the two days',
    'Not sure yet',
    'No'
  ], true);

  para('Any exams or commitments we should plan around?', 'Optional.', false);

  form.addSectionHeaderItem()
    .setTitle('Leadership (optional)')
    .setHelpText('Skip this block if you would rather join as a committee member.');

  pick('Would you like to be considered for a management role?', null, [
    'No — happy as a committee member',
    'Yes — I would like to be considered'
  ], true);

  checks('Which role(s)?', 'Tick any that interest you.', LEADERSHIP, false);

  para('Relevant leadership experience', 'Optional — what you ran, how large, what the outcome was.', false);

  /* ================================================================ *
   * PAGE 5 — Final
   * ================================================================ */
  page('Almost done');

  list('How did you hear about SynthArt 2.0?', null, [
    'Instagram / Facebook',
    'WhatsApp group',
    'Friend or word of mouth',
    'Lecture announcement',
    'Faculty notice board',
    'Email',
    'Other'
  ], true);

  para('Anything else we should know?', 'Optional.', false);

  checks('Declaration',
    'Please read before submitting.',
    ['I confirm the details above are accurate, and if selected I will serve on the committee and attend the weekly meetings.'],
    true);

  /* ---------- output ------------------------------------------------ */
  var editUrl = form.getEditUrl();
  var liveUrl = form.getPublishedUrl();

  Logger.log('EDIT LINK (for you):        ' + editUrl);
  Logger.log('PUBLISHED LINK (applicants): ' + liveUrl);
  Logger.log('Form ID: ' + form.getId());
  Logger.log('');
  Logger.log('Next: open main.js, set CONFIG.formUrl to the published link above.');

  return { edit: editUrl, live: liveUrl, id: form.getId() };
}

/**
 * Optional: link the responses to a spreadsheet so the committee can review
 * applications in a table instead of one by one.
 * Run once, after createCommitteeForm().
 */
function linkResponsesToSheet() {
  var form = FormApp.getActiveForm();
  if (!form) {
    Logger.log('Open this script from the form (Extensions → Apps Script) to use this helper.');
    return;
  }
  var sheet = SpreadsheetApp.create('SynthArt 2.0 — Committee applications (responses)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
  Logger.log('Responses sheet: ' + sheet.getUrl());
}
