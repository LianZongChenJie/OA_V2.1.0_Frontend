import axios from "axios";
import { getToken } from "@/utils/auth";
import { blobValidate } from "@/utils/ruoyi";
import { saveAs } from "file-saver";

/**
 * 下载文件
 * @param {string} url - 完整的下载链接
 * @param {string} fileName - 文件名（可选）
 * @param {Object} options - 其他 axios 选项（可选）
 */
export function downloadFile(url, fileName, options = {}) {
  if (!url) {
    console.error("下载链接不能为空");
    return Promise.reject(new Error("下载链接不能为空"));
  }

  return axios({
    method: "get",
    url,
    responseType: "blob",
    headers: { Authorization: "Bearer " + getToken() },
    ...options,
  }).then((res) => {
    const isBlob = blobValidate(res.data);
    if (isBlob) {
      const blob = new Blob([res.data]);
      saveAs(blob, fileName || "下载文件");
    } else {
      return Promise.reject(new Error("下载失败"));
    }
  });
}
