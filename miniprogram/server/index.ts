import { TaskItem, TaskListParams, TaskStatus, DateType, ApiResponse, ServerApiConfigOptions } from '../types/index'

// 用户信息相关接口
interface UserInfo {
  _id?: string
  openid?: string
  nickName?: string
  avatarUrl?: string
  createTime?: string
  updateTime?: string
  isActive?: boolean
}

import { apiWrapper } from '../utils/util'
/**
 * callFunction返回格式： {
 *  errMsg: string,
 * requestID: string,
 * result: {  
 *  success: boolean,
 *  data: any // 云函数返回的业务数据——云函数返回的数据外面包了一层result: { success: boolean, data: 业务代码返回 }
 * }
 */
// 获取任务总览信息-今天、本周、本月、全部
export const getTaskOverview = async (
  dateType: DateType = 'ALL',
  options: ServerApiConfigOptions = {}
): Promise<ApiResponse<any>> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
      name: 'todoList_taskList',
      data: {
        action: 'overview',
        data: {
          dateType
        }
      }
    });
    return res.result;
  }, options);
};
// 获取用户任务列表-所有；按类型分类；按名称搜索分类
export const getTaskList = async (
  params: TaskListParams,
  options: ServerApiConfigOptions = {}
): Promise<ApiResponse<any>> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
      name: 'todoList_taskList',
      data: {
        action: 'list',
        data: {
          ...params
        }
      }
    });
    return res.result;
  }, options);
};
// 获取任务详情
export const getTaskDetail = async (
  id: string,
  options: ServerApiConfigOptions = {}
): Promise<ApiResponse<any>> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
      name: 'todoList_taskList',
      data: {
        action: 'detail',
        data: {
          id
        }
      }
    });
    return res.result;
  },  options);
};
// 添加任务
export const addTask = async (
  params: TaskItem,
  options: ServerApiConfigOptions = { loading: true, loadingText: '保存中...' }
): Promise<ApiResponse<any>> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
      name: 'todoList_taskList',
      data: {
        action: 'add',
        data: {
          ...params
        }
      }
    });
    return res.result;
  }, options);
};
// 编辑任务
export const editTask = async (
  params: TaskItem,
  options: ServerApiConfigOptions = { loading: true, loadingText: '保存中...' }
): Promise<ApiResponse<any>> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
      name: 'todoList_taskList',
      data: {
        action: 'edit',
        data: {
          ...params
        }
      }
    });
    return res.result;
  }, options);
};
// 删除任务
export const deleteTask = async (
  id: string,
  options: ServerApiConfigOptions = { loading: true, loadingText: '删除中...' }
): Promise<ApiResponse<any>> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
      name: 'todoList_taskList',
      data: {
        action: 'delete',
        data: {
          id
        }
      }
    });
    return res.result;
  }, options);
};
// 更新任务状态
export const updateTaskStatus = async (
  id: string,
  status: keyof typeof TaskStatus,
  options: ServerApiConfigOptions = { loading: true, loadingText: '更新中...' }
): Promise<ApiResponse<any>> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
      name: 'todoList_taskList',
      data: {
        action: 'updateStatus',
        data: {
          id,
          status
        }
      }
    });
    return res.result;
  }, options);
};
// 获取任务分类完成情况
export const getTaskCategoryCompletion = async (
  dateType: DateType = 'ALL',
  options: ServerApiConfigOptions = {}
): Promise<ApiResponse<any>> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
      name: 'todoList_taskList',
      data: {
        action: 'getTaskCategoryCompletion',
        data: {
          dateType
        }
      }
    });
    return res.result;
  }, options);
};

// 获取备份历史记录
export const getBackupHistory = async (
  options: ServerApiConfigOptions = {}
): Promise<ApiResponse<any>> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
      name: 'todoList_profile',
      data: {
        action: 'getBackupHistory'
      }
    });
    return res.result;
  }, options);
};
// ==================== 用户登录相关接口 ====================
// 用户登录
export const userLogin = async (
  params: any,
  options: ServerApiConfigOptions = {}
): Promise<ApiResponse<any>> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
      name: 'todoList_userLogin',
      data: {
        action: 'userLogin',
        data: params
      }
    });
    return res.result;
  }, options);
};

// ==================== 个人中心相关接口 ====================

// 获取用户信息
export const getUserInfo = async (
  options: ServerApiConfigOptions = {}
): Promise<ApiResponse<any>> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
      name: 'todoList_userLogin',
      data: {
        action: 'getUserInfo'
      }
    });
    return res.result;
  }, options);
};

// 获取用户统计数据
export const getUserStats = async (
  options: ServerApiConfigOptions = {}
): Promise<ApiResponse<any>> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
      name: 'todoList_profile',
      data: {
        action: 'getUserStats'
      }
    });
    // 云函数返回格式: {success: true, data: {...}, message: "操作成功"}
    // 我们只需要返回 data 部分，让 apiWrapper 重新包装
    return (res.result as any).data;
  }, options);
};

// 更新用户信息
export const updateUserInfo = async (
  userData: Partial<UserInfo>,
  options: ServerApiConfigOptions = { loading: true, loadingText: '更新中...' }
): Promise<ApiResponse<any>> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
      name: 'todoList_userLogin',
      data: {
        action: 'updateUserInfo',
        data: { userInfo: userData }
      }
    });
    return res.result;
  }, options);
};

// 数据备份
export const backupUserData = async (
  options: ServerApiConfigOptions = { loading: true, loadingText: '备份中...' }
): Promise<ApiResponse<any>> => { 
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
      name: 'todoList_profile',
      data: {
        action: 'backupUserData'
      }
    });
    return res.result;
  }, options);
};

// 数据同步
export const syncUserData = async (
  options: ServerApiConfigOptions = { loading: true, loadingText: '同步中...' }
): Promise<ApiResponse<any>> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
      name: 'todoList_profile',
      data: {
        action: 'syncUserData'
      }
    });
    return res.result;
  }, options);
};

// 用户登出
export const logout = async (
  options: ServerApiConfigOptions = { loading: true, loadingText: '退出中...' }
): Promise<ApiResponse<any>> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
      name: 'todoList_userLogin',
      data: {
        action: 'logout'
      }
    });
    return res.result;
  }, options);
};
