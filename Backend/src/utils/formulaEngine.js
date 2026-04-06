const calculateNetPay = (baseSalary, fixedAllowance, standardDays, actualDays, lateHours) => {
    // Ép kiểu về số để tránh lỗi ghép chuỗi
    const base = Number(baseSalary) || 0;
    const allowance = Number(fixedAllowance) || 0;
    const stdDays = Number(standardDays) || 1; // Tránh chia cho 0
    const actDays = Number(actualDays) || 0;
    const late = Number(lateHours) || 0;

    // 1. Tính lương thực tế
    const actualSalary = (base / stdDays) * actDays;
    
    // 2. Tính các khoản giảm trừ (Ví dụ: đi muộn phạt 50k/giờ)
    const deductionRatePerHour = 50000;
    const totalDeductions = late * deductionRatePerHour;
    
    // 3. Thực lĩnh
    const netPay = actualSalary + allowance - totalDeductions;
    
    return {
        calculatedActualSalary: Math.round(actualSalary),
        totalDeductions: Math.round(totalDeductions),
        netPay: Math.round(netPay)
    };
};

module.exports = { calculateNetPay };
