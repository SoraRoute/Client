class AdminRepository {

    async findAdminByEmail(connection, email) {
        const query = `
            SELECT *
            FROM users
            WHERE email = ?
            AND role = ?
        `;

        const [rows] = await connection.query(query, [email, "admin"]);
        return rows;
    }

    async findAdminById(connection, adminId) {
        const query = `
            SELECT
                id,
                first_name,
                last_name,
                email,
                mobile,
                role,
                created_at
            FROM users
            WHERE id = ?
            AND role = ?
        `;

        const [rows] = await connection.query(query, [adminId, "admin"]);
        return rows;
    }

    async findAdminPasswordById(connection, adminId) {
        const query = `
            SELECT password
            FROM users
            WHERE id = ?
            AND role = ?
        `;

        const [rows] = await connection.query(query, [adminId, "admin"]);
        return rows;
    }

    async updateAdminPasswordById(connection, adminId, newPassword) {
        const query = `
            UPDATE users
            SET password = ?
            WHERE id = ?
            AND role = ?
        `;

        const [result] = await connection.query(query, [
            newPassword,
            adminId,
            "admin"
        ]);

        return result.affectedRows;
    }

    async updateAdminPasswordByEmail(connection, email, newPassword) {
        const query = `
            UPDATE users
            SET password = ?
            WHERE email = ?
            AND role = ?
        `;

        const [result] = await connection.query(query, [
            newPassword,
            email,
            "admin"
        ]);

        return result.affectedRows;
    }

    async saveOtp(connection, email, otpHash, purpose, expiresAt) {
        await connection.query(
            `
            INSERT INTO verification_codes (
                email,
                otp_hash,
                purpose,
                expires_at
            )
            VALUES (?, ?, ?, ?)
            `,
            [email, otpHash, purpose, expiresAt]
        );
    }

    async findOtpByEmail(connection, email, purpose) {
        const [rows] = await connection.query(
            `
            SELECT *
            FROM verification_codes
            WHERE email = ?
            AND purpose = ?
            `,
            [email, purpose]
        );

        return rows[0];
    }

    async deleteOtp(connection, email, purpose) {
        await connection.query(
            `
            DELETE FROM verification_codes
            WHERE email = ?
            AND purpose = ?
            `,
            [email, purpose]
        );
    }
}

module.exports = new AdminRepository();