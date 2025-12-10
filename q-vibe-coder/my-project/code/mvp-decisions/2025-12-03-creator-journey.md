# MVP Decision: Creator Journey (Onboarding & Vetting)

**Decision Date:** December 3, 2025  
**Decision Maker:** Brian (CEO/Founder)  
**Decision:** MUST HAVE  
**Framework Used:** Q-DECIDE  
**Origin:** Identified in Fraser & Gabriel meeting (Dec 3, 2025)

---

## Executive Summary

**APPROVED:** Creator Journey is MUST HAVE for PeerLoop MVP.

**Rationale:** Without a defined creator journey, there's no path for creators to join the platform and launch courses. This is a foundational prerequisite for the entire marketplace to function. Genesis cohort needs 4-5 creators with live courses.

**Key Insight:** Balance between quality vetting (Gabriel's concern) and open marketplace scalability (Brian's vision). Compromise: Brian manually vets for Genesis cohort, AI-assisted moderation added for scale later.

**Budget Allocation:** ~$4,000-$5,500  
**Timeline Allocation:** ~2-2.5 weeks

---

## Feature Description

The Creator Journey covers four stages:

| Stage | Description | Who Does It |
|-------|-------------|-------------|
| **1. Discovery** | Learn about PeerLoop model | Creator (self-service) |
| **2. Application** | Submit course proposal | Creator submits, Brian reviews |
| **3. Onboarding** | Set up course content | Creator + Brian assists |
| **4. Go-Live** | Course published, ready for students | Brian approves |

### Stage 1: Discovery
- "Become a Creator" landing page
- Explains PeerLoop's unique peer-teaching model
- Self-qualifying information (expectations, requirements)
- Single CTA: "Apply to Become a Creator"

### Stage 2: Application (Vetting)
- Application form collects:
  - Personal info (name, email, LinkedIn)
  - Course proposal (title, description, 3-8 modules)
  - Expertise proof
  - Content readiness and timeline
- Brian reviews in admin dashboard
- Approve / Decline / Request More Info

### Stage 3: Onboarding
- Creator completes profile
- Uploads course content (paste video/doc links)
- Sets course details (price, duration, description)
- Submits for Brian's review

### Stage 4: Go-Live
- Brian approves course
- Course published and visible to students
- Creator bootstraps first Student-Teachers
- Flywheel begins

---

## Why This is MUST HAVE

### Critical for Platform Launch
Without creators and courses, there is no PeerLoop:
- ✅ Students need courses to enroll in
- ✅ Student-Teachers need courses to teach
- ✅ Payment system needs products to process
- ✅ Community feed needs creators to post
- ✅ Flywheel needs starting point

### Genesis Cohort Requirement
- Need 4-5 creators with live courses
- Each creator needs clear path to launch
- Current state: No defined process exists

### Hypothesis Validation
- **H4 (Conversion to Teaching):** Requires courses to exist first
- **H6 (Flywheel):** Requires creators to bootstrap S-T's

---

## Meeting Context (Dec 3, 2025)

### Gabriel's View
- Creators need vetting (quality control)
- Content creation support needed
- Continuous engagement to keep community vibrant

### Brian's View
- No full LMS for teaching people how to teach
- Many creators already have material and expertise
- Open marketplace approach needed for scale
- Vet initial creators for quality, long-term rely on market

### Compromise Reached
- AI-assisted moderation for vetting course proposals (Phase 2)
- Manual Brian approval for Genesis cohort
- Lightweight onboarding (not full LMS)
- Creator help system (like Q) for future scale

---

## MVP Scope

### ✅ IN SCOPE

**Application System:**
- Landing page explaining model
- Application form (all required fields)
- Brian's admin dashboard for reviewing
- Email notifications (confirmation, approval, decline)

**Onboarding System:**
- Creator onboarding checklist
- Profile creation (uses unified profile system)
- Course content entry (paste external links)
- Course details form (price, description)
- Submit for review flow

**Go-Live System:**
- Brian's course approval in admin
- Course publication
- Basic creator dashboard

### ❌ OUT OF SCOPE (Phase 2)

- AI-assisted application screening
- Video hosting (use YouTube/Vimeo)
- Creator help system (Q-style)
- Best practices library
- Creator community/forum
- Application funnel analytics
- Add moderators to community (NICE TO HAVE)

---

## Budget Assessment

### Development Cost Estimate

| Component | Days | Cost |
|-----------|------|------|
| Landing page + application form | 2 | ~$800 |
| Admin dashboard: application review | 2 | ~$800 |
| Onboarding dashboard | 3 | ~$1,200 |
| Course setup forms | 2 | ~$800 |
| Course approval + publishing | 2 | ~$800 |
| Testing & polish | 2 | ~$800 |
| **Total** | **~13 days** | **~$5,200** |

**Note:** Leverages existing systems:
- Unified profile system (already being built)
- Course content delivery (already being built)
- Admin dashboard patterns (already established)

