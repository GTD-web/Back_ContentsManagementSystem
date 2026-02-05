import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Announcement } from '@domain/core/announcement/announcement.entity';
import { AnnouncementListResult } from '../../interfaces/announcement-context.interface';
import { Logger } from '@nestjs/common';
import { CompanyContextService } from '@context/company-context/company-context.service';

/**
 * 공지사항 목록 조회 쿼리
 */
export class GetAnnouncementListQuery {
  constructor(
    public readonly isPublic?: boolean,
    public readonly isFixed?: boolean,
    public readonly orderBy: 'order' | 'createdAt' = 'order',
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly startDate?: Date,
    public readonly endDate?: Date,
    public readonly categoryId?: string,
    public readonly excludeExpired?: boolean,
    public readonly search?: string,
  ) {}
}

/**
 * 공지사항 목록 조회 핸들러
 */
@QueryHandler(GetAnnouncementListQuery)
export class GetAnnouncementListHandler implements IQueryHandler<GetAnnouncementListQuery> {
  private readonly logger = new Logger(GetAnnouncementListHandler.name);

  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
    private readonly companyContextService: CompanyContextService,
  ) {}

  async execute(
    query: GetAnnouncementListQuery,
  ): Promise<AnnouncementListResult> {
    const {
      isPublic,
      isFixed,
      orderBy,
      page,
      limit,
      startDate,
      endDate,
      categoryId,
      excludeExpired,
      search,
    } = query;

    this.logger.debug(
      `공지사항 목록 조회 - 공개: ${isPublic}, 고정: ${isFixed}, 카테고리: ${categoryId}, 정렬: ${orderBy}, 페이지: ${page}, 제한: ${limit}, 마감제외: ${excludeExpired}, 검색: ${search}`,
    );

    const queryBuilder =
      this.announcementRepository.createQueryBuilder('announcement');

    let hasWhere = false;

    if (isPublic !== undefined) {
      queryBuilder.where('announcement.isPublic = :isPublic', { isPublic });
      hasWhere = true;
    }

    if (isFixed !== undefined) {
      if (hasWhere) {
        queryBuilder.andWhere('announcement.isFixed = :isFixed', { isFixed });
      } else {
        queryBuilder.where('announcement.isFixed = :isFixed', { isFixed });
        hasWhere = true;
      }
    }

    if (categoryId) {
      if (hasWhere) {
        queryBuilder.andWhere('announcement.categoryId = :categoryId', {
          categoryId,
        });
      } else {
        queryBuilder.where('announcement.categoryId = :categoryId', {
          categoryId,
        });
        hasWhere = true;
      }
    }

    if (startDate) {
      if (hasWhere) {
        queryBuilder.andWhere('announcement.createdAt >= :startDate', {
          startDate,
        });
      } else {
        queryBuilder.where('announcement.createdAt >= :startDate', {
          startDate,
        });
        hasWhere = true;
      }
    }

    if (endDate) {
      if (hasWhere) {
        queryBuilder.andWhere('announcement.createdAt <= :endDate', {
          endDate,
        });
      } else {
        queryBuilder.where('announcement.createdAt <= :endDate', { endDate });
        hasWhere = true;
      }
    }

    // 마감된 공지사항 제외 (excludeExpired가 true인 경우)
    if (excludeExpired) {
      if (hasWhere) {
        queryBuilder.andWhere(
          '(announcement.expiredAt IS NULL OR announcement.expiredAt > :now)',
          { now: new Date() },
        );
      } else {
        queryBuilder.where(
          '(announcement.expiredAt IS NULL OR announcement.expiredAt > :now)',
          { now: new Date() },
        );
        hasWhere = true;
      }
    }

    // 검색 조건 (제목, 내용, 작성자 이름, 카테고리 이름)
    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      const searchPattern = `%${searchTerm}%`;

      // 작성자 이름으로 검색하기 위해 SSO에서 직원 정보 조회
      let matchingEmployeeIds: string[] = [];
      try {
        const orgInfo = await this.companyContextService.조직_정보를_가져온다(true);
        
        // 모든 부서의 직원을 순회하며 이름에 검색어가 포함된 직원 ID 수집
        for (const dept of orgInfo.departments) {
          if (dept.employees && dept.employees.length > 0) {
            const matchingEmployees = dept.employees.filter(emp => 
              emp.name && emp.name.includes(searchTerm)
            );
            matchingEmployeeIds.push(...matchingEmployees.map(emp => emp.id));
          }
        }
        
        this.logger.debug(
          `검색어 "${searchTerm}"에 해당하는 직원 ${matchingEmployeeIds.length}명 발견`,
        );
      } catch (error) {
        this.logger.warn(
          `작성자 이름 검색 중 오류 발생 (제목/내용/카테고리 검색은 계속 진행): ${error.message}`,
        );
      }

      // 검색 조건 구성
      if (matchingEmployeeIds.length > 0) {
        // 작성자 이름으로 검색된 직원이 있는 경우
        if (hasWhere) {
          queryBuilder.andWhere(
            '(announcement.title LIKE :search OR announcement.content LIKE :search OR category.name LIKE :search OR announcement.createdBy IN (:...employeeIds))',
            { search: searchPattern, employeeIds: matchingEmployeeIds },
          );
        } else {
          queryBuilder.where(
            '(announcement.title LIKE :search OR announcement.content LIKE :search OR category.name LIKE :search OR announcement.createdBy IN (:...employeeIds))',
            { search: searchPattern, employeeIds: matchingEmployeeIds },
          );
          hasWhere = true;
        }
      } else {
        // 작성자 이름으로 검색된 직원이 없는 경우 (제목, 내용, 카테고리만 검색)
        if (hasWhere) {
          queryBuilder.andWhere(
            '(announcement.title LIKE :search OR announcement.content LIKE :search OR category.name LIKE :search)',
            { search: searchPattern },
          );
        } else {
          queryBuilder.where(
            '(announcement.title LIKE :search OR announcement.content LIKE :search OR category.name LIKE :search)',
            { search: searchPattern },
          );
          hasWhere = true;
        }
      }
    }

    // 고정 공지는 항상 최상단
    queryBuilder.orderBy('announcement.isFixed', 'DESC');

    if (orderBy === 'order') {
      queryBuilder.addOrderBy('announcement.order', 'ASC');
    } else {
      queryBuilder.addOrderBy('announcement.createdAt', 'DESC');
    }

    // 페이지네이션 적용
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Survey 관계 조인 (설문조사 포함 여부 확인용)
    queryBuilder.leftJoinAndSelect('announcement.survey', 'survey');

    // Category 관계 조인 (카테고리 이름 조회용)
    queryBuilder.leftJoinAndSelect('announcement.category', 'category');

    const [items, total] = await queryBuilder.getManyAndCount();

    return { items, total, page, limit };
  }
}
