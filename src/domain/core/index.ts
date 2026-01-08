/**
 * Core Domain Export
 * 
 * 회사의 핵심 비즈니스 기능
 * - ShareholdersMeeting: 주주총회 정보 및 의결 결과
 * - ElectronicDisclosure: 전자공시 문서
 * - IR: IR 자료 및 투자자 정보
 * - Brochure: 회사 소개 및 제품 브로슈어
 * - News: 언론 보도 및 뉴스
 * - Announcement: 내부 공지사항 및 직원 응답
 */

// Common Types
export * from './content-status.types';

// ShareholdersMeeting Module
export * from './shareholders-meeting/shareholders-meeting.entity';
export * from './shareholders-meeting/shareholders-meeting-translation.entity';
export * from './shareholders-meeting/vote-result.entity';
export * from './shareholders-meeting/vote-result-translation.entity';
export * from './shareholders-meeting/vote-result-type.types';

// ElectronicDisclosure Module
export * from './electronic-disclosure/electronic-disclosure.entity';
export * from './electronic-disclosure/electronic-disclosure-translation.entity';

// IR Module
export * from './ir/ir.entity';
export * from './ir/ir-translation.entity';

// Brochure Module
export * from './brochure/brochure.entity';
export * from './brochure/brochure-translation.entity';

// News Module
export * from './news/news.entity';

// Announcement Module
export * from './announcement/announcement.entity';
export * from './announcement/announcement-read.entity';
