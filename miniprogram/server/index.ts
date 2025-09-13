import { TaskItem, TaskListParams, TaskStatus, DateType, TaskOverview, ApiResponse } from '../types/index'
import { apiWrapper } from '../utils/util'
const cloudFunctionPrefix = 'todoList_'
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
export const getTaskOverview = async (dateType: DateType = 'ALL'): Promise<ApiResponse<TaskOverview[]>> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
      name: 'todoList_taskList',
      data: {
        action: 'overview',
        data: {
          dateType
        }
      }
    })
    return res.result
  }, '获取任务总览信息失败')
}
// 获取用户任务列表-所有；按类型分类；按名称搜索分类
export const getTaskList = async (params: TaskListParams): Promise<ApiResponse<TaskItem[]>> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
    name: 'todoList_taskList',
    data: {
      action: 'list',
      // category, search
      data: {
        ...params
      }
    }
    })
    return res.result
  }, '获取任务列表失败')
}
// 获取任务详情
export const getTaskDetail = async (id: string): Promise<ApiResponse<TaskItem>> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
    name: 'todoList_taskList',
    data: {
      action: 'detail',
      data: {
        id
      }
    }
  })
  return res.result
  }, '获取任务详情失败')
}
// 添加任务
export const addTask = async (params: TaskItem) => {
  return apiWrapper(async () => {
  const res = await wx.cloud.callFunction({
    name: 'todoList_taskList',
    data: {
      action: 'add',
      data: {
        ...params
      }
    }
  })
  return res.result
  }, '添加任务失败')
}
// 编辑任务
export const editTask = async (params: TaskItem): Promise<string> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
    name: 'todoList_taskList',
    data: {
      action: 'edit',
      data: {
        ...params
      }
    }
  })
  return res.result
  }, '编辑任务失败')
}
// 删除任务
export const deleteTask = async (id: string): Promise<string> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
    name: 'todoList_taskList',
    data: {
      action: 'delete',
      data: {
        id
      }
    }
  })
  return res.result
  }, '删除任务失败')
}
// 更新任务状态
export const updateTaskStatus = async (id: string, status: keyof typeof TaskStatus): Promise<ApiResponse<string>> => {
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
  })
    return res.result
  }, '更新任务状态失败')
}
// 获取任务分类完成情况
export const getTaskCategoryCompletion = async (dateType: DateType = 'ALL'): Promise<ApiResponse<TaskCategoryCompletion[]>> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
    name: 'todoList_taskList',
    data: {
      action: 'getTaskCategoryCompletion',
      data: {
        dateType
      }
    }
  })
  return res.result
  }, '获取任务分类完成情况失败')
}
