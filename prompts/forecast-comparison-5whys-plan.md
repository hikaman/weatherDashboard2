# How to Use

- Use this prompt as a guide for diagnosing and resolving issues related to missing forecast comparison data in the WeatherWise Dashboard.
- Always consider the context and rules in `@.cursor` and `@memory-bank` when applying or adapting this plan.
- Follow the steps in the plan to ensure robust data handling, improved user experience, and maintainable code.

---

# Plan: Addressing Missing Forecast Comparison Data (3-Leg 5 Whys Analysis)

## 1. API Data Availability
- **Check API Request:**
  - Ensure the weather API call includes `past_days=1` to request yesterday's data.
  - Verify the API response in the network tab: does `daily.time` include yesterday, today, and tomorrow?
- **Timezone Handling:**
  - Confirm that the date used for 'today' matches the timezone of the API data (often UTC).
  - Adjust client-side date logic if necessary to align with API data.
- **Fallback:**
  - If the API cannot provide yesterday's data for a location/date, log this clearly and proceed with available data.

## 2. UI/UX Robustness
- **Graceful Fallback:**
  - If yesterday's data is missing, show a user-friendly message (e.g., "No data for yesterday available.") instead of a generic error or empty state.
  - Render comparison for available days only (e.g., today/tomorrow) if possible.
- **Component Logic:**
  - Refactor components to not assume all three days are always present.
  - Use defensive checks for array bounds and data presence before rendering.

## 3. Data Validation and Developer Feedback
- **Centralize Validation:**
  - Move data validation and normalization logic to the store or data-fetching layer.
  - Ensure components receive only valid, pre-checked data, reducing repetitive error handling.
- **Logging:**
  - Keep meaningful debug logs for missing or malformed data, but avoid flooding the console.
  - Summarize issues in a single log per render or fetch cycle.

## 4. Continuous Improvement
- **Document Known Limitations:**
  - Note in documentation and decision logs when/why yesterday's data may be missing for certain locations or dates.
- **Test Edge Cases:**
  - Add tests for scenarios with missing days, partial data, and timezone edge cases.
- **Review Regularly:**
  - Periodically review API changes and update logic as needed.

---

*This plan is informed by the 3-leg 5 Whys analysis, and should be adapted as the project evolves. Always consult @.cursor and @memory-bank for the latest context, rules, and decisions.* 