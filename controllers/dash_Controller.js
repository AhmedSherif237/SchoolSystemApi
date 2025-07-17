const { Student, Grade, AttendanceRecord, sequelize } = require('../models');
const Op = sequelize.Op;


// GET /api/dashboard/students?gradeId=...&className=...&search=...

exports.getStudents = async (req, res) => {
    try {
        const { gradeId, className, search } = req.query;

        const whereClause = {};

        if (gradeId) {
            whereClause.grade_id = gradeId;
        }
        if (className) {
            whereClause.class_name = className;
        }
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { student_id_number: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const students = await Student.findAll({
            where: whereClause,
            include: [{
                model: Grade,
                as: 'gradeDetails',
                attributes: ['name']
            }]
        });

        res.status(200).json({
            status: 'success',
            results: students.length,
            data: students,
        });

    } catch (error) {
        console.error('getStudents function error ya 7beby', error);
        res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred while fetching students.'
        });
    }
};


// POST http://localhost:5000/api/Dashboard/addStudent

exports.addStudent = async (req, res) => {
    try {
        const { name, student_id_number, class_name, grade_id, parent_phone, student_phone } = req.body;

        if (!name || !student_id_number || !class_name || !grade_id || !parent_phone) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide all required student details: name, student_id_number, class_name, grade_id, parent_phone.'
            });
        }

        const gradeExists = await Grade.findByPk(grade_id);
        if (!gradeExists) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid grade_id provided. Grade does not exist.'
            });
        }

        const newStudent = await Student.create({
            name,
            student_id_number,
            class_name,
            grade_id,
            parent_phone,
            student_phone: student_phone || null,
        });

        res.status(201).json({
            status: 'success',
            message: 'Student created successfully.',
            data: newStudent,
        });

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                status: 'fail',
                message: 'Student ID number already exists. Please use a unique ID.'
            });
        }
        console.error('addStudents function error ya 7beby:', error);
        res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred while creating the student.'
        });
    }
};


// DELETE http://localhost:5000/api/Dashboard/delStudents/1
// replace 1 with the actual student ID

exports.deleteStudent = async (req, res) => {
    try {
        const studentId = req.params.id;

        const deletedRowsCount = await Student.destroy({
            where: { id: studentId }
        });

        if (deletedRowsCount === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'Student not found with the provided ID.'
            });
        }

        res.status(204).json({
            status: 'success',
            message: 'Student deleted successfully.',
            data: null,
        });

    } catch (error) {
        console.error('deleteStudents function error ya 7beby:', error);
        res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred while deleting the student.'
        });
    }
};
