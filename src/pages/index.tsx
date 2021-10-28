import { GetServerSideProps } from 'next';
import * as x from 'a-1';
import * as y from 'a-2';

const Home = () => {
  console.log('a1 inside src', x);
  console.log('a2 inside src', y);
  return <div>hello world {JSON.stringify(x)}</div>;
};

export default Home;

export const getServerSideProps: GetServerSideProps<{}> = async () => {
  return {
    props: 1,
  };
};
