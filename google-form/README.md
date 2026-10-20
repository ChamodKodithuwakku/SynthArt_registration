# SynthArt 2.0 — committee application form

The form is built by a small Google Apps Script, because a Google Form cannot be
created from outside your own Google account. One run produces the finished form —
25 questions, five pages, validation, a progress bar and a confirmation message.

---

## 1. Build it (about 2 minutes)

1. Open **https://script.google.com** → **New project**.
2. Delete the sample `myFunction` code and paste all of
   [`create-form.gs`](create-form.gs).
3. In the toolbar dropdown pick **`createCommitteeForm`**, press **▷ Run**.
4. Google asks for permission — choose your account, **Advanced → Go to project
   (unsafe) → Allow**. The script only creates a form; it cannot read your Drive.
5. Open **View → Logs** (or the Execution log at the bottom). You will see:

```
EDIT LINK (for you):        https://docs.google.com/forms/d/…/edit
PUBLISHED LINK (applicants): https://docs.google.com/forms/d/e/…/viewform
```

Keep the **edit** link to change wording later. The **published** link is the one
you hand out.

> Running the script twice creates two forms. Delete the one you do not want from
> Google Drive.

---

## 2. Connect it to the website

Open [`../main.js`](../main.js) and paste the published link:

```js
const CONFIG = {
  formUrl: 'https://docs.google.com/forms/d/e/…/viewform',
  embedForm: false,
  ...
};
```

Every **Register** button on the site now opens the form, and the status pill under
the registration panel flips from *Not connected* to *Open*. Set `embedForm: true`
to show the form inside the page instead of a new tab.

---

## 3. Collect answers in a spreadsheet

Run **`linkResponsesToSheet`** (the second function) once. It creates
*SynthArt 2.0 — Committee applications (responses)* and wires the form to it, so the
committee reviews a sortable table instead of clicking through responses.

A practical review layout — add these columns to the sheet:

| Column | Use |
|---|---|
| `Score` (1–5) | each reviewer scores independently |
| `Primary fit` | yes / maybe / no against the committee they asked for |
| `Status` | shortlisted · hold · declined |
| `Interview slot` | date and time |

Filter by **Academic batch** to check the seat split (five orientation, five 1Y·1S,
five 1Y·2S) and by **First choice** to see demand per committee.

---

## 4. What the form asks

Five pages, 25 questions, ~6 minutes. Required fields marked ★.

### Page 1 — About you
| # | Question | Type |
|---|---|---|
| 1 | Full name ★ | short text |
| 2 | Student registration number ★ | text, pattern `^[A-Za-z]{2}[0-9]{8}$` |
| 3 | University email ★ | text, email pattern |
| 4 | Mobile / WhatsApp ★ | text, `^0[0-9]{9}$` |
| 5 | Faculty ★ | Faculty of Computing / School of Business |
| 6 | Degree programme ★ | list of six SLIIT programmes + Other |
| 7 | Academic batch ★ | Orientation / 1Y·1S / 1Y·2S |

### Page 2 — Your committee
| # | Question | Type |
|---|---|---|
| 8 | First choice — primary committee ★ | list of the seven committees |
| 9 | Second choice — secondary committee ★ | same list |
| 10 | Why this committee? ★ | paragraph, ~150 words |
| 11 | What would you like to build or run? | paragraph, optional |

*The seven: Event Coordination & Hospitality · Competition · Media & Compering ·
Decoration · Gifts & Souvenirs · Game Zone · Exhibition.*

### Page 3 — Skills and experience
| # | Question | Type |
|---|---|---|
| 12 | Served on a committee before? ★ | first time / school / university / 1.0 / other |
| 13 | Previous roles or projects | paragraph, optional |
| 14 | Skills you can bring ★ | 16 checkboxes (design, video, photography, social, compering, planning, logistics, budgeting, illustration, web, game dev, 3D/VR, hardware, scriptwriting, sound, sponsorship) |
| 15 | Portfolio or work link | text, optional |

### Page 4 — Commitment and leadership
| # | Question | Type |
|---|---|---|
| 16 | Hours per week ★ | 2–4 / 5–8 / 9–12 / 13+ |
| 17 | Weekly meeting attendance ★ | consistently / most weeks / occasionally |
| 18 | Available 27–28 June 2027 ★ | both / one day / not sure / no |
| 19 | Exams or commitments to plan around | paragraph, optional |
| 20 | Considered for a management role? ★ | no / yes |
| 21 | Which role(s)? | 8 checkboxes — chair, vice chair, secretary, asst. secretary, finance, operations, PR, marketing & media |
| 22 | Relevant leadership experience | paragraph, optional |

### Page 5 — Almost done
| # | Question | Type |
|---|---|---|
| 23 | How did you hear about 2.0? ★ | instagram/facebook · whatsapp · friend · lecture · notice board · email · other |
| 24 | Anything else we should know? | paragraph, optional |
| 25 | Declaration ★ | single checkbox — details accurate, will serve and attend |

---

## 5. After it is built

- **Theme** — Forms → palette icon → pick a colour that matches the site
  (`#EC9642` reads well on the navy).
- **Deadline** — turn off responses on 29 October 2026 (Responses tab → toggle), or
  add a closing date via the form settings.
- **Short link** — Send → Link tab → tick *Shorten URL* for a `forms.gle` link that
  is easier to put on a poster.
- **Manual build** — if you would rather build it by hand, the tables in section 4
  are the complete blueprint; the Apps Script only automates exactly this.
