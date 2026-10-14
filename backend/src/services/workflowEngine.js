// Owner: Karan. The heart of the system.
// performAction(indentId, user, action, payload):
//   1 load indent + its workflow template
//   2 check this user may act at this step
//   3 move to the next step (approve / forward / fill / revise / reject)
//   4 write IndentHistory
//   5 queue the email
// All inside ONE database transaction, with a version check.

// --- Audit log (was auditService) ---
// Owner: Karan. logAction(userId, what, before, after) writes to AuditLog.
