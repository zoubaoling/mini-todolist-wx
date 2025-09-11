import { getAccountInfo } from "./util"

// 环境配置映射
const ENV_CONFIG = {
  develop: {
    cloudEnvId: 'zou-cloud1-4gee2jb2b028dcdc',
    apiBaseUrl: 'https://dev-api.example.com',
    debug: true
  },
  trial: {
    cloudEnvId: 'zou-cloud1-4gee2jb2b028dcdc', // 体验版可以用测试环境
    apiBaseUrl: 'https://test-api.example.com',
    debug: true
  },
  release: {
    cloudEnvId: 'zou-cloud1-4gee2jb2b028dcdc', // 正式版用生产环境
    apiBaseUrl: 'https://api.example.com',
    debug: false
  }
}

// 获取当前环境配置
export const getCurrentConfig = () => {
  const envVersion = getAccountInfo().miniProgram.envVersion
  return ENV_CONFIG[envVersion] || ENV_CONFIG.develop
}

// 导出配置
export const config = getCurrentConfig()
export const cloudConfig = {
  envId: config.cloudEnvId,
  debug: config.debug
}