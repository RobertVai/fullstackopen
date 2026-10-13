type HeaderProps = {
  course: string;
};
const Header = ({ course }: HeaderProps) => {
  return <h1>{course}</h1>;
};

export default Header;
