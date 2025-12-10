# MVP Decision: Payment & Escrow System

**Date:** 2025-12-02  
**Decision Maker:** Brian (CEO/Founder)  
**Decision:** ✅ MUST HAVE  
**Status:** Approved

---

## Feature Description

Complete payment processing system enabling students to pay for courses via credit card and enabling automatic revenue split tracking with semi-automated payouts to Student-Teachers and Creators.

**Payment Processor:** Stripe  
**Payout Approach:** Semi-Automated (System calculates, Brian clicks to process)

---

## Decision Framework Analysis

### 1. Hypothesis Validation ✅

| Hypothesis | Impact | Explanation |
|------------|--------|-------------|
| **H1: Market Positioning** | ✅ **STRONG** | Directly tests if students will pay $400-600 |
| **H2: Completion Rates** | ⚠️ Indirect | Escrow milestones may incentivize completion |
| **H3: Customer Segmentation** | ⚠️ Indirect | Payment data identifies customer types |
| **H4: Conversion to Teaching** | ✅ Moderate | 70% payout incentivizes becoming S-T |
| **H5: Peer Teaching Quality** | ❌ None | Doesn't measure teaching quality |
| **H6: Flywheel Validation** | ✅ Moderate | Revenue share enables sustainable flywheel |

**Primary Hypothesis:** H1 (Market Positioning)  
**Brian's Uncertainty Ranking:** #3 - "Will students pay $400-600?"  
**Validation Type:** DIRECT - Only way to test pricing hypothesis

### 2. Genesis Cohort Critical Check ✅

**Is this critical for 60-80 Genesis students?**

- ✅ Critical for enrollment - Must accept payments
- ✅ Critical for payment - Core infrastructure
- ✅ Required to test model - Can't validate H1 without it
- ✅ Students lose trust without it - Must be professional

**Assessment:** ABSOLUTELY CRITICAL - Cannot operate platform without payment processing

### 3. Manual Alternative Check ❌

**Can Brian handle payments manually?**

| Task | Manual Feasibility |
|------|-------------------|
| Collect payments | ❌ Venmo/PayPal = unprofessional |
| Calculate splits | ⚠️ Spreadsheet = error-prone |
| Track who paid | ⚠️ Time-consuming |
| Process payouts | ⚠️ 10-15 hrs/month |

**Polished Concierge Test:** ❌ FAILS
- Payment collection MUST be automated (Stripe)
- Split calculation MUST be automated
- Payout execution CAN be semi-manual (Brian clicks button)

**Conclusion:** No viable manual alternative for payment collection

### 4. Budget Impact ✅

| Metric | Value |
|--------|-------|
| **Development Cost** | $11,000 - $15,000 |
| **% of $75K Budget** | 15-20% |
| **Monthly Operating** | ~$50 (Stripe fees separate) |
| **Stripe Fees** | 2.9% + $0.30 per transaction |
| **Fits Phase 1?** | ✅ YES |

**Alternative Costs:**
- Fully Manual: $0 dev, but 10-15 hrs/month Brian time
- Fully Automated (Stripe Connect): $16K-$26K

**Chosen:** Semi-Automated saves $5K-$11K vs fully automated

### 5. Timeline Impact ✅

| Metric | Estimate |
|--------|----------|
| **Development Time** | 2-3 weeks |
| **Fraser Confidence** | Medium (needs review) |
| **Dependencies** | Creator Profiles ✅, Student Profiles ✅ |
| **Risk Level** | Medium (Stripe well-documented) |

---

## Scope Definition

### ✅ IN SCOPE (MVP)

**Payment Collection:**
- Stripe Checkout integration
- Credit card processing
- Course purchase flow
- Instant enrollment after payment
- Payment confirmation emails
- Receipt generation

**Revenue Split System:**
- Automatic 70/15/15 calculation per transaction
- Per-transaction tracking in database
- Creator earnings dashboard view
- Student-Teacher earnings dashboard view
- Running balance display

**Escrow/Holding:**
- Funds held until milestone completion
- Clear release criteria defined
- Brian approves fund releases
- Audit trail of releases

**Admin Payout Dashboard:**
- View all pending payouts by recipient
- "Process Payout" button per recipient
- Batch payout option (pay all)
- Payout history and audit trail
- Monthly summary reports

**Payout Execution:**
- System sends via Stripe Transfer or PayPal Payouts API
- Brian initiates with button click (not fully automated)
- Confirmation emails to recipients
- Receipt generation

### ❌ OUT OF SCOPE (Phase 2+)

- Stripe Connect (fully automated marketplace payouts)
- Subscription/recurring billing
- Multiple currency support
- Automated refund processing (Brian handles manually)
- Complex escrow conditions
- Student payment plans/installments
- Tax document generation (1099s)
- Cryptocurrency payments
- Buy-now-pay-later integrations

---

## Why Stripe?

### Chosen Over Alternatives:

| Processor | Verdict | Reason |
|-----------|---------|--------|
| **Stripe** | ✅ CHOSEN | Best developer experience, industry standard, upgrade path to Connect |
| PayPal | ❌ Rejected | Higher fees, clunky UX, account freeze risk |
| Square | ❌ Rejected | Not optimized for online platforms |
| Paddle | ❌ Rejected | Higher fees, less control |

### Stripe Benefits:
- Industry standard for SaaS/EdTech
- Excellent React components
- Best-in-class documentation
- 99.99% uptime
- Built-in fraud detection
- PCI compliance handled
- Easy upgrade to Stripe Connect in Phase 2
- Dashboard for Brian to monitor transactions

