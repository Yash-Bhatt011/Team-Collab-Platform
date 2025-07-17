export class AttendanceSalaryService {
  static calculateSalary(employee, attendanceRecords = []) {
    if (!employee) return { total: 0, details: {} };

    const baseHourlyRate = employee.hourlyRate || 20;
    
    // Calculate totals from attendance records
    const totals = attendanceRecords.reduce((acc, record) => {
      acc.totalHours += record.totalHours || 0;
      acc.totalBreakTime += record.totalBreakTime || 0;
      acc.overtimeHours += record.overtimeHours || 0;
      return acc;
    }, { totalHours: 0, totalBreakTime: 0, overtimeHours: 0 });

    const breakTimeHours = totals.totalBreakTime / 60; // Convert minutes to hours
    const totalWorkHours = Math.max(totals.totalHours - breakTimeHours, 0);
    const regularHours = totalWorkHours - totals.overtimeHours;
    const overtimeHours = totals.overtimeHours;
    
    // Calculate base pay
    const regularPay = regularHours * baseHourlyRate;
    const overtimePay = overtimeHours * (baseHourlyRate * 1.5);
    const grossPay = regularPay + overtimePay;

    // Calculate deductions
    const taxRate = 0.2; // 20% tax
    const taxes = grossPay * taxRate;

    // Calculate leave deductions
    const unpaidLeaveDeduction = this.calculateLeaveDeductions(employee);

    // Final calculation
    const netPay = grossPay - taxes - unpaidLeaveDeduction;

    return {
      total: netPay.toFixed(2),
      details: {
        periodTotalDays: attendanceRecords.length,
        regularHours: regularHours.toFixed(2),
        regularPay: regularPay.toFixed(2),
        overtimeHours: overtimeHours.toFixed(2),
        overtimePay: overtimePay.toFixed(2),
        grossPay: grossPay.toFixed(2),
        taxes: taxes.toFixed(2),
        leaveDeductions: unpaidLeaveDeduction.toFixed(2),
        netPay: netPay.toFixed(2),
        breakHours: breakTimeHours.toFixed(2),
        hourlyRate: baseHourlyRate.toFixed(2)
      }
    };
  }

  static calculateLeaveDeductions(employee) {
    if (!employee.leaves) return 0;
    
    const unpaidLeaveCount = employee.leaves.filter(leave => 
      leave.type === 'unpaid' && leave.status === 'approved'
    ).length || 0;
    
    return (employee.hourlyRate || 20) * 8 * unpaidLeaveCount;
  }
}
