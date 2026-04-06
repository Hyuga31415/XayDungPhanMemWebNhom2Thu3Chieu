const calculateNetPay = (baseSalary, fixedAllowance, standardDays, actualDays, lateHours) => {
    const base = Number(baseSalary) || 0;
    const allowance = Number(fixedAllowance) || 0;
    const stdDays = Number(standardDays) || 1; 
    const actDays = Number(actualDays) || 0;
    const late = Number(lateHours) || 0;

    const actualSalary = (base / stdDays) * actDays;
    const totalDeductions = late * 50000; 
    const netPay = actualSalary + allowance - totalDeductions;
    
    return {
        calculatedActualSalary: Math.round(actualSalary),
        totalDeductions: Math.round(totalDeductions),
        netPay: Math.round(netPay)
    };
};
module.exports = { calculateNetPay };
