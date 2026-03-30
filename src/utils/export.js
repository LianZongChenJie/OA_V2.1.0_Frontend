import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

/**
 * 导出数据为 Excel 文件
 * @param {Array} data - 要导出的数据数组
 * @param {string} fileName - 文件名（不含扩展名）
 * @param {string} sheetName - 工作表名称
 * @param {Array} columns - 列配置，格式：[{ key: '字段名', title: '列标题' }]
 */
export function exportExcel(data, fileName, sheetName = 'Sheet1', columns = null) {
  // 如果没有传入列配置，则使用数据的第一条记录的键
  let exportData = data
  if (!columns && data.length > 0) {
    columns = Object.keys(data[0]).map(key => ({ key, title: key }))
  }

  // 如果传入了列配置，则按配置转换数据
  if (columns) {
    exportData = data.map(item => {
      const row = {}
      columns.forEach(col => {
        row[col.title] = item[col.key]
      })
      return row
    })
  }

  // 创建工作簿
  const workbook = XLSX.utils.book_new()

  // 创建工作表
  const worksheet = XLSX.utils.json_to_sheet(exportData)

  // 设置列宽
  const colWidths = columns ? columns.map(col => ({ wch: Math.max(col.title.length * 2, 15) })) : []
  worksheet['!cols'] = colWidths

  // 将工作表添加到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  // 生成 Excel 文件的二进制数据
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

  // 使用 file-saver 保存文件
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveAs(blob, `${fileName}.xls`)
}
