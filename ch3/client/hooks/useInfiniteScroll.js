import { useRef, useState, useEffect, useCallback } from "react";

const useInfiniteScroll = (targetEl) => {
  // 최초로 한번 데이터 불러오기 방지 => useRef(null)
  const observerRef = useRef(null);
  const [intersecting, setIntersecting] = useState(false);

  // some(): 배열 안의 어떤 요소라도 주어진 판별 함수를 통과하는지 테스트
  // some(): callback이 어떤 배열 요소가 하나라도 배열 내 존재하는 경우 true를 반환, 그 외엔 false.
  // entries[0]( entries의 첫번째 인자 ) 대신 일반적으로 사용하기 위해 entries.some( ... ) 을 사용
  // 새로고침 할때마다 데이터 불러오기 방지 => useCallback( ... , [])
  const getObserver = useCallback(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) =>
        setIntersecting(entries.some((entry) => entry.isIntersecting))
      );
    }
    return observerRef.current;
  }, [observerRef.current]);

  // 감시할 대상 지정
  useEffect(() => {
    console.log("무한스크롤 시작");
    if (targetEl.current) getObserver().observe(targetEl.current);

    return () => {
      console.log("무한스크롤 끝");
      getObserver().disconnect();
    };
  }, [targetEl.current]);

  return intersecting;
};

export default useInfiniteScroll;
