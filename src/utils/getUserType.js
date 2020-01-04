/**
 * 在内存中获取当前用户类型并返回布尔值
 */
import memoryUtils from './memoryUtils'

export const isStudent = () => memoryUtils.user.type === "student" ? true : false
export const isTeacher = () => memoryUtils.user.type === "teacher" ? true : false
export const isAdmin = () => memoryUtils.user.type === "admin" ? true : false
