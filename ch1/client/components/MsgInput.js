import { useRef } from "react";

const MsgInput = ({ mutate, text = "", id = undefined }) => {
  const textRef = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const text = textRef.current.value;
    textRef.current.value = "";
    mutate(text, id);
  };

  // Form태그 하나당 꼭 한 개 이상의 submit 버튼이 존재해야 함
  // 제출 버튼을 클릭하면 양식(form)에서 제출(submit) 이벤트가 발생함
  // 이 이벤트를 처리하기 위한 handleSubmit() 함수를 작성하고, 양식(<form/>)의 onSubmit 속성에 설정해줌
  return (
    <form className="messages__input" onSubmit={onSubmit}>
      <textarea
        ref={textRef}
        defaultValue={text}
        placeholder="내용을 입력하세요."
      />
      <button type="submit">완료</button>
    </form>
  );
};

export default MsgInput;
