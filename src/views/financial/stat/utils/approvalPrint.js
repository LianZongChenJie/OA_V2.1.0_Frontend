const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const money = (value) => {
  const number = Number(value || 0)
  return `${number.toFixed(2)} 元`
}

const now = () => new Date().toLocaleString('zh-CN', { hour12: false })

const fileDate = (value) => {
  const matched = String(value || '').match(/(\d{4})-(\d{2})-(\d{2})/)
  if (matched) return `${matched[1]}${matched[2]}${matched[3]}`
  return new Date().toISOString().slice(0, 10).replace(/-/g, '')
}

export function getApprovalFileName(data) {
  const applicant = data?.adminName || '申请人'
  return `${fileDate(data?.createTime)}${applicant}提交的借支审批单_${Math.floor(Date.now() / 1000)}.pdf`
}

function cell(value, options = {}) {
  const { width, align = 'left', bold = false } = options
  const style = [
    width ? `width:${width};` : '',
    `text-align:${align};`,
    bold ? 'font-weight:600;' : ''
  ].join('')
  return `<td style="${style}">${escapeHtml(value ?? '-')}</td>`
}

function sectionRow(text) {
  return `<tr><td colspan="4" class="section">${escapeHtml(text)}</td></tr>`
}

function labelCell(value, width) {
  return `<td class="label" style="width:${width}">${escapeHtml(value)}</td>`
}

function row(leftLabel, leftValue, rightLabel, rightValue) {
  return `<tr>
    ${labelCell(leftLabel, '16%')}
    ${cell(leftValue, { width: '34%' })}
    ${labelCell(rightLabel, '16%')}
    ${cell(rightValue, { width: '34%' })}
  </tr>`
}

function fullRow(label, value) {
  return `<tr>
    ${labelCell(label, '16%')}
    <td colspan="3">${escapeHtml(value ?? '-')}</td>
  </tr>`
}

const applicantText = (data) => {
  if (!data?.adminName) return '-'
  return data.deptName ? `${data.adminName}（${data.deptName}）` : data.adminName
}

export function printLoanApprovalSheet(data, exportUser) {
  const approval = data?.approval || {}
  const records = approval.printRecords || approval.records || []

  const recordRows = records.length
    ? records.map((item) => `<tr>
        ${cell(item.action, { align: 'center', width: '16%' })}
        ${cell(item.time, { align: 'center', width: '22%' })}
        ${cell(item.userName, { align: 'center', width: '16%' })}
        ${cell(item.opinion || '-', { width: '46%' })}
      </tr>`).join('')
    : `<tr><td colspan="4" style="text-align:center;color:#999">暂无审批记录</td></tr>`

  const fileName = getApprovalFileName(data)

  const style = `
    @page { size: A4; margin: 16mm; }
    body { font-family: "Microsoft YaHei", Arial, sans-serif; color: #000; }
    h1 { text-align: center; font-size: 22px; margin: 0 0 18px; letter-spacing: 2px; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 14px; }
    td, th { border: 1px solid #333; padding: 9px 10px; line-height: 1.5; vertical-align: middle; word-break: break-all; }
    .label { background: #f7f7f7; text-align: center; white-space: nowrap; }
    .section { background: #f2f2f2; text-align: center; font-weight: 600; letter-spacing: 1px; }
    .footer { margin-top: 14px; display: flex; justify-content: space-between; font-size: 13px; }
  `

  const body = `
    <h1>借支审批单</h1>
    <table>
      ${row('借支主题', data?.title, '借支企业主体', data?.companyName)}
      ${row('借支类型', data?.typesText || data?.types, '借支编号', data?.id)}
      ${row('借支金额', money(data?.cost), '预计归还日期', data?.planTime)}
      ${fullRow('借支理由', data?.content)}
      ${sectionRow('审批信息')}
      ${row('申请人', applicantText(data), '申请时间', data?.createTime)}
      ${row('审核状态', approval.statusText, '抄送人', approval.copyUser)}
      ${sectionRow('审批记录')}
      <tr>
        <th class="label">审批节点</th>
        <th class="label">审批时间</th>
        <th class="label">处理人</th>
        <th class="label">审批意见</th>
      </tr>
      ${recordRows}
    </table>
    <div class="footer">
      <span>导出人员：${escapeHtml(exportUser || '-')}</span>
      <span>导出时间：${escapeHtml(now())}</span>
    </div>
  `

  const iframe = document.createElement('iframe')
  iframe.setAttribute('aria-hidden', 'true')
  iframe.style.cssText = 'position:fixed;left:-10000px;top:0;width:0;height:0;border:0;'
  document.body.appendChild(iframe)

  const iframeWindow = iframe.contentWindow
  const iframeDocument = iframeWindow?.document
  if (!iframeDocument) {
    iframe.remove()
    return false
  }

  const originalTitle = document.title
  let cleaned = false
  const cleanup = () => {
    if (cleaned) return
    cleaned = true
    document.title = originalTitle
    iframe.remove()
  }

  iframeDocument.title = fileName
  iframeDocument.head.innerHTML = `<meta charset="UTF-8"><style>${style}</style>`
  iframeDocument.body.innerHTML = body
  iframeWindow.onafterprint = cleanup
  document.title = fileName

  setTimeout(() => {
    try {
      iframeWindow.focus()
      iframeWindow.print()
    } catch (error) {
      console.error('打印审批单失败:', error)
      cleanup()
    }
  }, 100)

  return true
}

