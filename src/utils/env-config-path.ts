/*
 * @Date: 2022-09-25 15:51:53
 * @LastEditors: mario marioworker@163.com
 * @LastEditTime: 2022-11-07 11:24:33
 * @Description: Do not edit
 */
import * as fs from 'fs';
import * as path from 'path';

// 默认存放env文件的文件夹路径
const directory = path.resolve(process.cwd(), 'src/config/env');
type optionsType = {
  dirPath?: string;
  prefix?: string;
};
/**
 * 返回目录下所有文件的文件名(字符串数组形式)
 * @typedef {Object} options  参数选项
 * @param {string} options.dirPath  目录路径
 * @param {string} options.prefix  给每一个匹配项增加前缀文本
 * @return {string[]} 不传参数默认返回/config/env下所有文件拼接的数组
 */
export function getEnvFilePath(options?: optionsType): string[] {
  const params = { dirPath: directory, prefix: 'src/config/env/', ...options };
  const results = [];
  const runEnv = process.env.NODE_ENV;
  try {
    for (const dirContent of fs.readdirSync(params.dirPath)) {
      const dirContentPath = path.resolve(directory, dirContent);
      if (fs.statSync(dirContentPath).isFile()) {
        if (dirContent.endsWith('.env') && dirContent.includes(runEnv)) {
          if (params.prefix) {
            results.push(`${params.prefix}${dirContent}`);
          }
        }
      }
    }
    return results;
  } catch (error) {
    return results;
  }
}
