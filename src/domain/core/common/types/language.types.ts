/**
 * 언어 관련 타입 정의
 */

export enum LanguageEnum {
  KOREAN = 'korean',
  ENGLISH = 'english',
  JAPANESE = 'japanese',
  CHINESE = 'chinese',
}

export enum LanguageCode {
  KOREAN = 'ko',
  ENGLISH = 'en',
  JAPANESE = 'ja',
  CHINESE = 'zh',
}

export interface Language {
  code: LanguageCode;
  label: string;
  name: LanguageEnum;
}

/**
 * 언어 코드를 언어명으로 변환
 */
export function 언어코드를_언어명으로_변환한다(code: LanguageCode): LanguageEnum {
  const mapping: Record<LanguageCode, LanguageEnum> = {
    [LanguageCode.KOREAN]: LanguageEnum.KOREAN,
    [LanguageCode.ENGLISH]: LanguageEnum.ENGLISH,
    [LanguageCode.JAPANESE]: LanguageEnum.JAPANESE,
    [LanguageCode.CHINESE]: LanguageEnum.CHINESE,
  };
  return mapping[code];
}

/**
 * 언어 객체 생성
 */
export function 언어를_생성한다(
  code: LanguageCode,
  label: string,
): Language {
  return {
    code,
    label,
    name: 언어코드를_언어명으로_변환한다(code),
  };
}
