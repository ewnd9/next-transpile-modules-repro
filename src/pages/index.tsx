import { GetServerSideProps } from 'next';
import * as x from 'a-1';

const Home = () => {
  console.log('a1 inside src', x);
  return <div>hello world {JSON.stringify(x)}</div>;
};

export default Home;

export const getServerSideProps: GetServerSideProps<{}> = async () => {
  return {
    props: 1,
  };
};
