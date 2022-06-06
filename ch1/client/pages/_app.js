import "./index.scss";

// NextJS에서 서버사이드 렌더링을 하기위한 컴포넌트
const App = ({ Component, pageProps }) => <Component {...pageProps} />;

// getInitialProps: data fetching 작업
App.getInitialProps = async ({ ctx, Component }) => {
  // 하위 컴포넌트에 getInitialProps가 있다면 추가 (각 개별 컴포넌트에서 사용할 값 추가)
  const pageProps = await Component.getInitialProps?.(ctx);
  return { pageProps };
};

export default App;
