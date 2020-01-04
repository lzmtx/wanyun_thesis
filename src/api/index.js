/*
包含应用中所有的接口请求函数
函数返回值都是promise
*/
import ajax from './ajax'

// 本地测试端口 
// const BASE = 'http://localhost:8080/papers'

// 服务器测试端口
const BASE = 'http://www.lzmtx.com:8080/papers'

// 部署端口
// const BASE = '/papers'

// 登录
export const reqLogin = (username, password) => ajax(BASE + '/userLogin', { username, password }, 'POST')
// 去登陆
export const reqGoLogin = () => ajax(BASE + '/goLogin', {}, 'GET')
// 用户修改密码
export const reqUserResetPassword = (oldPassword, newPassword) => ajax(BASE + '/userResetPassword', { oldPassword, newPassword }, 'POST')
// 用户绑定邮箱-验证码发送
export const reqMailboxBindingVerificationCodeSending = (e_mail) => ajax(BASE + '/mailboxBindingVerificationCodeSending', { e_mail }, 'GET')
// 用户绑定邮箱
export const reqMailboxBinding = (verificationCode, e_mail) => ajax(BASE + '/mailboxBinding', { verificationCode, e_mail }, 'POST')
// 用户解绑邮箱
export const reqReleaseOfMailboxBinding = () => ajax(BASE + '/releaseOfMailboxBinding', {}, 'GET')
// 用户通过邮箱重置密码-验证码发送
export const reqPasswordRecoveryVerificationCodeSent = (e_mail) => ajax(BASE + '/passwordRecoveryVerificationCodeSent', { e_mail }, 'GET')
// 用户通过邮箱验证码重置密码
export const reqMailboxResetPassword = (verificationCode, newPassword) => ajax(BASE + '/mailboxResetPassword', { verificationCode, newPassword }, 'POST')
// 学生获取个人信息
export const reqStudentViewInformatio = () => ajax(BASE + '/studentViewInformation', {}, 'GET')
// 教师获取个人信息
export const reqTeacherViewInformation = () => ajax(BASE + '/teacherViewInformation', {}, 'GET')

// 退出登录
export const reqLogout = () => ajax(BASE + '/logout', {}, 'GET')
// 查询所有的公告信息
export const reqAnnouncementDisplay = () => ajax(BASE + '/announcementDisplay', {}, 'GET')
// 浏览公告详情
export const reqAnnouncementContentDisplay = (announcement_title, id) => ajax(BASE + '/announcementContentDisplay', { announcement_title, id }, 'GET')

// Private API
// 学生查看自己教师发布的选题
export const reqStudentViewingTopics = (pageNum, pageSize) => ajax(BASE + '/studentViewingTopics', { pageNum, pageSize }, 'GET')
// 学生查询有权下载的资料
export const reqStudentCanOperateAllInformation = (pageNum, pageSize) => ajax(BASE + '/studentCanOperateAllInformation', { pageNum, pageSize }, 'GET')
// 学生选择选题
export const reqStudentChoicePaperTopic = (paper_topic_id) => ajax(BASE + '/studentChoicePaperTopic', { paper_topic_id }, 'GET')
// 学生上传报告
export const reqStudentUploadReport = (paper_topic_id, file_type) => BASE + '/studentUploadReport?paper_topic_id=' + paper_topic_id + '&file_type=' + file_type
// 学生上传论文
export const reqStudentUploadPapers = (paper_topic_id) => BASE + '/studentUploadPapers?paper_topic_id=' + paper_topic_id
// 学生模糊查询资料
export const reqStudentFuzzyQuery = (pageNum, pageSize, data_name) => ajax(BASE + '/studentFuzzyQuery', { pageNum, pageSize, data_name }, 'GET')
// 学生查看成绩
export const reqStudentResultInquiry = () => ajax(BASE + '/studentResultInquiry', {}, 'GET')
// 学生那些论文文件被导师打回了
export const reqSelectCallBackTheRecord = () => ajax(BASE + '/selectCallBackTheRecord', {}, 'GET')

