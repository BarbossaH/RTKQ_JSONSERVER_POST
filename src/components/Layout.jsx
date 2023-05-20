import Header from './utils/Header';

const Layout = (props) => {
  return (
    <div>
      <Header />
      {props.children}
    </div>
  );
};
export default Layout;
