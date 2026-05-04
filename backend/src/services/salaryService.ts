import pool from '../infrastructure/database.js';

export interface Salary {
    id: number;
    user_id: number;
    month: number;
    year: number;
    total_hours: number;
    base_salary: number;
    bonus: number;
    deductions: number;
    net_salary: number;
    paid_at?: string;
    notes?: string;
}

export interface CalculateSalaryInput {
    user_id: number;
    month: number;
    year: number;
    hourly_rate: number;
    bonus?: number;
    deductions?: number;
    notes?: string;
}

export interface UpdateSalaryInput {
    bonus?: number;
    deductions?: number;
    notes?: string;
}

export const salaryService = {
    // Calculate total working hours for a month
    async getTotalHoursForMonth(userId: number, month: number, year: number): Promise<number> {
        try {
            const connection = await pool.getConnection();

            const [rows]: any = await connection.query(
                `SELECT COALESCE(SUM(
                    TIMESTAMPDIFF(HOUR, a.check_in, COALESCE(a.check_out, NOW()))
                ), 0) as total_hours
                 FROM ATTENDANCE a
                 WHERE a.user_id = ? AND MONTH(a.check_in) = ? AND YEAR(a.check_in) = ?`,
                [userId, month, year]
            );

            connection.release();

            return rows[0]?.total_hours || 0;
        } catch (error: any) {
            console.error(`[SALARY SERVICE] getTotalHoursForMonth error: ${error.message}`);
            throw error;
        }
    },

    // Calculate salary for a month
    async calculateSalary(input: CalculateSalaryInput): Promise<Salary> {
        try {
            const connection = await pool.getConnection();

            // Get total hours worked
            const totalHours = await this.getTotalHoursForMonth(input.user_id, input.month, input.year);

            // Calculate base salary
            const baseSalary = totalHours * input.hourly_rate;
            const bonus = input.bonus || 0;
            const deductions = input.deductions || 0;
            const netSalary = baseSalary + bonus - deductions;

            // Upsert salary record to allow recalculation for existing month/year
            await connection.query(
                `INSERT INTO SALARY (user_id, month, year, total_hours, base_salary, bonus, deductions, net_salary, notes)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE
                    total_hours = VALUES(total_hours),
                    base_salary = VALUES(base_salary),
                    bonus = VALUES(bonus),
                    deductions = VALUES(deductions),
                    net_salary = VALUES(net_salary),
                    notes = VALUES(notes)`,
                [
                    input.user_id,
                    input.month,
                    input.year,
                    totalHours,
                    baseSalary,
                    bonus,
                    deductions,
                    netSalary,
                    input.notes || null,
                ]
            );

            connection.release();

            const salary = await this.getSalaryByUserMonthYear(input.user_id, input.month, input.year);

            console.log(
                `[SALARY SERVICE] Salary calculated (upsert): User ${input.user_id}, ${input.month}/${input.year}, Hours: ${totalHours}`
            );
            return salary as Salary;
        } catch (error: any) {
            console.error(`[SALARY SERVICE] calculateSalary error: ${error.message}`);
            throw error;
        }
    },

    // Get salary by ID
    async getSalaryById(salaryId: number): Promise<Salary | null> {
        try {
            const connection = await pool.getConnection();

            const [rows] = await connection.query(
                `SELECT id, user_id, month, year, total_hours, base_salary, bonus, deductions, net_salary, paid_at, notes
                 FROM SALARY WHERE id = ?`,
                [salaryId]
            );

            connection.release();

            const salary = (rows as any[])[0];
            return salary ? this.formatSalary(salary) : null;
        } catch (error: any) {
            console.error(`[SALARY SERVICE] getSalaryById error: ${error.message}`);
            throw error;
        }
    },

    // Get salary by user, month, year
    async getSalaryByUserMonthYear(userId: number, month: number, year: number): Promise<Salary | null> {
        try {
            const connection = await pool.getConnection();

            const [rows] = await connection.query(
                `SELECT id, user_id, month, year, total_hours, base_salary, bonus, deductions, net_salary, paid_at, notes
                 FROM SALARY WHERE user_id = ? AND month = ? AND year = ?`,
                [userId, month, year]
            );

            connection.release();

            const salary = (rows as any[])[0];
            return salary ? this.formatSalary(salary) : null;
        } catch (error: any) {
            console.error(`[SALARY SERVICE] getSalaryByUserMonthYear error: ${error.message}`);
            throw error;
        }
    },

    // Get salaries with filters
    async getSalaries(filters: {
        user_id?: number;
        month?: number;
        year?: number;
    }): Promise<Salary[]> {
        try {
            const connection = await pool.getConnection();

            let query =
                `SELECT id, user_id, month, year, total_hours, base_salary, bonus, deductions, net_salary, paid_at, notes
                 FROM SALARY WHERE 1=1`;
            const params: any[] = [];

            if (filters.user_id) {
                query += ' AND user_id = ?';
                params.push(filters.user_id);
            }

            if (filters.month) {
                query += ' AND month = ?';
                params.push(filters.month);
            }

            if (filters.year) {
                query += ' AND year = ?';
                params.push(filters.year);
            }

            query += ' ORDER BY year DESC, month DESC';

            const [rows] = await connection.query(query, params);
            connection.release();

            return (rows as any[]).map((row) => this.formatSalary(row));
        } catch (error: any) {
            console.error(`[SALARY SERVICE] getSalaries error: ${error.message}`);
            throw error;
        }
    },

    // Update salary record
    async updateSalary(salaryId: number, updates: UpdateSalaryInput): Promise<Salary> {
        try {
            const connection = await pool.getConnection();

            // Get current salary
            const currentSalary = await this.getSalaryById(salaryId);
            if (!currentSalary) {
                throw new Error('Salary not found');
            }

            const bonus = updates.bonus !== undefined ? updates.bonus : currentSalary.bonus;
            const deductions = updates.deductions !== undefined ? updates.deductions : currentSalary.deductions;
            const netSalary = currentSalary.base_salary + bonus - deductions;

            // Update salary record
            await connection.query(
                `UPDATE SALARY SET bonus = ?, deductions = ?, net_salary = ?, notes = ? WHERE id = ?`,
                [
                    bonus,
                    deductions,
                    netSalary,
                    updates.notes !== undefined ? updates.notes : currentSalary.notes,
                    salaryId,
                ]
            );

            connection.release();

            const salary = await this.getSalaryById(salaryId);
            console.log(`[SALARY SERVICE] Salary updated: ID ${salaryId}`);
            return salary as Salary;
        } catch (error: any) {
            console.error(`[SALARY SERVICE] updateSalary error: ${error.message}`);
            throw error;
        }
    },

    // Mark salary as paid
    async markAsPaid(salaryId: number): Promise<Salary> {
        try {
            const connection = await pool.getConnection();

            await connection.query('UPDATE SALARY SET paid_at = NOW() WHERE id = ?', [salaryId]);

            connection.release();

            const salary = await this.getSalaryById(salaryId);
            console.log(`[SALARY SERVICE] Salary marked as paid: ID ${salaryId}`);
            return salary as Salary;
        } catch (error: any) {
            console.error(`[SALARY SERVICE] markAsPaid error: ${error.message}`);
            throw error;
        }
    },

    // Get salary summary for a user
    async getSalarySummary(
        userId: number,
        startMonth: number,
        startYear: number,
        endMonth: number,
        endYear: number
    ): Promise<{
        total_salary: number;
        paid_salary: number;
        unpaid_salary: number;
        count: number;
    }> {
        try {
            const connection = await pool.getConnection();

            const [rows]: any = await connection.query(
                `SELECT 
                    COUNT(*) as count,
                    SUM(net_salary) as total_salary,
                    SUM(CASE WHEN paid_at IS NOT NULL THEN net_salary ELSE 0 END) as paid_salary,
                    SUM(CASE WHEN paid_at IS NULL THEN net_salary ELSE 0 END) as unpaid_salary
                 FROM SALARY
                 WHERE user_id = ? AND (year < ? OR (year = ? AND month <= ?))
                 AND (year > ? OR (year = ? AND month >= ?))`,
                [userId, endYear, endYear, endMonth, startYear, startYear, startMonth]
            );

            connection.release();

            const summary = rows[0] || {
                count: 0,
                total_salary: 0,
                paid_salary: 0,
                unpaid_salary: 0,
            };

            return {
                total_salary: summary.total_salary || 0,
                paid_salary: summary.paid_salary || 0,
                unpaid_salary: summary.unpaid_salary || 0,
                count: summary.count || 0,
            };
        } catch (error: any) {
            console.error(`[SALARY SERVICE] getSalarySummary error: ${error.message}`);
            throw error;
        }
    },

    // Format salary record
    formatSalary(row: any): Salary {
        return {
            id: row.id,
            user_id: row.user_id,
            month: row.month,
            year: row.year,
            total_hours: row.total_hours,
            base_salary: row.base_salary,
            bonus: row.bonus || 0,
            deductions: row.deductions || 0,
            net_salary: row.net_salary,
            paid_at: row.paid_at,
            notes: row.notes,
        };
    },
};
