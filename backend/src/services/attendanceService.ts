import pool from '../infrastructure/database.js';

export interface Attendance {
    id: number;
    user_id: number;
    schedule_id?: number;
    check_in: string;
    check_out?: string;
    fingerprint_data?: string;
    is_late: boolean;
    notes?: string;
}

export interface CreateAttendanceInput {
    user_id: number;
    schedule_id: number;
    check_in: Date;
    fingerprint_data?: string | null;
    is_late: boolean;
}

export interface UpdateAttendanceInput {
    notes?: string;
}

export const attendanceService = {
    // Create attendance record (check-in)
    async createAttendance(input: CreateAttendanceInput): Promise<Attendance> {
        try {
            const connection = await pool.getConnection();

            const [result]: any = await connection.query(
                `INSERT INTO ATTENDANCE (user_id, schedule_id, check_in, fingerprint_data, is_late) 
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    input.user_id,
                    input.schedule_id,
                    input.check_in,
                    input.fingerprint_data || null,
                    input.is_late ? 1 : 0,
                ]
            );

            const attendanceId = result.insertId;

            const attendance = await this.getAttendanceById(attendanceId);

            connection.release();

            console.log(`[ATTENDANCE SERVICE] Check-in created: ID ${attendanceId}`);
            return attendance as Attendance;
        } catch (error: any) {
            console.error(`[ATTENDANCE SERVICE] createAttendance error: ${error.message}`);
            throw error;
        }
    },

    // Get attendance by ID
    async getAttendanceById(attendanceId: number): Promise<Attendance | null> {
        try {
            const connection = await pool.getConnection();

            const [rows] = await connection.query(
                `SELECT id, user_id, schedule_id, check_in, check_out, fingerprint_data, is_late, notes 
                 FROM ATTENDANCE WHERE id = ?`,
                [attendanceId]
            );

            connection.release();

            const attendance = (rows as any[])[0];
            return attendance ? this.formatAttendance(attendance) : null;
        } catch (error: any) {
            console.error(`[ATTENDANCE SERVICE] getAttendanceById error: ${error.message}`);
            throw error;
        }
    },

    // Get today's check-in for user
    async getTodayCheckIn(userId: number): Promise<Attendance | null> {
        try {
            const connection = await pool.getConnection();

            const today = new Date().toISOString().split('T')[0];

            const [rows] = await connection.query(
                `SELECT id, user_id, schedule_id, check_in, check_out, fingerprint_data, is_late, notes 
                 FROM ATTENDANCE 
                 WHERE user_id = ? AND DATE(check_in) = ?
                 ORDER BY check_in DESC LIMIT 1`,
                [userId, today]
            );

            connection.release();

            const attendance = (rows as any[])[0];
            return attendance ? this.formatAttendance(attendance) : null;
        } catch (error: any) {
            console.error(`[ATTENDANCE SERVICE] getTodayCheckIn error: ${error.message}`);
            throw error;
        }
    },

    // Update check-out timestamp
    async updateCheckOut(attendanceId: number, checkOut: Date): Promise<Attendance> {
        try {
            const connection = await pool.getConnection();

            await connection.query('UPDATE ATTENDANCE SET check_out = ? WHERE id = ?', [checkOut, attendanceId]);

            connection.release();

            const attendance = await this.getAttendanceById(attendanceId);
            console.log(`[ATTENDANCE SERVICE] Check-out recorded: ID ${attendanceId}`);
            return attendance as Attendance;
        } catch (error: any) {
            console.error(`[ATTENDANCE SERVICE] updateCheckOut error: ${error.message}`);
            throw error;
        }
    },

    // Update attendance record
    async updateAttendance(attendanceId: number, updates: UpdateAttendanceInput): Promise<Attendance> {
        try {
            const connection = await pool.getConnection();

            const updateFields: string[] = [];
            const params: any[] = [];

            if (updates.notes !== undefined) {
                updateFields.push('notes = ?');
                params.push(updates.notes);
            }

            if (updateFields.length === 0) {
                throw new Error('No fields to update');
            }

            params.push(attendanceId);

            const query = `UPDATE ATTENDANCE SET ${updateFields.join(', ')} WHERE id = ?`;
            await connection.query(query, params);

            connection.release();

            const attendance = await this.getAttendanceById(attendanceId);
            console.log(`[ATTENDANCE SERVICE] Attendance updated: ID ${attendanceId}`);
            return attendance as Attendance;
        } catch (error: any) {
            console.error(`[ATTENDANCE SERVICE] updateAttendance error: ${error.message}`);
            throw error;
        }
    },

    // Get attendance records with filters
    async getAttendance(filters: {
        user_id?: number;
        date?: string;
        month?: number;
        year?: number;
    }): Promise<Attendance[]> {
        try {
            const connection = await pool.getConnection();

            let query =
                `SELECT id, user_id, schedule_id, check_in, check_out, fingerprint_data, is_late, notes 
                 FROM ATTENDANCE WHERE 1=1`;
            const params: any[] = [];

            if (filters.user_id) {
                query += ' AND user_id = ?';
                params.push(filters.user_id);
            }

            if (filters.date) {
                query += ' AND DATE(check_in) = ?';
                params.push(filters.date);
            }

            if (filters.month && filters.year) {
                query += ' AND MONTH(check_in) = ? AND YEAR(check_in) = ?';
                params.push(filters.month, filters.year);
            }

            query += ' ORDER BY check_in DESC';

            const [rows] = await connection.query(query, params);
            connection.release();

            return (rows as any[]).map(row => this.formatAttendance(row));
        } catch (error: any) {
            console.error(`[ATTENDANCE SERVICE] getAttendance error: ${error.message}`);
            throw error;
        }
    },

    // Get attendance summary for a date range
    async getAttendanceSummary(
        userId: number,
        startDate: string,
        endDate: string
    ): Promise<{
        total_days: number;
        present_days: number;
        late_days: number;
        total_hours: number;
    }> {
        try {
            const connection = await pool.getConnection();

            const [rows]: any = await connection.query(
                `SELECT 
                    COUNT(DISTINCT DATE(check_in)) as total_days,
                    SUM(CASE WHEN check_out IS NOT NULL THEN 1 ELSE 0 END) as present_days,
                    SUM(CASE WHEN is_late = 1 THEN 1 ELSE 0 END) as late_days,
                    SUM(TIMESTAMPDIFF(HOUR, check_in, COALESCE(check_out, NOW()))) as total_hours
                 FROM ATTENDANCE
                 WHERE user_id = ? AND DATE(check_in) BETWEEN ? AND ?`,
                [userId, startDate, endDate]
            );

            connection.release();

            const summary = rows[0] || {
                total_days: 0,
                present_days: 0,
                late_days: 0,
                total_hours: 0,
            };

            return {
                total_days: summary.total_days || 0,
                present_days: summary.present_days || 0,
                late_days: summary.late_days || 0,
                total_hours: summary.total_hours || 0,
            };
        } catch (error: any) {
            console.error(`[ATTENDANCE SERVICE] getAttendanceSummary error: ${error.message}`);
            throw error;
        }
    },

    // Format attendance record
    formatAttendance(row: any): Attendance {
        return {
            id: row.id,
            user_id: row.user_id,
            schedule_id: row.schedule_id,
            check_in: row.check_in,
            check_out: row.check_out,
            fingerprint_data: row.fingerprint_data,
            is_late: row.is_late === 1 || row.is_late === true,
            notes: row.notes,
        };
    },
};
