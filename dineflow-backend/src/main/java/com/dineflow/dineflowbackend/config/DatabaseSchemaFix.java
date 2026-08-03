package com.dineflow.dineflowbackend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSchemaFix implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSchemaFix.class);

    private final JdbcTemplate jdbcTemplate;

    public DatabaseSchemaFix(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        fixUsersTable();
    }

    private void fixUsersTable() {
        try {
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(255)");
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE");
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'CUSTOMER'");
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS restaurant_id BIGINT");
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");

            jdbcTemplate.execute("UPDATE users SET is_active = TRUE WHERE is_active IS NULL");
            jdbcTemplate.execute("UPDATE users SET role = 'CUSTOMER' WHERE role IS NULL OR role = ''");
            jdbcTemplate.execute("UPDATE users SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL");
            jdbcTemplate.execute("UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE updated_at IS NULL");

            try {
                jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN is_active SET NOT NULL");
            } catch (Exception ignored) {
                // Column may already be NOT NULL
            }
            try {
                jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN role SET NOT NULL");
            } catch (Exception ignored) {
                // Column may already be NOT NULL
            }

            jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN is_active SET DEFAULT TRUE");
            jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'CUSTOMER'");
            jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP");
            jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP");

            log.info("Users table schema verified");
        } catch (Exception e) {
            log.warn("Could not fix users table schema: {}", e.getMessage());
        }
    }
}
