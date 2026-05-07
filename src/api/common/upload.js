import request from '@/utils/request'

// 上传附件接口
export function uploadAtta(data) {
  return request({
    url: '/tender/attachment/upload',
    method: 'post',
    data
  })
}
 
