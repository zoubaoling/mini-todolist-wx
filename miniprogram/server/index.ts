import { TaskItem, TaskListParams, TaskStatus, DateType, TaskOverview, ApiResponse } from '../types/index'
import { apiWrapper } from '../utils/util'
const cloudFunctionPrefix = 'todoList_'
// 获取任务总览信息-今天、本周、本月、全部
export const getTaskOverview = async (dateType: DateType = 'all'): Promise<ApiResponse<TaskOverview[]>> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
      name: 'todoList_taskList',
      data: {
        action: 'overview',
        data: {
          dateType,
          userId: wx.getStorageSync('userId')
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
      // userId, category, search
      data: {
        userId: wx.getStorageSync('userId'),
        ...params
      }
    }
    })
    return res
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
  return res
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
  return res.data
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
  return res.data
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
  return res
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
    return res
  }, '更新任务状态失败')
}
// 获取任务分类完成情况
export const getTaskCategoryCompletion = async (): Promise<ApiResponse<TaskCategoryCompletion[]>> => {
  return apiWrapper(async () => {
    const res = await wx.cloud.callFunction({
    name: 'todoList_taskList',
    data: {
      action: 'getTaskCategoryCompletion'
    }
  })
  return res
  }, '获取任务分类完成情况失败')
}
