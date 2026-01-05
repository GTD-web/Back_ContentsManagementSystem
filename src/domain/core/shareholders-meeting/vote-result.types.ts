/**
 * 주주총회 의결 결과
 */
export interface ResultOfVote {
  title: string;
  totalVote: number;
  yesVote: number;
  noVote: number;
  approvalRating: number;
  result: 'accepted' | 'rejected';
}

/**
 * 의결 결과를 생성한다
 */
export function 의결결과를_생성한다(
  title: string,
  totalVote: number,
  yesVote: number,
  noVote: number,
): ResultOfVote {
  const approvalRating = (yesVote / totalVote) * 100;
  const result = approvalRating >= 50 ? 'accepted' : 'rejected';

  return {
    title,
    totalVote,
    yesVote,
    noVote,
    approvalRating,
    result,
  };
}
