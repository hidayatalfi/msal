import { executeQuery } from "@/lib/db";

export const RateLimiter = {
  // Record login attempt
  async recordAttempt(identifier, ipAddress, success) {
    const query = `
      INSERT INTO login_attempts (identifier, ip_address, success)
      VALUES (?, ?, ?)
    `;
    await executeQuery(query, [identifier, ipAddress, success]);
  },

  // Check if user is rate limited
  async isRateLimited(identifier) {
    const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
    const windowMinutes = parseInt(process.env.LOGIN_ATTEMPT_WINDOW) || 15;

    const query = `
      SELECT COUNT(*) as attempt_count
      FROM login_attempts
      WHERE identifier = ?
      AND success = FALSE
      AND attempted_at > DATE_SUB(NOW(), INTERVAL ? MINUTE)
    `;

    const results = await executeQuery(query, [identifier, windowMinutes]);
    const attemptCount = results[0]?.attempt_count || 0;

    return attemptCount >= maxAttempts;
  },

  // Clean old attempts (panggil ini secara periodik atau via cron)
  async cleanOldAttempts(daysOld = 7) {
    const query = `
      DELETE FROM login_attempts
      WHERE attempted_at < DATE_SUB(NOW(), INTERVAL ? DAY)
    `;
    await executeQuery(query, [daysOld]);
  },
};
