import { useRef, useState, useEffect, useCallback } from "react";

const useInfiniteScroll = (targetEl) => {
  // 최초로 한번 데이터 불러오기 방지 => useRef(null)
  const observerRef = useRef(null);
  const [intersecting, setIntersecting] = useState(false);

  // some(): callback이 어떤 배열 요소가 하나라도 배열 내 존재하는 경우 true를 반환, 그 외엔 false.
  // entries[0]( entries의 첫번째 인자 ) 대신 일반적으로 사용하기 위해 entries.some( ... ) 을 사용
  // 새로고침 할때마다 데이터 불러오기 방지 => useCallback( ... , [])
  const getObserver = useCallback(() => {
    // 관찰자 초기화
    if (!observerRef.current) {
      // new IntersectionObserver(): 관찰할 대상(Target)이 등록되거나 가시성(Visibility, 보이는지 보이지 않는지)에 변화가 생기면 관찰자는 콜백(Callback)을 실행
      // isIntersecting: 관찰 대상이 루트 요소와 교차 상태로 들어가거나(true) 교차 상태에서 나가는지(false) 여부를 나타내는 값(Boolean)
      observerRef.current = new IntersectionObserver((entries) =>
        setIntersecting(entries.some((entry) => entry.isIntersecting))
      );
    }
    return observerRef.current;
  }, [observerRef.current]);

  // 관찰할 대상(요소) 등록
  useEffect(() => {
    // 관찰할 대상(요소) 관찰
    if (targetEl.current) getObserver().observe(targetEl.current);

    // 관찰할 대상(요소) 관찰 중지
    return () => {
      getObserver().disconnect();
    };
  }, [targetEl.current]);

  return intersecting;
};

export default useInfiniteScroll;
