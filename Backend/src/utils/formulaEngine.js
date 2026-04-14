// src/utils/formulaEngine.js

const calculateNetPay = (baseSalary, fixedAllowance, standardDays, actualDays, lateHours) => {
    const base = Number(baseSalary) || 0;
    const allowance = Number(fixedAllowance) || 0;
    const stdDays = Number(standardDays) || 1; 
    // Nếu actualDays lớn hơn standardDays thì chỉ tính tối đa bằng standardDays (tránh lố lương cơ bản)
    const actDays = Math.min(Number(actualDays) || 0, stdDays); 
    const late = Number(lateHours) || 0;

    // Tính lương thực tế dựa trên ngày công
    const actualSalary = (base / stdDays) * actDays;
    
    // Giả sử mỗi giờ đi muộn trừ 50k
    const totalDeductions = late * 50000; 
    
    // Tính lương thực lãnh
    let netPay = actualSalary + allowance - totalDeductions;
    
    // Đảm bảo lương không bị âm (Nếu đi muộn quá nhiều)
    netPay = Math.max(0, netPay);
    
    return {
        calculatedActualSalary: Math.round(actualSalary),
        totalDeductions: Math.round(totalDeductions),
        netPay: Math.round(netPay)
    };
};

module.exports = { calculateNetPay };