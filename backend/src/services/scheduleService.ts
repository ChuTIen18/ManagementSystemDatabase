import pool from '../infrastructure/database.js';

export interface Schedule {
    id: number;
    user_id: number;
    date: string;
    shift_type: 'morning' | 'lunch' | 'afternoon' | 'evening';
    status: 'pending' | 'approved' | 'rejected';
    created_at?: string;
}

export interface CreateScheduleInput {
    user_id: number;
    date: string;
    shift_type: 'morning' | 'lunch' | 'afternoon' | 'evening';
    status: 'pending' | 'approved' | 'rejected';
}

export const scheduleService = {
    // Get all schedules with optional filters
    async getAllSchedules(filters: {
        user_id?: number;
        date?: string;
        status?: string;
    }): Promise<Schedule[]> {
        try {
            const connection = await pool.getConnection();

            let query = 'SELECT id, user_id, date, shift_type, status, created_at FROM SCHEDULES WHERE 1=1';
            const params: any[] = [];

            if (filters.user_id) {
                query += ' AND user_id = ?';
                params.push(filters.user_id);
            }

            if (filters.date) {
                query += ' AND date = ?';
                params.push(filters.date);
            }

            if (filters.status) {
                query += ' AND status = ?';
                params.push(filters.status);
            }

            query += ' ORDER BY date ASC, shift_type ASC';

            const [rows] = await connection.query(query, params);
            connection.release();

            return rows as Schedule[];
        } catch (error: any) {
            console.error(`[SCHEDULE SERVICE] getAllSchedules error: ${error.message}`);
            throw error;
        }
    },

    // Get schedule by ID
    async getScheduleById(scheduleId: number): Promise<Schedule | null> {
        try {
            const connection = await pool.getConnection();

            const [rows] = await connection.query(
                'SELECT id, user_id, date, shift_type, status, created_at FROM SCHEDULES WHERE id = ?',
                [scheduleId]
            );

            connection.release();

            const schedule = (rows as any[])[0];
            return schedule || null;
        } catch (error: any) {
            console.error(`[SCHEDULE SERVICE] getScheduleById error: ${error.message}`);
            throw error;
        }
    },

    // Get schedule by user, date, and shift (to check for duplicates)
    async getScheduleByUserDateShift(
        userId: number,
        date: string,
        shiftType: string
    ): Promise<Schedule | null> {
        try {
            const connection = await pool.getConnection();

            const [rows] = await connection.query(
                'SELECT id, user_id, date, shift_type, status, created_at FROM SCHEDULES WHERE user_id = ? AND date = ? AND shift_type = ?',
                [userId, date, shiftType]
            );

            connection.release();

            const schedule = (rows as any[])[0];
            return schedule || null;
        } catch (error: any) {
            console.error(`[SCHEDULE SERVICE] getScheduleByUserDateShift error: ${error.message}`);
            throw error;
        }
    },

    // Create new schedule
    async createSchedule(input: CreateScheduleInput): Promise<Schedule> {
        try {
            const connection = await pool.getConnection();

            const [result]: any = await connection.query(
                `INSERT INTO SCHEDULES (user_id, date, shift_type, status) 
                 VALUES (?, ?, ?, ?)`,
                [input.user_id, input.date, input.shift_type, input.status]
            );

            const scheduleId = result.insertId;

            const schedule = await this.getScheduleById(scheduleId);

            connection.release();

            console.log(`[SCHEDULE SERVICE] Schedule created: ID ${scheduleId}`);
            return schedule as Schedule;
        } catch (error: any) {
            console.error(`[SCHEDULE SERVICE] createSchedule error: ${error.message}`);
            throw error;
        }
    },

    // Update schedule status
    async updateScheduleStatus(scheduleId: number, status: 'approved' | 'rejected'): Promise<Schedule> {
        try {
            const connection = await pool.getConnection();

            await connection.query('UPDATE SCHEDULES SET status = ? WHERE id = ?', [status, scheduleId]);

            connection.release();

            const schedule = await this.getScheduleById(scheduleId);
            console.log(`[SCHEDULE SERVICE] Schedule updated: ID ${scheduleId}, status ${status}`);
            return schedule as Schedule;
        } catch (error: any) {
            console.error(`[SCHEDULE SERVICE] updateScheduleStatus error: ${error.message}`);
            throw error;
        }
    },

    // Delete schedule
    async deleteSchedule(scheduleId: number): Promise<void> {
        try {
            const connection = await pool.getConnection();

            await connection.query('DELETE FROM SCHEDULES WHERE id = ?', [scheduleId]);

            connection.release();

            console.log(`[SCHEDULE SERVICE] Schedule deleted: ID ${scheduleId}`);
        } catch (error: any) {
            console.error(`[SCHEDULE SERVICE] deleteSchedule error: ${error.message}`);
            throw error;
        }
    },

    // Get user schedules for a date range
    async getUserSchedulesInRange(
        userId: number,
        startDate: string,
        endDate: string
    ): Promise<Schedule[]> {
        try {
            const connection = await pool.getConnection();

            const [rows] = await connection.query(
                `SELECT id, user_id, date, shift_type, status, created_at FROM SCHEDULES 
                 WHERE user_id = ? AND date BETWEEN ? AND ? 
                 ORDER BY date ASC, shift_type ASC`,
                [userId, startDate, endDate]
            );

            connection.release();

            return rows as Schedule[];
        } catch (error: any) {
            console.error(`[SCHEDULE SERVICE] getUserSchedulesInRange error: ${error.message}`);
            throw error;
        }
    },
};
