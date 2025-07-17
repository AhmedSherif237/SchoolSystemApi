const { sequelize } = require("../config/db.config");

const User = require("./log_user.js");
const Grade = require("./log_grade.js");
const Student = require("./log_student.js");
const AttendanceRecord = require("./log_attendance.js");
const LateArrival = require("./log_LateArrival.js");
const RefreshToken = require("./log_refreshToken.js");

// Grade , Student
Student.belongsTo(Grade, {
  foreignKey: "grade_id",
  as: "gradeDetails",
});
Grade.hasMany(Student, {
  foreignKey: "grade_id",
  as: "students",
});


User.hasMany(RefreshToken, {
  foreignKey: "userId", 
  as: "refreshTokens", // اسم مستعار للعلاقة لما تجيب RefreshTokens من User
  onDelete: "CASCADE", // لو المستخدم اتمسح، امسح كل الـ RefreshTokens بتاعته
});

// كل RefreshToken (الواحد) يخص مستخدم واحد (User)
RefreshToken.belongsTo(User, {
  foreignKey: "userId",
  as: "user", 
});



// student , AttendanceRecord
AttendanceRecord.belongsTo(Student, {
  foreignKey: "student_id",
  as: "studentInfo",
});
Student.hasMany(AttendanceRecord, {
  foreignKey: "student_id",
  as: "attendanceRecords",
});

// student , LateArrival
LateArrival.belongsTo(Student, {
  foreignKey: "student_id",
  as: "studentInfo",
});
Student.hasMany(LateArrival, {
  foreignKey: "student_id",
  as: "lateArrivals",
});

// attendanceRecord , User
AttendanceRecord.belongsTo(User, {
  foreignKey: "recorded_by_user_id",
  as: "recordedByUser",
});
User.hasMany(AttendanceRecord, {
  foreignKey: "recorded_by_user_id",
  as: "recordedAttendance",
});

module.exports = {
  sequelize,
  User,
  Grade,
  Student,
  AttendanceRecord,
  LateArrival,
   RefreshToken,
};
