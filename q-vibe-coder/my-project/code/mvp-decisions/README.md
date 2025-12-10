# MVP Decision Tracking

This directory contains comprehensive decision logs for PeerLoop MVP feature decisions.

**Purpose:** Track every feature decision with full rationale to avoid wasting money on wrong features.

---

## How This Works

### Creating Decision Logs

**Use Q-DECIDE command:**
```
User: Q-DECIDE
Claude: What feature are you evaluating?
User: [Feature description]
Claude: [Walks through framework, creates decision log]
```

**Manual creation (if needed):**
See template below and create file: `YYYY-MM-DD-[feature-name].md`

---

## Decision Log Format

Each decision log should include:

1. **Feature Description** - What is this feature?
2. **Hypothesis Validation** - Which of 6 hypotheses does it test?
3. **Genesis Cohort Critical Check** - Do first 30 students need it?
4. **Manual Alternative Check** - Can Brian do this manually?
5. **Budget Impact** - Estimated cost, fits Phase 1 budget?
6. **Decision** - MUST HAVE / NICE TO HAVE / OUT OF SCOPE
7. **Rationale** - Why this decision? (2-3 sentences)
8. **Date & Decision Maker** - When decided, who decided
9. **Open Questions** - Any remaining uncertainties

---

## File Naming Convention

**Format:** `YYYY-MM-DD-[feature-name].md`

**Examples:**
- `2025-11-25-stripe-payment-integration.md`
- `2025-11-26-progress-tracking-dashboard.md`
- `2025-11-27-automated-scheduling.md`

**Why this format:**
- Sortable by date (chronological order)
- Clear feature identification
- Easy to find specific decisions

---

## Decision Categories

### MUST HAVE ✅
Features that MUST be in MVP to validate core hypotheses.

**Criteria:**
- ✅ Validates core hypothesis (direct test)
- ✅ Critical for Genesis cohort enrollment/payment
- ✅ No manual workaround (must be built)
- ✅ Fits budget & timeline ($75K, 4 months)

**When you decide MUST HAVE:**
1. Q-DECIDE creates decision log here
2. Q-DECIDE also creates feature spec in `features/must-have/`
3. Feature tracked in both locations

### NICE TO HAVE ⚠️
Features that improve experience but have workarounds.

**Criteria:**
- ⚠️ Improves experience (not critical)
- ⚠️ Brian can handle manually (for 30 students)
- ⚠️ Indirect hypothesis validation
- ⚠️ Optimization for better results

**When you decide NICE TO HAVE:**
1. Decision log created here
2. Feature spec in `features/nice-to-have/`
3. Reviewed during Q-PRIORITIZE (include if budget/time allows)

### OUT OF SCOPE ❌
Features deferred to Phase 2 or later.

**Criteria:**
- ❌ Scale optimization (not needed for 30 students)
- ❌ No hypothesis validation
- ❌ Future business model needs
- ❌ Beyond budget/timeline

**When you decide OUT OF SCOPE:**
1. Decision log created here (with rationale for deferral)
2. Feature spec in `features/out-of-scope/`
3. Revisit after MVP validation (Phase 2)

---

## Decision Template

```markdown
# Decision Log: [Feature Name]

**Date:** YYYY-MM-DD
**Decision Maker:** Brian
**Status:** [MUST HAVE / NICE TO HAVE / OUT OF SCOPE]

---

## Feature Description

[1-2 sentence description of what this feature does]

---

## Decision Framework Analysis

### 1. Hypothesis Validation Check

**Which hypotheses does this validate?**
- [ ] Hypothesis #1: Market Positioning
- [ ] Hypothesis #2: Completion Rates
- [ ] Hypothesis #3: Customer Segmentation
- [ ] Hypothesis #4: Conversion to Teaching
- [ ] Hypothesis #5: Peer Teaching Quality
- [ ] Hypothesis #6: Flywheel Validation

**Primary hypothesis:** #[X]
**Validation type:** [Direct / Indirect / None]

### 2. Genesis Cohort Critical Check

**Is this critical for first 30 students?**
- [ ] Critical for enrollment
- [ ] Critical for payment
- [ ] Required to test model
- [ ] Students would lose trust without it
- [ ] Nice to have but not critical
- [ ] Not needed for Genesis cohort

**Assessment:** [Explanation]

### 3. Manual Alternative Check

**Can Brian do this manually for 30 students?**
- [ ] Yes - Manual workaround exists: [describe]
- [ ] Difficult but possible: [describe challenges]
- [ ] No - Must be automated

**Manual workaround:** [Description if applicable]

### 4. Budget Impact Check

**Estimated development cost:** $[X]
**Fits Phase 1 budget ($15-25K):** [Yes / No / Depends]
**Alternative cheaper option:** [If exists]

### 5. Timeline Impact Check

**Estimated time to build:** [X] weeks
**Fraser confidence level:** [High / Medium / Low / Not yet reviewed]
**Timeline risk:** [Low / Medium / High]

---

## Decision

**DECISION:** [MUST HAVE / NICE TO HAVE / OUT OF SCOPE]

**Rationale:**
[2-3 sentences explaining why this decision was made, considering hypothesis validation, Genesis cohort needs, manual alternatives, and constraints]

---

## Open Questions

- [ ] Question 1
- [ ] Question 2

---

## Next Steps

- [ ] [Action item 1]
- [ ] [Action item 2]

---

## Related Documents

- Feature Spec: `features/[priority]/[feature-name].md`
- Meeting Notes: [If discussed with Fraser/Guy/Gabriel]
- Session Notes: [If decision made in Q-session]

---

**Last Updated:** YYYY-MM-DD
```

