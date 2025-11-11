import { Request, Response } from 'express';
import { Attendance, Event, StudentModel, UserModel } from '../models';
import {
  STATUS_ATTENDANCE,
  HTTP_STATUS,
  HTTP_MESSAGE,
} from '../utils/constants';
import { sendError } from '../utils/commons';

// =======================
// GET: List Attendance
// =======================
export const getAttendances = async (req: Request, res: Response) => {
  try {
    const { event_id, student_id, page = 1, limit = 10 } = req.query;

    const where: any = {};
    if (event_id) where.event_id = event_id;
    if (student_id) where.student_id = student_id;

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Attendance.findAndCountAll({
      where,
      include: [
        { model: Event, as: 'event' },
        { model: StudentModel, as: 'student' },
        {
          model: UserModel,
          as: 'checker',
        },
      ],
      offset,
      limit: Number(limit),
      order: [['checked_at', 'DESC']],
    });

    res.json({
      data: rows,
      pagination: {
        total: count,
        page: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// =======================
// GET: Detail Attendance
// =======================
export const getAttendanceDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findByPk(id, {
      include: [
        { model: Event, as: 'event' },
        { model: StudentModel, as: 'student' },
        { model: UserModel, as: 'checker' },
      ],
    });

    if (!attendance) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'Attendance not found');
    }

    res.status(HTTP_STATUS.OK).json(attendance);
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// =======================
// POST: Create Attendance
// =======================
export const createAttendance = async (req: Request, res: Response) => {
  try {
    const { event_id, student_id, status, notes, checked_by } = req.body;

    // Validasi status
    if (!Object.values(STATUS_ATTENDANCE).includes(status)) {
      return sendError(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'Invalid attendance status'
      );
    }

    const attendance = await Attendance.create({
      event_id,
      student_id,
      status,
      notes,
      checked_by,
      checked_at: new Date(),
    });

    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// =======================
// PUT: Update Attendance
// =======================
export const updateAttendance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes, checked_by } = req.body;

    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Attendance not found');
    }

    await attendance.update({
      status: status ?? attendance.status,
      notes: notes ?? attendance.notes,
      checked_by: checked_by ?? attendance.checked_by,
      checked_at: new Date(),
    });

    res.status(HTTP_STATUS.OK).json({ success: true, data: attendance });
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// =======================
// DELETE: Delete Attendance
// =======================
export const deleteAttendance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'Attendance not found');
    }

    await attendance.destroy();
    res.json({ success: true, message: 'Attendance deleted successfully' });
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// =======================
// POST: Bulk Create Attendance
// =======================
export const bulkCreateAttendance = async (req: Request, res: Response) => {
  try {
    const { event_id, attendances, checked_by } = req.body;

    if (!event_id || !Array.isArray(attendances)) {
      return sendError(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'Missing event_id or attendances array'
      );
    }

    // Validasi isi attendances
    const validStatuses = Object.values(STATUS_ATTENDANCE);
    const invalidItem = attendances.find(
      (a) => !a.student_id || !validStatuses.includes(a.status)
    );

    if (invalidItem) {
      return sendError(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'Invalid attendance item found'
      );
    }

    // Buat data siap insert
    const attendanceRecords = attendances.map((a) => ({
      event_id,
      student_id: a.student_id,
      status: a.status,
      notes: a.notes || null,
      checked_by,
      checked_at: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Bulk insert — akan lebih cepat daripada insert satu-satu
    await Attendance.bulkCreate(attendanceRecords, { ignoreDuplicates: true });

    res.status(201).json({
      success: true,
      message: 'Bulk attendance created successfully',
      count: attendanceRecords.length,
    });
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

export const createOrUpdateAttendance = async (req: Request, res: Response) => {
  try {
    const { event_id, student_id, status, notes, checked_by } = req.body;

    if (!event_id || !student_id || !status || !checked_by) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Missing required fields');
    }

    // cari apakah sudah ada absensi utk event + student ini
    const existing = await Attendance.findOne({
      where: { event_id, student_id },
    });

    if (existing) {
      // update status + notes + waktu pemeriksaan
      await existing.update({
        status,
        notes: notes || existing.notes,
        checked_by,
        checked_at: new Date(),
      });

      return res.status(200).json({
        success: true,
        message: 'Attendance updated successfully',
        data: existing,
      });
    } else {
      // create baru kalau belum ada
      const newAttendance = await Attendance.create({
        event_id,
        student_id,
        status,
        notes: notes || null,
        checked_by,
        checked_at: new Date(),
      });

      return res.status(201).json({
        success: true,
        message: 'Attendance created successfully',
        data: newAttendance,
      });
    }
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};