### Stripe Costs:
- 2.9% + $0.30 per transaction
- Example: $500 course = ~$14.80 fee
- 60-80 students × $500 = ~$1,000-1,200 total fees

---

## Why Semi-Automated?

### Options Evaluated:

| Option | Dev Cost | Brian's Monthly Work | Verdict |
|--------|----------|---------------------|---------|
| **A: Fully Manual** | $0 | 10-15 hours | ❌ Not scalable |
| **B: Semi-Automated** | $11K-$15K | 1-2 hours | ✅ CHOSEN |
| **C: Fully Automated** | $16K-$26K | 0 hours | ❌ Overkill for MVP |

### Semi-Automated Workflow:
1. Student pays via Stripe Checkout
2. System instantly enrolls student
3. System calculates 70/15/15 split
4. System tracks amounts owed to each recipient
5. Monthly: Brian opens Admin Dashboard
6. Brian clicks "Process Payout" for each recipient
7. System sends payment via API
8. Recipients receive funds + confirmation

### Why Not Fully Automated?
- Saves $5K-$11K in development
- For 4-5 creators, clicking buttons is acceptable
- Brian maintains oversight of cash flow
- Can upgrade to Stripe Connect in Phase 2 if needed
- 1-2 hours/month is manageable for MVP

---

## Questions for Fraser

**Technical Review Needed:**

1. **Stripe Integration:**
   - Stripe Checkout vs custom payment form?
   - Webhook setup for payment confirmations?
   - Estimated integration time?

2. **Payout Method:**
   - Stripe Transfer vs PayPal Payouts?
   - Which is faster to implement?
   - Any account setup requirements?

3. **Escrow Logic:**
   - What triggers fund release? (Course completion? Session count?)
   - Database schema for tracking?
   - How complex is holding logic?

4. **Dashboard:**
   - Admin dashboard complexity?
   - Real-time vs batch reporting?

5. **Timeline Validation:**
   - Is 2-3 weeks realistic?
   - Any technical blockers?
   - Dependencies on other features?

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Stripe integration issues | Low | Medium | Well-documented, Fraser experienced |
| Payout calculation errors | Medium | High | Thorough testing, Brian review before send |
| Escrow logic complexity | Medium | Medium | Start simple, iterate based on needs |
| Refund disputes | Low | Medium | Brian handles manually for MVP |
| Timeline overrun | Medium | Medium | Buffer built into estimate |

---

## Success Criteria

**For MVP Launch:**
- [ ] Students can pay via credit card
- [ ] System correctly calculates 70/15/15 split
- [ ] Brian can view pending payouts
- [ ] Brian can process payouts with button click
- [ ] Recipients receive funds within 2-3 business days
- [ ] Transaction history is auditable

**For Hypothesis Validation:**
- [ ] 60-80 students successfully pay $400-600
- [ ] Payment completion rate >90%
- [ ] No major payment-related complaints
- [ ] Student-Teachers receive payouts as promised

---

## Budget Summary

| Component | Estimate |
|-----------|----------|
| Stripe Integration | $4,000 - $5,500 |
| Split Calculation System | $2,500 - $3,500 |
| Admin Dashboard | $2,500 - $3,500 |
| Payout Processing | $2,000 - $2,500 |
| **Total Development** | **$11,000 - $15,000** |
| Monthly Operating | ~$50 |
| Stripe Transaction Fees | ~$1,000-1,200 (one-time for Genesis) |

**% of Phase 1 Budget:** 15-20%  
**Verdict:** ✅ Within budget constraints

---

## Implementation Notes

### Phase 1 (MVP):
- Stripe Checkout for payments
- Manual escrow release (Brian approves)
- Semi-automated payouts (Brian clicks)
- Basic admin dashboard

### Phase 2 (Post-Validation):
- Stripe Connect for automated payouts
- Advanced escrow rules
- Automated refund processing
- Tax document generation
- Multiple payment methods

---

## Related Documents

- Feature Spec: `features/must-have/payment-escrow-system.md` (to be created)
- Creator Profiles: `mvp-decisions/2025-11-30-creator-profiles.md`
- Student Profiles: `mvp-decisions/2025-11-30-student-profile-system.md`

---

## Decision Rationale

**MUST HAVE because:**

1. ✅ **Directly validates H1** - Only way to test if students pay $400-600
2. ✅ **Core infrastructure** - Cannot operate platform without payments
3. ✅ **No manual alternative** - Venmo/PayPal destroys professional image
4. ✅ **Enables flywheel** - Student-Teachers must get paid to participate
5. ✅ **Within budget** - 15-20% is appropriate for critical infrastructure
6. ✅ **Proven technology** - Stripe is well-documented and reliable

**Semi-Automated because:**
- Saves $5K-$11K vs fully automated
- 1-2 hrs/month acceptable for 4-5 creators
- Brian maintains cash flow oversight
- Upgrade path to Stripe Connect exists

---

**Decision:** ✅ MUST HAVE  
**Approach:** Semi-Automated with Stripe  
**Budget:** $11,000 - $15,000  
**Timeline:** 2-3 weeks  
**Approved by:** Brian  
**Date:** 2025-12-02

---

**Next Steps:**
1. Fraser reviews technical approach
2. Fraser validates timeline estimate
3. Create detailed feature spec
4. Add to MVP spec document

---

**Last Updated:** 2025-12-02




























