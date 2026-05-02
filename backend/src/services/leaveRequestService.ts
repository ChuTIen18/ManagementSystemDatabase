import pool from '../infrastructure/database.js';

export interface LeaveRequest {
    id: number;
    user_id: number;
    start_date: string;
    end_date: string;
    reason?: string;
    status: 'pending' | 'approved' | 'rejected';
    approved_by?: number;
    request_date: string;
}

export interface CreateLeaveRequestInput {
    user_id: number;
    start_date: string;
    end_date: string;
    reason?: string | null;
    status: 'pending' | 'approved' | 'rejected';
}

export const leaveRequestService = {
    // Create leave request
    async createLeaveRequest(input: CreateLeaveRequestInput): Promise<LeaveRequest> {
        try {
            const connection = await pool.getConnection();

            const [result]: any = await connection.query(
                `INSERT INTO LEAVE_REQUESTS (user_id, start_date, end_date, reason, status)
                 VALUES (?, ?, ?, ?, ?)`,
                [input.user_id, input.start_date, input.end_date, input.reason || null, input.status]
            );

            const leaveRequestId = result.insertId;
            const leaveRequest = await this.getLeaveRequestById(leaveRequestId);

            connection.release();

            console.log(`[LEAVE REQUEST SERVICE] Leave request created: ID ${leaveRequestId}`);
            return leaveRequest as LeaveRequest;
        } catch (error: any) {
            console.error(`[LEAVE REQUEST SERVICE] createLeaveRequest error: ${error.message}`);
            throw error;
        }
    },

    // Get leave request by ID
    async getLeaveRequestById(leaveRequestId: number): Promise<LeaveRequest | null> {
        try {
            const connection = await pool.getConnection();

            const [rows] = await connection.query(
                `SELECT id, user_id, start_date, end_date, reason, status, approved_by, request_date
                 FROM LEAVE_REQUESTS WHERE id = ?`,
                [leaveRequestId]
            );

            connection.release();

            const leaveRequest = (rows as any[])[0];
            return leaveRequest ? this.formatLeaveRequest(leaveRequest) : null;
        } catch (error: any) {
            console.error(`[LEAVE REQUEST SERVICE] getLeaveRequestById error: ${error.message}`);
            throw error;
        }
    },

    // Get leave requests with filters
    async getLeaveRequests(filters: {
        user_id?: number;
        status?: string;
        start_date?: string;
        end_date?: string;
    }): Promise<LeaveRequest[]> {
        try {
            const connection = await pool.getConnection();

            let query =
                `SELECT id, user_id, start_date, end_date, reason, status, approved_by, request_date
                 FROM LEAVE_REQUESTS WHERE 1=1`;
            const params: any[] = [];

            if (filters.user_id) {
                query += ' AND user_id = ?';
                params.push(filters.user_id);
            }

            if (filters.status) {
                query += ' AND status = ?';
                params.push(filters.status);
            }

            if (filters.start_date) {
                query += ' AND start_date >= ?';
                params.push(filters.start_date);
            }

            if (filters.end_date) {
                query += ' AND end_date <= ?';
                params.push(filters.end_date);
            }

            query += ' ORDER BY request_date DESC';

            const [rows] = await connection.query(query, params);
            connection.release();

            return (rows as any[]).map((row) => this.formatLeaveRequest(row));
        } catch (error: any) {
            console.error(`[LEAVE REQUEST SERVICE] getLeaveRequests error: ${error.message}`);
            throw error;
        }
    },

    // Update leave request status
    async updateLeaveRequestStatus(
        leaveRequestId: number,
        status: 'pending' | 'approved' | 'rejected',
        approvedBy: number | undefined
    ): Promise<LeaveRequest> {
        try {
            const connection = await pool.getConnection();

            const query =
                status === 'pending'
                    ? 'UPDATE LEAVE_REQUESTS SET status = ? WHERE id = ?'
                    : 'UPDATE LEAVE_REQUESTS SET status = ?, approved_by = ? WHERE id = ?';

            const params =
                status === 'pending' ? [status, leaveRequestId] : [status, approvedBy, leaveRequestId];

            await connection.query(query, params);

            connection.release();

            const leaveRequest = await this.getLeaveRequestById(leaveRequestId);
            console.log(`[LEAVE REQUEST SERVICE] Leave request status updated: ID ${leaveRequestId}, Status ${status}`);
            return leaveRequest as LeaveRequest;
        } catch (error: any) {
            console.error(`[LEAVE REQUEST SERVICE] updateLeaveRequestStatus error: ${error.message}`);
            throw error;
        }
    },

    // Delete leave request
    async deleteLeaveRequest(leaveRequestId: number): Promise<void> {
        try {
            const connection = await pool.getConnection();

            await connection.query('DELETE FROM LEAVE_REQUESTS WHERE id = ?', [leaveRequestId]);

            connection.release();

            console.log(`[LEAVE REQUEST SERVICE] Leave request deleted: ID ${leaveRequestId}`);
        } catch (error: any) {
            console.error(`[LEAVE REQUEST SERVICE] deleteLeaveRequest error: ${error.message}`);
            throw error;
        }
    },

    // Get leave days for a user in a date range
    async getLeaveDaysInRange(
        userId: number,
        startDate: string,
        endDate: string
    ): Promise<{
        total_days: number;
        approved_days: number;
    }> {
        try {
            const connection = await pool.getConnection();

            const [rows]: any = await connection.query(
                `SELECT 
                    SUM(DATEDIFF(end_date, start_date) + 1) as total_days,
                    SUM(CASE WHEN status = 'approved' THEN DATEDIFF(end_date, start_date) + 1 ELSE 0 END) as approved_days
                 FROM LEAVE_REQUESTS
                 WHERE user_id = ? AND start_date >= ? AND end_date <= ?`,
                [userId, startDate, endDate]
            );

            connection.release();

            const result = rows[0] || {
                total_days: 0,
                approved_days: 0,
            };

            return {
                total_days: result.total_days || 0,
                approved_days: result.approved_days || 0,
            };
        } catch (error: any) {
            console.error(`[LEAVE REQUEST SERVICE] getLeaveDaysInRange error: ${error.message}`);
            throw error;
        }
    },

    // Format leave request
    formatLeaveRequest(row: any): LeaveRequest {
        return {
            id: row.id,
            user_id: row.user_id,
            start_date: row.start_date,
            end_date: row.end_date,
            reason: row.reason,
            status: row.status,
            approved_by: row.approved_by,
            request_date: row.request_date,
        };
    },
};
