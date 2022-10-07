/*
 * @Date: 2022-10-04 11:02:52
 * @LastEditors: mario marioworker@163.com
 * @LastEditTime: 2022-10-07 19:55:39
 * @Description: 请求拦截器
 */
import { ResponseStatus } from '@/contacts/response-message';
import { ToHump } from '@/utils';
import { parseTime } from '@/utils/date';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
export interface Response<T> {
  data: T;
  statusCode: number;
  timestamp: string;
  message: string;
}

/**
 * @description: 拦截器
 * @return { Observable<Response<T>> }
 */
export class TransformInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // 获取响应状态码
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;
    return next.handle().pipe(
      map((result, index) => {
        try {
          if (!result) {
            return {
              data: null,
              statusCode,
              timestamp: parseTime(new Date()),
              message: 'Request success, but no response result',
            };
          } else if (typeof result === 'string') {
            return {
              data: result,
              statusCode,
              timestamp: parseTime(new Date()),
              message: '请求成功',
            };
          } else {
            const { message, data, ...rest } = result;
            // 将data中的字段从下划线转换成驼峰
            const parseData = data
              ? data instanceof Array
                ? ToHump(
                    data.map((item) => JSON.parse(JSON.stringify(item))),
                    ['_id'],
                  )
                : ToHump(JSON.parse(JSON.stringify(data)), ['_id'])
              : data;
            // 处理分页数据
            const parseResult =
              parseData instanceof Array
                ? {
                    records: parseData,
                    ...rest,
                  }
                : parseData;
            console.log(parseResult);

            return {
              data: parseResult,
              statusCode,
              timestamp: parseTime(new Date()),
              message: message,
            };
          }
        } catch (error) {
          throw new HttpException(
            {
              message: '处理响应结果异常',
              error: error.message,
            },
            ResponseStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }),
    );
  }
}