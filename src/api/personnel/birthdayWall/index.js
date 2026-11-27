import request from '@/utils/request'

// 查询员工生日墙列表
export function getBirthdayWallList(month) {
  return request({
    url: '/system/birthdayWall/list',
    method: 'get',
    params: { month }
  })
}