// 教师发布论文选题
export const reqTeacherPublishThesisTopic = (paper_topic, closing_date) => ajax(BASE + '/teacherPublishThesisTopic', { paper_topic, closing_date }, 'POST')
// 教师查看已发布的论文选题
export const reqTeacherViewPublishedTopics = (pageNum, pageSize) => ajax(BASE + '/teacherViewPublishedTopics', { pageNum, pageSize }, 'GET')
// 教师或管理员进行资料上传
export const reqFileUpload = BASE + "/adminOrTeacherDataUpload"
// 教师模糊查询资料
export const reqTeacherFuzzyQuery = (pageNum, pageSize, data_name) => ajax(BASE + '/teacherFuzzyQuery', { pageNum, pageSize, data_name }, 'GET')
// 教师查询有权下载的资料
export const reqTeacherCanOperateAllInformation = (pageNum, pageSize) => ajax(BASE + '/teacherCanOperateAllInformation', { pageNum, pageSize }, 'GET')
// 教师查看自己分组内的所有学生
export const reqTeacherViewStudentInformation = (pageNum, pageSize) => ajax(BASE + '/teacherViewStudentInformation', { pageNum, pageSize }, 'GET')
// 教师导入Excel表添加学生
export const reqGroupingExcel = BASE + '/groupingExcel'
// 教师查看论文提交情况
export const reqTeacherViewPaperSubmissionStatus = (pageNum, pageSize, paper_topic_id) => ajax(BASE + '/teacherViewPaperSubmissionStatus', { pageNum, pageSize, paper_topic_id }, 'GET')
// 教师打回报告 
export const reqDeletePresentation = (student_id, file_type) => ajax(BASE + '/deletePresentation', { student_id, file_type }, 'GET')
// 教师打回论文
export const reqDeletePapers = (student_id, papers_id) => ajax(BASE + '/deletePapers', { student_id, papers_id }, 'GET')
// 教师查看报告提交情况
export const reqTeacherViewReportSubmissions = (pageNum, pageSize, paper_topic_id, file_type) => ajax(BASE + '/teacherViewReportSubmissions', { pageNum, pageSize, paper_topic_id, file_type }, 'GET')
// 教师对学生提交的论文进行评分
export const reqTeacherTeacherPaperRating = (fraction, papers_id) => ajax(BASE + '/teacherTeacherPaperRating', { fraction, papers_id }, 'POST')
// 教师进行论文查重 
export const reqPaperChecking = (data_name, upload_user_id) => ajax(BASE + '/paperChecking', { data_name, upload_user_id }, 'GET')

// 管理员手动添加学生账户
export const reqAdminAddStudentAccounts = (user_name, user_pwd, real_name, user_phone, grade, department, classes) => ajax(BASE + '/adminAddStudentAccounts', { user_name, user_pwd, real_name, user_phone, grade, department, classes }, 'POST')
// 管理员导入Excel批量添加学生用户
export const reqAdminBatchAdditionStudentAccounts = BASE + '/adminBatchAdditionStudentAccounts'
// 管理员手动添加教师账户
export const reqAdminAddTeacherAccounts = (user_name, user_pwd, real_name, user_phone, teacher_title) => ajax(BASE + '/adminAddTeacherAccounts', { user_name, user_pwd, real_name, user_phone, teacher_title }, 'POST')
// 管理员导入Excel批量添加教师用户
export const reqAdminBatchAdditionTeacherAccounts = BASE + '/adminBatchAdditionTeacherAccounts'
// 管理员导入Excel批量分组
export const reqAdminBatchGroupStudents = BASE + '/adminBatchGroupStudents'
// 管理员手动分组
export const reqAdminGroupStudents = (teacher_name, student_name) => ajax(BASE + '/adminGroupStudents', { teacher_name, student_name }, 'GET')
// 管理员查询有权下载的资料
export const reqAdminCanOperateAllInformation = (pageNum, pageSize) => ajax(BASE + '/adminCanOperateAllInformation', { pageNum, pageSize }, 'GET')
// 管理员查看所有学生信息
export const reqSelectAllStudent = (pageNum, pageSize) => ajax(BASE + '/selectAllStudent', { pageNum, pageSize }, 'GET')
// 管理员查看所有教师信息 
export const reqSelectAllTeacher = (pageNum, pageSize) => ajax(BASE + '/selectAllTeacher', { pageNum, pageSize }, 'GET')
// 管理员查看分组情况 
export const reqSelectUserInformationTwo = (pageNum, pageSize) => ajax(BASE + '/selectUserInformationTwo', { pageNum, pageSize }, 'GET')
// 管理员调整分组 
export const reqAdjustmentGrouping = (teacher_name, student_name) => ajax(BASE + '/adjustmentGrouping', { teacher_name, student_name }, 'POST')
// 管理员设置用户状态 
export const reqUpdateUserSate = (user_name, state) => ajax(BASE + '/updateUserSate', { user_name, state }, 'POST')

// 管理员查看所有权限路径
export const reqSelectAllPermission = () => ajax(BASE + '/selectAllPermission', {}, 'GET')
// 文件下载
export const reqFileDownload = () => BASE + '/teacherFuzzyQuery'
export const reqDownload = BASE + '/download'
export const reqDocToPdf = BASE + '/docToPdf'

// 教师 or 学生查重接口
export const reqDuplicateDetails = (data_name, upload_user_id) => ajax(BASE + '/duplicateDetails', { data_name, upload_user_id }, 'GET')


// PHP上线端口
const PHP_BASE = 'http://www.lzmtx.com/php/notice'
// PHP本地测试端口
// const PHP_BASE = 'http://localhost/php/paper/notice'

// 管理员发布公告
export const reqSaveNotice = (title, author, content) => ajax(PHP_BASE + '/save.php', { title, author, content }, 'POST')
// 页面查询公告列表
export const reqNoticeList = () => ajax(PHP_BASE + '/querylist.php', {}, 'POST')
// 页面查询公告内容
export const reqNoticeContent = (id) => ajax(PHP_BASE + '/queryContent.php', { id }, 'POST')
// 管理员查看用户、论文等数量
export const reqDataNum = () => ajax(PHP_BASE + '/queryData.php', {}, 'POST')
// 管理员上传公告图片
export const reqUploadNoticeImg = PHP_BASE + '/uploadImgFile.php'



// 模板
export const req = () => ajax(BASE + '', {}, 'POST')