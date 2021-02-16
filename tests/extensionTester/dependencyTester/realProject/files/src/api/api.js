import axios from 'axios';

const baseURL = 'https://sz-p.cn/server/sz-pdemos/'

export const base_Get_Rquest = async (url, params) => {
    try {
        const result = await axios.get(baseURL + url, { params: params })
        return result.data;
    } catch (err) {
        return err;
    }
}

/**
 * 获取所有分类
 * 
 * @param {any} success 
 * @param {any} error 
 */
export const getCategory = () => {
    return base_Get_Rquest('getAllCategory.php', null);
};

/**
 * 获取所有项目数据
 * 
 * @returns 
 */
export const getItem = () => {
    return base_Get_Rquest('getAllItem.php', null);
};

/**
 * 根据Demo名称获取详细信息
 * 
 * @returns 
 */
export const get_RelaodIntroduction = (params) => {
    return base_Get_Rquest('relaodIntroduction.php', params);
}