### Budget Impact

| Category | Amount |
|----------|--------|
| Creator Journey | ~$4,000-$5,500 |
| Previous features | $46K-62K |
| **Running total** | **$50K-67.5K** |
| **Remaining** | **$7.5K-25K** |

---

## Timeline Assessment

**Estimated Duration:** 2-2.5 weeks

**Week 1:**
- Application system (form, admin review)
- Email notifications

**Week 2:**
- Onboarding system (dashboard, content entry)
- Course approval flow

**Week 3 (if needed):**
- Polish and testing
- Edge case handling

**Dependencies:**
- Can build in parallel with other features
- Profile system must be ready for creator profiles
- Course content delivery system informs course structure

---

## Risk Assessment

### Risk 1: Creators Expect Full LMS
**Risk:** Creators want training on how to teach  
**Mitigation:** 
- Set expectations: "PeerLoop is for experts who already know how to teach"
- Brian provides 1-on-1 support for Genesis creators
- Creator guide document (static, not interactive)

### Risk 2: Application Bottleneck
**Risk:** Brian becomes bottleneck reviewing applications  
**Mitigation:**
- Genesis cohort is curated (invite-only mostly)
- 48-hour SLA for reviews
- AI screening for Phase 2 scale

### Risk 3: Onboarding Abandonment
**Risk:** Approved creators don't complete onboarding  
**Mitigation:**
- Simple, focused process (not overwhelming)
- Brian follows up personally
- Reminder emails after 7 days

### Risk 4: Content Quality Varies
**Risk:** Creators submit low-quality content  
**Mitigation:**
- Brian reviews before publishing
- Genesis creators are hand-picked
- Market will filter long-term (ratings, reviews)

---

## Success Metrics

### Application Stage
- 10+ applications received (Genesis)
- 80%+ approval rate (curated cohort)
- < 48 hour review time

### Onboarding Stage
- 90%+ approved creators complete onboarding
- < 2 weeks from approval to course live
- 100% courses have complete content before publish

### Go-Live Stage
- 4-5 creators with live courses
- Each creator bootstraps 2+ S-T's in 4 weeks
- Flywheel active within 6 weeks of Genesis launch

---

## Integration Points

### Uses:
- Unified Profile System (creator profiles)
- Course Content Delivery (course structure)
- User Authentication (creator accounts)

### Enables:
- Student Enrollment (courses must exist)
- Payment System (products to sell)
- Community Feed (creators can post)
- Flywheel (starting point for peer-teaching)

---

## Questions for Fraser

1. **Application Storage:**
   - Separate table or extend users?
   - Keep declined for analytics?

2. **Onboarding UX:**
   - Multi-step wizard or single form?
   - Auto-save drafts?

3. **Content Entry:**
   - Simple text URLs or rich link preview?
   - Module reordering mechanism?

4. **Timeline:**
   - Is 2-2.5 weeks realistic?
   - What can be simplified?

---

## Decision Rationale

### Why MUST HAVE:

1. ✅ **Foundational prerequisite** - No creators = no courses = no platform
2. ✅ **Genesis cohort requirement** - Need 4-5 live courses
3. ✅ **Enables all other features** - Payments, enrollment, flywheel
4. ✅ **Reasonable cost** - ~$4K-$5.5K, leverages existing systems
5. ✅ **Validated approach** - Agreed in Fraser/Gabriel meeting

### Trade-offs Accepted:

- ⚠️ Manual vetting (Brian reviews all applications for Genesis)
- ⚠️ Simple content entry (paste links, not hosted)
- ⚠️ No creator training LMS (creators expected to be experts)
- ⚠️ No AI screening (Phase 2 for scale)

---

## Next Steps

### Immediate:
1. ✅ Document decision (this file)
2. ✅ Create feature spec: `features/must-have/creator-journey.md`
3. ⏭️ Brian reviews and approves spec
4. ⏭️ Fraser validates timeline and cost

### Before Development:
5. ⏭️ Define application form fields (finalize)
6. ⏭️ Design admin review dashboard mockups
7. ⏭️ Document creator onboarding checklist

### During Development:
8. ⏭️ Build in phases (application → onboarding → go-live)
9. ⏭️ Test with mock creator application
10. ⏭️ Prepare creator guide document

---

**Status:** ✅ APPROVED  
**Approved By:** Brian (CEO/Founder)  
**Date:** December 3, 2025  
**Next Review:** After Fraser technical validation

---

**Related Documents:**
- Feature Spec: `features/must-have/creator-journey.md`
- Creator Profiles: `mvp-decisions/2025-11-30-creator-profiles.md`
- Course Content Delivery: `mvp-decisions/2025-12-02-course-content-delivery.md`
- Meeting Notes: `meeting-prep/2025-12-03-fraser-gabriel-meeting-notes.md`

---

*End of Decision Document*









