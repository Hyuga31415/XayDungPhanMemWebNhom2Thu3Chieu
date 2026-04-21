const db = require('../config/db');

const getAllConfigs = async () => {
    const [rows] = await db.query(`
        SELECT id, config_key, config_value, description, updated_by, updated_at
        FROM system_configs
        ORDER BY config_key ASC
    `);
    return rows;
};

const getConfigMap = async () => {
    const [rows] = await db.query(`
        SELECT config_key, config_value
        FROM system_configs
    `);

    return rows.reduce((acc, row) => {
        acc[row.config_key] = row.config_value;
        return acc;
    }, {});
};

const getNumberConfig = (configMap, key, defaultValue = 0) => {
    const rawValue = configMap[key];
    const parsed = Number(rawValue);
    return Number.isFinite(parsed) ? parsed : defaultValue;
};

const updateConfigs = async (items, updatedBy = null) => {
    if (!Array.isArray(items) || items.length === 0) {
        return { affected: 0 };
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        let affected = 0;
        for (const item of items) {
            const { config_key, config_value, description = null } = item;
            if (!config_key) continue;

            const [result] = await connection.query(`
                UPDATE system_configs
                SET config_value = ?, description = COALESCE(?, description), updated_by = ?
                WHERE config_key = ?
            `, [String(config_value ?? ''), description, updatedBy, config_key]);

            affected += result.affectedRows;
        }

        await connection.commit();
        return { affected };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    getAllConfigs,
    getConfigMap,
    getNumberConfig,
    updateConfigs
};