---

## Using Decision Logs

### During Decision-Making (Now → Dec 6)

**As you evaluate features:**
1. Run Q-DECIDE for each feature
2. Decision logs accumulate here
3. Track count: aim for clear MUST HAVE list by Dec 6

**Review decisions:**
- Read recent logs to stay consistent
- Look for patterns in what's MUST vs NICE vs OUT
- Share relevant logs with Fraser/Guy/Gabriel

### Before Fraser Meeting

**Prepare materials:**
1. Gather MUST HAVE decision logs
2. Gather NICE TO HAVE logs you want feasibility feedback on
3. Use Q-MEETING-PREP to organize

### After MVP Validation (Phase 2+)

**Revisit OUT OF SCOPE:**
- Review decision logs for deferred features
- Decide which to promote to Phase 2 based on learnings
- Update decision logs with new information

---

## Tracking Progress

### Quick Status Check

**Count decision logs:**
```bash
# Count MUST HAVE decisions
ls -1 | wc -l

# Or manually count files in this directory
```

**Review distribution:**
- How many MUST HAVE? (Should be 10-20 for MVP)
- How many NICE TO HAVE? (Candidates for inclusion)
- How many OUT OF SCOPE? (Good - shows discipline!)

### Decision Velocity

**Target pace to hit Dec 6 deadline:**
- Week 1 (Nov 25-29): 5-10 decision logs
- Week 2 (Dec 2-6): Remaining decisions + prioritization

**Use Q-STATUS to track progress toward deadline.**

---

## Quality Checks

**Good decision log checklist:**
- [ ] Clear feature description
- [ ] Hypothesis validation explained (not just checked)
- [ ] Genesis cohort need articulated
- [ ] Manual alternative considered
- [ ] Budget impact estimated
- [ ] Clear rationale (not just "seems good")
- [ ] Next steps identified

**Red flags:**
- ⚠️ No hypothesis validation → Why is this in MVP?
- ⚠️ "Might need this later" reasoning → That's Phase 2
- ⚠️ No manual alternative considered → Did we apply Polished Concierge test?
- ⚠️ No cost estimate → Can't do budget analysis

---

## Integration with Other Directories

**Decision logs connect to:**

1. **Feature Specs** (`features/[priority]/`)
   - Decision log = WHY we decided
   - Feature spec = WHAT we're building
   - Both reference each other

2. **Hypothesis Tracking** (`hypotheses/`)
   - Q-HYPOTHESIS scans decision logs
   - Maps features to hypotheses
   - Identifies validation gaps

3. **Meeting Prep** (`meeting-prep/`)
   - Q-MEETING-PREP reviews decision logs
   - Includes relevant decisions in agenda
   - Prepares questions for Fraser/Guy/Gabriel

4. **Session Notes** (`GeneratedMDs/session-notes/`)
   - Q-END documents decisions made in session
   - References decision logs created
   - Provides context for why decisions were made

---

## Tips for Good Decision-Making

**Remember Brian's fear:** Wasting money on wrong features (has happened before)

**Good decision habits:**
1. **Default to OUT OF SCOPE** - Can always add in Phase 2
2. **Ask "Can we validate without this?"** - If yes, probably not MUST HAVE
3. **Apply Polished Concierge test** - Manual backend for 30 students is OK
4. **70% information is enough** - Don't wait for perfect certainty
5. **Focus on highest uncertainties** - Hypothesis #6 gets priority

**When stuck:**
- Run Q-HYPOTHESIS to see validation gaps
- Review decision framework: `docs/DECISION-FRAMEWORK.md`
- Check if feature addresses Brian's top uncertainty (H6: Flywheel)
- Ask: "Would students lose trust without this?" (If no → not MUST HAVE)

---

## Success Metrics

**By December 6, 2025:**
- ✅ 10-20 MUST HAVE decisions documented
- ✅ All 6 hypotheses have feature coverage
- ✅ Hypothesis #6 (Flywheel) has strong coverage (Brian's top uncertainty)
- ✅ Total MUST HAVE cost within $75K
- ✅ Total MUST HAVE time within 4 months
- ✅ Fraser has reviewed and committed to feasibility
- ✅ Multi-creator marketplace validated
- ✅ Every decision has clear rationale documented

**This decision tracking ensures you never repeat past mistakes of building wrong features.**

---

**Last Updated:** 2025-11-25
