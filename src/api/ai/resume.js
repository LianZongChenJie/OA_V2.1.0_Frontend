import request from '@/utils/request'

// 上传简历
export function uploadResume(data, onProgress) {
  return request({
    url: '/resume-kb/upload',
    method: 'post',
    data: data,
    timeout: 60000,  // 图片型PDF OCR较慢，超时设为60秒
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onProgress,
  })
}

// 查询简历列表
export function listResume(query) {
  return request({
    url: '/resume-kb/list',
    method: 'get',
    params: query,
  })
}

// 检索简历
export function searchResume(query) {
  return request({
    url: '/resume-kb/search',
    method: 'get',
    params: query,
  })
}

// 查询简历详情
export function getResume(resumeId) {
  return request({
    url: '/resume-kb/' + resumeId,
    method: 'get',
  })
}

// 删除简历
export function delResume(resumeId) {
  return request({
    url: '/resume-kb/' + resumeId,
    method: 'delete',
  })
}

// 简历智能问答（流式）
export function chatResume(data) {
  return request({
    url: '/resume-kb/chat',
    method: 'post',
    data: data,
    responseType: 'stream',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
