/**
 * Domain Code Generator
 *
 * end-points.mdc의 서비스 인터페이스를 기반으로
 * Interface Layer (Controller, DTO, Decorator)를 자동 생성합니다.
 */

export interface DomainConfig {
  /** 도메인 이름 (영문) */
  name: string;
  /** 도메인 이름 (한글) */
  koreanName: string;
  /** API 경로 */
  apiPath: string;
  /** 도메인 타입 (core | sub) */
  type: 'core' | 'sub';
  /** CRUD 메서드 목록 */
  methods: DomainMethod[];
}

export interface DomainMethod {
  /** 메서드 이름 (한글) */
  koreanName: string;
  /** HTTP 메서드 */
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /** 엔드포인트 경로 */
  path: string;
  /** 요청 DTO 타입 (있는 경우) */
  requestDto?: string;
  /** 응답 DTO 타입 */
  responseDto: string;
  /** 파라미터 목록 */
  params?: MethodParam[];
}

export interface MethodParam {
  /** 파라미터 이름 */
  name: string;
  /** 파라미터 타입 */
  type: 'path' | 'query' | 'body';
  /** 파라미터 DTO */
  dto?: string;
}

/**
 * 도메인 설정 목록
 */
export const DOMAIN_CONFIGS: DomainConfig[] = [
  // Core Domains
  {
    name: 'announcement',
    koreanName: '공지사항',
    apiPath: 'announcements',
    type: 'core',
    methods: [
      {
        koreanName: '공지사항_목록을_조회_한다',
        httpMethod: 'GET',
        path: '',
        responseDto: 'AnnouncementResponseDto[]',
      },
      {
        koreanName: '공지사항을_조회_한다',
        httpMethod: 'GET',
        path: ':id',
        responseDto: 'AnnouncementResponseDto',
        params: [{ name: 'id', type: 'path' }],
      },
      {
        koreanName: '공지사항을_생성_한다',
        httpMethod: 'POST',
        path: '',
        requestDto: 'CreateAnnouncementDto',
        responseDto: 'AnnouncementResponseDto',
        params: [{ name: 'dto', type: 'body', dto: 'CreateAnnouncementDto' }],
      },
      {
        koreanName: '공지사항을_수정_한다',
        httpMethod: 'PUT',
        path: ':id',
        requestDto: 'UpdateAnnouncementDto',
        responseDto: 'AnnouncementResponseDto',
        params: [
          { name: 'id', type: 'path' },
          { name: 'dto', type: 'body', dto: 'UpdateAnnouncementDto' },
        ],
      },
      {
        koreanName: '공지사항을_삭제_한다',
        httpMethod: 'DELETE',
        path: ':id',
        responseDto: 'void',
        params: [{ name: 'id', type: 'path' }],
      },
      {
        koreanName: '카테고리_목록을_조회_한다',
        httpMethod: 'GET',
        path: 'categories',
        responseDto: 'AnnouncementCategoryResponseDto[]',
      },
      {
        koreanName: '카테고리를_생성_한다',
        httpMethod: 'POST',
        path: 'categories',
        requestDto: 'CreateAnnouncementCategoryDto',
        responseDto: 'AnnouncementCategoryResponseDto',
        params: [
          {
            name: 'dto',
            type: 'body',
            dto: 'CreateAnnouncementCategoryDto',
          },
        ],
      },
      {
        koreanName: '첨부파일_목록을_조회_한다',
        httpMethod: 'GET',
        path: ':id/attachments',
        responseDto: 'AnnouncementAttachmentResponseDto[]',
        params: [{ name: 'id', type: 'path' }],
      },
      {
        koreanName: '대상자_목록을_조회_한다',
        httpMethod: 'GET',
        path: ':id/targets',
        responseDto: 'AnnouncementTargetResponseDto[]',
        params: [{ name: 'id', type: 'path' }],
      },
      {
        koreanName: '응답_상태_목록을_조회_한다',
        httpMethod: 'GET',
        path: ':id/responses',
        responseDto: 'AnnouncementRespondedResponseDto[]',
        params: [{ name: 'id', type: 'path' }],
      },
    ],
  },
  // 더 많은 도메인들...
];

/**
 * Controller 템플릿 생성
 */
export function generateController(config: DomainConfig): string {
  const className = `${capitalizeFirst(config.name)}Controller`;
  const importDtos = [
    ...new Set(
      config.methods
        .flatMap((m) => [m.requestDto, m.responseDto])
        .filter(Boolean),
    ),
  ].join(', ');

  return `import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ${importDtos} } from './dto/${config.name}.dto';
import { ${config.methods.map((m) => generateDecoratorName(m.koreanName)).join(', ')} } from './decorators/${config.name}.decorators';

/**
 * ${config.koreanName} 컨트롤러
 */
@ApiTags('${config.koreanName}')
@Controller('${config.apiPath}')
export class ${className} {
${config.methods.map((method) => generateControllerMethod(method)).join('\n\n')}
}
`;
}

function generateControllerMethod(method: DomainMethod): string {
  const decoratorName = generateDecoratorName(method.koreanName);
  const methodName = toCamelCase(method.koreanName);
  const params =
    method.params
      ?.map((p) => {
        if (p.type === 'path') return `@Param('${p.name}') ${p.name}: string`;
        if (p.type === 'body') return `@Body() ${p.name}: ${p.dto}`;
        if (p.type === 'query') return `@Query() ${p.name}: ${p.dto}`;
        return '';
      })
      .join(', ') || '';

  const returnType =
    method.responseDto === 'void'
      ? 'Promise<void>'
      : `Promise<${method.responseDto}>`;

  return `  /**
   * ${method.koreanName}
   */
  @${decoratorName}()
  async ${methodName}(${params}): ${returnType} {
    // Business Layer 구현 필요
    throw new Error('Business Layer 구현 필요');
  }`;
}

function generateDecoratorName(koreanName: string): string {
  return koreanName
    .split('_')
    .map((word) => capitalizeFirst(word))
    .join('');
}

function toCamelCase(koreanName: string): string {
  const parts = koreanName.split('_');
  return (
    parts[0] +
    parts
      .slice(1)
      .map((word) => capitalizeFirst(word))
      .join('')
  );
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 사용 예시
// const code = generateController(DOMAIN_CONFIGS[0]);
// console.log(code);
